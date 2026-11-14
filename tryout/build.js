// Generator dokumen Tryout 1 — Seleksi Masuk SMA/MA Unggulan (MAN IC, SMA Labschool, SMANU MH Thamrin, SMA Al Azhar)
// Jalankan: node tryout/build.js  → menghasilkan Tryout1_Seleksi_SMA_Unggulan_TP2027-2028.docx di root repo.
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType,
  AlignmentType, HeadingLevel, BorderStyle, Header, Footer, PageNumber, LevelFormat,
  TabStopType, VerticalAlign, PageBreak, TableLayoutType,
} = require("docx");

const SECTIONS = ["tpa", "bindo", "mat", "ipa", "bing", "ips", "pai", "arab", "intl"].map((f) => require(`./data/${f}.js`));
const NK = require("./data/nonkog.js");
const INTL = SECTIONS.find((s) => s.id === "INT");

// ---------- kualifikasi internasional per butir ----------
const TIMSS = { 1: "Mengetahui (Knowing)", 2: "Menerapkan (Applying)", 3: "Menalar (Reasoning)" };
const TIMSS_SHORT = { 1: "Mengetahui", 2: "Menerapkan", 3: "Menalar" };
const PISA_LV = { 1: "Level 1–2", 2: "Level 2–3", 3: "Level 4–5" };
function intlTag(sec, it) {
  if (it.x) return it.x.fw + " • " + it.x.proc;
  const t = it.t;
  switch (sec.id) {
    case "TPA":
      if (/^Verbal/.test(t)) return "PISA Membaca – memahami makna kata (penalaran verbal)";
      if (/^(Numerik|Kuantitatif)/.test(t)) return "PISA Matematika – Quantity • penalaran kuantitatif";
      if (/^(Logika|Analitik)/.test(t)) return "PISA Matematika – penalaran matematis (logika & analitik)";
      return "PISA Matematika – Space & Shape • penalaran spasial";
    case "BIN":
      if (/^Kebahasaan/.test(t)) return "Kaidah kebahasaan (kurikulum nasional; tidak diukur PISA)";
      if (/numerasi/.test(t)) return "PISA Membaca – Menemukan informasi (locate)";
      if (/inferensi|evaluasi|fakta|tujuan/.test(t)) return "PISA Membaca – Mengevaluasi & merefleksi";
      return "PISA Membaca – Memahami (understand)";
    case "MAT": {
      const proc = it.l === 3 || /kontekstual/.test(t) ? "Merumuskan/menalar (formulate)" : "Menerapkan prosedur (employ)";
      if (/Statistika|Peluang/.test(t)) return `PISA: Uncertainty & Data • TIMSS: Data & Peluang • ${proc}`;
      if (/Pythagoras|Lingkaran|singgung|Kesebangunan|Bangun ruang|Transformasi/.test(t)) return `PISA: Space & Shape • TIMSS: Geometri • ${proc}`;
      if (/Bilangan|akar|Merasionalkan/i.test(t)) return `PISA: Quantity • TIMSS: Bilangan • ${proc}`;
      return `PISA: Change & Relationships • TIMSS: Aljabar • ${proc}`;
    }
    case "IPA": {
      const comp = /analisis data|percobaan|pH/.test(t) ? "Menafsirkan data & bukti / merancang penyelidikan" : "Menjelaskan fenomena secara ilmiah";
      const dom = /^Fisika/.test(t) ? "Sistem fisik • TIMSS: Fisika" : /^Kimia/.test(t) ? "Sistem fisik (materi) • TIMSS: Kimia" : "Sistem kehidupan • TIMSS: Biologi";
      return `PISA 2025 Sains: ${dom} • ${comp}`;
    }
    case "ING":
      if (/^Reading/.test(t)) return "PISA 2025 English as a Foreign Language – Reading • CEFR A2–B1";
      if (/^Expression/.test(t)) return "CEFR A2 – interaksi fungsional";
      return "CEFR A2–B1 – penguasaan tata bahasa & kosakata";
    case "IPS":
      if (/skala|kepadatan|neraca/.test(t)) return "PISA Matematika – Quantity (konteks sosial)";
      return "Literasi sosial–kewargaan (sejalan IEA ICCS; bukan domain PISA)";
    case "PAI":
      if (/tabayyun/.test(t)) return "PISA Membaca – menilai kredibilitas informasi";
      if (/Moderasi|Piagam|Hujurat|toleransi/i.test(t)) return "OECD PISA Global Competence – menghargai keberagaman";
      return "Kurikulum PAI/madrasah (tanpa padanan asesmen internasional)";
    case "ARB":
      return "Pembanding CEFR A1–A2 (kecakapan bahasa asing)";
  }
  return "";
}

// ---------- konstanta tata letak ----------
const FONT = "Arial";
const AR_FONT = "Traditional Arabic";
const W = 9638; // lebar area isi A4 dengan margin 2 cm (DXA)
const NAVY = "1F3864", BLUE = "2E75B6", LIGHT = "EAF1FB", GREY = "F2F2F2", GOLD = "FFF4D6";
const LETTERS = ["A", "B", "C", "D"];
const LEVEL_NAME = { 1: "L1 – Pengetahuan & Pemahaman", 2: "L2 – Aplikasi", 3: "L3 – Penalaran (HOTS)" };

// ---------- teks & run (mendukung aksara Arab RTL) ----------
const AR = "؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿";
const AR_SPLIT = new RegExp(`([${AR}]+(?:[\\s ]+[${AR}]+)*)`, "g");
const AR_TEST = new RegExp(`[${AR}]`);

function runs(text, o = {}) {
  const size = o.size || 22;
  return String(text).split(AR_SPLIT).filter((s) => s !== "").map((seg) => {
    if (AR_TEST.test(seg)) {
      return new TextRun({
        text: seg, rightToLeft: true, bold: o.bold, boldComplexScript: o.bold,
        font: { ascii: AR_FONT, hAnsi: AR_FONT, cs: AR_FONT }, size: Math.round(size * 1.35), sizeComplexScript: Math.round(size * 1.35),
      });
    }
    return new TextRun({ text: seg, bold: o.bold, italics: o.italics, color: o.color, font: FONT, size });
  });
}

function P(text, o = {}) {
  return new Paragraph({
    children: Array.isArray(text) ? text : runs(text, o),
    alignment: o.align, indent: o.indent, tabStops: o.tabs, keepNext: o.keepNext, keepLines: o.keepLines,
    bidirectional: o.rtl, pageBreakBefore: o.pageBreak, numbering: o.numbering,
    spacing: { before: o.before ?? 0, after: o.after ?? 100, line: o.line ?? 276 },
  });
}
const bullet = (text, lvl = 0, o = {}) => P(text, { ...o, numbering: { reference: "bullets", level: lvl }, after: o.after ?? 60 });
const numbered = (text, ref = "steps", o = {}) => P(text, { ...o, numbering: { reference: ref, level: 0 }, after: o.after ?? 60 });
const H1 = (text, pageBreak = true) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text, font: FONT })], pageBreakBefore: pageBreak });
const H2 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text, font: FONT })] });
const H3 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text, font: FONT })] });
const spacer = (after = 120) => new Paragraph({ children: [], spacing: { before: 0, after } });

// ---------- tabel ----------
const thin = { style: BorderStyle.SINGLE, size: 4, color: "A6A6A6" };
const BORDERS = { top: thin, bottom: thin, left: thin, right: thin };
const NOB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const NOBORDERS = { top: NOB, bottom: NOB, left: NOB, right: NOB };

function cell(content, width, o = {}) {
  const paras = (Array.isArray(content) ? content : [content]).map((c) =>
    c instanceof Paragraph || c instanceof Table ? c : P(String(c), { size: o.size || 18, bold: o.bold, color: o.color, align: o.align, after: 40, line: 252 }));
  return new TableCell({
    children: paras, width: { size: width, type: WidthType.DXA }, borders: o.borders || BORDERS,
    shading: o.fill ? { fill: o.fill, type: ShadingType.CLEAR, color: "auto" } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 }, verticalAlign: o.valign || VerticalAlign.TOP,
    columnSpan: o.span,
  });
}
function table(rows, widths, o = {}) {
  const total = widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA }, columnWidths: widths, layout: TableLayoutType.FIXED,
    rows: rows.map((r, i) => new TableRow({
      tableHeader: o.header && i === 0, cantSplit: o.cantSplit,
      children: r.map((c, j) => {
        const isHead = o.header && i === 0;
        const fill = isHead ? NAVY : (o.zebra && i % 2 === 0 ? GREY : (o.firstColFill && j === 0 ? LIGHT : undefined));
        return cell(c, widths[j], { size: o.size, bold: isHead || (o.boldFirstCol && j === 0), color: isHead ? "FFFFFF" : undefined, fill, align: o.center && j > 0 ? AlignmentType.CENTER : (o.centerAll ? AlignmentType.CENTER : undefined) });
      }),
    })),
  });
}
function box(paras, fill = LIGHT) {
  return new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: [W], layout: TableLayoutType.FIXED,
    rows: [new TableRow({ cantSplit: false, children: [new TableCell({
      children: paras, width: { size: W, type: WidthType.DXA },
      borders: { top: { style: BorderStyle.SINGLE, size: 6, color: BLUE }, bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE }, left: { style: BorderStyle.SINGLE, size: 18, color: BLUE }, right: { style: BorderStyle.SINGLE, size: 6, color: BLUE } },
      shading: { fill, type: ShadingType.CLEAR, color: "auto" }, margins: { top: 100, bottom: 100, left: 160, right: 160 },
    })] })],
  });
}

// ---------- pengacakan posisi kunci (seeded, seimbang) ----------
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function shuffle(arr, rnd) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function prepare(sec, seed) {
  const rnd = mulberry32(seed);
  const qs = sec.items.filter((it) => it.q !== undefined);
  const free = qs.filter((q) => !q.keep).length;
  let positions = [];
  while (positions.length < free) positions = positions.concat(shuffle([0, 1, 2, 3], rnd));
  let k = 0, n = 0;
  for (const it of sec.items) {
    if (it.q === undefined) continue;
    it.no = ++n;
    if (it.keep) { it.opts = it.o; it.key = it.a; continue; }
    const pos = positions[k++];
    const d = shuffle(it.o.slice(1), rnd);
    d.splice(pos, 0, it.o[0]);
    it.opts = d; it.key = pos;
  }
  sec.count = n;
  // rentang nomor untuk stimulus
  let pend = null;
  for (const it of sec.items) { if (it.stim) pend = it; else if (it.q !== undefined && pend) { pend.from = it.no; pend = null; } }
}
SECTIONS.forEach((s, i) => prepare(s, 20270101 + i * 97));
const TOTAL_ITEMS = SECTIONS.reduce((a, s) => a + s.count, 0);
const HOTS_PCT = Math.round(SECTIONS.reduce((a, s) => a + s.items.filter((it) => it.q !== undefined && it.l === 3).length, 0) / TOTAL_ITEMS * 100);
const TOTAL_TIME = SECTIONS.reduce((a, s) => a + s.time, 0) + NK.survey.time;

