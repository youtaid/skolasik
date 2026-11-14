// Validator bank soal: node tryout/check.js tryout/data/<file>.js [--quiet]
// Memastikan: ≥70% kontekstual, ≥70% level L3 (analisis), variasi bentuk (PG/MCMA/BS), PG 5 opsi (4 pengecoh),
// MCMA 5 opsi dengan 2–3 jawaban benar, Benar/Salah 4–5 pernyataan (campuran B & S), pembahasan tanpa merujuk huruf opsi.
const path = require("path");

function check(file) {
  const sec = require(path.resolve(file));
  const errs = [];
  const qs = sec.items.filter((it) => it.q !== undefined);
  const n = qs.length;
  const cnt = { pg: 0, mcma: 0, bs: 0 };
  let l3 = 0, ctx = 0;
  qs.forEach((it, i) => {
    const id = `#${i + 1} (${it.t || "tanpa topik"})`;
    const type = it.type || "pg";
    if (!["pg", "mcma", "bs"].includes(type)) errs.push(`${id}: type tidak dikenal "${type}"`);
    cnt[type] = (cnt[type] || 0) + 1;
    if (![1, 2, 3].includes(it.l)) errs.push(`${id}: l harus 1/2/3`);
    if (typeof it.c !== "boolean") errs.push(`${id}: c (kontekstual) wajib boolean`);
    if (!it.t || !it.e) errs.push(`${id}: t dan e wajib diisi`);
    if (it.keep) errs.push(`${id}: keep tidak diizinkan lagi`);
    if (it.l === 3) l3++;
    if (it.c) ctx++;
    if (type === "pg" || type === "mcma") {
      if (!Array.isArray(it.o) || it.o.length !== 5) errs.push(`${id}: ${type} wajib tepat 5 opsi`);
      else if (new Set(it.o.map((x) => String(x).trim())).size !== 5) errs.push(`${id}: opsi duplikat`);
    }
    if (type === "mcma") {
      if (!Array.isArray(it.a) || it.a.length < 2 || it.a.length > 3) errs.push(`${id}: mcma wajib 2–3 kunci (a)`);
      else if (it.a.some((k) => !Number.isInteger(k) || k < 0 || k > 4) || new Set(it.a).size !== it.a.length) errs.push(`${id}: indeks a tidak valid`);
    }
    if (type === "bs") {
      if (!Array.isArray(it.s) || it.s.length < 4 || it.s.length > 5) errs.push(`${id}: bs wajib 4–5 pernyataan`);
      else {
        if (it.s.some((r) => !Array.isArray(r) || typeof r[0] !== "string" || typeof r[1] !== "boolean")) errs.push(`${id}: format s = [[pernyataan, true/false], ...]`);
        const t = it.s.filter((r) => r[1] === true).length;
        if (t === 0 || t === it.s.length) errs.push(`${id}: bs harus memuat pernyataan Benar dan Salah`);
      }
    }
    if (/\b(opsi|pilihan|jawaban|option|answer)\s+\(?[A-E]\)?(\b|$)/i.test(it.e || "")) errs.push(`${id}: pembahasan merujuk huruf opsi (posisi akan diacak)`);
  });
  const pct = (x) => Math.round((x / n) * 100);
  if (pct(ctx) < 70) errs.push(`Kontekstual ${pct(ctx)}% (< 70%)`);
  if (pct(l3) < 70) errs.push(`Level L3 ${pct(l3)}% (< 70%)`);
  if (pct(cnt.mcma) < 15) errs.push(`MCMA ${pct(cnt.mcma)}% (< 15%)`);
  if (pct(cnt.bs) < 15) errs.push(`Benar/Salah ${pct(cnt.bs)}% (< 15%)`);
  if (pct(cnt.pg) < 35) errs.push(`PG ${pct(cnt.pg)}% (< 35%)`);
  return { sec, n, cnt, l3, ctx, errs, pct };
}

if (require.main === module) {
  let fail = false;
  for (const f of process.argv.slice(2).filter((a) => !a.startsWith("--"))) {
    const r = check(f);
    console.log(`${r.sec.id}: ${r.n} butir | PG ${r.cnt.pg}, MCMA ${r.cnt.mcma}, BS ${r.cnt.bs} | L3 ${r.pct(r.l3)}% | kontekstual ${r.pct(r.ctx)}%`);
    r.errs.forEach((e) => console.log("  ✗ " + e));
    if (r.errs.length) fail = true;
  }
  process.exit(fail ? 1 : 0);
}
module.exports = { check };
