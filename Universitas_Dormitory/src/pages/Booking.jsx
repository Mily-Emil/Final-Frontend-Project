import { useMemo, useState } from 'react'
import { DORMITORIES, FACULTIES, GENDERS, getDormitory, getFaculty, getRoom } from '../data/bookingData.js'
import {
  STATUS_LABELS,
  createBooking,
  getDormUsage,
  getRoomUsage,
  useBookings,
} from '../utils/bookingStore.js'
import './Booking.css'

const EMPTY_FORM = {
  name: '',
  nim: '',
  regNumber: '',
  semester: '',
  facultyId: '',
  major: '',
  guardianPhone: '',
  studentPhone: '',
  gender: '',
  dormId: '',
  capacity: 'all',
  roomId: '',
}

const PHONE_PATTERN = /^(\+62|62|0)8\d{7,12}$/

function validate(form) {
  const errors = {}
  if (form.name.trim().length < 3) errors.name = 'Nama minimal 3 karakter.'
  if (!/^\d{6,15}$/.test(form.nim.trim())) errors.nim = 'NIM harus berupa 6–15 digit angka.'
  if (form.regNumber.trim().length < 3) errors.regNumber = 'No. REG wajib diisi.'
  if (!form.semester) errors.semester = 'Pilih semester.'
  if (!form.facultyId) errors.facultyId = 'Pilih fakultas.'
  if (!form.major) errors.major = 'Pilih jurusan.'
  if (!PHONE_PATTERN.test(form.guardianPhone.replace(/[\s-]/g, '')))
    errors.guardianPhone = 'Format nomor tidak valid (contoh: 081234567890).'
  if (!PHONE_PATTERN.test(form.studentPhone.replace(/[\s-]/g, '')))
    errors.studentPhone = 'Format nomor tidak valid (contoh: 081234567890).'
  if (!form.gender) errors.gender = 'Pilih jenis kelamin.'
  if (!form.dormId) errors.dormId = 'Pilih asrama.'
  if (!form.roomId) errors.roomId = 'Pilih kamar.'
  return errors
}

function Field({ label, error, children, htmlFor }) {
  return (
    <div className={`bk-field${error ? ' bk-field--error' : ''}`}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error && <span className="bk-error">{error}</span>}
    </div>
  )
}

function StatusChecker({ bookings }) {
  const [nim, setNim] = useState('')
  const [submitted, setSubmitted] = useState('')
  const results = submitted ? bookings.filter((booking) => booking.nim === submitted) : []

  return (
    <section className="bk-card bk-status-check">
      <p className="eyebrow section-eyebrow">CEK STATUS</p>
      <h2>Sudah pernah booking?</h2>
      <form
        className="bk-inline-form"
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(nim.trim())
        }}
      >
        <input
          value={nim}
          onChange={(event) => setNim(event.target.value)}
          placeholder="Masukkan NIM"
          inputMode="numeric"
          aria-label="NIM untuk cek status"
        />
        <button type="submit" className="bk-btn bk-btn--dark">Cek</button>
      </form>

      {submitted && results.length === 0 && (
        <p className="bk-muted">Belum ada booking untuk NIM {submitted}.</p>
      )}

      {results.map((booking) => {
        const dorm = getDormitory(booking.dormId)
        const room = getRoom(booking.dormId, booking.roomId)
        return (
          <div key={booking.id} className="bk-status-item">
            <div>
              <strong>{dorm?.name}</strong> · Kamar {room?.number} ({room?.capacity} orang)
              <p className="bk-muted">
                {booking.id} · {new Date(booking.createdAt).toLocaleString('id-ID')}
              </p>
              {booking.note && <p className="bk-note">Catatan kepala asrama: {booking.note}</p>}
            </div>
            <span className={`bk-badge bk-badge--${booking.status}`}>
              {STATUS_LABELS[booking.status]}
            </span>
          </div>
        )
      })}
    </section>
  )
}

