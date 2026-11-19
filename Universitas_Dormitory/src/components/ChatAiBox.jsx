import { Fragment, useEffect, useRef, useState } from 'react'
import {
  STATUS_LABELS,
  getAllDormUsage,
  getDormUsage,
  getRoomUsage,
  readBookings,
  useBookings,
} from '../utils/bookingStore.js'
import { DORMITORIES, getDormitory } from '../data/bookingData.js'
import './ChatAiBox.css'

const DORMITORY_CONTEXT = `
Kamu adalah asisten AI resmi untuk Universitas Klabat (UNKLAB) dan Asrama Universitas Klabat di Airmadidi, Sulawesi Utara.
Jawablah dalam Bahasa Indonesia yang ramah, ringkas, dan jelas.

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

Daftar asrama UNKLAB:
- Asrama Putra:
  1. Crystal Dormitory (Area utama kampus, pilihan kamar 4 & 6 orang)
  2. Guesthouse Dormitory (Dekat pusat kegiatan, pilihan kamar 4 & 6 orang)
  3. Gen Z Dormitory (Area timur kampus, pilihan kamar 4 & 6 orang)
- Asrama Putri:
  1. Jasmine 1 Dormitory (Area utama kampus, pilihan kamar 4 & 6 orang)
  2. Jasmine 2 Dormitory (Area utama kampus, pilihan kamar 4 & 6 orang)
  3. Annex Dormitory (Area barat kampus, pilihan kamar 4 & 6 orang)
  4. Edelweiss Dormitory (Dekat perpustakaan, pilihan kamar 4 & 6 orang)
  5. Bougenville Dormitory (Area selatan kampus, pilihan kamar 4 & 6 orang)

Fitur Booking & Approval Asrama:
- Mahasiswa dapat mendaftar kamar melalui menu Booking (?page=booking) dengan mengisi data lengkap (Nama, NIM, No. REG, Semester, Fakultas, Jurusan, No. Wali, No. Mahasiswa), memilih asrama sesuai gender, dan memilih kamar yang tersedia (4 atau 6 orang).
- Setiap pengajuan booking akan masuk ke sistem dengan status "Menunggu persetujuan".
- Kepala Asrama meninjau dan memberikan approval di dashboard Kepala Asrama (?page=admin).
- Status kapasitas dan sisa kamar terisi/tersedia selalu diperbarui secara real-time berdasarkan data booking.

Kontak resmi: dormitory@unklab.ac.id, Universitas Klabat, Airmadidi, Sulawesi Utara.
`

const INITIAL_MESSAGES = [
  {
    id: 'welcome',
    role: 'assistant',
    text: 'Halo! Saya asisten AI Universitas Klabat (UNKLAB). Saya siap membantu merangkum informasi seputar asrama, ketersediaan kamar real-time, alur booking & approval, serta informasi umum kampus UNKLAB.',
  },
]

const QUICK_PROMPTS = [
  'Berapa kamar yang tersisa?',
  'Kamar di Crystal Dormitory',
  'Asrama putra & putri',
  'Alur booking & approval',
]

function hasWord(text, word) {
  return new RegExp(`\\b${word}\\b`, 'i').test(text)
}

function findMentionedDorm(q) {
  if (q.includes('crystal')) return getDormitory('crystal')
  if (q.includes('guest') || q.includes('guesthouse')) return getDormitory('guesthouse')
  if (
    q.includes('gen z') ||
    q.includes('gen-z') ||
    q.includes('genz') ||
    q.includes('genset')
  )
    return getDormitory('genz')
  if (q.includes('jasmine 1') || q.includes('jasmine1')) return getDormitory('jasmine1')
  if (q.includes('jasmine 2') || q.includes('jasmine2')) return getDormitory('jasmine2')
  if (q.includes('jasmine')) return [getDormitory('jasmine1'), getDormitory('jasmine2')]
  if (q.includes('annex')) return getDormitory('annex')
  if (q.includes('edelweiss') || q.includes('edelweis')) return getDormitory('edelweiss')
  if (
    q.includes('bougenville') ||
    q.includes('bougenvil') ||
    q.includes('bugenvil')
  )
    return getDormitory('bougenville')
  return null
}

