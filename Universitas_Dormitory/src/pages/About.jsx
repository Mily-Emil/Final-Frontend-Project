function About() {
  return (
    <section className="inner-page">
      <div className="inner-page-hero">
        <p className="eyebrow section-eyebrow">TENTANG ASRAMA</p>
        <h1>
          Bukan sekadar
          <br />
          tempat tinggal<span className="orange-period">.</span>
        </h1>
        <p className="inner-page-lead">
          Asrama adalah ruang untuk membangun kebiasaan baik, belajar hidup
          bersama, dan menemukan teman seperjalanan selama masa kuliah.
        </p>
      </div>

      <div className="about-image">
        <img
          src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1600&q=85"
          alt="Kamar bersama yang terang dan tertata"
          loading="lazy"
        />
        <span>RUANG BERSAMA, CERITA BERSAMA.</span>
      </div>

      <div className="about-values">
        <div>
          <p className="eyebrow section-eyebrow">NILAI KEHIDUPAN</p>
          <h2>Tumbuh dalam<br />kebersamaan.</h2>
        </div>
        <div className="value-list">
          <article>
            <span>01</span>
            <div>
              <h3>Komunitas</h3>
              <p>Belajar saling mengenal, menghargai perbedaan, dan mendukung satu sama lain.</p>
            </div>
          </article>
          <article>
            <span>02</span>
            <div>
              <h3>Kemandirian</h3>
              <p>Membangun tanggung jawab dan kebiasaan positif dalam kehidupan sehari-hari.</p>
            </div>
          </article>
          <article>
            <span>03</span>
            <div>
              <h3>Pengalaman</h3>
              <p>Menjadikan kehidupan kampus bagian dari perjalanan untuk berkembang.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default About
