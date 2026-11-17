import { useEffect, useRef, useState } from 'react'
import './ChatAiBox.css'

const UNKLAB_CONTEXT = `
Kamu adalah asisten AI resmi untuk Universitas Klabat (UNKLAB) di Airmadidi, Minahasa Utara, Sulawesi Utara.
Jawablah dalam Bahasa Indonesia yang ramah, ringkas, terstruktur, dan jelas.
Kamu mampu merangkum dan menjelaskan informasi umum tentang Universitas Klabat secara menyeluruh, termasuk profil kampus, sejarah, fakultas dan program studi, fasilitas umum kampus, kehidupan mahasiswa, pendaftaran, lokasi/kontak resmi, serta informasi asrama UNKLAB.

ATURAN KETAT TOPIK:
- Kamu HANYA boleh menjawab pertanyaan yang bersangkutan dengan Universitas Klabat (UNKLAB), termasuk informasi umum kampus, akademik/fakultas, fasilitas kampus, kehidupan mahasiswa, pendaftaran, kontak resmi, dan asrama UNKLAB.
- Jika pengguna bertanya tentang topik di luar Universitas Klabat (misalnya pemrograman umum, matematika, resep, berita umum, politik, universitas lain, hiburan, dll.), TOLAK dengan sopan dan jelaskan bahwa kamu hanya dapat membantu pertanyaan seputar Universitas Klabat (UNKLAB).
- Jangan mengarang informasi spesifik yang tidak pasti (seperti nominal biaya kuliah terbaru atau tanggal kalender akademik tahun berjalan); sarankan untuk mengecek situs resmi www.unklab.ac.id atau menghubungi pihak kampus/pengelola asrama untuk konfirmasi resmi.

INFORMASI UMUM UNIVERSITAS KLABAT (UNKLAB):
1. Profil & Sejarah Singkat:
   - Didirikan pada 7 Oktober 1965 dengan nama awal Perguruan Tinggi Klabat (PTK) oleh Gereja Masehi Advent Hari Ketujuh (GMAHK).
   - Resmi berubah status menjadi Universitas Klabat (UNKLAB) pada 10 Mei 1982 berdasarkan SK Mendikbud RI No. 0814/0/1982.
   - Dikenal sebagai Bilingual Campus dengan konsep green campus yang menerapkan nilai-nilai pendidikan Kristiani Advent.
2. Lokasi & Kontak Resmi:
   - Alamat: Jl. Arnold Mononutu, Airmadidi, Kabupaten Minahasa Utara, Sulawesi Utara 95371, Indonesia.
   - Telepon: +62 431 891035 | Faks: +62 431 891036
   - Email Kampus: info@unklab.ac.id | Email Asrama: dormitory@unklab.ac.id
   - Website Resmi: https://www.unklab.ac.id
3. Fakultas & Program Studi:
   - Fakultas Filsafat: Ilmu Filsafat / Teologi
   - Fakultas Keguruan dan Ilmu Pendidikan (FKIP): Pendidikan Bahasa Inggris, Pendidikan Ekonomi, Pendidikan Agama
   - Fakultas Ekonomi dan Bisnis (FEB / Unklab Business School): Manajemen, Akuntansi
   - Fakultas Pertanian (Faperta): Ilmu Pertanian / Agroteknologi
   - Fakultas Ilmu Komputer (FIK): Informatika, Sistem Informasi
   - Fakultas Keperawatan (FKep): Ilmu Keperawatan, Profesi Ners
   - Fakultas Teknik: Arsitektur dan bidang teknik
   - Fakultas Kedokteran: Pendidikan Dokter dan Profesi Dokter
   - Program Pascasarjana (S2): Magister Manajemen, Magister Teologi
   - Program Vokasi / Akademi: Akademi Sekretariatan dan jalur profesi terkait
4. Fasilitas Kampus (Selain Asrama):
   - Sarana Ibadah: Pioneer Chapel / Gereja Kampus
   - Akademik: Perpustakaan Pusat, Laboratorium Komputer & Sains, UPT Bahasa
   - Olahraga: Lapangan basket indoor, voli, tenis, jalur jogging
   - Kesehatan & Penunjang: Klinik Kampus, Cafetaria, Bakery, Unklab Store, Keamanan 24/7
5. Kehidupan Kampus & Pendaftaran:
   - Lingkungan kampus mendukung pembinaan karakter, kegiatan kerohanian/ibadah, dan pengawasan lingkungan (Village Dean).
   - Informasi pendaftaran mahasiswa baru (PMB), biaya kuliah, beasiswa, dan akreditasi terbaru tersedia di www.unklab.ac.id.

Daftar asrama UNKLAB yang tersedia di website:
- Putra:
  1. Crystal Dormitory (Area utama kampus, 2–4 orang/kamar, Favorit)
  2. Gen Z Dormitory (Area timur kampus, 2–3 orang/kamar, Pilihan baru)
  3. Annex Dormitory (Area barat kampus, 2–4 orang/kamar, Tersedia)
- Putri:
  1. Guesthouse Dormitory (Dekat pusat kegiatan, 2 orang/kamar, Terbatas)
  2. Jasmine 1 Dormitory (Area utama kampus, 2 orang/kamar, Tersedia)
  3. Jasmine 2 Dormitory (Area utama kampus, 2–3 orang/kamar, Tersedia)
  4. Edelweiss Dormitory (Dekat perpustakaan, 2 orang/kamar, Tersedia)
  5. Dormitory Unit 08 (Area selatan kampus, 2 orang/kamar, Tersedia)
`