function formatDormRoomAvailability(dorm, bookings) {
  const usage = getDormUsage(dorm, bookings)
  const openRooms = []
  const fullRooms = []

  for (const room of dorm.rooms) {
    const ru = getRoomUsage(room, bookings)
    if (ru.available > 0) {
      openRooms.push(
        `• **Kamar ${room.number}** (${room.capacity} orang): tersisa **${ru.available}** tempat (${ru.occupied} terisi${ru.pending > 0 ? `, ${ru.pending} pending` : ''})`,
      )
    } else {
      fullRooms.push(
        `• Kamar ${room.number} (${room.capacity} orang): Penuh (${ru.occupied}/${room.capacity})`,
      )
    }
  }

  let text = `Berikut rincian ketersediaan kamar di **${dorm.name}** (${dorm.gender === 'putra' ? 'Asrama Putra' : 'Asrama Putri'}):\n`
  text += `Status kapasitas: **${usage.available}** tempat tersedia dari total ${usage.capacity} kapasitas (**${usage.occupied}** terisi${usage.pending > 0 ? `, **${usage.pending}** menunggu approval` : ''}).\n\n`

  if (openRooms.length > 0) {
    text += `Kamar yang masih tersedia (${openRooms.length} kamar):\n${openRooms.join('\n')}\n\n`
  } else {
    text += `Semua kamar di asrama ini saat ini sudah penuh.\n\n`
  }

  if (fullRooms.length > 0) {
    text += `Kamar penuh (${fullRooms.length} kamar):\n${fullRooms.join('\n')}\n\n`
  }

  text += `Untuk memesan kamar di ${dorm.name}, silakan buka menu **Booking kamar** di navigasi atas.`
  return text
}

function formatAllDormsAvailability(bookings, genderFilter = null, capacityFilter = null) {
  const allUsage = getAllDormUsage(bookings)

  if (capacityFilter) {
    let result = `Berikut ketersediaan kamar berkapasitas **${capacityFilter} orang** saat ini:\n\n`
    let matchCount = 0

    const listByGender = (gender, label) => {
      const dorms = allUsage.filter(({ dorm }) => dorm.gender === gender)
      const lines = []
      for (const { dorm } of dorms) {
        const rooms = dorm.rooms.filter((r) => r.capacity === capacityFilter)
        for (const room of rooms) {
          const ru = getRoomUsage(room, bookings)
          if (ru.available > 0) {
            matchCount += 1
            lines.push(
              `• **${dorm.name}** - Kamar **${room.number}**: tersisa **${ru.available}** tempat (${ru.occupied}/${room.capacity} terisi)`,
            )
          }
        }
      }
      return lines.length > 0 ? `**${label}:**\n${lines.join('\n')}\n\n` : ''
    }

    if (!genderFilter || genderFilter === 'putra') {
      result += listByGender('putra', 'Asrama Putra')
    }
    if (!genderFilter || genderFilter === 'putri') {
      result += listByGender('putri', 'Asrama Putri')
    }

    if (matchCount === 0) {
      result = `Saat ini belum ada kamar kapasitas **${capacityFilter} orang** yang memiliki sisa tempat.`
    } else {
      result += `Silakan pilih kamar di atas pada formulir **Booking kamar**.`
    }
    return result
  }

  let totalAvailable = 0
  let totalCapacity = 0

  const renderSection = (items, label) => {
    let secText = `**${label}:**\n`
    for (const { dorm, usage } of items) {
      totalAvailable += usage.available
      totalCapacity += usage.capacity
      secText += `• **${dorm.name}**: **${usage.available}** tempat tersedia (${usage.openRooms} kamar buka dari ${dorm.rooms.length} kamar)\n`
    }
    return secText + '\n'
  }

  let text = 'Berikut ketersediaan kamar asrama saat ini sesuai data booking terbaru:\n\n'

  const putraList = allUsage.filter(({ dorm }) => dorm.gender === 'putra')
  const putriList = allUsage.filter(({ dorm }) => dorm.gender === 'putri')

  if (!genderFilter || genderFilter === 'putra') {
    text += renderSection(putraList, 'Asrama Putra')
  }
  if (!genderFilter || genderFilter === 'putri') {
    text += renderSection(putriList, 'Asrama Putri')
  }

  text += `Total tersedia: **${totalAvailable}** tempat siap huni dari total **${totalCapacity}** kapasitas.\n\n`
  text += `Ketik nama asrama (contoh: **"Kamar di Crystal"**) untuk melihat daftar kamar dan kapasitasnya, atau buka menu **Booking kamar** untuk mendaftar.`
  return text
}

