import { FOOTER } from '../data'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main container">
        <p>{FOOTER.address}</p>
        <p>
          Phone: <a href={`tel:${FOOTER.phone.replace(/\D/g, '')}`}>{FOOTER.phone}</a>
        </p>
        <p>
          Fax: <span className="muted">{FOOTER.fax}</span>
        </p>
      </div>
      <div className="footer-copy">
        <p className="container">{FOOTER.copyright}</p>
      </div>
    </footer>
  )
}