const INITIAL_MESSAGES = [
  {
    id: 'welcome',
    role: 'assistant',
    text: 'Halo! Saya asisten AI Universitas Klabat (UNKLAB). Saya siap membantu merangkum informasi umum seputar UNKLAB (profil, fakultas/prodi, fasilitas kampus, kontak) maupun informasi asrama mahasiswa.',
  },
]

const QUICK_PROMPTS = [
  'Rangkuman profil UNKLAB',
  'Fakultas & program studi',
  'Fasilitas kampus & asrama',
  'Asrama putra & putri',
]

function hasWord(text, word) {
  return new RegExp(`\\b${word}\\b`, 'i').test(text)
}

function buildLocalReply(userText) {
  const q = userText.toLowerCase()

  if (
    q.includes('rektor') ||
    q.includes('pimpinan') ||
    q.includes('dekan') ||
    q.includes('ketua')
  ) {
    return (
      'Untuk informasi struktur pimpinan dan rektor Universitas Klabat (UNKLAB) yang menjabat saat ini, silakan cek langsung di situs resmi:\n' +
      '• Website: https://www.unklab.ac.id\n' +
      '• Email: info@unklab.ac.id\n' +
      '• Telepon: +62 431 891035'
    )
  }

  if (
    q.includes('fakultas') ||
    q.includes('prodi') ||
    q.includes('jurusan') ||
    q.includes('program studi') ||
    q.includes('kedokteran') ||
    q.includes('informatika') ||
    q.includes('keperawatan') ||
    q.includes('ekonomi') ||
    q.includes('filsafat') ||
    hasWord(q, 'fkip') ||
    hasWord(q, 'fik') ||
    hasWord(q, 'feb') ||
    q.includes('pascasarjana') ||
    hasWord(q, 's2')
  ) {
    return (
      'Universitas Klabat (UNKLAB) memiliki berbagai fakultas dan program studi:\n' +
      '• Fakultas Filsafat (Ilmu Filsafat / Teologi)\n' +
      '• FKIP (Pendidikan Bahasa Inggris, Ekonomi, Agama)\n' +
      '• Fakultas Ekonomi & Bisnis / FEB (Manajemen, Akuntansi)\n' +
      '• Fakultas Ilmu Komputer / FIK (Informatika, Sistem Informasi)\n' +
      '• Fakultas Keperawatan / FKep (Ilmu Keperawatan, Profesi Ners)\n' +
      '• Fakultas Pertanian, Fakultas Teknik (Arsitektur), & Fakultas Kedokteran\n' +
      '• Pascasarjana S2 (Magister Manajemen, Magister Teologi) & Vokasi\n\n' +
      'Detail kurikulum dan akreditasi dapat dilihat di www.unklab.ac.id.'
    )
  }

  if (q.includes('putra') && q.includes('putri')) {
    return (
      'Berikut daftar asrama di UNKLAB:\n' +
      'Asrama Putra:\n' +
      '• Crystal Dormitory (Area utama, 2–4 orang/kamar, Favorit)\n' +
      '• Gen Z Dormitory (Area timur, 2–3 orang/kamar, Pilihan baru)\n' +
      '• Annex Dormitory (Area barat, 2–4 orang/kamar)\n\n' +
      'Asrama Putri:\n' +
      '• Guesthouse Dormitory (Dekat pusat kegiatan, 2 orang/kamar, Terbatas)\n' +
      '• Jasmine 1 & Jasmine 2 (Area utama, 2–3 orang/kamar)\n' +
      '• Edelweiss Dormitory (Dekat perpustakaan, 2 orang/kamar)\n' +
      '• Dormitory Unit 08 (Area selatan, 2 orang/kamar)'
    )
  }

  if (q.includes('putra') || q.includes('cowok') || q.includes('laki')) {
    return (
      'Untuk asrama putra, tersedia 3 pilihan:\n' +
      '• Crystal Dormitory — Area utama kampus (2–4 orang/kamar, Favorit)\n' +
      '• Gen Z Dormitory — Area timur kampus (2–3 orang/kamar, Pilihan baru)\n' +
      '• Annex Dormitory — Area barat kampus (2–4 orang/kamar, Tersedia)'
    )
  }

  if (q.includes('putri') || q.includes('cewek') || q.includes('perempuan')) {
    return (
      'Untuk asrama putri, tersedia 5 pilihan:\n' +
      '• Guesthouse Dormitory — Dekat pusat kegiatan (2 orang/kamar, Terbatas)\n' +
      '• Jasmine 1 Dormitory — Area utama kampus (2 orang/kamar)\n' +
      '• Jasmine 2 Dormitory — Area utama kampus (2–3 orang/kamar)\n' +
      '• Edelweiss Dormitory — Dekat perpustakaan (2 orang/kamar)\n' +
      '• Dormitory Unit 08 — Area selatan kampus (2 orang/kamar)'
    )
  }

  if (q.includes('kapasitas') || q.includes('kamar') || q.includes('orang')) {
    return (
      'Kapasitas kamar asrama UNKLAB bervariasi antara 2 hingga 4 orang per kamar:\n' +
      '• 2 orang/kamar: Guesthouse, Jasmine 1, Edelweiss, Dormitory Unit 08\n' +
      '• 2–3 orang/kamar: Gen Z, Jasmine 2\n' +
      '• 2–4 orang/kamar: Crystal, Annex'
    )
  }

  if (
    q.includes('fasilitas') ||
    q.includes('perpustakaan') ||
    q.includes('gereja') ||
    q.includes('chapel') ||
    q.includes('klinik') ||
    q.includes('olahraga') ||
    q.includes('kantin') ||
    q.includes('cafetaria') ||
    q.includes('laboratorium') ||
    hasWord(q, 'lab')
  ) {
    return (
      'Fasilitas umum di kampus UNKLAB meliputi:\n' +
      '• Sarana Ibadah: Pioneer Chapel / Gereja Kampus\n' +
      '• Akademik: Perpustakaan Pusat, Lab Komputer & Sains, UPT Bahasa\n' +
      '• Olahraga: Lapangan basket indoor, voli, tenis, jalur jogging\n' +
      '• Penunjang: Klinik Kampus, Cafetaria, Bakery, Unklab Store, Keamanan 24/7\n' +
      '• Hunian: Asrama Putra & Putri (lihat detail di halaman Fasilitas ?page=features).'
    )
  }

  if (
    q.includes('daftar') ||
    q.includes('pmb') ||
    q.includes('pendaftaran') ||
    q.includes('mahasiswa baru') ||
    q.includes('biaya') ||
    q.includes('spp') ||
    q.includes('beasiswa') ||
    q.includes('akreditasi') ||
    q.includes('website')
  ) {
    return (
      'Untuk informasi pendaftaran mahasiswa baru (PMB), biaya kuliah, beasiswa, dan akreditasi terbaru di UNKLAB:\n' +
      '• Website Resmi: https://www.unklab.ac.id\n' +
      '• Email Resmi: info@unklab.ac.id\n' +
      '• Telepon Kampus: +62 431 891035\n\n' +
      'Silakan kunjungi portal resmi tersebut untuk jadwal dan persyaratan terkini.'
    )
  }

  if (
    q.includes('kehidupan') ||
    q.includes('aturan') ||
    q.includes('peraturan') ||
    q.includes('ibadah') ||
    q.includes('vesper') ||
    q.includes('sabat') ||
    q.includes('karakter') ||
    q.includes('advent')
  ) {
    return (
      'Kehidupan kampus di UNKLAB berlandaskan nilai-nilai Kristiani Gereja Masehi Advent Hari Ketujuh (GMAHK) dengan konsep Bilingual & Green Campus:\n' +
      '• Pembinaan karakter, kedisiplinan, dan kegiatan ibadah rutin (seperti Chapel & Vesper)\n' +
      '• Pengawasan lingkungan kampus dan asrama oleh pembina (Village Dean)\n' +
      '• Berbagai kegiatan kemahasiswaan, akademik, dan olahraga di dalam area kampus.'
    )
  }

  if (
    q.includes('lokasi') ||
    q.includes('alamat') ||
    q.includes('kontak') ||
    q.includes('email') ||
    q.includes('hubungi') ||
    q.includes('telepon') ||
    q.includes('dimana') ||
    q.includes('di mana') ||
    q.includes('airmadidi')
  ) {
    return (
      'Lokasi & Kontak Resmi Universitas Klabat (UNKLAB):\n' +
      '• Alamat: Jl. Arnold Mononutu, Airmadidi, Kab. Minahasa Utara, Sulawesi Utara 95371\n' +
      '• Telepon: +62 431 891035 | Email: info@unklab.ac.id\n' +
      '• Kontak Asrama: dormitory@unklab.ac.id\n' +
      '• Website: https://www.unklab.ac.id\n\n' +
      'Anda juga dapat membuka halaman Peta Lokasi (?page=gempat) atau Kontak (?page=contact).'
    )
  }

  if (
    q.includes('rangkum') ||
    q.includes('ringkas') ||
    q.includes('profil') ||
    q.includes('sejarah') ||
    q.includes('berdiri') ||
    q.includes('tentang') ||
    q.includes('unklab') ||
    q.includes('universitas klabat') ||
    q.includes('klabat')
  ) {
    return (
      'Rangkuman Universitas Klabat (UNKLAB):\n' +
      '• Sejarah: Didirikan 7 Oktober 1965 sebagai Perguruan Tinggi Klabat (PTK) oleh GMAHK, dan resmi menjadi Universitas Klabat pada 10 Mei 1982.\n' +
      '• Lokasi: Jl. Arnold Mononutu, Airmadidi, Minahasa Utara, Sulawesi Utara.\n' +
      '• Konsep Kampus: Bilingual Campus & Green Campus berbasis nilai Kristiani.\n' +
      '• Akademik: Memiliki 8 fakultas (Filsafat, FKIP, FEB, Faperta, FIK, FKep, Teknik, Kedokteran), Pascasarjana (S2), dan Vokasi.\n' +
      '• Fasilitas & Hunian: Dilengkapi Pioneer Chapel, perpustakaan, laboratorium, klinik, sarana olahraga, kantin, serta 8 pilihan asrama Putra & Putri.\n' +
      '• Info Resmi: https://www.unklab.ac.id | info@unklab.ac.id'
    )
  }

  if (
    hasWord(q, 'halo') ||
    hasWord(q, 'hai') ||
    hasWord(q, 'hi') ||
    q.includes('selamat')
  ) {
    return 'Halo! Silakan tanya informasi umum seputar Universitas Klabat (profil, fakultas/prodi, fasilitas kampus, pendaftaran, lokasi/kontak) atau tentang asrama UNKLAB.'
  }

  return (
    'Maaf, saya hanya dapat menjawab pertanyaan yang berkaitan dengan Universitas Klabat (UNKLAB).\n\n' +
    'Silakan tanyakan seputar:\n' +
    '• Rangkuman profil & sejarah UNKLAB\n' +
    '• Fakultas & program studi yang tersedia\n' +
    '• Fasilitas kampus, kehidupan mahasiswa, & pendaftaran\n' +
    '• Daftar asrama Putra & Putri beserta kapasitasnya\n' +
    '• Lokasi & kontak resmi UNKLAB'
  )
}