function buildAvailabilityContextForAI(bookings) {
  const allUsage = getAllDormUsage(bookings)
  let text = 'STATUS KETERSEDIAAN KAMAR & ASRAMA REAL-TIME (BERDASARKAN DATA BOOKING TERBARU):\n'
  for (const { dorm, usage } of allUsage) {
    text += `- ${dorm.name} (${dorm.gender === 'putra' ? 'Putra' : 'Putri'}, Lokasi: ${dorm.location}): Total Kapasitas ${usage.capacity}, Terisi ${usage.occupied}, Menunggu Approval ${usage.pending}, Sisa Tersedia ${usage.available} tempat tidur (${usage.openRooms} kamar buka).\n`
    const roomDetails = dorm.rooms
      .map((room) => {
        const ru = getRoomUsage(room, bookings)
        return `  * Kamar ${room.number}: Kapasitas ${room.capacity} orang, Sisa ${ru.available} tempat (${ru.occupied} terisi${ru.pending > 0 ? `, ${ru.pending} pending` : ''})`
      })
      .join('\n')
    text += `${roomDetails}\n`
  }
  return text
}

function buildLocalReply(userText, bookings = []) {
  const currentBookings =
    bookings && bookings.length > 0 ? bookings : readBookings()
  const q = userText.toLowerCase()

  // 1. Cek pertanyaan ketersediaan kamar / sisa kamar / kuota
  const wantsAvailability =
    q.includes('tersisa') ||
    q.includes('sisa') ||
    q.includes('kosong') ||
    q.includes('tersedia') ||
    q.includes('ketersediaan') ||
    q.includes('kuota') ||
    (q.includes('kamar') &&
      (q.includes('berapa') ||
        q.includes('ada') ||
        q.includes('mana') ||
        q.includes('bisa') ||
        q.includes('status') ||
        q.includes('cek') ||
        q.includes('booking') ||
        q.includes('pilihan')))

  if (wantsAvailability) {
    const mentionedDorm = findMentionedDorm(q)
    if (mentionedDorm) {
      if (Array.isArray(mentionedDorm)) {
        return mentionedDorm
          .map((d) => formatDormRoomAvailability(d, currentBookings))
          .join('\n\n---\n\n')
      }
      return formatDormRoomAvailability(mentionedDorm, currentBookings)
    }

    const capacityFilter =
      q.includes('4 orang') ||
      q.includes('4 org') ||
      q.includes('4orang') ||
      q.includes('kapasitas 4') ||
      q.includes('muatan 4')
        ? 4
        : q.includes('6 orang') ||
            q.includes('6 org') ||
            q.includes('6orang') ||
            q.includes('kapasitas 6') ||
            q.includes('muatan 6')
          ? 6
          : null

    const genderFilter =
      q.includes('putra') ||
      q.includes('cowo') ||
      q.includes('cowok') ||
      q.includes('laki') ||
      q.includes('pria')
        ? 'putra'
        : q.includes('putri') ||
            q.includes('cewe') ||
            q.includes('cewek') ||
            q.includes('perempuan') ||
            q.includes('wanita')
          ? 'putri'
          : null

    return formatAllDormsAvailability(
      currentBookings,
      genderFilter,
      capacityFilter,
    )
  }

  // 2. Alur Booking dan Approval Kepala Asrama
  if (
    q.includes('approval') ||
    q.includes('setuju') ||
    q.includes('disetujui') ||
    q.includes('kepala asrama') ||
    q.includes('cara booking') ||
    q.includes('status booking') ||
    q.includes('cek status')
  ) {
    return (
      'Alur Booking dan Approval Asrama UNKLAB:\n' +
      '1. **Isi Formulir Booking**: Buka menu **Booking kamar** (?page=booking), lengkapi data mahasiswa (NIM, No. REG, Fakultas/Jurusan, No. HP Mahasiswa & Wali), lalu pilih asrama sesuai jenis kelamin dan kamar yang tersedia (kapasitas 4 atau 6 orang).\n' +
      '2. **Status Menunggu**: Setelah submit, status booking Anda adalah **Menunggu persetujuan**.\n' +
      '3. **Approval Kepala Asrama**: Kepala asrama akan memeriksa permohonan melalui dashboard **Kepala Asrama** (?page=admin) untuk menyetujui (Approved) atau menolak (Rejected).\n' +
      '4. **Cek Status**: Anda dapat memantau status booking kapan saja di halaman **Booking kamar** pada bagian **Cek Status** dengan memasukkan NIM Anda.'
    )
  }

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
      '• **Crystal Dormitory** (Area utama, pilihan 4 & 6 orang/kamar)\n' +
      '• **Guesthouse Dormitory** (Dekat pusat kegiatan, pilihan 4 & 6 orang/kamar)\n' +
      '• **Gen Z Dormitory** (Area timur, pilihan 4 & 6 orang/kamar)\n\n' +
      'Asrama Putri:\n' +
      '• **Jasmine 1 & Jasmine 2** (Area utama, pilihan 4 & 6 orang/kamar)\n' +
      '• **Annex Dormitory** (Area barat, pilihan 4 & 6 orang/kamar)\n' +
      '• **Edelweiss Dormitory** (Dekat perpustakaan, pilihan 4 & 6 orang/kamar)\n' +
      '• **Bougenville Dormitory** (Area selatan, pilihan 4 & 6 orang/kamar)\n\n' +
      'Tanyakan **"Berapa kamar yang tersisa?"** untuk melihat ketersediaan real-time.'
    )
  }

  if (
    q.includes('putra') ||
    q.includes('cowok') ||
    q.includes('laki') ||
    q.includes('pria')
  ) {
    return (
      'Untuk asrama putra, tersedia 3 pilihan:\n' +
      '• **Crystal Dormitory** — Area utama kampus (kamar 4 & 6 orang, Favorit)\n' +
      '• **Guesthouse Dormitory** — Dekat pusat kegiatan (kamar 4 & 6 orang, Terbatas)\n' +
      '• **Gen Z Dormitory** — Area timur kampus (kamar 4 & 6 orang, Pilihan baru)\n\n' +
      'Tanyakan **"Sisa kamar asrama putra"** untuk melihat kamar yang masih bisa dipesan.'
    )
  }

  if (
    q.includes('putri') ||
    q.includes('cewek') ||
    q.includes('perempuan') ||
    q.includes('wanita')
  ) {
    return (
      'Untuk asrama putri, tersedia 5 pilihan:\n' +
      '• **Jasmine 1 Dormitory** — Area utama kampus (kamar 4 & 6 orang)\n' +
      '• **Jasmine 2 Dormitory** — Area utama kampus (kamar 4 & 6 orang)\n' +
      '• **Annex Dormitory** — Area barat kampus (kamar 4 & 6 orang)\n' +
      '• **Edelweiss Dormitory** — Dekat perpustakaan (kamar 4 & 6 orang)\n' +
      '• **Bougenville Dormitory** — Area selatan kampus (kamar 4 & 6 orang)\n\n' +
      'Tanyakan **"Sisa kamar asrama putri"** untuk melihat kamar yang masih bisa dipesan.'
    )
  }

  if (q.includes('kapasitas') || q.includes('kamar') || q.includes('orang')) {
    return (
      'Kapasitas kamar di seluruh Asrama UNKLAB terbagi menjadi dua pilihan muatan:\n' +
      '• **Kamar 4 orang**: Tersedia di seluruh asrama Putra & Putri.\n' +
      '• **Kamar 6 orang**: Tersedia di seluruh asrama bagi mahasiswa yang memilih kamar bersama lebih luas.\n\n' +
      'Untuk melihat sisa tempat tidur dan kamar kosong saat ini, silakan tanyakan **"Berapa kamar yang tersisa?"** atau buka menu **Booking kamar**.'
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
      'Kehidupan asrama di UNKLAB dirancang untuk menumbuhkan karakter, kedisiplinan, dan kehidupan rohani berlandaskan nilai-nilai Kristiani Advent.\n' +
      'Mahasiswa dibimbing melalui ibadah bersama (worship/vesper), waktu belajar teratur, dan lingkungan kampus yang aman di bawah pengawasan dekan asrama (Village Dean).'
    )
  }

  if (
    q.includes('lokasi') ||
    q.includes('alamat') ||
    q.includes('kontak') ||
    q.includes('email') ||
    q.includes('telepon') ||
    q.includes('hubungi')
  ) {
    return (
      'Asrama dan Kampus berlokasi di lingkungan Universitas Klabat, Airmadidi, Sulawesi Utara.\n' +
      '• Email Asrama: dormitory@unklab.ac.id\n' +
      '• Email Kampus: info@unklab.ac.id\n' +
      '• Telepon: +62 431 891035\n' +
      'Buka halaman **Peta lokasi** (?page=gempat) atau **Kontak** (?page=contact) untuk detail rute dan peta.'
    )
  }

  if (
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
    return 'Halo! Silakan tanya informasi ketersediaan kamar asrama terkini ("Berapa kamar yang tersisa?"), alur booking asrama, atau informasi umum seputar Universitas Klabat.'
  }

  return (
    'Maaf, saya hanya dapat menjawab pertanyaan yang berkaitan dengan Universitas Klabat (UNKLAB) dan Asrama UNKLAB.\n\n' +
    'Silakan tanyakan seputar:\n' +
    '• **Ketersediaan kamar**: "Berapa kamar yang tersisa?" atau "Kamar di Crystal"\n' +
    '• **Daftar asrama**: Asrama Putra & Putri UNKLAB\n' +
    '• **Alur booking & approval**: Cara mendaftar & proses persetujuan kepala asrama\n' +
    '• **Fakultas & Fasilitas**: Program studi dan kehidupan kampus UNKLAB'
  )
}