// ---------- render butir soal ----------
const QIND = 454;
function renderOptions(it) {
  const opts = it.opts;
  const anyAr = opts.some((o) => AR_TEST.test(o));
  const maxLen = Math.max(...opts.map((o) => o.length));
  const out = [];
  if (!anyAr && maxLen <= 14) {
    const stops = [2750, 5050, 7350].map((p) => ({ type: TabStopType.LEFT, position: p }));
    const ch = [];
    opts.forEach((o, i) => { if (i) ch.push(new TextRun({ text: "\t", font: FONT, size: 22 })); ch.push(new TextRun({ text: `${LETTERS[i]}. `, bold: true, font: FONT, size: 22 }), ...runs(o)); });
    out.push(P(ch, { indent: { left: QIND }, tabs: stops, after: 160, keepLines: true }));
  } else if (maxLen <= 36 || anyAr) {
    const stops = [{ type: TabStopType.LEFT, position: 5050 }];
    for (let r = 0; r < 2; r++) {
      const ch = [];
      [0, 1].forEach((c) => { const i = r * 2 + c; if (c) ch.push(new TextRun({ text: "\t", font: FONT, size: 22 })); ch.push(new TextRun({ text: `${LETTERS[i]}. `, bold: true, font: FONT, size: 22 }), ...runs(opts[i])); });
      out.push(P(ch, { indent: { left: QIND }, tabs: stops, after: r ? 160 : 40, keepNext: r === 0, keepLines: true }));
    }
  } else {
    opts.forEach((o, i) => out.push(P([new TextRun({ text: `${LETTERS[i]}.\t`, bold: true, font: FONT, size: 22 }), ...runs(o)],
      { indent: { left: QIND + 397, hanging: 397 }, tabs: [{ type: TabStopType.LEFT, position: QIND + 397 }], after: i === 3 ? 160 : 30, keepNext: i < 3, keepLines: true })));
  }
  return out;
}
function renderQuestion(it) {
  const out = [];
  const parts = Array.isArray(it.q) ? it.q : [it.q];
  parts.forEach((p, idx) => {
    if (p && p.table) {
      const cols = p.table[0].length; const cw = Math.min(1100, Math.floor((W - QIND) / cols));
      out.push(new Table({
        width: { size: cw * cols, type: WidthType.DXA }, columnWidths: Array(cols).fill(cw), layout: TableLayoutType.FIXED, indent: { size: QIND, type: WidthType.DXA },
        rows: p.table.map((r) => new TableRow({ children: r.map((c) => cell(c, cw, { size: 20, align: AlignmentType.CENTER })) })),
      }));
      out.push(spacer(60));
      return;
    }
    if (idx === 0) out.push(P([new TextRun({ text: `${it.no}.\t`, bold: true, font: FONT, size: 22 }), ...runs(p)], { indent: { left: QIND, hanging: QIND }, tabs: [{ type: TabStopType.LEFT, position: QIND }], after: 60, keepNext: true }));
    else out.push(P(p, { indent: { left: QIND }, after: 60, keepNext: true }));
  });
  return out.concat(renderOptions(it));
}
function renderStim(st, sec) {
  const last = (() => { let seen = false, cnt = 0; for (const it of sec.items) { if (it === st) { seen = true; continue; } if (!seen) continue; if (it.stim || it.part) break; if (it.q !== undefined) cnt++; } return st.from + cnt - 1; })();
  const ch = [P(st.stim.title.replace(/nomor \d+–\d+/, `nomor ${st.from}–${last}`), { bold: true, size: 20, color: NAVY, after: 80 })];
  st.stim.paras.forEach((t) => {
    if (t && t.table) {
      const cols = t.table[0].length; const cw = Math.floor((W - 400) / cols);
      ch.push(new Table({ width: { size: cw * cols, type: WidthType.DXA }, columnWidths: Array(cols).fill(cw), layout: TableLayoutType.FIXED,
        rows: t.table.map((r, ri) => new TableRow({ children: r.map((c) => cell(c, cw, { size: 18, bold: ri === 0 && !t.nohead, align: AlignmentType.CENTER, fill: c === "RAK" ? "F4B183" : (ri === 0 && !t.nohead ? "DCE6F2" : "FFFFFF") })) })) }));
      ch.push(spacer(60));
      return;
    }
    ch.push(st.stim.rtl ? P(t, { rtl: true, align: AlignmentType.RIGHT, after: 60, size: 24 }) : P(t, { size: 21, align: AlignmentType.JUSTIFIED, after: 70 }));
  });
  return [box(ch, "F7F9FC"), spacer(100)];
}
function sectionHeader(sec, idx, label = "SUBTES") {
  const info = `Waktu: ${sec.time} menit   •   Jumlah soal: ${sec.count ?? sec.items.length}   •   Relevansi: ${sec.relevance}`;
  return [new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: [W], layout: TableLayoutType.FIXED,
    rows: [
      new TableRow({ children: [cell(P(`${label} ${idx} — ${sec.title.toUpperCase()}`, { bold: true, color: "FFFFFF", size: 26, after: 0 }), W, { fill: NAVY, borders: NOBORDERS })] }),
      new TableRow({ children: [cell([P(info, { size: 18, after: 60 }), ...sec.instructions.map((t) => bullet(t, 0, { size: 18, after: 30 }))], W, { fill: LIGHT, borders: NOBORDERS })] }),
    ],
  }), spacer(160)];
}

// ---------- konten analisis ----------
const SCHOOLS = [
  {
    name: "MAN Insan Cendekia (MAN IC)",
    rows: [
      ["Penyelenggara & status", "Kementerian Agama RI melalui Seleksi Nasional Murid Baru (SNMB) Madrasah Unggulan (sebelumnya SNPDB) bersama MAN Program Keagamaan dan MAKN; madrasah negeri berasrama di berbagai provinsi (mis. MAN IC Serpong, Gorontalo, Pekalongan, Padang Pariaman)."],
      ["Skala persaingan", "29.327 pendaftar (2023); lebih dari 36–39 ribu peserta seleksi madrasah unggulan TP 2026/2027 (pemberitaan nasional)."],
      ["Jalur seleksi", "Jalur Prestasi (non-tes, kuota maksimal ±10%, disertai psikotes) dan Jalur Tes berbasis CBT."],
      ["Materi tes (siklus 2026)", "Tes Potensi Belajar (±90–100 menit): penelusuran bakat-minat/kepribadian, kemampuan numerik, verbal, dan penalaran analitik. Tes Akademik (±120 menit): penalaran matematika, literasi keislaman (PAI & moderasi beragama), dan literasi membaca (Bahasa Indonesia & Bahasa Inggris)."],
      ["Materi format sebelumnya", "2020–2024: Tes Akademik meliputi Matematika, IPA (Fisika–Biologi) atau IPS (Ekonomi–Sosiologi), Bahasa Inggris, PAI, dan Bahasa Arab. Pada 2020: Tes Potensi Belajar 50 butir + kepribadian 25 butir; Tes Akademik MAN IC 80 butir."],
      ["Jadwal acuan (2026)", "Pendaftaran jalur tes awal Januari–awal Februari 2026; uji coba CBT pertengahan Februari; pengumuman jalur tes ±6 Maret 2026. Jalur prestasi: psikotes ±7 Februari, pengumuman ±13 Februari 2026."],
      ["Ciri khas", "Kombinasi sains–keislaman, asrama penuh, tes serentak nasional berbasis komputer, bobot literasi/penalaran meningkat."],
    ],
  },
  {
    name: "SMA Labschool (Labschool UNJ — Jakarta/Kebayoran/Cibubur/Cirendeu, dll.)",
    rows: [
      ["Penyelenggara & status", "Badan Pengelola Sekolah Labschool UNJ; seleksi terpusat “PSB One Lab” yang dilaksanakan di setiap unit. Sekolah swasta non-asrama di bawah UNJ."],
      ["Skala persaingan", "2.628 peserta tes PSB SMA (2024); 3.605 peserta tes PSB SMA (2026)."],
      ["Jalur seleksi", "Jalur Prestasi (portofolio & rapor; diumumkan lebih awal) dan Jalur Tes. Peserta yang tidak lolos jalur prestasi masih dapat mengikuti jalur tes."],
      ["Materi tes", "Tes Kuantitatif, Tes Pemahaman Bacaan, Tes Verbal, Tes Akademik, dan Survei Karakter."],
      ["Format", "Computer Adaptive Test (CAT) yang dikembangkan Labschool UNJ; tes SMA 2026 berlangsung 08.00–11.30 WIB (±3,5 jam termasuk survei)."],
      ["Jadwal acuan (TP 2027/2028)", "Laman PSB resmi mencantumkan jalur prestasi SMA mulai 2 November 2026 dan jalur tes SMA mulai 8 Desember 2026 (perlu dikonfirmasi ulang di psb.labschool-unj.sch.id)."],
      ["Ciri khas", "Penalaran umum (verbal–kuantitatif–bacaan) sangat dominan; perhatian pada karakter dan kesehatan mental siswa."],
    ],
  },
  {
    name: "SMAN Unggulan M.H. Thamrin (SMANU MHT), Jakarta",
    rows: [
      ["Penyelenggara & status", "Dinas Pendidikan Provinsi DKI Jakarta; SMA negeri unggulan berasrama (boarding school)."],
      ["Skala persaingan", "Daya tampung TP 2026/2027 sekitar 88 murid (menurut beberapa sumber); pendaftar jauh melebihi kuota."],
      ["Jalur seleksi", "Prestasi (±10%, hanya peraih olimpiade/lomba berjenjang, tanpa tes akademik tetapi tetap verifikasi & wawancara), Afirmasi (±40–50%), dan Umum (±40%). Persentase berbeda antar-sumber."],
      ["Syarat akademik", "Nilai rapor Matematika, IPA, Bahasa Inggris (dan Bahasa Indonesia pada sebagian sumber) minimal 85 pada semester yang ditentukan."],
      ["Tahapan & materi", "Seleksi administrasi → tes akademik (Matematika, IPA, Bahasa Inggris) → psikotes (kesiapan hidup di asrama, ketahanan stres, stabilitas emosi) → wawancara siswa & orang tua. Peserta berperingkat teratas tes akademik (pernah disebut 350 besar) lanjut ke tahap berikutnya; urutan tahap dapat berbeda antartahun."],
      ["Jadwal acuan (2026)", "Pendaftaran daring 2–5 Februari 2026; seleksi jalur prestasi 2–6 Februari; pengumuman jalur afirmasi & umum sekitar 23 Februari 2026."],
      ["Ciri khas", "Fokus sains–matematika–bahasa Inggris dengan standar rapor tinggi; kesiapan berasrama dinilai serius."],
    ],
  },
  {
    name: "SMA Islam Al Azhar (YPI Al Azhar — mis. SMA IA 1 Kebayoran Baru, unit lainnya)",
    rows: [
      ["Penyelenggara & status", "Yayasan Pesantren Islam (YPI) Al Azhar; setiap unit menyelenggarakan Penerimaan Murid Baru (PMB) sendiri. Sekolah swasta Islam, umumnya non-asrama."],
      ["Skala persaingan", "Pendaftaran SMA IA 1 pernah ditutup lebih awal karena kuota terpenuhi; seleksi bergelombang."],
      ["Jalur seleksi", "Jalur Prestasi dan Jalur Tes Akademik (SMA IA 1, TP 2026/2027)."],
      ["Materi tes (bervariasi antarunit)", "Tes akademik (mis. Matematika, IPA, Bahasa Inggris), tes baca Al-Qur'an, tes bacaan salat, psikotes, dan wawancara. Contoh: SMA IA 20 Kembangan (tes baca Al-Qur'an, bacaan salat, tes akademik termasuk Bahasa Inggris, wawancara); SMA IA Kelapa Gading (tes akademik, psikotes, wawancara)."],
      ["Jadwal acuan", "Umumnya dibuka lebih awal daripada sekolah negeri (open house, gelombang); jadwal berbeda tiap unit."],
      ["Ciri khas", "Keseimbangan akademik dan keislaman praktis (tilawah, ibadah); wawancara orang tua sering menjadi bagian proses."],
    ],
  },
];

