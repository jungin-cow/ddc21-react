import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { POSTS, findPost, photoUrl } from '../gallery'
import Lightbox from '../components/Lightbox'
import VerseBanner from '../components/VerseBanner'

// 게시물이 바뀌면 key 로 상태(크게 보기, 깨진 사진 목록)를 새로 시작한다.
export default function GalleryPostPage() {
  const { id } = useParams()
  return <GalleryPost key={id} id={id} />
}

function GalleryPost({ id }) {
  const post = findPost(id)
  const [open, setOpen] = useState(null) // 크게 보는 사진 번호
  const [broken, setBroken] = useState(() => new Set()) // 불러오지 못한 사진 번호

  if (!post) {
    return (
      <section className="gallery container">
        <p className="gallery-empty">게시물을 찾을 수 없습니다.</p>
        <Link className="back-link" to="/gallery">
          <FaArrowLeft /> 갤러리 목록
        </Link>
      </section>
    )
  }

  // 목록 순서(최신순) 기준 이전/다음 게시물
  const index = POSTS.indexOf(post)
  const newer = POSTS[index - 1]
  const older = POSTS[index + 1]

  return (
    <>
      <article className="gallery container">
        <Link className="back-link" to="/gallery">
          <FaArrowLeft /> 갤러리 목록
        </Link>
        <header className="post-title">
          {post.categoryNames.length > 0 && <p className="gallery-cat">{post.categoryNames.join(', ')}</p>}
          <h1>{post.title}</h1>
          <p className="post-meta">사진 {post.photos.length}장</p>
        </header>

        {!post.thumb && <p className="post-notice">오래된 게시물이라 원본 서버에 사진 파일이 남아 있지 않을 수 있습니다.</p>}

        <div className="post-photos">
          {post.photos.map(([path, width, height], i) =>
            broken.has(i) ? (
              <div key={path} className="post-photo">
                <span className="photo-missing">사진 없음</span>
              </div>
            ) : (
              <button key={path} className="post-photo" onClick={() => setOpen(i)} aria-label={`${i + 1}번째 사진 크게 보기`}>
                <img
                  src={photoUrl(path)}
                  alt=""
                  loading="lazy"
                  width={width || undefined}
                  height={height || undefined}
                  onError={() => setBroken((prev) => new Set(prev).add(i))}
                />
              </button>
            ),
          )}
        </div>

        <nav className="post-nav" aria-label="다른 게시물">
          {newer ? (
            <Link to={`/gallery/${newer.id}`} className="post-nav-link">
              <FaChevronLeft />
              <span>
                <small>다음 게시물</small>
                {newer.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {older && (
            <Link to={`/gallery/${older.id}`} className="post-nav-link is-older">
              <span>
                <small>이전 게시물</small>
                {older.title}
              </span>
              <FaChevronRight />
            </Link>
          )}
        </nav>
      </article>
      <VerseBanner />

      {open !== null && (
        <Lightbox photos={post.photos.map(([path]) => photoUrl(path))} index={open} onChange={setOpen} onClose={() => setOpen(null)} />
      )}
    </>
  )
}
