// Subtes 1 — Tes Potensi Akademik / Potensi Belajar
// Format butir: o[0] = jawaban benar (posisi diacak saat build), kecuali keep:true (pakai a = indeks kunci).
// l: 1 = Pengetahuan & Pemahaman, 2 = Aplikasi, 3 = Penalaran (HOTS)
const PK = ["P > Q", "P < Q", "P = Q", "Hubungan P dan Q tidak dapat ditentukan"];

module.exports = {
  id: "TPA",
  title: "Tes Potensi Akademik (TPA) / Potensi Belajar",
  time: 60,
  relevance: "MAN IC (Tes Potensi Belajar), Labschool (Tes Verbal & Kuantitatif), SMA Al Azhar",
  instructions: [
    "Subtes ini terdiri atas empat bagian: Verbal (1–15), Numerik/Kuantitatif (16–30), Penalaran Logis & Analitik (31–40), dan Figural/Spasial (41–45).",
    "Pilih satu jawaban yang paling tepat. Tidak ada pengurangan nilai untuk jawaban salah.",
  ],
  items: [
    { part: "A. Kemampuan Verbal — Sinonim (soal 1–4): pilih kata yang paling dekat maknanya." },
    { t: "Verbal – sinonim", l: 1, q: "KONTEMPORER = …", o: ["masa kini", "kuno", "sementara", "berkelanjutan"], e: "Kontemporer berarti pada waktu yang sama atau masa kini." },
    { t: "Verbal – sinonim", l: 1, q: "NIRLABA = …", o: ["tidak mencari keuntungan", "tanpa modal", "bebas pajak", "tidak berizin"], e: "Awalan nir- berarti ‘tidak/tanpa’; nirlaba = tidak bertujuan mencari laba." },
    { t: "Verbal – sinonim", l: 1, q: "ESKALASI = …", o: ["peningkatan", "penurunan", "pemindahan", "penundaan"], e: "Eskalasi adalah kenaikan atau perluasan (volume, intensitas, jumlah) secara bertahap." },
    { t: "Verbal – sinonim", l: 1, q: "PRESISI = …", o: ["ketepatan", "kecepatan", "keindahan", "keseragaman"], e: "Presisi berarti ketepatan atau ketelitian." },

    { part: "Antonim (soal 5–8): pilih kata yang maknanya paling berlawanan." },
    { t: "Verbal – antonim", l: 1, q: "KONKRET >< …", o: ["abstrak", "nyata", "khusus", "rumit"], e: "Konkret = nyata/berwujud; lawannya abstrak." },
    { t: "Verbal – antonim", l: 1, q: "DEFISIT >< …", o: ["surplus", "kerugian", "inflasi", "anggaran"], e: "Defisit = kekurangan (pengeluaran > pemasukan); lawannya surplus." },
    { t: "Verbal – antonim", l: 2, q: "SPORADIS >< …", o: ["terus-menerus", "jarang", "tersebar", "acak"], e: "Sporadis = kadang-kadang/tidak tentu; lawannya terus-menerus (kontinu)." },
    { t: "Verbal – antonim", l: 1, q: "HETEROGEN >< …", o: ["homogen", "beraneka", "campuran", "kompleks"], e: "Heterogen = terdiri atas berbagai unsur berbeda; lawannya homogen." },

    { part: "Analogi (soal 9–12): pilih pasangan kata yang hubungannya setara." },
    { t: "Verbal – analogi", l: 2, q: "PENA : PENULIS = … : …", o: ["kuas : pelukis", "kertas : buku", "palu : paku", "meja : kayu"], e: "Pena adalah alat kerja penulis; kuas adalah alat kerja pelukis." },
    { t: "Verbal – analogi", l: 2, q: "AIR : HAUS = … : …", o: ["makanan : lapar", "air : basah", "api : panas", "uang : bank"], e: "Air menghilangkan rasa haus; makanan menghilangkan rasa lapar." },
    { t: "Verbal – analogi", l: 2, q: "TERMOMETER : SUHU = … : …", o: ["barometer : tekanan udara", "kompas : utara", "timbangan : pasar", "mikroskop : sel"], e: "Termometer mengukur suhu; barometer mengukur tekanan udara (alat ukur : besaran yang diukur)." },
    { t: "Verbal – analogi", l: 2, q: "SEMUT : SERANGGA = … : …", o: ["paus : mamalia", "ikan : air", "elang : sarang", "katak : kecebong"], e: "Semut termasuk kelompok serangga; paus termasuk kelompok mamalia (anggota : kelas)." },

    { part: "Pengelompokan Kata (soal 13–15): pilih kata yang TIDAK termasuk kelompoknya." },
    { t: "Verbal – pengelompokan", l: 2, q: "Merkurius – Venus – Mars – Bulan", o: ["Bulan", "Merkurius", "Venus", "Mars"], e: "Merkurius, Venus, dan Mars adalah planet; Bulan adalah satelit." },
    { t: "Verbal – pengelompokan", l: 3, q: "sonata – simfoni – soneta – konserto", o: ["soneta", "sonata", "simfoni", "konserto"], e: "Sonata, simfoni, dan konserto adalah bentuk komposisi musik; soneta adalah bentuk puisi 14 baris." },
    { t: "Verbal – pengelompokan", l: 3, q: "kalori – joule – watt – erg", o: ["watt", "kalori", "joule", "erg"], e: "Kalori, joule, dan erg adalah satuan energi; watt adalah satuan daya." },

    { part: "B. Kemampuan Numerik/Kuantitatif — Deret (soal 16–20): tentukan suku berikutnya." },
    { t: "Numerik – deret", l: 2, q: "2, 6, 12, 20, 30, …", o: ["42", "40", "36", "44"], e: "Selisih naik 4, 6, 8, 10, lalu 12 → 30 + 12 = 42 (pola n(n+1))." },
    { t: "Numerik – deret", l: 2, q: "3, 5, 9, 17, 33, …", o: ["65", "64", "49", "66"], e: "Setiap suku = suku sebelumnya × 2 − 1 → 33 × 2 − 1 = 65." },
    { t: "Numerik – deret", l: 2, q: "4, 7, 12, 15, 20, 23, …", o: ["28", "26", "27", "31"], e: "Pola selang-seling +3, +5, +3, +5, +3, lalu +5 → 23 + 5 = 28." },
    { t: "Numerik – deret huruf", l: 2, q: "A, C, F, J, O, …", o: ["U", "T", "V", "S"], e: "Posisi huruf 1, 3, 6, 10, 15 (selisih +2, +3, +4, +5); berikutnya +6 = 21 → U." },
    { t: "Numerik – deret", l: 2, q: "81, 27, 9, 3, 1, …", o: ["1/3", "0", "1/9", "−1"], e: "Setiap suku dibagi 3 → 1 ÷ 3 = 1/3." },

    { part: "Aritmetika (soal 21–25)." },
    { t: "Numerik – aritmetika", l: 2, q: "15% dari 240 ditambah 25% dari 96 adalah …", o: ["60", "56", "64", "72"], e: "0,15 × 240 = 36; 0,25 × 96 = 24; 36 + 24 = 60." },
    { t: "Numerik – aritmetika sosial", l: 2, q: "Setelah mendapat diskon 20%, harga sebuah tas menjadi Rp96.000,00. Harga tas sebelum diskon adalah …", o: ["Rp120.000,00", "Rp115.200,00", "Rp116.000,00", "Rp124.000,00"], e: "Harga setelah diskon = 80% harga awal → harga awal = 96.000 ÷ 0,8 = 120.000." },
    { t: "Numerik – kerja bersama", l: 2, q: "Ahmad dapat menyelesaikan sebuah pekerjaan dalam 6 hari, sedangkan Bayu dalam 12 hari. Jika mereka bekerja bersama-sama, pekerjaan itu selesai dalam … hari.", o: ["4", "3", "5", "9"], e: "Laju gabungan = 1/6 + 1/12 = 3/12 = 1/4 pekerjaan per hari → 4 hari." },
    { t: "Numerik – rata-rata", l: 3, q: "Rata-rata lima bilangan adalah 18. Jika salah satu bilangan dikeluarkan, rata-rata empat bilangan sisanya menjadi 16. Bilangan yang dikeluarkan adalah …", o: ["26", "24", "22", "18"], e: "Jumlah awal 5 × 18 = 90; jumlah sisa 4 × 16 = 64; bilangan yang dikeluarkan = 90 − 64 = 26." },
    { t: "Numerik – jarak, waktu, kecepatan", l: 3, q: "Andi berangkat pukul 07.00 dengan kecepatan tetap 40 km/jam. Budi berangkat dari tempat yang sama pukul 07.30, melalui jalan yang sama, dengan kecepatan tetap 60 km/jam. Budi menyusul Andi pada pukul …", o: ["08.30", "08.00", "09.00", "08.45"], e: "Pukul 07.30 Andi sudah menempuh 20 km. Selisih kecepatan 20 km/jam → Budi menyusul dalam 20 ÷ 20 = 1 jam → pukul 08.30." },

    { part: "Perbandingan Kuantitatif (soal 26–30): bandingkan nilai P dan Q, lalu pilih hubungan yang tepat." },
    { t: "Kuantitatif – perbandingan", l: 2, keep: true, a: 2, q: ["P = 3/8", "Q = 0,375"], o: PK, e: "3/8 = 0,375, jadi P = Q." },
    { t: "Kuantitatif – perbandingan", l: 3, keep: true, a: 3, q: ["Diketahui x² = 16.", "P = x", "Q = 4"], o: PK, e: "x dapat bernilai 4 atau −4, sehingga hubungan P dan Q tidak dapat ditentukan." },
    { t: "Kuantitatif – perbandingan", l: 3, keep: true, a: 0, q: ["P = √0,81", "Q = 0,81"], o: PK, e: "√0,81 = 0,9 > 0,81, jadi P > Q. (Akar dari bilangan antara 0 dan 1 lebih besar daripada bilangan itu.)" },
    { t: "Kuantitatif – perbandingan", l: 2, keep: true, a: 0, q: ["P = 2¹⁰", "Q = 10³"], o: PK, e: "2¹⁰ = 1.024 dan 10³ = 1.000, jadi P > Q." },
    { t: "Kuantitatif – perbandingan", l: 3, keep: true, a: 1, q: ["Harga 1 kg apel Rp30.000,00 naik 10%, kemudian turun 10% dari harga baru.", "P = harga akhir 1 kg apel", "Q = Rp30.000,00"], o: PK, e: "30.000 × 1,1 = 33.000; 33.000 × 0,9 = 29.700 < 30.000, jadi P < Q." },

    { part: "C. Penalaran Logis (soal 31–34)." },
    { t: "Logika – silogisme kategoris", l: 3, q: ["Premis 1: Semua peserta olimpiade adalah siswa berprestasi.", "Premis 2: Sebagian siswa berprestasi aktif di OSIS.", "Simpulan yang paling tepat adalah …"], o: ["Tidak dapat dipastikan apakah ada peserta olimpiade yang aktif di OSIS", "Sebagian peserta olimpiade aktif di OSIS", "Semua siswa berprestasi adalah peserta olimpiade", "Tidak ada peserta olimpiade yang aktif di OSIS"], e: "Siswa berprestasi yang aktif di OSIS belum tentu termasuk peserta olimpiade, sehingga tidak ada simpulan pasti tentang hubungan peserta olimpiade dan OSIS." },
    { t: "Logika – modus tollens", l: 2, q: ["Jika hujan deras, lapangan sekolah tergenang.", "Lapangan sekolah tidak tergenang.", "Simpulan yang sah adalah …"], o: ["Tidak terjadi hujan deras", "Terjadi hujan deras", "Lapangan kering karena panas", "Terjadi hujan ringan"], e: "Modus tollens: p → q, ~q, maka ~p. Jadi tidak terjadi hujan deras." },
    { t: "Logika – silogisme hipotetis", l: 2, q: ["Jika Rani rajin berlatih, ia lolos seleksi.", "Jika Rani lolos seleksi, ia mewakili sekolah.", "Simpulan yang sah adalah …"], o: ["Jika Rani rajin berlatih, ia mewakili sekolah", "Jika Rani mewakili sekolah, ia rajin berlatih", "Jika Rani tidak rajin berlatih, ia tidak mewakili sekolah", "Rani rajin berlatih, tetapi tidak mewakili sekolah"], e: "Silogisme: p → q, q → r, maka p → r." },
    { t: "Logika – ingkaran", l: 2, q: "Ingkaran dari pernyataan “Semua siswa membawa laptop” adalah …", o: ["Ada siswa yang tidak membawa laptop", "Semua siswa tidak membawa laptop", "Tidak ada siswa yang membawa laptop", "Ada siswa yang membawa laptop"], e: "Ingkaran ‘semua p’ adalah ‘ada (beberapa) yang tidak p’." },

    { part: "Penalaran Analitik (soal 35–40)." },
    { stim: { title: "Bacalah informasi berikut untuk menjawab soal nomor 35–37.", paras: [
      "Lima siswa—Ali, Bima, Citra, Dina, dan Eka—duduk berjajar pada kursi nomor 1 sampai 5 (dari kiri ke kanan) dengan ketentuan:",
      "(1) Citra duduk di kursi nomor 3.",
      "(2) Ali duduk tepat di sebelah kiri Bima.",
      "(3) Dina tidak duduk di kursi paling ujung.",
      "(4) Eka duduk di salah satu kursi paling ujung.",
    ] } },
    { t: "Analitik – susunan posisi", l: 3, q: "Siswa yang pasti duduk tepat bersebelahan dengan Citra adalah …", o: ["Dina", "Ali", "Bima", "Eka"], e: "Hanya dua susunan yang memenuhi: Ali–Bima–Citra–Dina–Eka atau Eka–Dina–Citra–Ali–Bima. Dina selalu bersebelahan dengan Citra." },
    { t: "Analitik – susunan posisi", l: 3, q: "Jika Eka duduk di kursi nomor 5, siswa yang duduk di kursi nomor 1 adalah …", o: ["Ali", "Bima", "Dina", "Citra"], e: "Eka di kursi 5 → susunan Ali–Bima–Citra–Dina–Eka, sehingga kursi 1 ditempati Ali." },
    { t: "Analitik – susunan posisi", l: 3, q: "Pernyataan berikut yang PASTI SALAH adalah …", o: ["Bima duduk di kursi nomor 4", "Ali duduk di kursi nomor 1", "Eka duduk di kursi nomor 1", "Dina duduk di kursi nomor 2"], e: "Bima hanya mungkin di kursi 2 atau 5, sehingga ‘Bima di kursi 4’ pasti salah; pernyataan lain mungkin benar." },
    { stim: { title: "Bacalah informasi berikut untuk menjawab soal nomor 38–40.", paras: [
      "Empat kegiatan ekstrakurikuler—Robotik, Debat, Paduan Suara, dan Futsal—dijadwalkan pada hari Senin, Selasa, Rabu, dan Kamis. Setiap hari hanya ada satu kegiatan dengan ketentuan:",
      "(1) Robotik tidak dijadwalkan pada hari Senin.",
      "(2) Debat dijadwalkan sehari setelah Robotik.",
      "(3) Futsal tidak dijadwalkan pada hari Kamis.",
    ] } },
    { t: "Analitik – penjadwalan", l: 3, q: "Jika Paduan Suara dijadwalkan pada hari Kamis, Futsal dijadwalkan pada hari …", o: ["Senin", "Selasa", "Rabu", "Kamis"], e: "Paduan Suara Kamis → Robotik–Debat harus Selasa–Rabu, sehingga Futsal pada hari Senin." },
    { t: "Analitik – penjadwalan", l: 3, q: "Pernyataan berikut yang PASTI BENAR adalah …", o: ["Debat tidak dijadwalkan pada hari Senin maupun Selasa", "Robotik dijadwalkan pada hari Rabu", "Futsal dijadwalkan pada hari Senin", "Paduan Suara dijadwalkan pada hari Selasa"], e: "Robotik hanya mungkin Selasa atau Rabu, sehingga Debat selalu Rabu atau Kamis." },
    { t: "Analitik – penjadwalan", l: 3, q: "Banyak susunan jadwal berbeda yang memenuhi semua ketentuan adalah …", o: ["3", "2", "4", "6"], e: "(F, R, D, PS), (F, PS, R, D), dan (PS, F, R, D) untuk Senin–Kamis → 3 susunan." },

    { part: "D. Figural/Spasial (soal 41–45)." },
    { t: "Figural – pola berulang", l: 2, q: "Pola simbol berikut berulang terus: ▲ ■ ● ▲ ■ ● ▲ ■ ● … Simbol ke-50 adalah …", o: ["■", "▲", "●", "◆"], e: "Pola berulang setiap 3 simbol; 50 = 3 × 16 + 2 → simbol ke-2 dalam pola, yaitu ■." },
    { t: "Figural – matriks", l: 2, q: ["Perhatikan matriks bilangan berikut!", { table: [["2", "4", "8"], ["3", "9", "27"], ["4", "16", "?"]] }, "Bilangan yang tepat untuk mengganti tanda “?” adalah …"], o: ["64", "32", "48", "20"], e: "Setiap baris berisi a, a², a³. Baris ketiga: 4, 16, 64." },
    { t: "Spasial – dadu", l: 3, q: "Pada dadu standar, jumlah titik pada dua sisi yang berhadapan selalu 7. Sebuah dadu diletakkan dengan sisi atas bertitik 2 dan sisi depan bertitik 3. Jumlah titik pada sisi bawah dan sisi belakang adalah …", o: ["9", "7", "10", "8"], e: "Sisi bawah = 7 − 2 = 5; sisi belakang = 7 − 3 = 4; jumlah = 9." },
    { t: "Spasial – pencerminan", l: 3, q: "Huruf “b” dicerminkan terhadap garis vertikal, kemudian hasilnya dicerminkan lagi terhadap garis horizontal. Bentuk akhirnya menyerupai huruf …", o: ["q", "p", "b", "d"], e: "Cermin vertikal: b → d. Cermin horizontal: d → q (bulatan pindah ke atas, tangkai ke bawah di sisi kanan)." },
    { t: "Spasial – sudut jarum jam", l: 3, q: "Sudut terkecil yang dibentuk jarum jam dan jarum menit pada pukul 04.20 adalah …", o: ["10°", "0°", "20°", "15°"], e: "Jarum jam: 4 × 30° + 20 × 0,5° = 130°. Jarum menit: 20 × 6° = 120°. Selisih = 10°." },
  ],
};
