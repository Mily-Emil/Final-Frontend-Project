import { useEffect } from 'react'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Features from './pages/Features.jsx'
import Contact from './pages/Contact.jsx'
import CampusMap from './pages/gempat.jsx'
import PageLayout from './components/PageLayout.jsx'
import './App.css'

const pages = {
  about: About,
  features: Features,
  contact: Contact,
  gempat: CampusMap,
}

const pageTitles = {
  home: 'Beranda',
  about: 'Tentang Asrama',
  features: 'Fasilitas',
  contact: 'Kontak',
  gempat: 'Peta Kampus',
}

function App() {
  const pageName = new URLSearchParams(window.location.search).get('page')
  const Page = pages[pageName]
  const title = pageTitles[pageName] || pageTitles.home

  useEffect(() => {
    document.title = `${title} — Asrama Universitas Klabat`
  }, [title])

  if (!pageName || pageName === 'home' || !Page) {
    return <Home />
  }

  return (
    <PageLayout page={pageName}>
      <Page />
    </PageLayout>
  )
}

export default App
