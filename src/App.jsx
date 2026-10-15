import Header from './components/Header'
import Hero from './components/Hero'
import QuickLinks from './components/QuickLinks'
import Departments from './components/Departments'
import Media from './components/Media'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <QuickLinks />
        <Departments />
        <Media />
      </main>
      <Footer />
    </>
  )
}
