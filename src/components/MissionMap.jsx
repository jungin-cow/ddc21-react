import { geoMercator, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import world from 'world-atlas/countries-110m.json'
import { MISSIONS } from '../missions'

// 원본 사이트의 구글 지도 차트 대신 SVG로 직접 그린다 (API 키, 외부 요청 없음).
// 지도 모양은 데이터에 따라 바뀌지 않으므로 모듈을 불러올 때 한 번만 계산한다.
const WIDTH = 1200
const HEIGHT = 560

// 남극(010)은 빼고, 경도 -170~190 / 위도 75~-48 범위가 꽉 차게 맞춘다.
const countries = feature(world, world.objects.countries).features.filter((f) => f.id !== '010')
const projection = geoMercator()
  .rotate([-10, 0])
  .fitSize([WIDTH, HEIGHT], { type: 'MultiPoint', coordinates: [[-169, 75], [189, -48]] })
const path = geoPath(projection)

const missionByIso = new Map(MISSIONS.map((m) => [m.iso, m]))
const SHAPES = countries.map((f) => ({ id: f.id, d: path(f), mission: missionByIso.get(f.id) }))
// 지도 데이터에 없는 작은 나라는 점으로 표시
const DOTS = MISSIONS.filter((m) => m.coords).map((m) => ({ mission: m, at: projection(m.coords) }))

export default function MissionMap({ selected, onSelect }) {
  const props = (m) => ({
    role: 'button',
    tabIndex: 0,
    'aria-label': `${m.region} · ${m.title}`,
    className: `mission-region${selected === m.slug ? ' is-selected' : ''}`,
    style: { '--mission-color': m.color },
    onClick: () => onSelect(m.slug),
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onSelect(m.slug)
      }
    },
  })

  return (
    <svg className="mission-map" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="group" aria-label="선교지 지도">
      <rect width={WIDTH} height={HEIGHT} className="mission-ocean" />
      {SHAPES.filter((s) => !s.mission).map((s) => (
        <path key={s.id} d={s.d} className="mission-country" />
      ))}
      {/* 선교지는 다른 나라 위에 그려야 테두리가 가려지지 않는다 */}
      {SHAPES.filter((s) => s.mission).map((s) => (
        <path key={s.id} d={s.d} {...props(s.mission)}>
          <title>{`${s.mission.region} · ${s.mission.title}`}</title>
        </path>
      ))}
      {DOTS.map(({ mission, at }) => (
        <circle key={mission.slug} cx={at[0]} cy={at[1]} r="6" {...props(mission)}>
          <title>{`${mission.region} · ${mission.title}`}</title>
        </circle>
      ))}
    </svg>
  )
}
