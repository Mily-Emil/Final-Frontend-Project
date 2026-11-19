import { useSyncExternalStore } from 'react'
import { DORMITORIES, getRoom } from '../data/bookingData.js'

// Penyimpanan booking di localStorage (demo front-end, belum memakai backend/database).
const STORAGE_KEY = 'unklab-dorm-bookings'
const listeners = new Set()
const EMPTY = []
let cachedRaw = null
let cachedList = EMPTY

export function readBookings() {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw !== cachedRaw) {
    cachedRaw = raw
    try {
      cachedList = raw ? JSON.parse(raw) : EMPTY
    } catch {
      cachedList = EMPTY
    }
  }
  return cachedList
}

function writeBookings(list) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  const onStorage = (event) => {
    if (event.key === STORAGE_KEY) listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function useBookings() {
  return useSyncExternalStore(subscribe, readBookings)
}

const ACTIVE = ['pending', 'approved']

export function getRoomUsage(room, bookings) {
  let approved = 0
  let pending = 0
  for (const booking of bookings) {
    if (booking.roomId !== room.id) continue
    if (booking.status === 'approved') approved += 1
    if (booking.status === 'pending') pending += 1
  }
  const occupied = room.occupied + approved
  return {
    capacity: room.capacity,
    occupied,
    pending,
    available: Math.max(room.capacity - occupied - pending, 0),
  }
}

export function getDormUsage(dorm, bookings) {
  return dorm.rooms.reduce(
    (total, room) => {
      const usage = getRoomUsage(room, bookings)
      total.capacity += usage.capacity
      total.occupied += usage.occupied
      total.pending += usage.pending
      total.available += usage.available
      if (usage.available > 0) total.openRooms += 1
      return total
    },
    { capacity: 0, occupied: 0, pending: 0, available: 0, openRooms: 0 },
  )
}

export function getAllDormUsage(bookings) {
  return DORMITORIES.map((dorm) => ({ dorm, usage: getDormUsage(dorm, bookings) }))
}

function makeId() {
  return `BK-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`
}

export function createBooking(data) {
  const bookings = readBookings()
  const nim = data.nim.trim()

  const duplicate = bookings.find(
    (booking) => booking.nim === nim && ACTIVE.includes(booking.status),
  )
  if (duplicate) {
    return {
      ok: false,
      error: `NIM ${nim} sudah memiliki booking aktif (${duplicate.id}) dengan status ${
        duplicate.status === 'pending' ? 'menunggu persetujuan' : 'disetujui'
      }.`,
    }
  }

  const room = getRoom(data.dormId, data.roomId)
  if (!room) return { ok: false, error: 'Kamar tidak ditemukan.' }
  if (getRoomUsage(room, bookings).available <= 0) {
    return { ok: false, error: 'Maaf, kamar ini baru saja penuh. Silakan pilih kamar lain.' }
  }

  const booking = {
    ...data,
    nim,
    id: makeId(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    decidedAt: null,
    note: '',
  }
  writeBookings([booking, ...bookings])
  return { ok: true, booking }
}

export function updateBookingStatus(id, status, note = '') {
  const bookings = readBookings()
  const target = bookings.find((booking) => booking.id === id)
  if (!target) return { ok: false, error: 'Booking tidak ditemukan.' }

  if (status === 'approved') {
    const room = getRoom(target.dormId, target.roomId)
    const usage = getRoomUsage(room, bookings)
    if (usage.occupied >= usage.capacity) {
      return { ok: false, error: 'Kamar sudah penuh, booking tidak dapat disetujui.' }
    }
  }

  writeBookings(
    bookings.map((booking) =>
      booking.id === id
        ? { ...booking, status, note: note.trim(), decidedAt: new Date().toISOString() }
        : booking,
    ),
  )
  return { ok: true }
}

export function resetBookings() {
  writeBookings([])
}

export const STATUS_LABELS = {
  pending: 'Menunggu persetujuan',
  approved: 'Disetujui',
  rejected: 'Ditolak',
}
