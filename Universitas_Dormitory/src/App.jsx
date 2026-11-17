import { useEffect } from 'react'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Features from './pages/Features.jsx'
import Contact from './pages/Contact.jsx'
import CampusMap from './pages/gempat.jsx'
import Booking from './pages/Booking.jsx'
import Admin from './pages/Admin.jsx'
import PageLayout from './components/PageLayout.jsx'
import ChatAiBox from './components/ChatAiBox.jsx'
import './App.css'

const pages = {
  about: About,
  features: Features,
  contact: Contact,
  gempat: CampusMap,
  booking: Booking,
  admin: Admin,
}

const pageTitles = {
  home: 'Beranda',
  about: 'Tentang Asrama',
  features: 'Fasilitas',
  contact: 'Kontak',
  gempat: 'Peta Kampus',
  booking: 'Booking Asrama',
  admin: 'Approval Kepala Asrama',
}

function App() {
  const pageName = new URLSearchParams(window.location.search).get('page')
  const Page = pages[pageName]
  const title = pageTitles[pageName] || pageTitles.home

  useEffect(() => {
    document.title = `${title} — Asrama Universitas Klabat`
  }, [title])

  if (!pageName || pageName === 'home' || !Page) {
    return (
      <>
        <Home />
        <ChatAiBox />
      </>
    )
  }

  return (
    <>
      <PageLayout page={pageName}>
        <Page />
      </PageLayout>
      <ChatAiBox />
    </>
  )
}

export default App
