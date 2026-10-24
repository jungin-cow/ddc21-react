import { Link, useSearchParams } from 'react-router-dom'
import { PHOTO_SLIDES } from '../data'
import { CATEGORIES, PAGE_SIZE, POSTS, thumbUrl } from '../gallery'
import PhotoSlider from '../components/PhotoSlider'
import Pagination from '../components/Pagination'
import VerseBanner from '../components/VerseBanner'

export default function GalleryPage() {
  // 분류와 페이지 번호를 주소(?cat=events&page=2)에 담아서, 뒤로가기와 새로고침에도 유지되게 한다.
  const [params, setParams] = useSearchParams()
  const cat = params.get('cat') ?? ''
  const posts = cat ? POSTS.filter((post) => post.categories.includes(cat)) : POSTS
  const pageCount = Math.max(1, Math.ceil(posts.length / PAGE_SIZE))
  const page = Math.min(Math.max(1, Number(params.get('page')) || 1), pageCount)
  const visible = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const go = (next) => {
    const merged = { cat, page: 1, ...next }
    const search = {}
    if (merged.cat) search.cat = merged.cat
    if (merged.page > 1) search.page = String(merged.page)
    setParams(search)
  }

  return (
    <>
      <section className="gallery container">
        <header className="page-title">
          <h1>DDC Gallery</h1>
          <p>DDC 가족들이 함께한 소중한 순간들 입니다.</p>
        </header>

        <div className="gallery-slider">
          <PhotoSlider slides={PHOTO_SLIDES} />
        </div>

        <ul className="gallery-filters" aria-label="분류">
          {[{ slug: '', name: 'All' }, ...CATEGORIES].map((c) => (
            <li key={c.slug}>
              <button className={c.slug === cat ? 'is-active' : ''} aria-pressed={c.slug === cat} onClick={() => go({ cat: c.slug })}>
                {c.name}
              </button>
            </li>
          ))}
        </ul>

        <p className="gallery-count">
          게시물 {posts.length}개 · {page} / {pageCount} 페이지
        </p>

        <div className="gallery-grid">
          {visible.map((post) => (
            <Link key={post.id} to={`/gallery/${post.id}`} className="gallery-card">
              <div className="gallery-thumb">
                {post.thumb ? (
                  <img src={thumbUrl(post)} alt="" loading="lazy" width="400" height="300" />
                ) : (
                  <span className="photo-missing">사진 없음</span>
                )}
                {post.thumb && post.photos.length > 1 && <span className="gallery-count-badge">{post.photos.length}장</span>}
              </div>
              <h2>{post.title}</h2>
              {post.categoryNames.length > 0 && <p className="gallery-cat">{post.categoryNames.join(', ')}</p>}
            </Link>
          ))}
        </div>

        <Pagination page={page} pageCount={pageCount} onChange={(p) => go({ page: p })} />
      </section>
      <VerseBanner />
    </>
  )
}