const MATRIX = [
  ["Komponen / Materi", "MAN IC", "Labschool", "SMANU MHT", "Al Azhar"],
  ["Potensi akademik: verbal", "●", "●", "◐", "◐"],
  ["Potensi akademik: numerik/kuantitatif", "●", "●", "◐", "◐"],
  ["Penalaran logis & analitik", "●", "●", "◐", "◐"],
  ["Literasi membaca (B. Indonesia)", "●", "●", "–", "◐"],
  ["Matematika", "●", "●", "●", "●"],
  ["IPA (Fisika, Kimia, Biologi)", "◐", "◐", "●", "◐"],
  ["Bahasa Inggris", "●", "◐", "●", "●"],
  ["IPS", "◐", "–", "–", "–"],
  ["PAI & literasi keislaman", "●", "–", "–", "●"],
  ["Bahasa Arab", "◐", "–", "–", "–"],
  ["Psikotes / survei karakter", "●", "●", "●", "●"],
  ["Tes baca Al-Qur'an & praktik ibadah", "◐", "–", "–", "●"],
  ["Wawancara (siswa/orang tua)", "◐", "–", "●", "●"],
  ["Format berbasis komputer", "● CBT", "● CAT", "◐", "◐"],
  ["Berasrama", "Ya", "Tidak", "Ya", "Umumnya tidak"],
];

const FINDINGS = [
  "Irisan terbesar keempat sekolah adalah Matematika/penalaran kuantitatif dan Bahasa Inggris. Kedua bidang ini menjadi prioritas utama latihan dan diberi porsi butir terbesar dalam tryout.",
  `Terjadi pergeseran dari hafalan materi ke penalaran dan literasi berbasis stimulus. MAN IC (2026) merumuskan tes akademik sebagai penalaran matematika, literasi keislaman, dan literasi membaca; Labschool menekankan tes kuantitatif, verbal, dan pemahaman bacaan. Karena itu ${HOTS_PCT}% butir tryout disusun pada level penalaran (HOTS) dan sebagian besar sisanya pada level aplikasi berbasis konteks.`,
  "Format tes sudah berbasis komputer (CBT di MAN IC, CAT adaptif di Labschool). Pada CAT, tingkat kesulitan butir menyesuaikan jawaban sebelumnya, sehingga ketelitian di butir-butir awal sangat menentukan. Tryout ini sebaiknya juga dijalankan dalam mode CBT (mis. diunggah ke LMS/Google Form/CBT sekolah).",
  "Komponen non-kognitif makin menentukan: psikotes, survei karakter, kesiapan hidup berasrama, dan wawancara siswa–orang tua. Paket ini menyertakan simulasi survei karakter, rubrik tes baca Al-Qur'an, dan simulasi wawancara.",
  "Setiap sekolah memiliki kekhasan: MAN IC dan Al Azhar menuntut kompetensi keislaman (PAI, tilawah, bahasa Arab untuk MAN IC); SMANU MH Thamrin menuntut Matematika–IPA–Bahasa Inggris yang kuat dengan prasyarat rapor ≥85; Labschool menuntut penalaran umum dan karakter.",
  "Rasio keketatan sangat tinggi (puluhan ribu peserta untuk madrasah unggulan; ±88 kursi SMANU; ±3.600 peserta Labschool). Tryout perlu diikuti analisis butir dan program remedial terarah, bukan sekadar skor total.",
  "Arah soal seleksi sejalan dengan standar internasional (PISA, TIMSS) dan asesmen nasional (AKM, TKA SMP). Rata-rata skor PISA 2025 Indonesia masih berada di sekitar Level 1a, sedangkan sekolah unggulan menjaring siswa jauh di atas rata-rata. Karena itu paket ini ditambah Subtes 9 bermodel unit PISA/TIMSS dan setiap butir diberi kualifikasi internasional (domain kognitif TIMSS dan estimasi level PISA).",
];

const BLUEPRINT_PROFILES = [
  ["MAN IC", "TPA, Literasi B. Indonesia, Matematika, IPA atau IPS, B. Inggris, PAI, B. Arab, Survei Karakter, Tes Baca Al-Qur'an"],
  ["SMA Labschool", "TPA (verbal & kuantitatif), Literasi B. Indonesia (pemahaman bacaan), Matematika, IPA, B. Inggris, Survei Karakter"],
  ["SMANU MH Thamrin", "Matematika, IPA, B. Inggris (inti); TPA (pendukung psikotes); Survei Karakter; Simulasi Wawancara"],
  ["SMA Al Azhar", "TPA, Matematika, IPA, B. Inggris, Literasi B. Indonesia, PAI, Tes Baca Al-Qur'an & praktik ibadah, Simulasi Wawancara"],
  ["Semua sekolah", "Subtes 9 Literasi Standar Internasional (wajib untuk target MAN IC & Labschool; sangat dianjurkan untuk SMANU & Al Azhar)"],
];

const WEIGHTS = {
  cols: ["TPA", "BIN", "MAT", "IPA", "ING", "IPS", "PAI", "ARB"],
  rows: [
    ["MAN IC", [25, 10, 20, "10*", 15, "10*", 15, 5]],
    ["SMA Labschool", [30, 20, 20, 15, 15, 0, 0, 0]],
    ["SMANU MH Thamrin", [0, 0, 35, 35, 30, 0, 0, 0]],
    ["SMA Al Azhar", [15, 10, 25, 15, 20, 0, 15, 0]],
  ],
};

