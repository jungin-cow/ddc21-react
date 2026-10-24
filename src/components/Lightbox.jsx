import { useEffect, useRef } from 'react'
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa'

// 사진 크게 보기. 키보드(← → Esc)와 손가락 밀기로 넘긴다.
export default function Lightbox({ photos, index, onChange, onClose }) {
  const touchX = useRef(null)
  const closeRef = useRef(null)
  const count = photos.length
  const prev = () => onChange((index - 1 + count) % count)
  const next = () => onChange((index + 1) % count)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onChange((index - 1 + count) % count)
      else if (e.key === 'ArrowRight') onChange((index + 1) % count)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, count, onChange, onClose])

  // 열려 있는 동안 뒤 페이지 스크롤 막기
  useEffect(() => {
    const before = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = before
    }
  }, [])

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="사진 크게 보기"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 50) (dx > 0 ? prev : next)()
        touchX.current = null
      }}
    >
      <img key={photos[index]} src={photos[index]} alt="" />
      <p className="lightbox-count">
        {index + 1} / {count}
      </p>
      <button ref={closeRef} className="lightbox-close" onClick={onClose} aria-label="닫기">
        <FaTimes />
      </button>
      {count > 1 && (
        <>
          <button className="lightbox-arrow prev" onClick={prev} aria-label="이전 사진">
            <FaChevronLeft />
          </button>
          <button className="lightbox-arrow next" onClick={next} aria-label="다음 사진">
            <FaChevronRight />
          </button>
        </>
      )}
    </div>
  )
}
