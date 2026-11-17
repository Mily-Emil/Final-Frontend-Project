import { useMemo, useState } from 'react'
import '../App.css'

const dormitories = [
  {
    name: 'Crystal Dormitory',
    type: 'Putra',
    location: 'Area utama kampus',
    rooms: '4 orang / kamar',
    image:
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Kamar asrama dengan tempat tidur dan jendela besar',
    tag: 'Favorit',
  },
  {
    name: 'Guesthouse Dormitory',
    type: 'Putra',
    location: 'Dekat pusat kegiatan',
    rooms: '6 orang / kamar',
    image:
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Interior kamar asrama yang nyaman',
    tag: 'Terbatas',
  },
  {
    name: 'Genset Dormitory',
    type: 'Putra',
    location: 'Area timur kampus',
    rooms: '2–3 orang / kamar',
    image:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Ruang tinggal modern dengan furnitur minimalis',
    tag: 'Pilihan baru',
  },
  {
    name: 'Annex Dormitory',
    type: 'Putri',
    location: 'Area barat kampus',
    rooms: '2–4 orang / kamar',
    image:
      'https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Ruang kamar asrama dengan dua tempat tidur',
    tag: 'Tersedia',
  },
  {
    name: 'Jasmine 1 Dormitory',
    type: 'Putri',
    location: 'Area utama kampus',
    rooms: '4 orang / kamar',
    image:
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Kamar tidur asrama dengan pencahayaan alami',
    tag: 'Tersedia',
  },
  {
    name: 'Jasmine 2 Dormitory',
    type: 'Putri',
    location: 'Area utama kampus',
    rooms: '4 orang / kamar',
    image:
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Kamar tidur rapi dengan tempat tidur dan meja',
    tag: 'Tersedia',
  },
  {
    name: 'Edelweiss Dormitory',
    type: 'Putri',
    location: 'Dekat perpustakaan',
    rooms: '6 orang / kamar',
    image:
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Kamar tidur terang dengan furnitur kayu',
    tag: 'Tersedia',
  },
]

const filters = ['Semua', 'Putra', 'Putri']

function ArrowIcon({ diagonal = false }) {
  return (
    <svg
      aria-hidden="true"
      className={diagonal ? 'arrow-icon arrow-icon--diagonal' : 'arrow-icon'}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path d="M3.5 10h12m-5-5 5 5-5 5" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M16 8.3c0 4.3-6 9.2-6 9.2S4 12.6 4 8.3a6 6 0 1 1 12 0Z" />
      <circle cx="10" cy="8" r="2" />
    </svg>
  )
}