const SOURCES = [
  ["SNMB 2026 – MAN Insan Cendekia Pekalongan", "https://icp.sch.id/snpdb/"],
  ["detikEdu – Seleksi Murid Baru MAN IC Serpong 2026 Dibuka", "https://www.detik.com/edu/sekolah/d-8292379/seleksi-murid-baru-man-ic-serpong-2026-dibuka-cek-jadwal-syaratnya"],
  ["detikEdu – Tes SNPDB MAN Unggulan, Cek Materi Seleksi", "https://www.detik.com/edu/sekolah/d-7210878/siap-siap-tes-snpdb-man-unggulan-bakal-digelar-2-maret-cek-materi-seleksi-di-sini"],
  ["Gebrak.id – MAN IC Serpong Jadi Incaran, Ini Jadwal", "https://www.gebrak.id/2025/12/man-ic-serpong-jadi-incaran-ini-jadwal.html"],
  ["GNFI – Seleksi Masuk MAN Unggulan 2026/2027 Tembus 36 Ribu Peserta", "https://www.goodnewsfromindonesia.id/short/seleksi-masuk-man-unggulan-2026-2027-tembus-36-ribu-peserta"],
  ["Media Indonesia – 15.019 Siswa Ikut Seleksi Masuk MAN (2020)", "https://mediaindonesia.com/humaniora/291732/15019-siswa-mtssmp-ikut-seleksi-masuk-madrasah-aliyah-negeri"],
  ["NU Online – 29.327 Pendaftar Madrasah Aliyah Unggulan (2023)", "https://www.nu.or.id/nasional/ada-29-327-pendaftar-pada-2023-madrasah-aliyah-unggulan-makin-diminati-masyarakat-nQR4i"],
  ["Labschool UNJ – Tes Seleksi PSB SMA Labschool UNJ 2026", "https://labschool-unj.sch.id/ribuan-calon-siswa-ikuti-tes-seleksi-psb-sma-labschool-unj-2026-secara-terpadu/"],
  ["PSB Labschool UNJ – FAQ Jalur Tes", "https://psb.labschool-unj.sch.id/faq-psb-labschool-2/"],
  ["PSB Labschool UNJ – Info Jalur Prestasi SMA 2026", "https://psb.labschool-unj.sch.id/info-daftar-jalur-prestasi-sma-2026/"],
  ["Medcom – 3.605 Peserta Berebut Kursi di SMA Labschool UNJ", "https://www.medcom.id/pendidikan/news-pendidikan/5b2y7YeN-3-605-peserta-berebut-kursi-di-sma-labschool-unj-begini-suasana-tes-masuknya"],
  ["Bisnis.com – Seleksi Ketat di PSB 2026, Labschool UNJ", "https://kabar24.bisnis.com/read/20260208/79/1951093/seleksi-ketat-di-psb-2026-labschool-unj-soroti-keseimbangan-akademik-dan-mental"],
  ["Republika – 2.628 Peserta Tes PSB SMA Labschool UNJ (2024)", "https://news.republika.co.id/berita/s8dg6g320/sebanyak-2628-peserta-bersaing-dalam-tes-psb-sma-labschool-unj"],
  ["Medcom – SPMB SMANU M.H. Thamrin 2026: Syarat, Jalur, Kuota, Jadwal", "https://www.medcom.id/pendidikan/news-pendidikan/PNg1OR9k-spmb-smanu-m-h-thamrin-2026-segera-dibuka-ini-syarat-jalur-kuota-hingga-jadwalnya"],
  ["detikEdu – SPMB SMAN Unggulan MH Thamrin Dibuka 2–5 Februari 2026", "https://www.detik.com/edu/sekolah/d-8327829/spmb-sman-unggulan-mh-thamrin-dibuka-2-5-februari-2026-persiapkan-dokumennya"],
  ["detikEdu – Syarat PPDB SMAN Unggulan MH Thamrin 2023", "https://www.detik.com/edu/sekolah/d-6554220/syarat-ppdb-sman-unggulan-mh-thamrin-2023-siswa-simak-ya/amp"],
  ["Bintang Pelajar – Panduan Masuk SMANU MH Thamrin 2026", "https://www.bintangpelajar.com/syarat-masuk-smanu-mh-thamrin-panduan-lengkap-untuk-ayah-bunda/"],
  ["PLC Pekanbaru – Kuota Penerimaan SMANU M.H. Thamrin 2026/2027", "https://www.plcpekanbaru.com/artikel/detail/788/cek-kuota-penerimaan-sman-unggulan-mh-thamrin-20262027-mengapa-persaingannya-sangat-ketat"],
  ["SMA Islam Al Azhar 1 – Pendaftaran Murid Baru Ditutup Setelah Kuota Terpenuhi", "https://smaia1.al-azhar.sch.id/antusiasme-tinggi-pendaftaran-murid-baru-sma-islam-al-azhar-1-ditutup-setelah-kuota-terpenuhi/"],
  ["SMA Islam Al Azhar 1 – Pengumuman", "https://smaia1.al-azhar.sch.id/pengumuman/"],
  ["Al Azhar Kembangan – Tes PMB SMA Islam Al Azhar 20", "https://www.alazhar-kembangan.sch.id/berita/sma/tes-penerimaan-murid-baru-sma-islam-al-azhar-20-kembangan-tahun-pelajaran-2024-2025/a97da629b098b75c294dffdc3e463904"],
  ["Jurnal Ridwan Institute – Seleksi Siswa SMA Islam Al-Azhar Kelapa Gading", "https://arl.ridwaninstitute.co.id/index.php/arl/article/download/162/109/834"],
  ["OECD – PISA 2025 Results (Volume I): What is PISA", "https://www.oecd.org/en/publications/pisa-2025-results-volume-i_73451bc5-en/full-report/what-is-pisa_d18121f2.html"],
  ["OECD – Siaran pers PISA 2025 (8 September 2026)", "https://oecd.org/en/about/news/press-releases/2026/09/pisa-2025-students-reading-and-mathematics-performance-declined-sharply-across-the-oecd.html"],
  ["Education International – What you need to know about PISA 2025", "https://www.ei-ie.org/en/item/32893:what-you-need-to-know-about-pisa-2025"],
  ["Scottish Government – PISA 2025 National Report (kerangka sains 2025)", "https://www.gov.scot/publications/pisa-2025-national-report-scotland/pages/5/"],
  ["OECD – PISA 2025 Science Framework (draf)", "https://www.fisme.science.uu.nl/publicaties/literatuur/PISA_2025_Science_Framework.pdf"],
  ["Info Pendidikan BIC – Hasil PISA 2025 Indonesia", "https://infopendidikan.bic.id/hasil-pisa-2025-indonesia/"],
  ["Bisnis.com – Skor PISA 2025 Indonesia Masih di Bawah Rata-rata OECD", "https://kabar24.bisnis.com/read/20260911/79/2003323/skor-pisa-2025-indonesia-masih-di-bawah-rata-rata-oecd"],
  ["OECD – PISA 2022 Results Country Note: Indonesia", "https://www.oecd.org/en/publications/pisa-2022-results-volume-i-and-ii-country-notes_ed6fbcc5-en/indonesia_c2e1ae0e-en.html"],
  ["TIMSS 2023 – Content and Cognitive Domains (Grade 8)", "https://timss2023.org/?p=11845"],
  ["TIMSS 2023 Frameworks – Mathematics", "https://elvis.bc.edu/timss2023/frameworks/pdf/T23_Frameworks_Ch1_Mathematics.pdf"],
  ["Kompas TV – Hasil TKA dapat digunakan untuk jalur prestasi SPMB 2026/2027", "https://www.kompas.tv/info-publik/647057/kemendikdasmen-hasil-tka-bisa-digunakan-untuk-jalur-prestasi-spmb-2026-2027"],
  ["JPNN – Jadwal TKA 2026 jenjang SD dan SMP, jumlah soal & durasi", "https://www.jpnn.com/news/jadwal-tka-2026-jenjang-sd-dan-smp-jumlah-soal-durasinya"],
];

// ---------- perakitan dokumen ----------
const NI = SECTIONS.length; // nomor dasar instrumen non-kognitif
const body = [];

// Sampul
body.push(spacer(1400));
body.push(P("PAKET TRYOUT 1", { bold: true, size: 30, color: BLUE, align: AlignmentType.CENTER, after: 120 }));
body.push(P("SELEKSI MASUK SMA/MA UNGGULAN", { bold: true, size: 48, color: NAVY, align: AlignmentType.CENTER, after: 80 }));
body.push(P("Tahun Pelajaran 2027/2028", { bold: true, size: 30, color: NAVY, align: AlignmentType.CENTER, after: 360 }));
body.push(P("Disusun berdasarkan analisis sistem dan materi seleksi:", { size: 22, align: AlignmentType.CENTER, after: 80 }));
body.push(P("MAN Insan Cendekia  •  SMA Labschool UNJ  •  SMAN Unggulan M.H. Thamrin  •  SMA Islam Al Azhar", { bold: true, size: 22, align: AlignmentType.CENTER, after: 480 }));
body.push(table([
  ["Sasaran", "Siswa kelas IX SMP/MTs (calon peserta seleksi TP 2027/2028)"],
  ["Isi paket", `${SECTIONS.length} subtes kognitif (${TOTAL_ITEMS} butir pilihan ganda + ${INTL.essays.length} uraian model PISA) + 3 instrumen non-kognitif`],
  ["Standar acuan", "Profil seleksi 4 sekolah + kualifikasi internasional PISA 2025 & TIMSS 2023 (domain kognitif, estimasi level PISA)"],
  ["Total waktu tes tertulis", `${TOTAL_TIME} menit (disarankan dalam 2 hari) + tes baca Al-Qur'an & wawancara individual`],
  ["Kelengkapan", "Analisis seleksi, kisi-kisi, naskah soal, lembar jawaban, kunci & pembahasan, pedoman skor"],
], [2600, W - 2600], { firstColFill: true, boldFirstCol: true, size: 20 }));
body.push(spacer(400));
body.push(P("IDENTITAS PESERTA", { bold: true, size: 22, color: NAVY, after: 80 }));
body.push(table([
  ["Nama lengkap", ""], ["Asal sekolah", ""], ["Nomor peserta", ""], ["Sekolah tujuan utama", "☐ MAN IC   ☐ SMA Labschool   ☐ SMANU MH Thamrin   ☐ SMA Al Azhar"],
], [2600, W - 2600], { firstColFill: true, boldFirstCol: true, size: 20 }));

// Isi dokumen (statis)
body.push(H1("Isi Dokumen"));
[
  "Bagian I — Analisis Data Tes Masuk Empat Sekolah Unggulan & Kualifikasi Standar Internasional (PISA 2025, TIMSS)",
  "Bagian II — Spesifikasi & Kisi-kisi Tryout 1",
  `Bagian III — Naskah Soal (Subtes 1–${SECTIONS.length}, termasuk Subtes ${SECTIONS.length} model PISA/TIMSS)`,
  "Bagian IV — Instrumen Non-Kognitif (Survei Karakter, Tes Baca Al-Qur'an, Simulasi Wawancara)",
  "Bagian V — Lembar Jawaban",
  "Bagian VI — Kunci Jawaban & Pembahasan",
  "Bagian VII — Pedoman Penskoran, Interpretasi & Analisis Hasil",
  "Rujukan Sumber Data",
].forEach((t) => body.push(numbered(t)));
body.push(spacer(200));
body.push(box([
  P("Cara menggunakan paket ini", { bold: true, color: NAVY, after: 80 }),
  bullet("Guru/pengelola bimbingan: pelajari Bagian I–II untuk memahami arah seleksi, lalu gandakan Bagian III–V untuk peserta. Bagian VI–VII disimpan terpisah sebagai dokumen penilai.", 0, { size: 20 }),
  bullet("Peserta dapat mengikuti paket lengkap (simulasi semua sekolah) atau paket modular sesuai sekolah tujuan (lihat Bagian II.3).", 0, { size: 20 }),
  bullet("Posisi kunci jawaban telah diacak dan diseimbangkan (A–D) sehingga tidak dapat ditebak dari pola.", 0, { size: 20 }),
  bullet("Butir dapat diunggah ke CBT/LMS sekolah agar pengalaman tes mendekati format CBT (MAN IC) dan CAT (Labschool).", 0, { size: 20 }),
]));

// BAGIAN I — Analisis
body.push(H1("Bagian I — Analisis Data Tes Masuk & Kualifikasi Standar Internasional"));
body.push(H2("1.1 Ringkasan Eksekutif"));
body.push(P("Analisis ini menghimpun informasi publik (laman resmi sekolah, pemberitaan nasional, dan publikasi ilmiah) tentang sistem seleksi dan materi tes keempat sekolah pada siklus 2023–2026, lalu memadukannya dengan kerangka asesmen internasional (PISA 2025 dan TIMSS 2023) untuk menyusun spesifikasi tryout. Lima kesimpulan utama:", { align: AlignmentType.JUSTIFIED }));
[
  "Semua sekolah memakai seleksi bertahap: jalur prestasi dan jalur tes, dengan kombinasi tes kognitif (potensi/akademik) dan non-kognitif (psikotes, survei karakter, wawancara, atau tes keagamaan).",
  "Matematika/penalaran kuantitatif dan Bahasa Inggris adalah materi yang diuji di keempat sekolah; potensi akademik (verbal, numerik, penalaran) dan literasi membaca diuji eksplisit di MAN IC dan Labschool.",
  "Kekhasan: MAN IC dan Al Azhar menambahkan dimensi keislaman; SMANU MH Thamrin menekankan Matematika–IPA–Bahasa Inggris dengan prasyarat rapor ≥85 serta kesiapan berasrama.",
  "Soal seleksi sekolah unggulan makin serupa dengan asesmen internasional: berbasis stimulus, menuntut penalaran, dan dikerjakan di komputer. Hasil PISA 2025 menempatkan rata-rata siswa Indonesia di sekitar Level 1a, sehingga calon siswa unggulan perlu dilatih hingga Level 3–4 ke atas.",
  `Tryout 1 dirancang sebagai paket komposit: ${SECTIONS.length} subtes kognitif, ${TOTAL_ITEMS} butir (${HOTS_PCT}% level penalaran/HOTS), ditambah simulasi survei karakter, tes baca Al-Qur'an, dan wawancara.`,
].forEach((t) => body.push(bullet(t)));

body.push(H2("1.2 Profil Sistem Seleksi per Sekolah"));
SCHOOLS.forEach((s) => {
  body.push(H3(s.name));
  body.push(table(s.rows, [2400, W - 2400], { firstColFill: true, boldFirstCol: true, size: 19 }));
  body.push(spacer(160));
});

