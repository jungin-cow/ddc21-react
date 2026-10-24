// 갤러리 데이터 (원본 사이트 page_id=276 에서 scripts/scrape_gallery.py 로 수집)
// - 썸네일은 public/images/gallery/<id>.jpg 로 저장되어 있다.
// - 큰 사진은 용량 때문에 받지 않고 원본 서버(ddc21.or.kr) 주소를 그대로 쓴다.
import data from './data/gallery.json'
import { img } from './data'

export const PAGE_SIZE = 24

export const CATEGORIES = data.categories

const categoryName = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c.name]))

export const POSTS = data.posts.map((post) => ({
  ...post,
  categoryNames: post.categories.map((slug) => categoryName[slug] ?? slug),
}))

export const findPost = (id) => POSTS.find((post) => String(post.id) === String(id))

// 원본 서버의 사진 주소. 한글 파일명이 있어서 encodeURI 로 감싼다.
export const photoUrl = (path) => encodeURI(path.startsWith('http') ? path : data.uploads + path)

// 썸네일이 없으면 null. 2021년 이전 게시물은 원본 서버에서도 사진 파일이 지워진 상태다.
export const thumbUrl = (post) => (post.thumb ? img(`gallery/${post.id}.jpg`) : null)
