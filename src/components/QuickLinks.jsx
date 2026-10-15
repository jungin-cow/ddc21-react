import { QUICK_LINKS } from '../data'

export default function QuickLinks() {
  return (
    <section className="quick-links container" aria-label="바로가기">
      {QUICK_LINKS.map((link) => {
        const Icon = link.icon
        return (
          <a key={link.label} className="quick-btn" href={link.href} style={{ '--mobile-order': link.mobileOrder }}>
            <Icon aria-hidden="true" />
            <span>{link.label}</span>
          </a>
        )
      })}
    </section>
  )
}