body.push(H2("1.3 Matriks Perbandingan Komponen & Materi Seleksi"));
body.push(P("Keterangan: ● diujikan secara eksplisit pada siklus terbaru; ◐ diujikan sebagian, bervariasi antarunit/antartahun, atau tercakup secara tidak langsung (mis. dalam psikotes); – tidak teridentifikasi dalam sumber.", { size: 19, italics: true }));
body.push(table(MATRIX, [3238, 1600, 1600, 1600, 1600], { header: true, center: true, zebra: true, size: 19 }));
body.push(spacer(160));

body.push(H2("1.4 Temuan Analitis & Implikasi bagi Persiapan"));
FINDINGS.forEach((t, i) => body.push(P([new TextRun({ text: `Temuan ${i + 1}. `, bold: true, font: FONT, size: 22, color: NAVY }), ...runs(t)], { align: AlignmentType.JUSTIFIED, after: 120 })));

body.push(H2("1.5 Perkiraan Kalender Seleksi TP 2027/2028"));
body.push(P("Disusun dari pola siklus 2026. Tanggal pasti wajib dicek di laman resmi masing-masing sekolah.", { size: 19, italics: true }));
body.push(table([
  ["Sekolah", "Pola waktu (berdasarkan siklus 2026)", "Implikasi persiapan"],
  ["SMA Labschool", "Jalur prestasi mulai November 2026; jalur tes SMA dibuka Desember 2026; tes sekitar akhir Januari–awal Februari 2027", "Paling awal — tryout 1 idealnya selesai paling lambat Desember 2026"],
  ["SMA Al Azhar", "PMB bergelombang, sering dibuka lebih awal dan ditutup saat kuota penuh", "Pantau open house; siapkan tilawah & bacaan salat sejak dini"],
  ["MAN IC", "Pendaftaran Januari–awal Februari 2027; CBT pertengahan–akhir Februari; pengumuman sekitar Maret 2027", "Tryout 2–3 sebaiknya pada Januari 2027 dengan format CBT"],
  ["SMANU MH Thamrin", "Pendaftaran awal Februari 2027; tes akademik, psikotes, wawancara Februari 2027", "Pastikan nilai rapor Matematika, IPA, B. Inggris, B. Indonesia ≥85"],
], [2000, 4238, 3400], { header: true, size: 19 }));
body.push(spacer(160));

body.push(H2("1.6 Kualifikasi Standar Internasional: PISA 2025, TIMSS 2023 & Asesmen Nasional"));
body.push(P("Sekolah unggulan menyeleksi siswa terbaik dari populasi nasional. Karena itu, tingkat kesulitan dan karakter soal tryout perlu dikalibrasi tidak hanya terhadap kurikulum SMP/MTs, tetapi juga terhadap standar internasional yang mengukur kemampuan menggunakan pengetahuan dalam konteks nyata. Dua rujukan utama adalah PISA (OECD; siswa usia 15 tahun—tepat usia calon siswa SMA) dan TIMSS (IEA; siswa kelas 8).", { align: AlignmentType.JUSTIFIED }));
body.push(H3("a. PISA 2025 — fakta kunci"));
body.push(table([
  ["Aspek", "Keterangan"],
  ["Rilis hasil", "Volume I diluncurkan OECD pada 8 September 2026. Laporan English as a Foreign Language dijadwalkan April 2027 dan laporan Learning in the Digital World Mei 2027."],
  ["Domain", "Sains sebagai domain utama; Membaca dan Matematika sebagai domain minor; Learning in the Digital World (domain inovatif baru, dinilai pertama kali); English as a Foreign Language (opsional, 22 negara/ekonomi)."],
  ["Kompetensi sains 2025", "(1) Menjelaskan fenomena secara ilmiah; (2) Merancang dan mengevaluasi penyelidikan ilmiah serta menafsirkan data dan bukti secara kritis; (3) Meneliti, mengevaluasi, dan menggunakan informasi ilmiah untuk pengambilan keputusan dan tindakan. Dibingkai dalam gagasan agency in the Anthropocene (kepedulian dan kemampuan bertindak atas isu lingkungan)."],
  ["Proses matematika", "Merumuskan situasi secara matematis (formulate), menerapkan konsep dan prosedur (employ), menafsirkan dan mengevaluasi hasil (interpret), dengan penalaran matematis sebagai inti. Kategori isi: Quantity, Change & Relationships, Space & Shape, Uncertainty & Data."],
  ["Proses membaca", "Menemukan informasi; memahami (makna literal dan inferensi); mengevaluasi dan merefleksi (termasuk menilai kredibilitas dan teks multisumber)."],
  ["Learning in the Digital World", "Kemampuan membangun pengetahuan dan memecahkan masalah secara iteratif dan mandiri dengan alat serta praktik komputasional (berpikir komputasional, menguji dan memperbaiki solusi)."],
  ["Format butir", "Berbasis komputer; satu stimulus (unit) diikuti beberapa soal; pilihan ganda sederhana/kompleks dan respons terbuka yang dinilai dengan kode skor penuh, sebagian, atau nol."],
], [2400, W - 2400], { header: true, size: 18, boldFirstCol: true }));
body.push(spacer(120));
body.push(H3("b. Capaian Indonesia dan level kecakapan"));
body.push(table([
  ["Domain", "Skor PISA 2025", "Perubahan dari 2022", "Estimasi level rata-rata", "% siswa ≥ Level 2 (PISA 2022)"],
  ["Membaca", "365", "naik 7 poin*", "Level 1a", "25% (OECD 74%)"],
  ["Sains", "389", "naik 6 poin*", "Level 1a", "34% (OECD 76%)"],
  ["Matematika", "364", "turun 2 poin*", "Level 1a", "18% (OECD 69%)"],
], [1800, 1600, 1900, 1900, 2438], { header: true, center: true, size: 18, boldFirstCol: true }));
body.push(P("* Menurut OECD, perubahan 2022–2025 tersebut tidak signifikan secara statistik. Skor Indonesia masih di bawah rata-rata OECD pada ketiga domain.", { size: 17, italics: true, before: 40 }));
body.push(spacer(80));
body.push(table([
  ["Level PISA Matematika", "Batas bawah skor (≈)", "Gambaran kemampuan", "Posisi dalam tryout ini"],
  ["Level 1a", "358", "Menjawab soal dengan konteks akrab, informasi lengkap, dan prosedur rutin yang diminta secara langsung.", "Di bawah sasaran"],
  ["Level 2 (baseline)", "420", "Mengenali situasi yang memerlukan representasi matematis sederhana tanpa petunjuk langsung; menafsirkan hasil secara harfiah.", "Kecakapan minimum"],
  ["Level 3", "482", "Menjalankan prosedur bertahap, memilih strategi sederhana, dan menafsirkan berbagai representasi.", "Sasaran minimum calon siswa unggulan"],
  ["Level 4", "545", "Bekerja dengan model eksplisit pada situasi kompleks, memadukan representasi, dan memberi penjelasan berargumen.", "Sasaran kompetitif (MAN IC, SMANU, Labschool)"],
  ["Level 5–6", "607 / 669", "Mengembangkan dan mengevaluasi model untuk situasi baru, bernalar dan menggeneralisasi, serta mengomunikasikan argumen secara presisi.", "Unggul/setara peserta olimpiade"],
], [1700, 1300, 4238, 2400], { header: true, size: 18, boldFirstCol: true }));
body.push(P("Sasaran level di kolom terakhir adalah rekomendasi penyusun untuk calon siswa sekolah unggulan, bukan ketentuan resmi.", { size: 17, italics: true, before: 40 }));
body.push(H3("c. TIMSS 2023 dan asesmen nasional yang serumpun"));
[
  "TIMSS (kelas 8) mengelompokkan tuntutan berpikir ke dalam tiga domain kognitif: Mengetahui (Knowing), Menerapkan (Applying), dan Menalar (Reasoning). Target proporsi TIMSS 2023 kelas 8: Matematika 35% : 40% : 25%; Sains 35% : 35% : 30%.",
  "Pada tryout ini, level L1/L2/L3 dipetakan langsung ke domain TIMSS Mengetahui/Menerapkan/Menalar, dan diestimasi setara PISA Level 1–2, Level 2–3, dan Level 4–5.",
  "Di dalam negeri, Asesmen Nasional (AKM) mengukur literasi dan numerasi dengan kerangka yang serupa. Tes Kemampuan Akademik (TKA) SMP 2026 menguji Bahasa Indonesia dan Matematika berbasis komputer (±130 menit), dan hasilnya dapat digunakan pada jalur prestasi akademik SPMB.",
].forEach((t) => body.push(bullet(t, 0, { size: 20 })));
body.push(H3("d. Pemetaan subtes ke kerangka internasional"));
body.push(table([
  ["Subtes", "Kerangka internasional acuan", "Cara kualifikasi butir"],
  ["1. TPA", "PISA Membaca (penalaran verbal) & PISA Matematika (penalaran kuantitatif, logis, spasial)", "Domain TIMSS + estimasi level PISA"],
  ["2. Literasi B. Indonesia", "PISA Reading Literacy: menemukan, memahami, mengevaluasi & merefleksi", "Proses membaca PISA per butir"],
  ["3. Matematika", "PISA Mathematical Literacy & TIMSS Mathematics Grade 8", "Kategori isi PISA/TIMSS + proses formulate/employ"],
  ["4. IPA", "PISA 2025 Scientific Literacy & TIMSS Science Grade 8", "Kompetensi sains PISA 2025 + domain isi TIMSS"],
  ["5. Bahasa Inggris", "PISA 2025 English as a Foreign Language; CEFR A2–B1", "Reading (PISA FLA) atau level CEFR"],
  ["6. IPS", "Literasi sosial–kewargaan (sejalan IEA ICCS)", "Domain kognitif + konteks"],
  ["7. PAI", "OECD Global Competence (sikap terhadap keberagaman) untuk butir moderasi beragama", "Domain kognitif; butir lain berbasis kurikulum madrasah"],
  ["8. Bahasa Arab", "Pembanding CEFR A1–A2", "Domain kognitif"],
  [`${NI}. Literasi Internasional`, "Replika unit PISA 2025 (Sains, Matematika, Membaca multisumber, Learning in the Digital World, English FLA) & TIMSS", "Kerangka, proses, konteks, dan format per butir; uraian dengan kode PISA"],
], [2200, 4538, 2900], { header: true, size: 18, boldFirstCol: true }));
body.push(spacer(120));

