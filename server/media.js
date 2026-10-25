// 미디어 URL 만들기 (DB 설계서 §6, 페이지 가이드 §1.3)
// - DB에는 객체 키(2026/10/파일.jpg)만 있고, URL = MEDIA_BASE_URL + 키 조각별 encodeURIComponent.
// - GCS 객체명은 한글이 NFD(자모 분리)인 것과 NFC인 것이 섞여 있고, DB 키는 NFC다.
//   그래서 버킷의 객체 목록을 받아 "NFC 키 → 실제 객체명" 표를 만들어 두고 URL을 만들 때 바꿔 쓴다.
//   목록은 server/.cache/gcs-objects.json 에 저장해 두고 하루에 한 번 새로 받는다.
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

const BASE_URL = process.env.MEDIA_BASE_URL ?? 'https://storage.googleapis.com/ddc21-media/uploads/'
const CACHE_FILE = path.join(import.meta.dirname, '.cache', 'gcs-objects.json')
const CACHE_TTL = 24 * 60 * 60 * 1000

let objectName = new Map() // NFC 키 → 버킷 안의 실제 이름(uploads/ 뒤)

// MEDIA_BASE_URL 이 https://storage.googleapis.com/<bucket>/<prefix> 형태일 때만 목록을 받을 수 있다.
function bucketOf(baseUrl) {
  const m = baseUrl.match(/^https:\/\/storage\.googleapis\.com\/([^/]+)\/(.*)$/)
  return m && { bucket: m[1], prefix: m[2] }
}

async function fetchObjectNames({ bucket, prefix }) {
  const names = []
  let pageToken
  do {
    const q = new URLSearchParams({ prefix, fields: 'items(name),nextPageToken', maxResults: '1000' })
    if (pageToken) q.set('pageToken', pageToken)
    const res = await fetch(`https://storage.googleapis.com/storage/v1/b/${bucket}/o?${q}`)
    if (!res.ok) throw new Error(`GCS 목록 조회 실패: HTTP ${res.status}`)
    const data = await res.json()
    for (const item of data.items ?? []) names.push(item.name.slice(prefix.length))
    pageToken = data.nextPageToken
  } while (pageToken)
  return names
}

function setNames(names) {
  objectName = new Map(names.map((name) => [name.normalize('NFC'), name]))
}

// 서버 시작 시 한 번 부른다. 실패해도 서버는 뜨고, 그때는 DB 키를 그대로 쓴다.
export async function loadObjectNames({ refresh = false } = {}) {
  const target = bucketOf(BASE_URL)
  if (!target) return

  const cached = await stat(CACHE_FILE).catch(() => null)
  if (cached && !refresh && Date.now() - cached.mtimeMs < CACHE_TTL) {
    setNames(JSON.parse(await readFile(CACHE_FILE, 'utf8')))
    console.log(`[media] GCS 객체 목록 ${objectName.size}개 (캐시)`)
    return
  }

  try {
    const names = await fetchObjectNames(target)
    setNames(names)
    await mkdir(path.dirname(CACHE_FILE), { recursive: true })
    await writeFile(CACHE_FILE, JSON.stringify(names))
    console.log(`[media] GCS 객체 목록 ${names.length}개 (새로 받음)`)
  } catch (err) {
    // 오래된 캐시라도 있으면 쓴다.
    if (cached) setNames(JSON.parse(await readFile(CACHE_FILE, 'utf8')))
    console.warn(`[media] ${err.message}. ${cached ? '이전 캐시를 사용합니다' : 'DB 키를 그대로 사용합니다'}`)
  }
}

export function mediaUrl(key) {
  if (!key) return null
  const name = objectName.get(key.normalize('NFC')) ?? key
  return BASE_URL + name.split('/').map(encodeURIComponent).join('/')
}

// 화면에 보여줄 수 있는 파일만 그리드에 넣는다. HEIC는 브라우저가 못 띄우고, pptx 등은 사진이 아니다.
export const DISPLAYABLE_SQL = "((m.mime_type LIKE 'image/%' AND m.mime_type <> 'image/heic') OR m.mime_type = 'video/mp4')"

// media + media_variants 한 행 → API 미디어 객체 (페이지 가이드 §1.3)
// variant 가 없는 이미지(16장)는 원본을 세 사이즈 모두에 쓴다.
export function toMedia(row, alt = '') {
  if (row.mime_type.startsWith('video/')) {
    return { id: row.id, type: 'video', alt, url: mediaUrl(row.object_key), width: row.width, height: row.height }
  }
  const original = { key: row.object_key, width: row.width, height: row.height }
  const variant = (name) => {
    const v = row[`${name}_key`] ? { key: row[`${name}_key`], width: row[`${name}_w`], height: row[`${name}_h`] } : original
    return { url: mediaUrl(v.key), width: v.width, height: v.height }
  }
  return { id: row.id, type: 'image', alt, variants: { small: variant('small'), medium: variant('medium'), large: variant('large') } }
}
