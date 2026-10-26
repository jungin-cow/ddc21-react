import { useState } from 'react'
import { img } from '../data'
import { MISSIONS, MISSION_SLOGAN } from '../missions'
import MissionMap from '../components/MissionMap'
import MissionDialog from '../components/MissionDialog'
import VerseBanner from '../components/VerseBanner'

// 선교 페이지 (원본 page_id=7909). 지도나 목록에서 선교지를 고르면 정보 창이 열린다.
export default function MissionPage() {
  const [selectedSlug, setSelectedSlug] = useState(null)
  const selected = MISSIONS.find((m) => m.slug === selectedSlug)
  const open = setSelectedSlug
  const close = () => setSelectedSlug(null)

  return (
    <>
      <section className="mission container">
        <header className="page-title">
          <h1>선교</h1>
        </header>

        <blockquote className="mission-slogan">&ldquo;{MISSION_SLOGAN}&rdquo;</blockquote>

        <div className="mission-map-box">
          <MissionMap selected={selected?.slug} onSelect={open} />
          <p className="mission-note">
            <span aria-hidden="true">*</span> 지도에서 색칠된 나라나 아래 목록을 누르면 자세한 정보를 보실 수 있습니다.
          </p>
        </div>

        <h2 className="mission-list-title">
          함께하는 선교사 <span>{MISSIONS.length}가정</span>
        </h2>
        <ul className="mission-list">
          {MISSIONS.map((m) => (
            <li key={m.slug}>
              <button className="mission-card" style={{ '--mission-color': m.color }} onClick={() => open(m.slug)}>
                <span className="mission-card-thumb">
                  <img src={img(`missions/${m.slug}.jpg`)} alt="" loading="lazy" />
                </span>
                <span className="mission-region-label">{m.region}</span>
                <strong>{m.title}</strong>
              </button>
            </li>
          ))}
        </ul>
      </section>
      <VerseBanner />

      {selected && <MissionDialog mission={selected} onClose={close} />}
    </>
  )
}
