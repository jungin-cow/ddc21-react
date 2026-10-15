import { DEPARTMENTS, img } from '../data'

export default function Departments() {
  return (
    <section className="departments container" aria-label="예배와 부서">
      {DEPARTMENTS.map(({ label, icon, href }) => (
        <a key={label} className="dept-card" href={href}>
          <img src={img(icon)} alt="" width="75" height="75" />
          <span>{label}</span>
        </a>
      ))}
    </section>
  )
}
