import { Link } from 'react-router-dom'

// data.js 항목에 to 가 있으면 앱 안 페이지(Link), 없으면 일반 링크(a)로 그린다.
export default function SmartLink({ item, children, ...props }) {
  if (item.to) {
    return (
      <Link to={item.to} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <a href={item.href} {...props}>
      {children}
    </a>
  )
}