body.push(H2("1.7 Catatan Validitas Data"));
[
  "Data berasal dari sumber publik 2020–2026; sebagian besar berupa pemberitaan dan laman sekolah, bukan dokumen petunjuk teknis resmi yang lengkap. Angka kuota dan urutan tahapan SMANU MH Thamrin berbeda antarsumber.",
  "Materi SMA Al Azhar bervariasi antarunit; profil di atas merupakan sintesis dari beberapa unit.",
  "Butir soal dalam paket ini adalah butir orisinal yang disusun mengikuti karakteristik materi dan level kognitif, bukan salinan soal asli seleksi.",
  "Bobot penilaian dan ambang kesiapan pada Bagian VII adalah bobot simulasi penyusun, bukan ketentuan resmi sekolah.",
  "Kualifikasi PISA/TIMSS pada setiap butir adalah estimasi penyusun berdasarkan karakter butir. Skor tryout tidak dapat dikonversi secara langsung menjadi skor PISA resmi, karena PISA memakai skala hasil kalibrasi internasional.",
].forEach((t) => body.push(bullet(t, 0, { size: 20 })));

// BAGIAN II — Spesifikasi
body.push(H1("Bagian II — Spesifikasi & Kisi-kisi Tryout 1"));
body.push(H2("2.1 Struktur Paket"));
const specRows = [["Subtes", "Nama subtes", "Butir", "Waktu", "Relevansi sekolah"]];
SECTIONS.forEach((s, i) => specRows.push([String(i + 1), s.title, s.essays ? `${s.count} PG + ${s.essays.length} uraian` : String(s.count), `${s.time}′`, s.relevance]));
specRows.push([String(NI + 1), NK.survey.title, String(NK.survey.items.length), `${NK.survey.time}′`, NK.survey.relevance]);
specRows.push([String(NI + 2), "Tes Baca Al-Qur'an & Praktik Ibadah", "5 tugas", "±10′/peserta", NK.quran.relevance]);
specRows.push([String(NI + 3), "Simulasi Wawancara", `${NK.interview.student.length} + ${NK.interview.parent.length} pertanyaan`, "±15′/peserta", NK.interview.relevance]);
specRows.push(["", "TOTAL tes tertulis kognitif", String(TOTAL_ITEMS), `${TOTAL_TIME - NK.survey.time}′`, "+ survei karakter 15′"]);
body.push(table(specRows, [800, 2900, 1000, 1000, 3938], { header: true, size: 18 }));
body.push(spacer(160));

body.push(H2("2.2 Distribusi Level Kognitif"));
const lv = SECTIONS.map((s) => { const c = { 1: 0, 2: 0, 3: 0 }; s.items.forEach((it) => { if (it.q !== undefined) c[it.l]++; }); return [s, c]; });
const tot = { 1: 0, 2: 0, 3: 0 }; lv.forEach(([, c]) => [1, 2, 3].forEach((k) => (tot[k] += c[k])));
const lvRows = [["Subtes", "L1 Pemahaman", "L2 Aplikasi", "L3 Penalaran", "% L3 (HOTS)"]];
lv.forEach(([s, c]) => lvRows.push([s.title, String(c[1]), String(c[2]), String(c[3]), `${Math.round((c[3] / s.count) * 100)}%`]));
lvRows.push(["TOTAL", String(tot[1]), String(tot[2]), String(tot[3]), `${Math.round((tot[3] / TOTAL_ITEMS) * 100)}%`]);
body.push(table(lvRows, [3838, 1450, 1450, 1450, 1450], { header: true, center: true, size: 18 }));
body.push(P(`Proporsi keseluruhan: L1 ${Math.round((tot[1] / TOTAL_ITEMS) * 100)}% • L2 ${Math.round((tot[2] / TOTAL_ITEMS) * 100)}% • L3 ${Math.round((tot[3] / TOTAL_ITEMS) * 100)}%. Komposisi ini meniru karakter seleksi unggulan yang menempatkan penalaran dan literasi sebagai pembeda utama.`, { size: 19, before: 80 }));
body.push(H3("Perbandingan dengan target domain kognitif TIMSS 2023 (kelas 8)"));
const pct = (c, n) => `${Math.round((c / n) * 100)}%`;
const cmpRow = (label, id, target) => { const [sec, c] = lv.find(([s]) => s.id === id); return [label, `${pct(c[1], sec.count)} : ${pct(c[2], sec.count)} : ${pct(c[3], sec.count)}`, target]; };
body.push(table([
  ["Bidang", "Tryout ini (Mengetahui : Menerapkan : Menalar)", "Target TIMSS 2023 kelas 8"],
  cmpRow("Matematika (Subtes 3)", "MAT", "35% : 40% : 25%"),
  cmpRow("IPA (Subtes 4)", "IPA", "35% : 35% : 30%"),
  cmpRow(`Literasi Internasional (Subtes ${NI})`, "INT", "– (model PISA)"),
  ["Seluruh paket", `${pct(tot[1], TOTAL_ITEMS)} : ${pct(tot[2], TOTAL_ITEMS)} : ${pct(tot[3], TOTAL_ITEMS)}`, "–"],
], [2600, 4238, 2800], { header: true, center: true, size: 18, boldFirstCol: true }));
body.push(P("Subtes Matematika sengaja diberi porsi penalaran lebih besar daripada TIMSS karena seleksi sekolah unggulan menyaring siswa di atas rata-rata; porsi Mengetahui yang kecil menjadi penanda bahwa hafalan rumus saja tidak cukup. Subtes IPA mendekati proporsi TIMSS dengan penekanan pada penerapan konsep.", { size: 19, before: 60, align: AlignmentType.JUSTIFIED }));

body.push(H2("2.3 Paket Modular & Jadwal Pelaksanaan"));
body.push(table([["Sekolah tujuan", "Subtes/instrumen yang dikerjakan"], ...BLUEPRINT_PROFILES], [2400, W - 2400], { header: true, size: 19, boldFirstCol: true }));
body.push(spacer(140));
body.push(table([
  ["Hari/Sesi", "Kegiatan", "Durasi"],
  ["Hari 1 – Sesi 1", "Subtes 1: TPA", "60 menit"],
  ["Hari 1 – Sesi 2", "Subtes 2: Literasi Membaca & Bahasa Indonesia", "30 menit"],
  ["", "Istirahat", "15 menit"],
  ["Hari 1 – Sesi 3", "Subtes 3: Matematika", "50 menit"],
  ["Hari 1 – Sesi 4", "Subtes 4: IPA", "60 menit"],
  ["Hari 2 – Sesi 5", "Subtes 5: Bahasa Inggris", "40 menit"],
  ["Hari 2 – Sesi 6", "Subtes 6: IPS (peminatan)", "25 menit"],
  ["Hari 2 – Sesi 7", "Subtes 7: PAI & Literasi Keislaman", "25 menit"],
  ["Hari 2 – Sesi 8", "Subtes 8: Bahasa Arab", "25 menit"],
  ["Hari 2 – Sesi 9", `Subtes ${NI}: Literasi Standar Internasional (model PISA 2025 & TIMSS)`, `${INTL.time} menit`],
  ["Hari 2 – Sesi 10", "Survei Karakter", "15 menit"],
  ["Hari 2 – Individual", "Tes baca Al-Qur'an (±10 menit) & simulasi wawancara (±15 menit) per peserta", "terjadwal"],
], [2400, 5638, 1600], { header: true, size: 19 }));

body.push(H2("2.4 Tata Tertib & Petunjuk Umum Peserta"));
[
  "Isilah identitas pada lembar jawaban sebelum tes dimulai.",
  "Setiap soal memiliki empat pilihan jawaban (A, B, C, D) dan hanya satu jawaban yang paling tepat.",
  "Jawaban benar bernilai 1, jawaban salah atau kosong bernilai 0 (tanpa pengurangan). Usahakan menjawab semua soal.",
  `Subtes ${NI} juga memuat ${INTL.essays.length} soal uraian. Tulis jawaban uraian secara lengkap dan runtut pada lembar jawaban uraian; jawaban dinilai dengan kode 2 (penuh), 1 (sebagian), atau 0.`,
  "Kerjakan sesuai alokasi waktu setiap subtes; tidak diperkenankan kembali ke subtes yang waktunya telah habis.",
  "Kalkulator, gawai, dan catatan tidak diperkenankan. Gunakan kertas coretan yang disediakan.",
  "Kerjakan dengan jujur—hasil tryout dipakai untuk memetakan kekuatan dan kelemahan, bukan untuk menghakimi.",
].forEach((t) => body.push(numbered(t, "rules")));

body.push(H2("2.5 Kisi-kisi per Subtes"));
SECTIONS.forEach((s, i) => {
  body.push(H3(`Subtes ${i + 1}: ${s.title}`));
  const groups = new Map();
  s.items.forEach((it) => { if (it.q === undefined) return; if (!groups.has(it.t)) groups.set(it.t, []); groups.get(it.t).push(it); });
  const rows = [["Materi / Indikator", "Nomor soal", "Jml", "Level", "Domain TIMSS", "Kualifikasi internasional"]];
  for (const [t, its] of groups) rows.push([t, its.map((x) => x.no).join(", "), String(its.length), [...new Set(its.map((x) => `L${x.l}`))].join("/"), [...new Set(its.map((x) => TIMSS_SHORT[x.l]))].join("/"), [...new Set(its.map((x) => intlTag(s, x)))].join(" | ")]);
  if (s.essays) s.essays.forEach((e, k) => rows.push([`Uraian – ${e.unit}`, `U${k + 1}`, "1", `L${e.l}`, TIMSS_SHORT[e.l], `${e.x.fw} • ${e.x.proc}`]));
  body.push(table(rows, [2700, 1300, 550, 750, 1300, 3038], { header: true, size: 16, zebra: true }));
  body.push(spacer(120));
});

// BAGIAN III — Naskah Soal
body.push(H1("Bagian III — Naskah Soal"));
body.push(box([
  P("PETUNJUK UMUM", { bold: true, color: NAVY, after: 60 }),
  P(`Paket ini terdiri atas ${SECTIONS.length} subtes dengan total ${TOTAL_ITEMS} soal pilihan ganda dan ${INTL.essays.length} soal uraian (Subtes ${NI}). Nomor soal dimulai dari 1 pada setiap subtes. Tandai jawaban pada Lembar Jawaban (Bagian V) sesuai nomor dan subtes. Selamat mengerjakan—bismillah, semoga sukses!`, { size: 20, after: 0 }),
]));
SECTIONS.forEach((s, i) => {
  if (i > 0) body.push(new Paragraph({ children: [new PageBreak()] }));
  else body.push(spacer(200));
  body.push(...sectionHeader(s, i + 1));
  s.items.forEach((it) => {
    if (it.part) body.push(P(it.part, { bold: true, color: BLUE, size: 21, before: 120, after: 100, keepNext: true }));
    else if (it.stim) body.push(...renderStim(it, s));
    else body.push(...renderQuestion(it));
  });
  if (s.essays) {
    body.push(P("Bagian B — Uraian (respons terbuka model PISA)", { bold: true, color: BLUE, size: 21, before: 160, after: 100, keepNext: true }));
    s.essays.forEach((e, k) => {
      body.push(P([new TextRun({ text: `U${k + 1}.\t`, bold: true, font: FONT, size: 22 }), new TextRun({ text: `[${e.unit}] `, italics: true, font: FONT, size: 20, color: BLUE }), ...runs(e.q)], { indent: { left: QIND + 113, hanging: QIND + 113 }, tabs: [{ type: TabStopType.LEFT, position: QIND + 113 }], after: 80, keepNext: true }));
      body.push(P("Tulis jawabanmu pada Lembar Jawaban Uraian (Bagian V).", { italics: true, size: 18, color: "7F7F7F", indent: { left: QIND + 113 }, after: 160 }));
    });
  }
  body.push(P("— Akhir subtes. Periksa kembali jawaban Anda. —", { italics: true, align: AlignmentType.CENTER, size: 19, before: 160, color: "7F7F7F" }));
});

