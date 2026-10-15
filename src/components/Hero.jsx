import { img } from '../data'

// 원본 메인 슬라이더(rev_slider_4_1): 1920x1080 그리드 위에 배경 사진, 흰 로고 마크,
// 4줄 문구, 영문 교회명과 밑줄이 순서대로 나타난다. 위치와 크기는 vw 로 비례 계산.
export default function Hero() {
  return (
    <section className="hero" aria-label="메인 이미지">
      <img className="hero-bg" src={img('hero.jpg')} alt="동탄동산교회 건물 외관" />
      <img className="hero-mark" src={img('mark-white.png')} alt="" aria-hidden="true" />
      <h1 className="hero-title">
        선명한 복음으로
        <br />
        도시와 가정을 세우고
        <br />
        하나님을 예배하는
        <br />
        동탄동산교회
      </h1>
      <p className="hero-sub">Dongtan Dongsan Church</p>
      <span className="hero-bar" aria-hidden="true" />
    </section>
  )
}