async function fetchGeminiReply(history, userText) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) {
    return null
  }

  const conversationTurns = history
    .filter((msg) => msg.id !== 'welcome')
    .map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.text }],
    }))

  const contents = [
    ...conversationTurns,
    {
      role: 'user',
      parts: [{ text: userText }],
    },
  ]

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`
  const payload = JSON.stringify({
    systemInstruction: {
      parts: [{ text: UNKLAB_CONTEXT }],
    },
    contents,
  })

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    })

    if (res.ok) {
      const data = await res.json()
      return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null
    }

    if ((res.status === 503 || res.status === 429) && attempt === 0) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      continue
    }

    throw new Error('Gagal menghubungi layanan AI')
  }

  return null
}

function ChatAiBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const nextIdRef = useRef(1)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping, isOpen])

  async function sendMessage(rawText) {
    const text = rawText.trim()
    if (!text || isTyping) return

    const userMsg = { id: `u-${nextIdRef.current++}`, role: 'user', text }
    const nextHistory = [...messages, userMsg]
    setMessages(nextHistory)
    setInput('')
    setIsTyping(true)

    try {
      const apiReply = await fetchGeminiReply(messages, text)
      const replyText = apiReply || buildLocalReply(text)

      if (!apiReply) {
        await new Promise((resolve) => setTimeout(resolve, 400))
      }

      setMessages((prev) => [
        ...prev,
        { id: `a-${nextIdRef.current++}`, role: 'assistant', text: replyText },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${nextIdRef.current++}`,
          role: 'assistant',
          text: buildLocalReply(text),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    sendMessage(input)
  }

  function handleReset() {
    setMessages(INITIAL_MESSAGES)
    setInput('')
  }

  return (
    <div className="chat-ai-root">
      {isOpen ? (
        <section className="chat-ai-window" aria-label="Chat AI Universitas Klabat">
          <header className="chat-ai-header">
            <div className="chat-ai-title-wrap">
              <span className="chat-ai-avatar" aria-hidden="true">AI</span>
              <div>
                <h2 className="chat-ai-title">UNKLAB AI Assistant</h2>
                <p className="chat-ai-subtitle">
                  <span className="chat-ai-status-dot" aria-hidden="true" />
                  Siap membantu
                </p>
              </div>
            </div>

            <div className="chat-ai-header-actions">
              <button
                type="button"
                className="chat-ai-icon-btn"
                onClick={handleReset}
                title="Reset percakapan"
                aria-label="Reset percakapan"
              >
                ↻
              </button>
              <button
                type="button"
                className="chat-ai-icon-btn"
                onClick={() => setIsOpen(false)}
                title="Tutup chat"
                aria-label="Tutup chat"
              >
                ✕
              </button>
            </div>
          </header>

          <div className="chat-ai-messages" role="log" aria-live="polite">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-ai-msg chat-ai-msg--${msg.role}`}
              >
                {msg.text}
              </div>
            ))}

            {isTyping && (
              <div className="chat-ai-typing" aria-label="AI sedang mengetik">
                <span />
                <span />
                <span />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 2 && !isTyping && (
            <div className="chat-ai-suggestions">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="chat-ai-chip"
                  onClick={() => sendMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <form className="chat-ai-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="chat-ai-input"
              placeholder="Tanya tentang UNKLAB atau asrama..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              aria-label="Ketik pesan untuk AI"
            />
            <button
              type="submit"
              className="chat-ai-send"
              disabled={!input.trim() || isTyping}
            >
              Kirim
            </button>
          </form>
        </section>
      ) : (
        <button
          type="button"
          className="chat-ai-fab"
          onClick={() => setIsOpen(true)}
          aria-label="Buka Chat AI"
        >
          <span className="chat-ai-fab-dot" aria-hidden="true" />
          Tanya AI
        </button>
      )}
    </div>
  )
}

export default ChatAiBox
