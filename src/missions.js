// 선교 페이지 데이터 (원본 사이트 page_id=7909 의 선교 지도에서 옮김)
// - 이 페이지는 DB(ddc21_c)로 이관되지 않아서 여기 데이터로 둔다.
// - iso 는 ISO 3166-1 숫자 코드. world-atlas 지도의 나라 id 와 같다.
// - 지도에 없을 만큼 작은 나라(싱가포르)는 coords [경도, 위도] 위치에 점으로 그린다.
// - 사진은 public/images/missions/<slug>.jpg
export const MISSION_SLOGAN = '동탄동산교회는 지구촌을 이웃으로 만드는 비전을 실현하기 위하여 100개의 나라를 섬기고자 합니다.'

export const MISSIONS = [
  { slug: 'cambodia', iso: '116', region: '캄보디아', color: '#6b2e54', title: '최옥남 선교사', children: '신지철', supportCell: '오선영, 장경아' },
  { slug: 'costa-rica', iso: '188', region: '코스타리카', color: '#3a22d8', title: '최용식, 김윤자 선교사', children: '병준, 혜리', supportCell: '박지민' },
  { slug: 'india', iso: '356', region: '인도', color: '#faa21b', title: '조요셉, 서주연 선교사', children: '하민, 수아, 요셉, 안나', supportCell: '문근주' },
  { slug: 'japan', iso: '392', region: '일본', color: '#689e3a', title: '마키토, 이종은 선교사', supportCell: '윤다애' },
  { slug: 'kenya', iso: '404', region: '케냐', color: '#dd3333', title: '연군흠, 김혜란 선교사', children: '허음, 주원', supportCell: '김성규' },
  { slug: 'mongolia', iso: '496', region: '몽골', color: '#dd9933', title: '김충석, 김혜옥 선교사', children: '김주혜', supportCell: '김태우, 이진희' },
  { slug: 'pakistan', iso: '586', region: '파키스탄', color: '#1dba28', title: 'S 선교사', supportCell: '김재중' },
  { slug: 'singapore', iso: '702', region: '싱가포르', color: '#dd3333', title: '이승재, 김순영 선교사', children: '에녹, 에스더', supportCell: '정한나, 조민구', coords: [103.82, 1.35] },
  { slug: 'south-africa', iso: '710', region: '남아프리카공화국', color: '#ce692f', title: '오세연, 조미경 선교사', children: '예랑, 예린', supportCell: '박지숙' },
  { slug: 'spain', iso: '724', region: '스페인', color: '#ffc800', title: '조셉, 조안나 선교사', supportCell: '황수진, 박정열' },
  { slug: 'tanzania', iso: '834', region: '탄자니아', color: '#3366ff', title: '이진동, 신순임 선교사', supportCell: '김인영' },
  { slug: 'iran', iso: '364', region: '이란', color: '#8224e3', title: 'Y 선교사 부부', children: '사랑, 소망', supportCell: '심보영' },
  { slug: 'thailand', iso: '764', region: '태국', color: '#1e73be', title: '강형석, 김수희 선교사', children: '라율, 가율', supportCell: '황지나, 김소룡' },
  { slug: 'uganda', iso: '800', region: '우간다', color: '#1dba28', title: '노효선, 김소현 선교사', children: '주안, 예주', supportCell: '서미주' },
  { slug: 'north-korea', iso: '408', region: 'NK 지역', color: '#1dba28', title: '신나라 선교사', supportCell: '김현자' },
  { slug: 'canada', iso: '124', region: '캐나다', color: '#dd4646', title: '김민규, 백남주 선교사', children: '하은, 은준, 준현' },
]
