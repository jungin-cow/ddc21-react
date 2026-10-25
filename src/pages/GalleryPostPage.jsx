import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaPlay } from 'react-icons/fa'
import { formatDate, useApi } from '../api'
import Lightbox from '../components/Lightbox'
import VerseBanner from '../components/VerseBanner'
import MediaImage from '../components/MediaImage'
import LoadError from '../components/LoadError'
import PostBody from '../components/PostBody'

// 게시물이 바뀌면 key 로 상태(크게 보기)를 새로 시작한다.
export default function GalleryPostPage() {
  const { boardSlug, postId } = useParams()
  return <GalleryPost key={postId} boardSlug={boardSlug} postId={postId} />
}

function GalleryPost({ boardSlug, postId }) {
  const { data: post, error, loading, reload } = useApi(`/posts/${encodeURIComponent(postId)}`)
  const [open, setOpen] = useState(null) // 크게 보는 사진 번호
  const backTo = `/gallery/${boardSlug}`

  if (error) {
    return (
      <section className="gallery container">
        {error.status === 404 ? <p className="gallery-empty">게시물을 찾을 수 없습니다.</p> : <LoadError error={error} onRetry={reload} />}
        <Link className="back-link" to={backTo}>
          <FaArrowLeft /> 갤러리 목록
        </Link>
      </section>
    )
  }

  // 주소의 게시판과 실제 게시판이 다르면 맞는 주소로 바꾼다.
  if (post?.board && post.board.slug !== boardSlug) return <Navigate to={`/gallery/${post.board.slug}/${post.id}`} replace />

  return (
    <>
      <article className="gallery container">
        <Link className="back-link" to={backTo}>
          <FaArrowLeft /> {post?.board?.name ?? '갤러리'} 목록
        </Link>

        {loading ? (
          <div aria-busy="true" aria-label="불러오는 중">
            <header className="post-title">
              <span className="skeleton-line is-short" />
              <span className="skeleton-line is-title" />
            </header>
            <div className="post-photos">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="post-photo is-skeleton" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <header className="post-title">
              {post.board && <p className="gallery-cat">{post.board.name}</p>}
              <h1>{post.title || '(제목 없음)'}</h1>
              <p className="post-meta">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                {post.images.length > 0 && ` · 사진 ${post.images.length}장`}
              </p>
            </header>

            <PostBody html={post.body} />

            {post.images.length > 0 ? (
              <div className="post-photos">
                {post.images.map((media, i) => (
                  <button
                    key={media.id}
                    className="post-photo"
                    onClick={() => setOpen(i)}
                    aria-label={`${i + 1}번째 ${media.type === 'video' ? '영상 재생' : '사진 크게 보기'}`}
                  >
                    {media.type === 'video' ? (
                      <span className="post-video">
                        <FaPlay />
                      </span>
                    ) : (
                      <MediaImage media={media} alt="" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              !post.body?.trim() && <p className="gallery-empty">등록된 사진이 없습니다.</p>
            )}

            {post.tags.length > 0 && (
              <ul className="post-tags" aria-label="태그">
                {post.tags.map((t) => (
                  <li key={t.slug}>#{t.name}</li>
                ))}
              </ul>
            )}

            <nav className="post-nav" aria-label="다른 게시물">
              {post.next ? (
                <Link to={`${backTo}/${post.next.id}`} className="post-nav-link">
                  <FaChevronLeft />
                  <span>
                    <small>다음 게시물</small>
                    {post.next.title || '(제목 없음)'}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {post.prev && (
                <Link to={`${backTo}/${post.prev.id}`} className="post-nav-link is-older">
                  <span>
                    <small>이전 게시물</small>
                    {post.prev.title || '(제목 없음)'}
                  </span>
                  <FaChevronRight />
                </Link>
              )}
            </nav>
          </>
        )}
      </article>
      <VerseBanner />

      {open !== null && post && (
        <Lightbox items={post.images} index={open} onChange={setOpen} onClose={() => setOpen(null)} />
      )}
    </>
  )
}
