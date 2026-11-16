import { useEffect, useRef, useState } from 'react'
import './ChatAiBox.css'

const DORMITORY_CONTEXT = `
Kamu adalah asisten AI resmi untuk Universitas Klabat (UNKLAB) dan Asrama Universitas Klabat di Airmadidi, Sulawesi Utara.
Jawablah dalam Bahasa Indonesia yang ramah, ringkas, dan jelas.

ATURAN KETAT TOPIK:
- Kamu HANYA boleh menjawab pertanyaan yang bersangkutan dengan Universitas Klabat (UNKLAB), termasuk asrama UNKLAB, fasilitas kampus/asrama, lokasi kampus di Airmadidi, kehidupan mahasiswa UNKLAB, dan kontak resmi.
- Jika pengguna bertanya tentang topik di luar Universitas Klabat (misalnya pemrograman, matematika, resep, berita umum, politik, universitas lain, hiburan, dll.), TOLAK dengan sopan dan jelaskan bahwa kamu hanya dapat membantu pertanyaan seputar Universitas Klabat dan Asrama UNKLAB.
- Jangan mengarang informasi spesifik yang tidak kamu ketahui; sarankan untuk menghubungi pengelola asrama atau pihak kampus jika butuh konfirmasi resmi.

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

Kontak resmi contoh: dormitory@unklab.ac.id, Universitas Klabat, Airmadidi, Sulawesi Utara.
`

const INITIAL_MESSAGES = [
  {
    id: 'welcome',
    role: 'assistant',
    text: 'Halo! Saya asisten AI Asrama Universitas Klabat. Ada yang bisa saya bantu tentang pilihan asrama, kapasitas kamar, atau lokasi?',
  },
]

const QUICK_PROMPTS = [
  'Asrama putra apa saja?',
  'Asrama putri yang tersedia?',
  'Kapasitas kamar berapa orang?',
  'Lokasi & kontak asrama',
]

function buildLocalReply(userText) {
  const q = userText.toLowerCase()

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
      'Kapasitas kamar bervariasi antara 2 hingga 4 orang per kamar:\n' +
      '• 2 orang/kamar: Guesthouse, Jasmine 1, Edelweiss, Dormitory Unit 08\n' +
      '• 2–3 orang/kamar: Gen Z, Jasmine 2\n' +
      '• 2–4 orang/kamar: Crystal, Annex'
    )
  }

  if (q.includes('lokasi') || q.includes('alamat') || q.includes('kontak') || q.includes('email') || q.includes('hubungi')) {
    return (
      'Asrama berlokasi di lingkungan Universitas Klabat, Airmadidi, Sulawesi Utara.\n' +
      'Anda juga dapat membuka halaman Peta lokasi (?page=gempat) atau Kontak (?page=contact) untuk detail lebih lanjut.'
    )
  }

  if (q.includes('fasilitas')) {
    return 'Informasi fasilitas lengkap dapat dilihat di halaman Fasilitas (?page=features) atau tanyakan asrama spesifik yang ingin Anda ketahui.'
  }

  if (q.includes('unklab') || q.includes('universitas klabat') || q.includes('klabat')) {
    return (
      'Universitas Klabat (UNKLAB) adalah perguruan tinggi swasta yang berlokasi di Airmadidi, Minahasa Utara, Sulawesi Utara.\n' +
      'UNKLAB memiliki lingkungan kampus yang asri dan menyediakan beberapa pilihan asrama mahasiswa (putra & putri) di area kampus.'
    )
  }

  if (q.includes('halo') || q.includes('hai') || q.includes('hi')) {
    return 'Halo! Silakan tanya tentang asrama putra, asrama putri, kapasitas kamar, atau lokasi asrama UNKLAB.'
  }

  return (
    'Maaf, saya hanya dapat menjawab pertanyaan yang berkaitan dengan Universitas Klabat (UNKLAB) dan Asrama UNKLAB.\n\n' +
    'Silakan tanyakan seputar:\n' +
    '• Daftar asrama Putra & Putri UNKLAB\n' +
    '• Kapasitas kamar & area kampus\n' +
    '• Lokasi & informasi kontak Universitas Klabat'
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

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: DORMITORY_CONTEXT }],
        },
        contents,
      }),
    },
  )

  if (!res.ok) {
    throw new Error('Gagal menghubungi layanan AI')
  }

  const data = await res.json()
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null
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
        <section className="chat-ai-window" aria-label="Chat AI Asrama Universitas Klabat">
          <header className="chat-ai-header">
            <div className="chat-ai-title-wrap">
              <span className="chat-ai-avatar" aria-hidden="true">AI</span>
              <div>
                <h2 className="chat-ai-title">UNKLAB Dormitory AI</h2>
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
