import DOMPurify from 'dompurify'

// 본문 HTML은 외부에서 들어온 값이므로 그리기 전에 sanitize 한다 (페이지 가이드 §1.6).
// - <script>, on* 속성, javascript: 주소는 DOMPurify 가 지운다.
// - <iframe>은 YouTube 만 남긴다.
// - 본문 사진은 원본 크기라 늦게 불러오게(lazy) 한다.
const YOUTUBE = /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com)\/embed\//

DOMPurify.addHook('uponSanitizeElement', (node, data) => {
  if (data.tagName === 'iframe' && !YOUTUBE.test(node.getAttribute('src') ?? '')) node.remove()
})
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'IMG') {
    node.setAttribute('loading', 'lazy')
    node.setAttribute('decoding', 'async')
  }
  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') node.setAttribute('rel', 'noopener noreferrer')
})

export default function PostBody({ html }) {
  if (!html?.trim()) return null
  const clean = DOMPurify.sanitize(html, { ADD_TAGS: ['iframe'], ADD_ATTR: ['allowfullscreen', 'target'] })
  return <div className="post-body" dangerouslySetInnerHTML={{ __html: clean }} />
}