// BAGIAN IV — Non-kognitif
body.push(H1("Bagian IV — Instrumen Non-Kognitif"));
body.push(...sectionHeader({ title: NK.survey.title, time: NK.survey.time, count: NK.survey.items.length, relevance: NK.survey.relevance, instructions: NK.survey.instructions }, NI + 1, "INSTRUMEN"));
const sv = [["No", "Pernyataan", "STS", "TS", "S", "SS"]];
NK.survey.items.forEach((it, i) => sv.push([String(i + 1), it.s, "", "", "", ""]));
body.push(table(sv, [600, 6638, 600, 600, 600, 600], { header: true, size: 19 }));

body.push(new Paragraph({ children: [new PageBreak()] }));
body.push(...sectionHeader({ title: NK.quran.title, time: "±10", count: NK.quran.tasks.length, relevance: NK.quran.relevance, instructions: ["Dilaksanakan individual oleh penguji yang kompeten (guru PAI/ustaz/ustazah).", "Beri skor 1–4 pada setiap aspek sesuai deskriptor rubrik."] }, NI + 2, "INSTRUMEN"));
body.push(P("Tugas peserta:", { bold: true, after: 60 }));
NK.quran.tasks.forEach((t) => body.push(numbered(t, "quran")));
body.push(spacer(100));
body.push(table([["Aspek", "Skor 1", "Skor 2", "Skor 3", "Skor 4", "Skor"], ...NK.quran.rubric.map((r) => [...r, ""])], [1900, 1700, 1700, 1700, 1700, 938], { header: true, size: 17, boldFirstCol: true }));
body.push(P("Nilai tes baca Al-Qur'an & ibadah = (jumlah skor ÷ 20) × 100.", { size: 19, before: 80 }));
body.push(P("Catatan penguji: ………………………………………………………………………………………………………………", { size: 19, before: 80 }));

body.push(new Paragraph({ children: [new PageBreak()] }));
body.push(...sectionHeader({ title: NK.interview.title, time: "±15", count: NK.interview.student.length + NK.interview.parent.length, relevance: NK.interview.relevance, instructions: ["Pewawancara mengajukan pertanyaan inti, lalu menggali dengan pertanyaan lanjutan (Mengapa? Bagaimana? Contohnya?).", "Peserta dilatih menjawab dengan pola STAR: Situation, Task, Action, Result."] }, NI + 3, "INSTRUMEN"));
body.push(P("A. Pertanyaan untuk calon siswa", { bold: true, color: BLUE, after: 60 }));
body.push(table([["No", "Aspek", "Pertanyaan"], ...NK.interview.student.map((r, i) => [String(i + 1), r[0], r[1]])], [600, 2200, W - 2800], { header: true, size: 19 }));
body.push(spacer(120));
body.push(P("B. Pertanyaan untuk orang tua/wali", { bold: true, color: BLUE, after: 60 }));
NK.interview.parent.forEach((t) => body.push(numbered(t, "parent")));
body.push(spacer(100));
body.push(P("C. Rubrik penilaian wawancara", { bold: true, color: BLUE, after: 60 }));
body.push(table([["Aspek", "Skor 1", "Skor 2", "Skor 3", "Skor 4", "Skor"], ...NK.interview.rubric.map((r) => [...r, ""])], [1900, 1700, 1700, 1700, 1700, 938], { header: true, size: 17, boldFirstCol: true }));
body.push(P("Nilai wawancara = (jumlah skor ÷ 20) × 100.", { size: 19, before: 80 }));

// BAGIAN V — Lembar Jawaban
body.push(H1("Bagian V — Lembar Jawaban"));
body.push(table([["Nama", "", "No. Peserta", ""], ["Asal Sekolah", "", "Sekolah Tujuan", ""]], [1600, 3219, 1600, 3219], { size: 19, firstColFill: false }));
body.push(P("Hitamkan/silang satu huruf pilihan jawaban untuk setiap nomor.", { size: 18, italics: true, before: 80 }));
SECTIONS.forEach((s, i) => {
  body.push(P(`Subtes ${i + 1} — ${s.title} (${s.count} soal)`, { bold: true, size: 19, color: NAVY, before: 120, after: 60, keepNext: true }));
  const per = 5; const rows = [];
  const nRows = Math.ceil(s.count / per);
  for (let r = 0; r < nRows; r++) {
    const row = [];
    for (let c = 0; c < per; c++) { const n = c * nRows + r + 1; row.push(n <= s.count ? `${String(n).padStart(2, " ")}.  (A) (B) (C) (D)` : ""); }
    rows.push(row);
  }
  body.push(table(rows, [1927, 1927, 1928, 1928, 1928], { size: 16 }));
  if (s.essays) {
    body.push(P(`Lembar Jawaban Uraian — Subtes ${i + 1}`, { bold: true, size: 19, color: NAVY, before: 160, after: 60, keepNext: true }));
    s.essays.forEach((e, k) => body.push(new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [W], layout: TableLayoutType.FIXED, rows: [
      new TableRow({ children: [cell(P(`U${k + 1}. ${e.unit}`, { bold: true, size: 18, after: 0 }), W, { fill: LIGHT })] }),
      new TableRow({ height: { value: 2000, rule: "atLeast" }, children: [cell(P("", { after: 0 }), W)] }),
    ] }), spacer(80)));
  }
});

// BAGIAN VI — Kunci & Pembahasan
body.push(H1("Bagian VI — Kunci Jawaban & Pembahasan"));
body.push(box([P("DOKUMEN PENILAI — jangan dibagikan kepada peserta sebelum tryout selesai.", { bold: true, color: "C00000", after: 0, align: AlignmentType.CENTER })], "FDECEC"));
body.push(spacer(120));
body.push(H2("6.1 Kunci Jawaban Ringkas"));
SECTIONS.forEach((s, i) => {
  body.push(P(`Subtes ${i + 1} — ${s.title}`, { bold: true, size: 19, color: NAVY, before: 100, after: 40, keepNext: true }));
  const qs = s.items.filter((it) => it.q !== undefined);
  const rows = []; for (let r = 0; r < qs.length; r += 10) rows.push(Array.from({ length: 10 }, (_, k) => (qs[r + k] ? `${qs[r + k].no}. ${LETTERS[qs[r + k].key]}` : "")));
  body.push(table(rows, Array(10).fill(963).map((w, k) => (k === 9 ? W - 963 * 9 : w)), { size: 17, centerAll: true }));
  const dist = [0, 0, 0, 0]; qs.forEach((q) => dist[q.key]++);
  body.push(P(`Sebaran kunci: A = ${dist[0]}, B = ${dist[1]}, C = ${dist[2]}, D = ${dist[3]}`, { size: 16, italics: true, color: "7F7F7F", before: 40 }));
});
body.push(H2("6.2 Pembahasan Lengkap"));
SECTIONS.forEach((s, i) => {
  body.push(H3(`Subtes ${i + 1}: ${s.title}`));
  const rows = [["No", "Kunci", "Level", "Materi & kualifikasi internasional", "Pembahasan"]];
  s.items.forEach((it) => { if (it.q !== undefined) rows.push([String(it.no), LETTERS[it.key], `L${it.l}`, [P(it.t, { size: 16, bold: true, after: 20, line: 240 }), P(`TIMSS: ${TIMSS_SHORT[it.l]} • PISA ≈ ${PISA_LV[it.l]}`, { size: 15, color: BLUE, after: 20, line: 240 }), P(intlTag(s, it), { size: 15, italics: true, color: "595959", after: 0, line: 240 })], it.e]); });
  body.push(table(rows, [500, 800, 750, 3400, 4188], { header: true, size: 17, zebra: true }));
  if (s.essays) {
    body.push(P(`Pedoman Kode Uraian Subtes ${i + 1} (model coding guide PISA)`, { bold: true, color: NAVY, size: 20, before: 160, after: 80, keepNext: true }));
    s.essays.forEach((e, k) => {
      body.push(P([new TextRun({ text: `U${k + 1}. `, bold: true, font: FONT, size: 19 }), ...runs(e.q, { size: 19 })], { after: 40, keepNext: true }));
      body.push(P(`Kualifikasi: ${e.x.fw} • ${e.x.proc} • ${e.x.fmt} • TIMSS: ${TIMSS_SHORT[e.l]} • PISA ≈ ${PISA_LV[e.l]}`, { size: 16, italics: true, color: BLUE, after: 60, keepNext: true }));
      body.push(table([["Kode", "Kriteria"], ...e.rubric], [1800, W - 1800], { header: true, size: 17, boldFirstCol: true }));
      body.push(spacer(100));
    });
  }
});

