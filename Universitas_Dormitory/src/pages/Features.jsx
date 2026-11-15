const features = [
  {
    number: '01',
    title: 'Direktori asrama',
    description:
      'Lihat pilihan asrama dalam satu tempat dan kenali informasi singkat setiap hunian.',
    label: 'JELAJAHI PILIHAN',
  },
  {
    number: '02',
    title: 'Pencarian praktis',
    description:
      'Cari nama asrama atau gunakan filter untuk menemukan pilihan yang sesuai.',
    label: 'TEMUKAN LEBIH CEPAT',
  },
  {
    number: '03',
    title: 'Peta lokasi',
    description:
      'Lihat gambaran lokasi asrama dan fasilitas kampus melalui peta ilustratif.',
    label: 'KENALI LINGKUNGAN',
  },
]

function Features() {
  return (
    <section className="inner-page features-page">
      <div className="inner-page-hero">
        <p className="eyebrow section-eyebrow">YANG BISA KAMU TEMUKAN</p>
        <h1>
          Semua informasi,
          <br />
          satu tempat<span className="orange-period">.</span>
        </h1>
        <p className="inner-page-lead">
          Kenali pilihan hunian dan lingkungan kampus dengan lebih mudah sebelum
          menentukan langkah berikutnya.
        </p>
      </div>

      <div className="feature-page-grid">
        {features.map((feature) => (
          <article className="feature-page-card" key={feature.number}>
            <span className="feature-page-number">{feature.number}</span>
            <div className="feature-page-icon" aria-hidden="true">
              {feature.number === '01' ? '⌂' : feature.number === '02' ? '⌕' : '↗'}
            </div>
            <p className="eyebrow section-eyebrow">{feature.label}</p>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>

      <div className="feature-page-cta">
        <div>
          <p className="eyebrow">MULAI DARI SINI</p>
          <h2>Temukan asrama yang cocok untukmu.</h2>
        </div>
        <a className="button button--primary" href="?page=home#asrama">
          Buka direktori <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  )
}

export default Features
