// Data master untuk fitur booking asrama.
// Daftar fakultas/jurusan & kamar di bawah adalah data contoh — sesuaikan dengan data resmi UNKLAB.

export const FACULTIES = [
  { id: 'filsafat', name: 'Fakultas Filsafat', majors: ['Ilmu Filsafat (Teologi)'] },
  {
    id: 'fkip',
    name: 'Fakultas Keguruan dan Ilmu Pendidikan',
    majors: ['Pendidikan Bahasa Inggris', 'Pendidikan Ekonomi', 'Pendidikan Agama Kristen'],
  },
  { id: 'feb', name: 'Fakultas Ekonomi dan Bisnis', majors: ['Manajemen', 'Akuntansi'] },
  { id: 'faperta', name: 'Fakultas Pertanian', majors: ['Agroteknologi'] },
  { id: 'fik', name: 'Fakultas Ilmu Komputer', majors: ['Informatika', 'Sistem Informasi'] },
  { id: 'fkep', name: 'Fakultas Keperawatan', majors: ['Ilmu Keperawatan', 'Profesi Ners'] },
  { id: 'ft', name: 'Fakultas Teknik', majors: ['Arsitektur'] },
  { id: 'fk', name: 'Fakultas Kedokteran', majors: ['Pendidikan Dokter'] },
]

export const GENDERS = [
  { id: 'putra', label: 'Laki-laki', dormLabel: 'Asrama Putra' },
  { id: 'putri', label: 'Perempuan', dormLabel: 'Asrama Putri' },
]

// [nomor kamar, kapasitas (orang), penghuni lama yang sudah menempati]
function makeRooms(prefix, layout) {
  return layout.map(([number, capacity, occupied]) => ({
    id: `${prefix}-${number}`,
    number,
    capacity,
    occupied,
  }))
}

export const DORMITORIES = [
  // Putra
  {
    id: 'crystal',
    name: 'Crystal Dormitory',
    gender: 'putra',
    location: 'Area utama kampus',
    rooms: makeRooms('crystal', [
      ['101', 4, 2], ['102', 4, 4], ['103', 4, 1], ['104', 4, 3],
      ['201', 6, 3], ['202', 6, 6], ['203', 6, 2], ['204', 6, 0],
    ]),
  },
  {
    id: 'guesthouse',
    name: 'Guesthouse Dormitory',
    gender: 'putra',
    location: 'Dekat pusat kegiatan',
    rooms: makeRooms('guesthouse', [
      ['G1', 4, 4], ['G2', 4, 2], ['G3', 4, 3], ['G4', 6, 4], ['G5', 6, 1],
    ]),
  },
  {
    id: 'genz',
    name: 'Gen Z Dormitory',
    gender: 'putra',
    location: 'Area timur kampus',
    rooms: makeRooms('genz', [
      ['A1', 4, 1], ['A2', 4, 0], ['A3', 4, 2], ['B1', 6, 2], ['B2', 6, 3], ['B3', 6, 5],
    ]),
  },
  // Putri
  {
    id: 'jasmine1',
    name: 'Jasmine 1 Dormitory',
    gender: 'putri',
    location: 'Area utama kampus',
    rooms: makeRooms('jasmine1', [
      ['101', 4, 3], ['102', 4, 1], ['103', 4, 4], ['201', 6, 2], ['202', 6, 4],
    ]),
  },
  {
    id: 'jasmine2',
    name: 'Jasmine 2 Dormitory',
    gender: 'putri',
    location: 'Area utama kampus',
    rooms: makeRooms('jasmine2', [
      ['101', 4, 2], ['102', 4, 2], ['201', 6, 5], ['202', 6, 1], ['203', 6, 0],
    ]),
  },
  {
    id: 'annex',
    name: 'Annex Dormitory',
    gender: 'putri',
    location: 'Area barat kampus',
    rooms: makeRooms('annex', [
      ['1A', 4, 4], ['1B', 4, 2], ['2A', 6, 3], ['2B', 6, 6], ['2C', 6, 2],
    ]),
  },
  {
    id: 'edelweiss',
    name: 'Edelweiss Dormitory',
    gender: 'putri',
    location: 'Dekat perpustakaan',
    rooms: makeRooms('edelweiss', [
      ['E1', 4, 1], ['E2', 4, 3], ['E3', 4, 0], ['E4', 6, 4], ['E5', 6, 2],
    ]),
  },
  {
    id: 'bougenville',
    name: 'Bougenville Dormitory',
    gender: 'putri',
    location: 'Area selatan kampus',
    rooms: makeRooms('bougenville', [
      ['B1', 4, 2], ['B2', 4, 4], ['B3', 6, 1], ['B4', 6, 3], ['B5', 6, 0],
    ]),
  },
]

export function getFaculty(id) {
  return FACULTIES.find((faculty) => faculty.id === id)
}

export function getDormitory(id) {
  return DORMITORIES.find((dorm) => dorm.id === id)
}

export function getRoom(dormId, roomId) {
  return getDormitory(dormId)?.rooms.find((room) => room.id === roomId)
}
