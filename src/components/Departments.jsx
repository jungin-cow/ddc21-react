import { DEPARTMENTS, img } from '../data'
import SmartLink from './SmartLink'

export default function Departments() {
  return (
    <section className="departments container" aria-label="예배와 부서">
      {DEPARTMENTS.map((item) => (
        <SmartLink key={item.label} item={item} className="dept-card">
          <img src={img(item.icon)} alt="" width="75" height="75" />
          <span>{item.label}</span>
        </SmartLink>
      ))}
    </section>
  )
}