function Home() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('Semua')

  const visibleDormitories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return dormitories.filter((dormitory) => {
      const matchesFilter =
        activeFilter === 'Semua' || dormitory.type === activeFilter
      const matchesQuery =
        !normalizedQuery ||
        `${dormitory.name} ${dormitory.type} ${dormitory.location}`
          .toLowerCase()
          .includes(normalizedQuery)

      return matchesFilter && matchesQuery
    })
  }, [activeFilter, query])

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="wordmark" href="#beranda" aria-label="Uklab Dormitory, beranda">
          <span className="wordmark-mark">U.</span>
          <span className="wordmark-name">
            UNKLAB
            <small>DORMITORY</small>
          </span>
        </a>

        <nav className="main-nav" aria-label="Navigasi utama">
          <a href="?page=home" aria-current="page">Beranda</a>
          <a href="?page=about">Tentang</a>
          <a href="?page=features">Fasilitas</a>
          <a href="?page=gempat">Peta lokasi</a>
          <a href="?page=contact">Kontak</a>
          <a href="?page=booking">Booking</a>
        </nav>

        <a className="nav-cta" href="#asrama">
          Cari hunian <ArrowIcon diagonal />
        </a>
      </header>

      <main>
        <section className="hero-section" id="beranda">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              HUNIAN KAMPUS · AIRMADIDI
            </div>
            <h1>
              Ruang untuk
              <br />
              tumbuh <span>bersama.</span>
            </h1>
            <p className="hero-description">
              Temukan tempat tinggal yang terasa seperti rumah. Kenali pilihan
              asrama Universitas Klabat dan temukan ruang terbaik untuk cerita
              kampusmu.
            </p>
            <div className="hero-actions">
              <a className="button button--primary" href="#asrama">
                Jelajahi asrama <ArrowIcon />
              </a>
              <a className="text-link" href="#peta">
                Lihat peta kampus
              </a>
            </div>
            <div className="hero-note">
              <span className="note-line" />
              <span>Tempat baik untuk memulai perjalananmu.</span>
            </div>
          </div>

          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=90"
              alt="Bangunan kampus Universitas dengan suasana hijau"
            />
            <div className="visual-caption">
              <span className="caption-index">01 / 03</span>
              <span>Lebih dari sekadar tempat tinggal.</span>
            </div>
            <div className="floating-stats" aria-label="Informasi asrama">
              <span className="stats-number">{String(dormitories.length).padStart(2, '0')}</span>
              <span className="stats-label">pilihan asrama<br />di dalam kampus</span>
              <span className="stats-rule" />
              <span className="stats-number">01</span>
              <span className="stats-label">komunitas untuk<br />bertumbuh bersama</span>
            </div>
            <span className="visual-index">AIRMADIDI, NORTH SULAWESI</span>
          </div>
        </section>

        <section className="intro-strip" id="tentang">
          <p className="intro-heading">
            Satu kampus,
            <br />
            banyak cerita.
          </p>
          <p className="intro-copy">
            Tinggal di asrama berarti menjadi bagian dari komunitas yang saling
            mendukung. Pilih hunian yang sesuai dengan kebutuhan, kebiasaan, dan
            caramu menjalani hari.
          </p>
          <div className="intro-index">
            <span>01</span>
            <span className="intro-index-line" />
            <span>KENALI LINGKUNGANMU</span>
          </div>
        </section>

        <section className="directory-section" id="asrama">
          <div className="section-heading">
            <div>
              <p className="eyebrow section-eyebrow">PILIHAN HUNIAN</p>
              <h2>Daftar asrama<span className="orange-period">.</span></h2>
            </div>
            <p className="section-aside">
              Temukan tempat yang pas
              <br />
              untuk kehidupan kampusmu.
            </p>
          </div>

          <div className="directory-tools">
            <div className="filter-tabs" role="group" aria-label="Filter asrama">
              {filters.map((filter) => (
                <button
                  className={activeFilter === filter ? 'filter-tab is-active' : 'filter-tab'}
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  type="button"
                  aria-pressed={activeFilter === filter}
                >
                  {filter}
                  {filter === 'Semua' && (
                    <span className="filter-count">
                      {String(dormitories.length).padStart(2, '0')}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <label className="search-field">
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                <circle cx="8.8" cy="8.8" r="5.8" />
                <path d="m13.2 13.2 4 4" />
              </svg>
              <span className="sr-only">Cari nama atau lokasi asrama</span>
              <input
                type="search"
                placeholder="Cari asrama..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <span className="search-shortcut">↵</span>
            </label>
          </div>

          {visibleDormitories.length > 0 ? (
            <div className="dorm-grid">
              {visibleDormitories.map((dormitory, index) => (
                <article className="dorm-card" key={dormitory.name}>
                  <a
                    className="dorm-image-link"
                    href="#kontak"
                    aria-label={`Tanyakan tentang ${dormitory.name}`}
                  >
                    <img
                      className="dorm-image"
                      src={dormitory.image}
                      alt={dormitory.imageAlt}
                      loading="lazy"
                    />
                    <span className="card-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="dorm-tag">{dormitory.tag}</span>
                    <span className="image-arrow"><ArrowIcon diagonal /></span>
                  </a>
                  <div className="dorm-card-content">
                    <div className="dorm-name-row">
                      <h3>{dormitory.name}</h3>
                      <span className="dorm-type">{dormitory.type}</span>
                    </div>
                    <div className="dorm-meta">
                      <span><PinIcon />{dormitory.location}</span>
                      <span>{dormitory.rooms}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state" role="status">
              <span className="empty-state-mark">?</span>
              <div>
                <h3>Asrama tidak ditemukan.</h3>
                <p>Coba kata kunci lain atau pilih filter yang berbeda.</p>
              </div>
              <button
                className="text-link"
                onClick={() => {
                  setQuery('')
                  setActiveFilter('Semua')
                }}
                type="button"
              >
                Hapus pencarian <ArrowIcon />
              </button>
            </div>
          )}

          <div className="directory-footer">
            <span>
              MENAMPILKAN {String(visibleDormitories.length).padStart(2, '0')} DARI{' '}
              {String(dormitories.length).padStart(2, '0')} ASRAMA
            </span>
            <a href="#kontak">Butuh bantuan memilih? <ArrowIcon diagonal /></a>
          </div>
        </section>

        <section className="map-section" id="peta">
          <div className="map-copy">
            <p className="eyebrow section-eyebrow">TEMUKAN JALANMU</p>
            <h2>
              Semua dekat.
              <br />
              Semua terhubung.
            </h2>
            <p>
              Tinggal di dalam kampus membuat ruang belajar, aktivitas, dan
              teman-teman selalu mudah dijangkau.
            </p>
            <a className="button button--dark" href="#asrama">
              Pilih asrama <ArrowIcon />
            </a>
            <span className="map-coordinate">01°27&apos; N&nbsp; 124°50&apos; E</span>
          </div>

          <div className="campus-map" role="img" aria-label="Ilustrasi peta lokasi asrama dan fasilitas kampus">
            <div className="map-grid" />
            <svg className="map-paths" viewBox="0 0 720 440" preserveAspectRatio="none" aria-hidden="true">
              <path d="M55 315 156 315 156 252 245 252 245 183 354 183 354 124 454 124 454 188 548 188 548 288 674 288" />
              <path d="M155 315 245 364 354 364 354 298 454 298 454 188" />
              <path d="M245 183 189 112 89 112" />
              <path d="M454 124 527 70 645 70" />
              <path d="M548 288 602 352 671 352" />
            </svg>
            <div className="map-building map-building--one"><span>MAIN HALL</span></div>
            <div className="map-building map-building--two"><span>LIBRARY</span></div>
            <div className="map-building map-building--three"><span>CHAPEL</span></div>
            <div className="map-building map-building--four"><span>SPORTS CENTER</span></div>
            <div className="map-green map-green--one" />
            <div className="map-green map-green--two" />
            <div className="map-pin map-pin--one"><span>CRYSTAL</span></div>
            <div className="map-pin map-pin--two"><span>JASMINE</span></div>
            <div className="map-pin map-pin--three"><span>ANNEX</span></div>
            <div className="map-pin map-pin--four"><span>GUESTHOUSE</span></div>
            <div className="map-compass"><span>N</span><span>↑</span></div>
            <span className="map-label map-label--campus">UNIVERSITAS KLABAT</span>
            <span className="map-label map-label--road">JALAN ARNOLD MONONUT</span>
            <span className="map-scale"><i /> 200 M</span>
          </div>
        </section>

        <section className="contact-banner" id="kontak">
          <div>
            <p className="eyebrow">LANGKAH BERIKUTNYA</p>
            <h2>
              Siap menemukan
              <br />
              tempatmu?
            </h2>
          </div>
          <p className="contact-copy">
            Tanyakan informasi ketersediaan kamar dan proses tinggal di asrama
            kepada tim kami.
          </p>
          <a className="button button--light" href="mailto:dormitory@unklab.ac.id">
            Hubungi pengelola <ArrowIcon diagonal />
          </a>
          <span className="banner-decoration" aria-hidden="true">U.</span>
        </section>
      </main>

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
        <a className="back-to-top" href="#beranda" aria-label="Kembali ke atas">↑</a>
      </footer>
    </div>
  )
}

export default Home
