# Tryout 1 — Seleksi Masuk SMA/MA Unggulan TP 2027/2028

Paket tryout komposit untuk MAN Insan Cendekia, SMA Labschool UNJ, SMAN Unggulan M.H. Thamrin, dan SMA Islam Al Azhar,
dikualifikasi terhadap standar internasional PISA 2025 dan TIMSS 2023.

- Dokumen siap pakai: `../Tryout1_Seleksi_SMA_Unggulan_TP2027-2028.docx`
- Bank soal (dapat diedit): `data/*.js` — `o[0]` selalu jawaban benar; posisi kunci diacak dan diseimbangkan saat build.
  - `data/intl.js`: Subtes 9, unit model PISA/TIMSS (pilihan ganda + uraian dengan pedoman kode).
  - Kualifikasi internasional butir lain dihitung oleh `intlTag()` di `build.js`.
- Validator: `node tryout/check.js tryout/data/<file>.js` — mewajibkan ≥70% kontekstual, ≥70% level L3 (analisis), variasi bentuk (PG/MCMA/Benar-Salah), PG & MCMA 5 opsi (4 pengecoh). Build gagal bila kriteria tidak terpenuhi.
- Skema butir: PG `{t,l,c,q,o:[kunci,...4 pengecoh],e}`; MCMA `{type:"mcma",...,o:[5],a:[indeks kunci]}`; Benar/Salah `{type:"bs",...,s:[[pernyataan,true|false],...]}`.
- Generator: `node tryout/build.js` (butuh paket npm `docx`).
