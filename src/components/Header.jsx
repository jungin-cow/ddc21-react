import { useState } from 'react'
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa'
import { MENU, ABOUT_URL, img } from '../data'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openSub, setOpenSub] = useState(null)

  return (
    <header className="header" id="top">
      <div className="header-top container">
        <a href="#top" className="logo">
          <img className="logo-desktop" src={img('logo.png')} alt="동탄동산교회 로고" width="150" height="97" />
          <img className="logo-mobile" src={img('logo-mobile.png')} alt="동탄동산교회 로고" width="150" height="51" />
        </a>
        <div className="header-tagline">
          <span>처음 방문하셨나요? 동탄동산교회에 오신 여러분을 환영합니다.</span>
          <a className="btn-about" href={ABOUT_URL}>
            Go to About
          </a>
        </div>
        <button
          className="menu-toggle"
          aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <nav className={`nav ${mobileOpen ? 'is-open' : ''}`} aria-label="주 메뉴">
        <ul className="nav-list">
          {MENU.map((item, i) => (
            <li key={item.label} className={`nav-item ${item.children ? 'has-children' : ''} ${i === 0 ? 'is-current' : ''}`}>
              <div className="nav-link-row">
                <a href={item.href} onClick={() => setMobileOpen(false)}>
                  {item.label}
                </a>
                {item.children && (
                  <button
                    className={`sub-toggle ${openSub === item.label ? 'is-open' : ''}`}
                    aria-label={`${item.label} 하위 메뉴`}
                    aria-expanded={openSub === item.label}
                    onClick={() => setOpenSub((v) => (v === item.label ? null : item.label))}
                  >
                    <FaChevronDown />
                  </button>
                )}
              </div>
              {item.children && (
                <ul className={`sub-menu ${openSub === item.label ? 'is-open' : ''}`}>
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <a href={child.href}>{child.label}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
