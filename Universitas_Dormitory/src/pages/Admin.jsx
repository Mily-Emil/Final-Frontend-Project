import { useState } from 'react'
import { getDormitory, getRoom } from '../data/bookingData.js'
import {
  STATUS_LABELS,
  getAllDormUsage,
  resetBookings,
  updateBookingStatus,
  useBookings,
} from '../utils/bookingStore.js'
import './Booking.css'

// PIN demo saja. Untuk produksi, autentikasi kepala asrama wajib dilakukan di backend.
const DEMO_PIN = 'kepala123'
const SESSION_KEY = 'unklab-dorm-admin'

const TABS = [
  { id: 'pending', label: 'Menunggu' },
  { id: 'approved', label: 'Disetujui' },
  { id: 'rejected', label: 'Ditolak' },
  { id: 'all', label: 'Semua' },
]

function Login({ onLogin }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  return (
    <section className="inner-page bk-page">
      <div className="bk-card bk-login">
        <p className="eyebrow section-eyebrow">KEPALA ASRAMA</p>
        <h2>Masuk dashboard approval</h2>
        <form
          className="bk-inline-form"
          onSubmit={(event) => {
            event.preventDefault()
            if (pin === DEMO_PIN) {
              window.sessionStorage.setItem(SESSION_KEY, '1')
              onLogin()
            } else {
              setError('PIN salah.')
            }
          }}
        >
          <input
            type="password"
            value={pin}
            onChange={(event) => {
              setPin(event.target.value)
              setError('')
            }}
            placeholder="PIN kepala asrama"
            aria-label="PIN kepala asrama"
          />
          <button type="submit" className="bk-btn bk-btn--dark">Masuk</button>
        </form>
        {error && <span className="bk-error">{error}</span>}
        <p className="bk-muted bk-small">PIN demo: <code>{DEMO_PIN}</code></p>
      </div>
    </section>
  )
}

