import { Link, NavLink, useParams, useSearchParams } from 'react-router-dom'
import { PHOTO_SLIDES } from '../data'
import { formatDate, useApi } from '../api'
import PhotoSlider from '../components/PhotoSlider'
import Pagination from '../components/Pagination'
import VerseBanner from '../components/VerseBanner'
import MediaImage from '../components/MediaImage'
import LoadError from '../components/LoadError'

const PAGE_SIZE = 12

// /gallery            → 갤러리 게시판 8개 전체
// /gallery/happykids  → 한 게시판. 페이지 번호는 ?page=2 로 주소에 남겨서 뒤로가기가 된다.
export default function GalleryPage() {
  const { boardSlug } = useParams()
  const [params, setParams] = useSearchParams()
  const page = Math.max(1, Number(params.get('page')) || 1)

  const boards = useApi('/boards', { type: 'gallery' })
  const list = useApi(boardSlug ? `/galleries/${boardSlug}/posts` : '/galleries/posts', { page, size: PAGE_SIZE })

  const pageCount = list.data ? Math.max(1, Math.ceil(list.data.total / PAGE_SIZE)) : 1
  const goPage = (p) => setParams(p > 1 ? { page: String(p) } : {})
  const board = boards.data?.items.find((b) => b.slug === boardSlug)

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

        <nav aria-label="부서">
          <ul className="gallery-filters">
            <li>
              <NavLink to="/gallery" end>
                전체
              </NavLink>
            </li>
            {boards.data?.items.map((b) => (
              <li key={b.slug}>
                <NavLink to={`/gallery/${b.slug}`}>{b.name}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <p className="gallery-count" aria-live="polite">
          {list.data && `${board?.name ?? '전체'} · 게시물 ${list.data.total}개 · ${page} / ${pageCount} 페이지`}
        </p>

        {list.error ? (
          <LoadError error={list.error} onRetry={list.reload} />
        ) : list.loading ? (
          <div className="gallery-grid" aria-busy="true" aria-label="불러오는 중">
            {Array.from({ length: PAGE_SIZE }, (_, i) => (
              <div key={i} className="gallery-card is-skeleton">
                <div className="gallery-thumb" />
                <span className="skeleton-line" />
                <span className="skeleton-line is-short" />
              </div>
            ))}
          </div>
        ) : list.data.items.length === 0 ? (
          <p className="gallery-empty">등록된 글이 없습니다.</p>
        ) : (
          <div className="gallery-grid">
            {list.data.items.map((post) => (
              <Link key={post.id} to={`/gallery/${post.board.slug}/${post.id}`} className="gallery-card">
                <div className="gallery-thumb">
                  <MediaImage media={post.cover} alt="" />
                  {post.imageCount > 1 && <span className="gallery-count-badge">{post.imageCount}장</span>}
                </div>
                <h2>{post.title || '(제목 없음)'}</h2>
                <p className="gallery-cat">
                  {!boardSlug && `${post.board.name} · `}
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </p>
              </Link>
            ))}
          </div>
        )}

        <Pagination page={page} pageCount={pageCount} onChange={goPage} />
      </section>
      <VerseBanner />
    </>
  )
}
