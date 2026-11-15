function Contact() {
  return (
    <section className="inner-page contact-page">
      <div className="inner-page-hero">
        <p className="eyebrow section-eyebrow">HUBUNGI KAMI</p>
        <h1>
          Ada yang ingin
          <br />
          ditanyakan<span className="orange-period">?</span>
        </h1>
        <p className="inner-page-lead">
          Tim pengelola asrama dapat membantu menjawab pertanyaan tentang
          pilihan hunian dan proses tinggal.
        </p>
      </div>

      <div className="contact-page-grid">
        <div className="contact-details">
          <p className="eyebrow section-eyebrow">INFORMASI KONTAK</p>
          <h2>Mulai percakapan.</h2>
          <p>
            Silakan hubungi pengelola asrama melalui informasi kontak resmi
            Universitas Klabat.
          </p>
          <div className="contact-detail-row">
            <span>LOKASI</span>
            <p>Universitas Klabat<br />Airmadidi, Sulawesi Utara</p>
          </div>
          <div className="contact-detail-row">
            <span>EMAIL</span>
            <a href="mailto:dormitory@unklab.ac.id">dormitory@unklab.ac.id</a>
          </div>
          <p className="contact-disclaimer">
            Alamat email di atas masih contoh dan perlu dikonfirmasi sebelum digunakan.
          </p>
        </div>

        <div className="contact-prompt">
          <span className="contact-prompt-mark">?</span>
          <p className="eyebrow">BELUM TAHU HARUS MULAI DARI MANA?</p>
          <h2>Lihat dulu pilihan asramanya.</h2>
          <p>
            Jelajahi direktori untuk mengenali nama dan gambaran setiap pilihan
            hunian.
          </p>
          <a className="button button--dark" href="?page=home#asrama">
            Lihat direktori <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Contact