function CapacityBoard({ bookings }) {
  return (
    <section className="bk-card">
      <p className="eyebrow section-eyebrow">STATUS KAPASITAS</p>
      <h2>Kapasitas asrama saat ini</h2>
      <div className="bk-capacity-grid">
        {getAllDormUsage(bookings).map(({ dorm, usage }) => {
          const occupiedPct = (usage.occupied / usage.capacity) * 100
          const pendingPct = (usage.pending / usage.capacity) * 100
          return (
            <div key={dorm.id} className="bk-capacity">
              <div className="bk-capacity-head">
                <strong>{dorm.name}</strong>
                <span className={`bk-tag bk-tag--${dorm.gender}`}>
                  {dorm.gender === 'putra' ? 'Putra' : 'Putri'}
                </span>
              </div>
              <div className="bk-bar" role="img" aria-label={`${usage.occupied} dari ${usage.capacity} terisi`}>
                <span className="bk-bar-fill" style={{ width: `${occupiedPct}%` }} />
                <span className="bk-bar-pending" style={{ width: `${pendingPct}%` }} />
              </div>
              <div className="bk-capacity-stats">
                <span><b>{usage.occupied}</b>/{usage.capacity} terisi</span>
                <span><b>{usage.pending}</b> menunggu</span>
                <span><b>{usage.available}</b> tersedia</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function BookingRow({ booking }) {
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const dorm = getDormitory(booking.dormId)
  const room = getRoom(booking.dormId, booking.roomId)

  function decide(status) {
    if (status === 'rejected' && !note.trim()) {
      setError('Isi alasan penolakan terlebih dahulu.')
      return
    }
    const res = updateBookingStatus(booking.id, status, note)
    setError(res.ok ? '' : res.error)
  }

  return (
    <article className="bk-request">
      <header className="bk-request-head">
        <div>
          <strong>{booking.name}</strong>
          <p className="bk-muted">
            {booking.id} · {new Date(booking.createdAt).toLocaleString('id-ID')}
          </p>
        </div>
        <span className={`bk-badge bk-badge--${booking.status}`}>{STATUS_LABELS[booking.status]}</span>
      </header>

      <dl className="bk-request-grid">
        <div><dt>NIM</dt><dd>{booking.nim}</dd></div>
        <div><dt>No. REG</dt><dd>{booking.regNumber}</dd></div>
        <div><dt>Semester</dt><dd>{booking.semester}</dd></div>
        <div><dt>Fakultas</dt><dd>{booking.facultyName}</dd></div>
        <div><dt>Jurusan</dt><dd>{booking.major}</dd></div>
        <div><dt>No. HP mahasiswa</dt><dd>{booking.studentPhone}</dd></div>
        <div><dt>No. HP wali</dt><dd>{booking.guardianPhone}</dd></div>
        <div><dt>Asrama / kamar</dt><dd>{dorm?.name} · {room?.number} ({room?.capacity} org)</dd></div>
      </dl>

      {booking.status === 'pending' ? (
        <div className="bk-request-actions">
          <input
            value={note}
            onChange={(event) => {
              setNote(event.target.value)
              setError('')
            }}
            placeholder="Catatan (wajib bila ditolak)"
            aria-label="Catatan keputusan"
          />
          <button type="button" className="bk-btn bk-btn--ghost" onClick={() => decide('rejected')}>Tolak</button>
          <button type="button" className="bk-btn bk-btn--primary" onClick={() => decide('approved')}>Setujui</button>
        </div>
      ) : (
        <p className="bk-muted bk-small">
          Diputuskan {booking.decidedAt && new Date(booking.decidedAt).toLocaleString('id-ID')}
          {booking.note && ` · Catatan: ${booking.note}`}
        </p>
      )}
      {error && <span className="bk-error">{error}</span>}
    </article>
  )
}

function Admin() {
  const bookings = useBookings()
  const [loggedIn, setLoggedIn] = useState(() => window.sessionStorage.getItem(SESSION_KEY) === '1')
  const [tab, setTab] = useState('pending')
  const [dormFilter, setDormFilter] = useState('all')

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />

  const filtered = bookings.filter(
    (booking) =>
      (tab === 'all' || booking.status === tab) &&
      (dormFilter === 'all' || booking.dormId === dormFilter),
  )
  const countByStatus = (status) => bookings.filter((booking) => booking.status === status).length

  return (
    <section className="inner-page bk-page">
      <div className="inner-page-hero bk-admin-hero">
        <div>
          <p className="eyebrow section-eyebrow">DASHBOARD KEPALA ASRAMA</p>
          <h1>
            Approval booking<span className="orange-period">.</span>
          </h1>
        </div>
        <div className="bk-admin-tools">
          <button
            type="button"
            className="bk-btn bk-btn--ghost"
            onClick={() => {
              if (window.confirm('Hapus semua data booking (demo)?')) resetBookings()
            }}
          >
            Reset data demo
          </button>
          <button
            type="button"
            className="bk-btn bk-btn--dark"
            onClick={() => {
              window.sessionStorage.removeItem(SESSION_KEY)
              setLoggedIn(false)
            }}
          >
            Keluar
          </button>
        </div>
      </div>

      <CapacityBoard bookings={bookings} />

      <section className="bk-card">
        <div className="bk-toolbar">
          <div className="bk-chips" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={`bk-chip${tab === t.id ? ' is-active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
                {t.id !== 'all' && <span className="bk-chip-count">{countByStatus(t.id)}</span>}
              </button>
            ))}
          </div>
          <select value={dormFilter} onChange={(event) => setDormFilter(event.target.value)} aria-label="Filter asrama">
            <option value="all">Semua asrama</option>
            {getAllDormUsage([]).map(({ dorm }) => (
              <option key={dorm.id} value={dorm.id}>{dorm.name}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="bk-muted bk-empty">Tidak ada booking pada filter ini.</p>
        ) : (
          <div className="bk-request-list">
            {filtered.map((booking) => (
              <BookingRow key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </section>
    </section>
  )
}

export default Admin
