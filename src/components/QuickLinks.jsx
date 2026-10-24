import { QUICK_LINKS } from '../data'
import SmartLink from './SmartLink'

export default function QuickLinks() {
  return (
    <section className="quick-links container" aria-label="바로가기">
      {QUICK_LINKS.map((link) => {
        const Icon = link.icon
        return (
          <SmartLink key={link.label} item={link} className="quick-btn" style={{ '--mobile-order': link.mobileOrder }}>
            <Icon aria-hidden="true" />
            <span>{link.label}</span>
          </SmartLink>
        )
      })}
    </section>
  )
}
