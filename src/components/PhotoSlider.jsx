import { useCallback, useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { img } from '../data'

const INTERVAL = 5000

export default function PhotoSlider({ slides }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef(null)
  const count = slides.length

  const go = useCallback((n) => setIndex(((n % count) + count) % count), [count])

  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => go(index + 1), INTERVAL)
    return () => clearTimeout(t)
  }, [index, paused, go])

  return (
    <div
      className="photo-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1))
        touchX.current = null
      }}
    >
      <div className="photo-track">
        {slides.map((src, i) => (
          <img
            key={src}
            className={`photo-slide ${i === index ? 'is-active' : ''}`}
            src={img(src)}
            alt={`교회 사진 ${i + 1}`}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}
      </div>
      <button className="photo-arrow prev" aria-label="이전 사진" onClick={() => go(index - 1)}>
        <FaChevronLeft />
      </button>
      <button className="photo-arrow next" aria-label="다음 사진" onClick={() => go(index + 1)}>
        <FaChevronRight />
      </button>
      <div className="photo-bullets">
        {slides.map((src, i) => (
          <button
            key={src}
            className={i === index ? 'is-active' : ''}
            aria-label={`${i + 1}번 사진`}
            onClick={() => go(i)}
          />
        ))}
      </div>
      {!paused && <span key={index} className="photo-progress" style={{ animationDuration: `${INTERVAL}ms` }} />}
    </div>
  )
}
