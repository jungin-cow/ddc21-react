import { useState } from 'react'

// API 미디어 객체의 한 사이즈(small/medium/large)를 그린다. 못 불러오면 자리표시자로 바꾼다.
// GCS에 없는 파일이 있을 수 있어서(DB 설계서 D1) onError 처리가 꼭 필요하다.
export default function MediaImage({ media, size = 'small', alt }) {
  const [broken, setBroken] = useState(false)
  const v = media?.variants?.[size]
  if (!v || broken) {
    return (
      <span className="photo-missing" role="img" aria-label={alt ? `${alt} (사진 없음)` : '사진 없음'}>
        사진 없음
      </span>
    )
  }
  return (
    <img
      src={v.url}
      alt={alt ?? media.alt}
      width={v.width || undefined}
      height={v.height || undefined}
      loading="lazy"
      decoding="async"
      onError={() => setBroken(true)}
    />
  )
}
