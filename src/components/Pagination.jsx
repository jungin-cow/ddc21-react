import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

// 현재 페이지 앞뒤 2개씩 + 처음/끝 페이지를 보여준다. 예: 1 … 4 5 [6] 7 8 … 30
function pageItems(page, pageCount) {
  const items = []
  for (let p = 1; p <= pageCount; p++) {
    if (p === 1 || p === pageCount || Math.abs(p - page) <= 2) items.push(p)
    else if (items[items.length - 1] !== '…') items.push('…')
  }
  return items
}

export default function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null
  return (
    <nav className="pagination" aria-label="페이지">
      <button onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="이전 페이지">
        <FaChevronLeft />
      </button>
      {pageItems(page, pageCount).map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="pagination-gap">
            …
          </span>
        ) : (
          <button key={p} className={p === page ? 'is-current' : ''} aria-current={p === page ? 'page' : undefined} onClick={() => onChange(p)}>
            {p}
          </button>
        ),
      )}
      <button onClick={() => onChange(page + 1)} disabled={page === pageCount} aria-label="다음 페이지">
        <FaChevronRight />
      </button>
    </nav>
  )
}
