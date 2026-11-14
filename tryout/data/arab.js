// Subtes 8 — Bahasa Arab
module.exports = {
  id: "ARB",
  title: "Bahasa Arab",
  time: 25,
  relevance: "MAN IC (komponen akademik madrasah), SMA Al Azhar (program bahasa Arab)",
  instructions: [
    "Soal 1–8 mufradat & tarkib dasar, 9–12 qawa'id & hiwar, 13–15 qira'ah (pemahaman teks).",
  ],
  items: [
    { t: "Mufradat – arti kata", l: 1, q: "Arti kata مَدْرَسَةٌ adalah …", o: ["sekolah", "masjid", "perpustakaan", "kantor"], e: "مَدْرَسَةٌ = sekolah; مَسْجِدٌ = masjid; مَكْتَبَةٌ = perpustakaan; مَكْتَبٌ = kantor/meja." },
    { t: "Mufradat – padanan kata", l: 1, q: "Bahasa Arab dari kata “perpustakaan” adalah …", o: ["مَكْتَبَةٌ", "مَكْتَبٌ", "مَطْبَخٌ", "مَلْعَبٌ"], e: "مَكْتَبَةٌ = perpustakaan; مَطْبَخٌ = dapur; مَلْعَبٌ = lapangan." },
    { t: "Mufradat – antonim", l: 1, q: "Lawan kata dari كَبِيرٌ adalah …", o: ["صَغِيرٌ", "طَوِيلٌ", "جَدِيدٌ", "قَدِيمٌ"], e: "كَبِيرٌ (besar) >< صَغِيرٌ (kecil)." },
    { t: "Tarkib – dhamir", l: 2, q: "Kata ganti yang tepat untuk melengkapi kalimat ـــــــ طَالِبٌ مُجْتَهِدٌ adalah …", o: ["هُوَ", "هِيَ", "هُمْ", "أَنْتِ"], e: "طَالِبٌ (laki-laki, tunggal) → هُوَ." },
    { t: "Tarkib – isim isyarah", l: 2, q: "Kata tunjuk untuk benda dekat yang mudzakkar pada kalimat ـــــــ كِتَابٌ adalah …", o: ["هَذَا", "هَذِهِ", "ذَلِكَ", "تِلْكَ"], e: "هَذَا = ini (dekat, mudzakkar); هَذِهِ = ini (muannats); ذَلِكَ/تِلْكَ = itu (jauh)." },
    { t: "Tarkib – mudzakkar/muannats", l: 1, q: "Bentuk muannats dari kata مُدَرِّسٌ adalah …", o: ["مُدَرِّسَةٌ", "مُدَرِّسُونَ", "مَدْرَسَةٌ", "دَرْسٌ"], e: "Muannats umumnya ditandai ta' marbuthah: مُدَرِّسَةٌ (guru perempuan)." },
    { t: "Mufradat – waktu", l: 2, q: "Kalimat السَّاعَةُ السَّابِعَةُ artinya …", o: ["pukul tujuh", "pukul enam", "pukul delapan", "pukul sembilan"], e: "السَّابِعَةُ = ketujuh → pukul tujuh. (السَّادِسَةُ = keenam, الثَّامِنَةُ = kedelapan, التَّاسِعَةُ = kesembilan)." },
    { t: "Mufradat – hari", l: 2, q: "Hari sesudah يَوْمُ الْخَمِيسِ adalah …", o: ["يَوْمُ الْجُمُعَةِ", "يَوْمُ السَّبْتِ", "يَوْمُ الْأَرْبِعَاءِ", "يَوْمُ الْأَحَدِ"], e: "الْخَمِيسُ = Kamis → hari berikutnya الْجُمُعَةُ = Jumat." },
    { t: "Qawa'id – fi'il mudhari'", l: 2, q: "Arti kalimat يَكْتُبُ الطَّالِبُ الدَّرْسَ adalah …", o: ["Siswa itu sedang menulis pelajaran", "Siswa itu telah membaca pelajaran", "Para siswa menulis pelajaran", "Guru menulis pelajaran"], e: "يَكْتُبُ = fi'il mudhari' (sedang/akan menulis); الطَّالِبُ = siswa (tunggal); الدَّرْسَ = pelajaran." },
    { t: "Qawa'id – fi'il madhi", l: 3, q: "Kata yang tepat untuk melengkapi kalimat أَنَا ـــــــ الرِّسَالَةَ أَمْسِ adalah …", o: ["كَتَبْتُ", "كَتَبَ", "كَتَبَتْ", "يَكْتُبُ"], e: "أَمْسِ (kemarin) → fi'il madhi; dhamir أَنَا → كَتَبْتُ (aku telah menulis)." },
    { t: "Qawa'id – jamak taksir", l: 2, q: "Bentuk jamak dari كِتَابٌ adalah …", o: ["كُتُبٌ", "كَاتِبُونَ", "مَكَاتِبُ", "أَقْلَامٌ"], e: "Jamak taksir كِتَابٌ → كُتُبٌ. كَاتِبُونَ = para penulis; مَكَاتِبُ = jamak مَكْتَبٌ; أَقْلَامٌ = pena-pena." },
    { t: "Hiwar – ungkapan", l: 1, q: "Jawaban yang tepat untuk pertanyaan كَيْفَ حَالُكَ؟ adalah …", o: ["بِخَيْرٍ، وَالْحَمْدُ لِلَّهِ", "اِسْمِي أَحْمَدُ", "أَنَا مِنْ جَاكَرْتَا", "أَنَا طَالِبٌ"], e: "كَيْفَ حَالُكَ؟ = Apa kabarmu? → بِخَيْرٍ، وَالْحَمْدُ لِلَّهِ (Baik, alhamdulillah)." },

    { stim: { title: "Bacalah teks berikut untuk menjawab soal nomor 13–15.", rtl: true, paras: [
      "اِسْمِي فَاطِمَةُ. أَنَا طَالِبَةٌ فِي الْمَدْرَسَةِ الْمُتَوَسِّطَةِ. أَذْهَبُ إِلَى الْمَدْرَسَةِ بِالدَّرَّاجَةِ كُلَّ يَوْمٍ. أُحِبُّ دَرْسَ الرِّيَاضِيَّاتِ، وَهِوَايَتِي الْقِرَاءَةُ.",
    ] } },
    { t: "Qira'ah – informasi tersurat", l: 2, q: "Bagaimana Fatimah pergi ke sekolah?", o: ["Bersepeda", "Berjalan kaki", "Naik bus", "Diantar ayahnya"], e: "بِالدَّرَّاجَةِ = dengan sepeda." },
    { t: "Qira'ah – informasi tersurat", l: 2, q: "Pelajaran yang disukai Fatimah adalah …", o: ["Matematika", "Bahasa Arab", "Sains", "Sejarah"], e: "أُحِبُّ دَرْسَ الرِّيَاضِيَّاتِ = saya menyukai pelajaran matematika." },
    { t: "Qira'ah – informasi tersurat", l: 1, q: "Hobi Fatimah adalah …", o: ["Membaca", "Menulis", "Berenang", "Menggambar"], e: "هِوَايَتِي الْقِرَاءَةُ = hobi saya membaca." },
  ],
};
