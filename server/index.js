// 읽기 전용 API 서버 (DDC_DB/DDC_homepage_design_guide.md 의 /api/v1 규칙)
// - 갤러리 화면에 필요한 API: 게시판 목록, 갤러리 글 목록, 글 상세
// - npm run build 로 만든 dist/ 도 같이 내보내므로 서버 하나로 사이트 전체가 열린다.
import { existsSync } from 'node:fs'
import path from 'node:path'
import express from 'express'
import { pool, query, toKst } from './db.js'
import { DISPLAYABLE_SQL, loadObjectNames, toMedia } from './media.js'

const PORT = Number(process.env.PORT ?? 3001)
const DIST = path.join(import.meta.dirname, '..', 'dist')

class HttpError extends Error {
  constructor(status, code, message) {
    super(message)
    this.status = status
    this.code = code
  }
}

// page, size 같은 숫자 파라미터 검사. 범위를 벗어나면 400.
function intParam(value, fallback, min, max, name) {
  if (value === undefined || value === '') return fallback
  const n = Number(value)
  if (!Number.isInteger(n) || n < min || n > max) throw new HttpError(400, 'bad_param', `${name} 는 ${min}~${max} 사이의 정수여야 합니다.`)
  return n
}

const boardOf = (row) => row.board_id && { id: row.board_id, slug: row.board_slug, name: row.board_name, type: row.board_type }

// media + 3사이즈를 한 번에 읽는 SELECT. WHERE 는 호출하는 쪽에서 붙인다.
const MEDIA_SELECT = `
  SELECT m.id, m.mime_type, m.object_key, m.width, m.height,
         vs.object_key AS small_key,  vs.width AS small_w,  vs.height AS small_h,
         vm.object_key AS medium_key, vm.width AS medium_w, vm.height AS medium_h,
         vl.object_key AS large_key,  vl.width AS large_w,  vl.height AS large_h
  FROM media m
  LEFT JOIN media_variants vs ON vs.media_id = m.id AND vs.variant = 'small'
  LEFT JOIN media_variants vm ON vm.media_id = m.id AND vm.variant = 'medium'
  LEFT JOIN media_variants vl ON vl.media_id = m.id AND vl.variant = 'large'`

const app = express()

app.use('/api', (req, res, next) => {
  // 데이터가 거의 바뀌지 않으므로 5분 캐시 (가이드 §1.2)
  res.set('Cache-Control', 'public, max-age=300')
  next()
})

// 메뉴·탭용 게시판 목록. 공개 글이 있는 게시판만. ?type=gallery|blog
app.get('/api/v1/boards', async (req, res) => {
  const { type } = req.query
  if (type !== undefined && type !== 'gallery' && type !== 'blog') throw new HttpError(400, 'bad_param', 'type 은 gallery 또는 blog 입니다.')
  const rows = await query(
    `SELECT b.id, b.slug, b.name, b.type, COUNT(p.id) AS post_count
     FROM boards b
     JOIN posts p ON p.board_id = b.id AND p.status = 'publish'
     WHERE ? IS NULL OR b.type = ?
     GROUP BY b.id
     ORDER BY b.sort_order`,
    [type ?? null, type ?? null],
  )
  res.json({ items: rows.map((r) => ({ id: r.id, slug: r.slug, name: r.name, type: r.type, postCount: r.post_count })) })
})

// 갤러리 글 목록. slug 가 없으면 갤러리 게시판 8개 전체.
async function galleryPosts(req, res) {
  const page = intParam(req.query.page, 1, 1, 10000, 'page')
  const size = intParam(req.query.size, 12, 1, 48, 'size')

  let board = null
  if (req.params.slug) {
    ;[board] = await query(`SELECT id, slug, name, type FROM boards WHERE slug = ? AND type = 'gallery'`, [req.params.slug])
    if (!board) throw new HttpError(404, 'not_found', '갤러리를 찾을 수 없습니다.')
  }
  const where = board
    ? 'p.board_id = ? AND p.status = ?'
    : `p.board_id IN (SELECT id FROM boards WHERE type = 'gallery') AND p.status = ?`
  const whereParams = board ? [board.id, 'publish'] : ['publish']

  const [{ total }] = await query(`SELECT COUNT(*) AS total FROM posts p WHERE ${where}`, whereParams)
  const rows = await query(
    `SELECT p.id, p.title, p.published_at,
            b.id AS board_id, b.slug AS board_slug, b.name AS board_name, b.type AS board_type,
            (SELECT COUNT(*) FROM post_media pm JOIN media m ON m.id = pm.media_id
              WHERE pm.post_id = p.id AND pm.role IN ('gallery','attachment') AND ${DISPLAYABLE_SQL}) AS image_count,
            COALESCE(p.thumbnail_media_id,
              (SELECT pm.media_id FROM post_media pm JOIN media m ON m.id = pm.media_id
                WHERE pm.post_id = p.id AND pm.role IN ('gallery','attachment')
                  AND m.mime_type LIKE 'image/%' AND m.mime_type <> 'image/heic'
                ORDER BY pm.role = 'gallery' DESC, pm.position LIMIT 1)) AS cover_id
     FROM posts p
     JOIN boards b ON b.id = p.board_id
     WHERE ${where}
     ORDER BY p.published_at DESC, p.id DESC
     LIMIT ? OFFSET ?`,
    [...whereParams, size, (page - 1) * size],
  )

  const coverIds = rows.map((r) => r.cover_id).filter(Boolean)
  const covers = coverIds.length ? await query(`${MEDIA_SELECT} WHERE m.id IN (?)`, [coverIds]) : []
  const coverById = new Map(covers.map((m) => [m.id, m]))

  res.json({
    board: board && { id: board.id, slug: board.slug, name: board.name },
    items: rows.map((r) => ({
      id: r.id,
      title: r.title,
      publishedAt: toKst(r.published_at),
      board: boardOf(r),
      imageCount: r.image_count,
      cover: coverById.has(r.cover_id) ? toMedia(coverById.get(r.cover_id), r.title) : null,
    })),
    page,
    size,
    total,
  })
}
app.get('/api/v1/galleries/posts', galleryPosts)
app.get('/api/v1/galleries/:slug/posts', galleryPosts)