function renderAssistantText(text) {
  const lines = text
    .replace(/\s*\(?\?page=[\w-]+(?:&[^)\s]*)?\)?/gi, '')
    .split('\n')

  return lines.map((line, lineIndex) => {
    const itemMatch = line.match(/^\s*(?:[•*-]|\d+[.)])\s+(.+)$/)
    const content = itemMatch ? itemMatch[1] : line
    const parts = content.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
    const hasBold = parts.some((part) => /^\*\*[^*]+\*\*$/.test(part))

    let formattedParts = parts.map((part, partIndex) => {
      const boldMatch = part.match(/^\*\*([^*]+)\*\*$/)
      return boldMatch ? <strong key={partIndex}>{boldMatch[1]}</strong> : part
    })

    if (itemMatch && !hasBold) {
      const labelMatch = content.match(/^(.+?)(\s+[—–-]\s+|\s*:\s+)(.*)$/)
      formattedParts = labelMatch
        ? [
            <strong key="label">{labelMatch[1]}</strong>,
            labelMatch[2],
            labelMatch[3],
          ]
        : [<strong key="label">{content}</strong>]
    }

    return (
      <Fragment key={lineIndex}>
        {itemMatch ? '• ' : ''}
        {formattedParts}
        {lineIndex < lines.length - 1 ? '\n' : null}
      </Fragment>
    )
  })
}

