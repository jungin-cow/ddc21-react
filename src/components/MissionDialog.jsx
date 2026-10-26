import { useEffect, useRef } from 'react'
import { FaTimes } from 'react-icons/fa'
import { img } from '../data'

// 선교사 정보 창. Esc 나 바깥을 누르면 닫힌다.
export default function MissionDialog({ mission, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

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
    <div className="mission-dialog-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mission-dialog" role="dialog" aria-modal="true" aria-labelledby="mission-dialog-title" style={{ '--mission-color': mission.color }}>
        <button ref={closeRef} className="mission-dialog-close" onClick={onClose} aria-label="닫기">
          <FaTimes />
        </button>
        <img src={img(`missions/${mission.slug}.jpg`)} alt={`${mission.title} 사진`} />
        <div className="mission-dialog-body">
          <p className="mission-region-label">{mission.region}</p>
          <h2 id="mission-dialog-title">{mission.title}</h2>
          <dl>
            <dt>선교지</dt>
            <dd>{mission.region}</dd>
            {mission.children && (
              <>
                <dt>자녀</dt>
                <dd>{mission.children}</dd>
              </>
            )}
            {mission.supportCell && (
              <>
                <dt>후원셀</dt>
                <dd>{mission.supportCell}</dd>
              </>
            )}
          </dl>
        </div>
      </div>
    </div>
  )
}