// 글 상세 (게시판 종류와 관계없이 공통). 사진, 태그, 같은 게시판의 이전/다음 글 포함.
app.get('/api/v1/posts/:id', async (req, res) => {
  const id = intParam(req.params.id, null, 1, Number.MAX_SAFE_INTEGER, 'id')
  const [post] = await query(
    `SELECT p.id, p.title, p.body, p.youtube_id, p.published_at, p.updated_at,
            b.id AS board_id, b.slug AS board_slug, b.name AS board_name, b.type AS board_type,
            u.display_name AS author
     FROM posts p
     LEFT JOIN boards b ON b.id = p.board_id
     LEFT JOIN users u ON u.id = p.author_id
     WHERE p.id = ? AND p.status = 'publish'`,
    [id],
  )
  if (!post) throw new HttpError(404, 'not_found', '글을 찾을 수 없습니다.')

  // gallery role 먼저, 이어서 attachment. inline 은 본문에 이미 있으므로 제외 (가이드 §4.2)
  const images = await query(
    `${MEDIA_SELECT}
     JOIN post_media pm ON pm.media_id = m.id
     WHERE pm.post_id = ? AND pm.role IN ('gallery','attachment') AND ${DISPLAYABLE_SQL}
     ORDER BY pm.role = 'gallery' DESC, pm.position`,
    [id],
  )
  const tags = await query(
    `SELECT t.name, t.slug FROM post_tags pt JOIN tags t ON t.id = pt.tag_id WHERE pt.post_id = ? ORDER BY t.name`,
    [id],
  )

  // 같은 게시판에서 바로 앞(더 오래된)/뒤(더 최신) 글
  let prev = null
  let next = null
  if (post.board_id) {
    const near = (cmp, order) =>
      query(
        `SELECT id, title FROM posts
         WHERE board_id = ? AND status = 'publish'
           AND (published_at ${cmp} ? OR (published_at = ? AND id ${cmp} ?))
         ORDER BY published_at ${order}, id ${order} LIMIT 1`,
        [post.board_id, post.published_at, post.published_at, id],
      )
    ;[[prev = null], [next = null]] = await Promise.all([near('<', 'DESC'), near('>', 'ASC')])
  }

  res.json({
    id: post.id,
    title: post.title,
    publishedAt: toKst(post.published_at),
    updatedAt: toKst(post.updated_at),
    author: post.author,
    board: boardOf(post),
    body: post.body, // 프론트가 렌더링 전에 sanitize 한다
    youtubeId: post.youtube_id,
    images: images.map((m) => toMedia(m, post.title)),
    tags,
    prev,
    next,
  })
})

app.use('/api', () => {
  throw new HttpError(404, 'not_found', '없는 API 입니다.')
})

// 빌드 결과물(dist/)이 있으면 같이 내보낸다. 주소는 HashRouter(#/gallery)라 index.html 하나면 된다.
if (existsSync(DIST)) app.use(express.static(DIST))

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err)
  if (err instanceof HttpError) {
    res.status(err.status).set('Cache-Control', 'no-store').json({ error: err.code, message: err.message })
    return
  }
  console.error(err)
  res.status(500).set('Cache-Control', 'no-store').json({ error: 'server_error', message: '서버 오류가 발생했습니다.' })
})

await loadObjectNames()
await pool
  .query('SELECT 1')
  .then(() => console.log(`[db] ${process.env.DB_NAME ?? 'ddc21_c'} 연결 확인`))
  .catch((err) => console.warn(`[db] 연결 실패: ${err.message} (.env 의 DB_* 값을 확인하세요)`))
app.listen(PORT, () => console.log(`API 서버: http://localhost:${PORT}/api/v1`))