// BAGIAN VII — Penskoran
body.push(H1("Bagian VII — Pedoman Penskoran, Interpretasi & Analisis Hasil"));
body.push(H2("7.1 Nilai per Subtes"));
body.push(P("Nilai subtes = (jumlah jawaban benar ÷ jumlah soal subtes) × 100. Tidak ada pengurangan untuk jawaban salah.", { align: AlignmentType.JUSTIFIED }));
body.push(table([["Subtes", "Jumlah soal", "Benar", "Nilai (0–100)"], ...SECTIONS.map((s, i) => [`${i + 1}. ${s.title}`, String(s.count), "", ""])], [5038, 1500, 1500, 1600], { header: true, size: 19, center: true }));
body.push(P(`Khusus Subtes ${NI}: skor = jumlah benar pilihan ganda (maks. ${INTL.count}) + jumlah kode uraian (maks. ${INTL.essays.length * 2}); nilai = skor ÷ ${INTL.count + INTL.essays.length * 2} × 100. Nilai Subtes ${NI} dilaporkan sebagai Indeks Literasi Internasional dan tidak dimasukkan ke skor komposit sekolah.`, { size: 19, before: 80, align: AlignmentType.JUSTIFIED }));
body.push(H2("7.2 Skor Komposit per Sekolah Tujuan (Bobot Simulasi)"));
body.push(P("Skor komposit = Σ (bobot% × nilai subtes) ÷ 100. Bobot berikut disusun penyusun berdasarkan analisis Bagian I untuk keperluan simulasi; bukan bobot resmi sekolah.", { size: 20, align: AlignmentType.JUSTIFIED }));
body.push(table([["Sekolah", ...WEIGHTS.cols], ...WEIGHTS.rows.map(([n, w]) => [n, ...w.map((x) => (x === 0 ? "–" : `${x}%`))])], [2438, 900, 900, 900, 900, 900, 900, 900, 900], { header: true, center: true, size: 18, boldFirstCol: true }));
body.push(P("* MAN IC: pilih IPA (10%) untuk peminatan sains atau IPS (10%) untuk peminatan sosial/keagamaan—hanya salah satu yang dihitung. TPA = Tes Potensi Akademik; BIN = Literasi Bahasa Indonesia; MAT = Matematika; ING = Bahasa Inggris; PAI = Pendidikan Agama Islam; ARB = Bahasa Arab.", { size: 17, italics: true, before: 60 }));
body.push(H3("Contoh perhitungan (SMANU MH Thamrin)"));
body.push(P("Nilai Matematika 80, IPA 70, Bahasa Inggris 90 → skor komposit = (35 × 80 + 35 × 70 + 30 × 90) ÷ 100 = (2.800 + 2.450 + 2.700) ÷ 100 = 79,5.", { size: 20 }));
body.push(H2("7.3 Interpretasi Tingkat Kesiapan"));
body.push(table([
  ["Skor komposit", "Kategori", "Tindak lanjut yang disarankan"],
  ["≥ 85", "Sangat siap", "Pertahankan; perbanyak latihan soal HOTS dan simulasi CBT berwaktu; mulai latihan wawancara."],
  ["75 – 84,9", "Siap", "Fokus pada 2 subtes terlemah; latihan terstruktur 3–4 kali per minggu."],
  ["65 – 74,9", "Cukup, perlu penguatan", "Remedial materi per indikator (lihat kisi-kisi); latihan bertahap L1 → L3."],
  ["< 65", "Perlu pendampingan intensif", "Pembelajaran ulang konsep dasar; jadwal belajar harian; pendampingan guru/mentor."],
], [1800, 2400, 5438], { header: true, size: 19 }));
body.push(P("Catatan: ambang di atas adalah ambang kesiapan internal tryout, bukan passing grade resmi sekolah. Komponen non-kognitif (survei karakter, tes baca Al-Qur'an, wawancara) dilaporkan terpisah sebagai profil, tidak dijumlahkan ke skor komposit.", { size: 18, italics: true, before: 80 }));

body.push(H2("7.4 Estimasi Kecakapan Setara Level PISA (Indikatif)"));
body.push(P("Gunakan persentase jawaban benar pada butir L2 dan L3 di Subtes 2, 3, 4, dan " + NI + " untuk memperkirakan posisi kecakapan peserta. Estimasi ini bersifat indikatif untuk umpan balik belajar dan bukan skor PISA resmi.", { size: 20, align: AlignmentType.JUSTIFIED }));
body.push(table([
  ["Pola capaian peserta", "Estimasi setara", "Makna bagi persiapan seleksi unggulan"],
  ["Benar < 50% pada butir L2", "Di bawah Level 2", "Perkuat konsep dasar dan membaca stimulus; belum siap bersaing."],
  ["Benar ≥ 50% pada L2, < 40% pada L3", "Level 2–3", "Kecakapan dasar tercapai; latih soal multitahap dan penalaran."],
  ["Benar ≥ 70% pada L2, 40–69% pada L3", "Level 3–4", "Sasaran minimum tercapai; tingkatkan konsistensi pada soal L3 dan uraian."],
  ["Benar ≥ 80% pada L2, ≥ 70% pada L3, uraian rata-rata ≥ kode 1,5", "Level 4–5 ke atas", "Kompetitif untuk MAN IC, SMANU, dan Labschool; pertahankan lewat soal tipe olimpiade/PISA Level 5–6."],
], [3400, 1900, 4338], { header: true, size: 18 }));
body.push(spacer(80));
const levelCount = (sec, l) => sec.items.filter((it) => it.q !== undefined && it.l === l).length;
body.push(table([["Subtes", "Jumlah butir L2", "Jumlah butir L3", "Benar L2", "Benar L3", "Estimasi level"], ...SECTIONS.filter((x) => ["BIN", "MAT", "IPA", "INT"].includes(x.id)).map((x) => [x.title, String(levelCount(x, 2)), String(levelCount(x, 3)), "", "", ""])], [3138, 1300, 1300, 1300, 1300, 1300], { header: true, size: 17, center: true }));

body.push(H2("7.5 Penskoran Survei Karakter"));
[
  "Butir positif: STS = 1, TS = 2, S = 3, SS = 4. Butir negatif (nomor 3, 6, 8, 12, 15, 20) diberi skor terbalik: STS = 4, TS = 3, S = 2, SS = 1.",
  "Hitung rata-rata per dimensi: Integritas (1–3), Kemandirian (4–6), Ketahanan stres (7–9), Kerja sama (10–12), Regulasi diri (13–15), Motivasi berprestasi (16–17), Religiusitas & toleransi (18–20).",
  "Rata-rata ≥ 3,25 = kuat; 2,50–3,24 = cukup; < 2,50 = perlu dikembangkan.",
  "Hasil survei adalah bahan refleksi dan konseling, bukan diagnosis psikologis. Untuk psikotes sesungguhnya, rujuk ke psikolog.",
].forEach((t) => body.push(bullet(t, 0, { size: 20 })));
const negNums = NK.survey.items.map((it, i) => (it.r ? i + 1 : null)).filter(Boolean).join(", ");
if (negNums !== "3, 6, 8, 12, 15, 20") throw new Error("Nomor butir negatif survei tidak sesuai pedoman: " + negNums);

body.push(H2("7.6 Panduan Analisis Butir untuk Guru"));
body.push(P("Setelah tryout, lakukan analisis butir agar program remedial tepat sasaran dan bank soal makin berkualitas.", { align: AlignmentType.JUSTIFIED }));
body.push(table([
  ["Indikator", "Rumus", "Kriteria"],
  ["Tingkat kesukaran (p)", "p = jumlah peserta menjawab benar ÷ jumlah peserta", "p < 0,30 sukar • 0,30–0,70 sedang • > 0,70 mudah"],
  ["Daya pembeda (D)", "D = pA − pB (pA, pB = proporsi benar kelompok atas & bawah, masing-masing 27%)", "D ≥ 0,40 sangat baik • 0,30–0,39 baik • 0,20–0,29 cukup (perlu revisi) • < 0,20 buruk"],
  ["Efektivitas pengecoh", "Proporsi pemilih setiap pilihan salah", "Pengecoh berfungsi bila dipilih ≥ 5% peserta, terutama kelompok bawah"],
  ["Penguasaan indikator", "Rata-rata nilai butir per indikator kisi-kisi", "< 60% → indikator prioritas remedial"],
], [2200, 4238, 3200], { header: true, size: 18 }));
body.push(spacer(120));
body.push(P("Rekomendasi tindak lanjut: (1) petakan indikator lemah per peserta dan per kelas dari kisi-kisi; (2) susun Tryout 2 dengan proporsi butir lebih banyak pada indikator lemah; (3) jalankan Tryout 3 dalam format CBT berwaktu penuh untuk membiasakan ritme tes; (4) lakukan simulasi wawancara dan tes baca Al-Qur'an secara berkala bagi peserta yang menargetkan sekolah berasrama/berbasis keislaman.", { align: AlignmentType.JUSTIFIED, size: 20 }));

// Rujukan
body.push(H1("Rujukan Sumber Data"));
body.push(P("Sumber diakses November 2026. Informasi resmi terbaru tetap mengacu pada laman SNMB Madrasah Kemenag (snmb-madrasah.kemenag.go.id), PSB Labschool UNJ (psb.labschool-unj.sch.id), laman SPMB SMANU M.H. Thamrin, dan laman PMB setiap unit SMA Islam Al Azhar.", { size: 19, italics: true }));
SOURCES.forEach(([t, u], i) => body.push(P([new TextRun({ text: `${i + 1}. ${t}. `, font: FONT, size: 19 }), new TextRun({ text: u, font: FONT, size: 17, color: BLUE })], { indent: { left: 397, hanging: 397 }, after: 70 })));

// ---------- dokumen ----------
const doc = new Document({
  creator: "Tim Penyusun Tryout",
  title: "Tryout 1 Seleksi Masuk SMA/MA Unggulan TP 2027/2028",
  description: "Paket tryout komposit MAN IC, SMA Labschool, SMANU MH Thamrin, SMA Al Azhar",
  styles: {
    default: { document: { run: { font: FONT, size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 32, bold: true, color: NAVY }, paragraph: { spacing: { before: 0, after: 200 }, keepNext: true, outlineLevel: 0, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: BLUE, space: 4 } } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 26, bold: true, color: BLUE }, paragraph: { spacing: { before: 240, after: 120 }, keepNext: true, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 22, bold: true, color: NAVY }, paragraph: { spacing: { before: 180, after: 80 }, keepNext: true, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [
        { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 397, hanging: 284 } } } },
        { level: 1, format: LevelFormat.BULLET, text: "–", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 794, hanging: 284 } } } },
      ] },
      ...["steps", "rules", "quran", "parent"].map((reference) => ({ reference, levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 454, hanging: 340 } } } }] })),
    ],
  },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134, header: 567, footer: 567 } }, titlePage: true },
    headers: {
      first: new Header({ children: [] }),
      default: new Header({ children: [P([new TextRun({ text: "Tryout 1 · Seleksi Masuk SMA/MA Unggulan TP 2027/2028", font: FONT, size: 16, color: "7F7F7F" })], { align: AlignmentType.RIGHT, after: 0 })] }),
    },
    footers: {
      first: new Footer({ children: [] }),
      default: new Footer({ children: [P([new TextRun({ children: ["Halaman ", PageNumber.CURRENT, " dari ", PageNumber.TOTAL_PAGES], font: FONT, size: 16, color: "7F7F7F" })], { align: AlignmentType.CENTER, after: 0 })] }),
    },
    children: body,
  }],
});

const OUT = path.join(__dirname, "..", "Tryout1_Seleksi_SMA_Unggulan_TP2027-2028.docx");
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(OUT, buf);
  console.log("OK:", OUT);
  SECTIONS.forEach((s) => { const d = [0, 0, 0, 0]; s.items.forEach((it) => { if (it.q !== undefined) d[it.key]++; }); console.log(s.id, s.count, "butir; kunci A/B/C/D =", d.join("/")); });
  console.log("Total butir:", TOTAL_ITEMS, "| Total waktu:", TOTAL_TIME, "menit");
});
