function CampusMap() {
  return (
    <section className="inner-page campus-page">
      <div className="inner-page-hero">
        <p className="eyebrow section-eyebrow">PETA KAMPUS</p>
        <h1>
          Temukan jalanmu<span className="orange-period">.</span>
        </h1>
        <p className="inner-page-lead">
          Gambaran ilustratif lokasi asrama dan beberapa area kampus Universitas
          Klabat. Penanda ini bukan peta navigasi resmi.
        </p>
      </div>

      <div className="campus-map campus-map--page" role="img" aria-label="Ilustrasi peta asrama dan fasilitas kampus">
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

      <div className="map-disclaimer">
        <span>CATATAN</span>
        <p>
          Posisi gedung pada ilustrasi ini hanya untuk kebutuhan tampilan.
          Gunakan peta resmi kampus untuk petunjuk arah dan lokasi yang akurat.
        </p>
      </div>
    </section>
  )
}

export default CampusMap
