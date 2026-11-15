function PageLayout({ page, children }) {
  return (
    <div className="site-shell" id="top">
      <header className="topbar">
        <a className="wordmark" href="?page=home" aria-label="Uklab Dormitory, beranda">
          <span className="wordmark-mark">U.</span>
          <span className="wordmark-name">
            UNKLAB
            <small>DORMITORY</small>
          </span>
        </a>

        <nav className="main-nav" aria-label="Navigasi utama">
          <a href="?page=home">Beranda</a>
          <a href="?page=about" aria-current={page === 'about' ? 'page' : undefined}>Tentang</a>
          <a href="?page=features" aria-current={page === 'features' ? 'page' : undefined}>Fasilitas</a>
          <a href="?page=gempat" aria-current={page === 'gempat' ? 'page' : undefined}>Peta lokasi</a>
          <a href="?page=contact" aria-current={page === 'contact' ? 'page' : undefined}>Kontak</a>
        </nav>

        <a className="nav-cta" href="?page=home#asrama">
          Lihat asrama
          <svg aria-hidden="true" className="arrow-icon arrow-icon--diagonal" viewBox="0 0 20 20" fill="none">
            <path d="M3.5 10h12m-5-5 5 5-5 5" />
          </svg>
        </a>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="?page=home">
          <span className="wordmark-mark">U.</span>
          <span className="wordmark-name">
            UNKLAB
            <small>DORMITORY</small>
          </span>
        </a>
        <span className="footer-note">RUANG TUMBUH &amp; KARAKTER.</span>
        <span className="footer-copyright">© {new Date().getFullYear()} UNIVERSITAS KLABAT</span>
        <a className="back-to-top" href="#top" aria-label="Kembali ke atas">↑</a>
      </footer>
    </div>
  )
}

export default PageLayout
