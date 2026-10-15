import { PHOTO_SLIDES, YOUTUBE_EMBED } from '../data'
import PhotoSlider from './PhotoSlider'

export default function Media() {
  return (
    <section className="media container" aria-label="영상과 사진">
      <div className="video-wrap">
        <iframe
          src={YOUTUBE_EMBED}
          title="동탄동산교회 유튜브 영상"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <PhotoSlider slides={PHOTO_SLIDES} />
    </section>
  )
}