async function fetchGeminiReply(history, userText, bookings = []) {
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

  const currentBookings =
    bookings && bookings.length > 0 ? bookings : readBookings()
  const liveContext = buildAvailabilityContextForAI(currentBookings)
  const fullSystemInstruction = `${DORMITORY_CONTEXT}\n\n${liveContext}\n\nPETUNJUK KETERSEDIAAN KAMAR:\nKetika pengguna bertanya tentang ketersediaan kamar, sisa kamar, kuota, kamar kosong, atau booking, selalu gunakan data ketersediaan real-time di atas. Berikan angka persis sesuai data.`

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`
  const payload = JSON.stringify({
    systemInstruction: {
      parts: [{ text: fullSystemInstruction }],
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
  const bookings = useBookings()

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

    const currentBookings = bookings || readBookings()

    try {
      const apiReply = await fetchGeminiReply(messages, text, currentBookings)
      const replyText = apiReply || buildLocalReply(text, currentBookings)

      if (!apiReply) {
        await new Promise((resolve) => setTimeout(resolve, 350))
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
          text: buildLocalReply(text, currentBookings),
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
        <section
          className="chat-ai-window"
          aria-label="Chat AI Universitas Klabat"
        >
          <header className="chat-ai-header">
            <div className="chat-ai-title-wrap">
              <span className="chat-ai-avatar" aria-hidden="true">
                AI
              </span>
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
                {msg.role === 'assistant'
                  ? renderAssistantText(msg.text)
                  : msg.text}
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