function Booking() {
  const bookings = useBookings()
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)

  const faculty = getFaculty(form.facultyId)
  const dormOptions = DORMITORIES.filter((dorm) => dorm.gender === form.gender)
  const selectedDorm = getDormitory(form.dormId)

  const rooms = useMemo(() => {
    if (!selectedDorm) return []
    return selectedDorm.rooms
      .filter((room) => form.capacity === 'all' || room.capacity === Number(form.capacity))
      .map((room) => ({ room, usage: getRoomUsage(room, bookings) }))
  }, [selectedDorm, form.capacity, bookings])

  const capacityOptions = selectedDorm
    ? [...new Set(selectedDorm.rooms.map((room) => room.capacity))].sort((a, b) => a - b)
    : []

  function update(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      // Reset pilihan turunan saat pilihan induk berubah.
      if (field === 'facultyId') {
        const majors = getFaculty(value)?.majors ?? []
        next.major = majors.length === 1 ? majors[0] : ''
      }
      if (field === 'gender') {
        next.dormId = ''
        next.capacity = 'all'
        next.roomId = ''
      }
      if (field === 'dormId') {
        next.capacity = 'all'
        next.roomId = ''
      }
      if (field === 'capacity') next.roomId = ''
      return next
    })
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setResult({ ok: false, error: 'Periksa kembali data yang belum lengkap.' })
      return
    }

    const res = createBooking({
      name: form.name.trim(),
      nim: form.nim,
      regNumber: form.regNumber.trim(),
      semester: Number(form.semester),
      facultyId: form.facultyId,
      facultyName: faculty.name,
      major: form.major,
      guardianPhone: form.guardianPhone.trim(),
      studentPhone: form.studentPhone.trim(),
      gender: form.gender,
      dormId: form.dormId,
      roomId: form.roomId,
    })
    setResult(res)
    if (res.ok) {
      setForm(EMPTY_FORM)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <section className="inner-page bk-page">
      <div className="inner-page-hero">
        <p className="eyebrow section-eyebrow">BOOKING ASRAMA</p>
        <h1>
          Pesan kamar
          <br />
          asramamu<span className="orange-period">.</span>
        </h1>
        <p className="inner-page-lead">
          Isi data diri, pilih asrama sesuai jenis kelamin, lalu pilih kamar yang masih tersedia.
          Booking akan diproses setelah disetujui kepala asrama.
        </p>
      </div>

      {result?.ok && (
        <div className="bk-alert bk-alert--success" role="status">
          <strong>Booking berhasil dikirim!</strong> Kode booking: <code>{result.booking.id}</code>.
          Status saat ini <em>menunggu persetujuan kepala asrama</em>. Cek status dengan NIM Anda di bawah.
        </div>
      )}
      {result && !result.ok && (
        <div className="bk-alert bk-alert--error" role="alert">{result.error}</div>
      )}

      <form className="bk-layout" onSubmit={handleSubmit} noValidate>
        <div className="bk-main">
          {/* STEP 1 */}
          <section className="bk-card">
            <div className="bk-step-head">
              <span className="bk-step">1</span>
              <h2>Data mahasiswa</h2>
            </div>
            <div className="bk-grid">
              <Field label="Nama lengkap" error={errors.name} htmlFor="bk-name">
                <input id="bk-name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Nama sesuai KTM" />
              </Field>
              <Field label="NIM" error={errors.nim} htmlFor="bk-nim">
                <input id="bk-nim" value={form.nim} inputMode="numeric" onChange={(e) => update('nim', e.target.value)} placeholder="Contoh: 105022310001" />
              </Field>
              <Field label="No. REG" error={errors.regNumber} htmlFor="bk-reg">
                <input id="bk-reg" value={form.regNumber} onChange={(e) => update('regNumber', e.target.value)} placeholder="Contoh: S22310001" />
              </Field>
              <Field label="Semester" error={errors.semester} htmlFor="bk-semester">
                <select id="bk-semester" value={form.semester} onChange={(e) => update('semester', e.target.value)}>
                  <option value="">Pilih semester</option>
                  {Array.from({ length: 14 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>Semester {n}</option>
                  ))}
                </select>
              </Field>
              <Field label="Fakultas" error={errors.facultyId} htmlFor="bk-faculty">
                <select id="bk-faculty" value={form.facultyId} onChange={(e) => update('facultyId', e.target.value)}>
                  <option value="">Pilih fakultas</option>
                  {FACULTIES.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Jurusan" error={errors.major} htmlFor="bk-major">
                <select id="bk-major" value={form.major} onChange={(e) => update('major', e.target.value)} disabled={!faculty}>
                  <option value="">{faculty ? 'Pilih jurusan' : 'Pilih fakultas terlebih dahulu'}</option>
                  {faculty?.majors.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </Field>
              <Field label="No. HP wali" error={errors.guardianPhone} htmlFor="bk-guardian">
                <input id="bk-guardian" type="tel" value={form.guardianPhone} onChange={(e) => update('guardianPhone', e.target.value)} placeholder="08xxxxxxxxxx" />
              </Field>
              <Field label="No. HP mahasiswa" error={errors.studentPhone} htmlFor="bk-phone">
                <input id="bk-phone" type="tel" value={form.studentPhone} onChange={(e) => update('studentPhone', e.target.value)} placeholder="08xxxxxxxxxx" />
              </Field>
            </div>
          </section>

          {/* STEP 2 */}
          <section className="bk-card">
            <div className="bk-step-head">
              <span className="bk-step">2</span>
              <h2>Jenis kelamin &amp; asrama</h2>
            </div>
            <div className="bk-segment" role="radiogroup" aria-label="Jenis kelamin">
              {GENDERS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  role="radio"
                  aria-checked={form.gender === g.id}
                  className={`bk-segment-btn${form.gender === g.id ? ' is-active' : ''}`}
                  onClick={() => update('gender', g.id)}
                >
                  {g.label}
                  <small>{g.dormLabel}</small>
                </button>
              ))}
            </div>
            {errors.gender && <span className="bk-error">{errors.gender}</span>}

            {form.gender && (
              <div className="bk-dorm-grid">
                {dormOptions.map((dorm) => {
                  const usage = getDormUsage(dorm, bookings)
                  const full = usage.available === 0
                  return (
                    <button
                      key={dorm.id}
                      type="button"
                      disabled={full}
                      className={`bk-dorm${form.dormId === dorm.id ? ' is-active' : ''}`}
                      onClick={() => update('dormId', dorm.id)}
                    >
                      <strong>{dorm.name}</strong>
                      <span className="bk-muted">{dorm.location}</span>
                      <span className={`bk-dorm-slots${full ? ' is-full' : ''}`}>
                        {full ? 'Penuh' : `${usage.available} tempat tersedia`}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
            {errors.dormId && <span className="bk-error">{errors.dormId}</span>}
          </section>

          {/* STEP 3 */}
          {selectedDorm && (
            <section className="bk-card">
              <div className="bk-step-head">
                <span className="bk-step">3</span>
                <h2>Pilih kamar · {selectedDorm.name}</h2>
              </div>

              <div className="bk-chips" role="radiogroup" aria-label="Kapasitas kamar">
                {['all', ...capacityOptions].map((cap) => (
                  <button
                    key={cap}
                    type="button"
                    role="radio"
                    aria-checked={String(form.capacity) === String(cap)}
                    className={`bk-chip${String(form.capacity) === String(cap) ? ' is-active' : ''}`}
                    onClick={() => update('capacity', String(cap))}
                  >
                    {cap === 'all' ? 'Semua kamar' : `${cap} orang / kamar`}
                  </button>
                ))}
              </div>

              <div className="bk-room-grid">
                {rooms.map(({ room, usage }) => {
                  const full = usage.available === 0
                  const selected = form.roomId === room.id
                  return (
                    <button
                      key={room.id}
                      type="button"
                      disabled={full}
                      className={`bk-room${selected ? ' is-active' : ''}${full ? ' is-full' : ''}`}
                      onClick={() => update('roomId', room.id)}
                      aria-pressed={selected}
                    >
                      <span className="bk-room-number">Kamar {room.number}</span>
                      <span className="bk-room-beds" aria-hidden="true">
                        {Array.from({ length: room.capacity }, (_, i) => {
                          let state = 'free'
                          if (i < usage.occupied) state = 'taken'
                          else if (i < usage.occupied + usage.pending) state = 'pending'
                          return <i key={i} className={`bk-bed bk-bed--${state}`} />
                        })}
                      </span>
                      <span className="bk-muted">
                        {room.capacity} orang · {full ? 'Penuh' : `sisa ${usage.available}`}
                      </span>
                    </button>
                  )
                })}
              </div>
              <div className="bk-legend">
                <span><i className="bk-bed bk-bed--taken" /> Terisi</span>
                <span><i className="bk-bed bk-bed--pending" /> Menunggu approval</span>
                <span><i className="bk-bed bk-bed--free" /> Tersedia</span>
              </div>
              {errors.roomId && <span className="bk-error">{errors.roomId}</span>}
            </section>
          )}
        </div>

        <aside className="bk-summary bk-card">
          <p className="eyebrow section-eyebrow">RINGKASAN</p>
          <dl>
            <dt>Nama</dt><dd>{form.name || '—'}</dd>
            <dt>NIM</dt><dd>{form.nim || '—'}</dd>
            <dt>Fakultas</dt><dd>{faculty?.name || '—'}</dd>
            <dt>Jurusan</dt><dd>{form.major || '—'}</dd>
            <dt>Asrama</dt><dd>{selectedDorm?.name || '—'}</dd>
            <dt>Kamar</dt>
            <dd>
              {form.roomId
                ? `${getRoom(form.dormId, form.roomId)?.number} (${getRoom(form.dormId, form.roomId)?.capacity} orang)`
                : '—'}
            </dd>
          </dl>
          <button type="submit" className="bk-btn bk-btn--primary bk-btn--block">
            Kirim booking →
          </button>
          <p className="bk-muted bk-small">
            Booking berstatus <em>menunggu persetujuan</em> hingga disetujui kepala asrama.
          </p>
        </aside>
      </form>

      <StatusChecker bookings={bookings} />
    </section>
  )
}

export default Booking
