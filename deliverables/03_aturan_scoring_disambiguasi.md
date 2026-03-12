# Aturan Scoring Disambiguasi

## Formula Final
`final_score = (0.35 * name_score) + (0.30 * affiliation_score) + (0.20 * timeline_score) + (0.15 * field_score) + cross_validation_bonus - conflict_penalty`

## Definisi Komponen
- `name_score`:
  - 1.00 jika nama persis.
  - 0.80-0.95 jika variasi nama sangat mirip.
  - 0.50-0.79 jika sebagian cocok.
  - <0.50 jika indikasi nama berbeda.

- `affiliation_score`:
  - 0.85-1.00 jika ada UMM/prodi/instansi historis relevan.
  - 0.60-0.84 jika afiliasi masih masuk konteks regional/bidang.
  - <0.60 jika afiliasi tidak konsisten.

- `timeline_score`:
  - 0.80-1.00 jika tahun aktivitas kandidat selisih <= 1 tahun dari tahun lulus.
  - 0.55-0.79 jika selisih 2-3 tahun.
  - <0.55 jika selisih > 3 tahun.

- `field_score`:
  - 0.80-1.00 jika topik/role konsisten dengan prodi.
  - 0.55-0.79 jika masih satu domain luas.
  - <0.55 jika tidak relevan.

## Aturan Cross-Validation
- Bonus `+0.05` jika minimal 2 sumber independen konsisten.
- Bonus `+0.08` jika >= 3 sumber konsisten.
- Penalti `-0.05` jika ada kontradiksi kuat (lokasi/role/timeline bertentangan).

## Kategori Keputusan
- `Kemungkinan kuat` jika `score >= 0.80`.
- `Perlu verifikasi` jika `0.60 <= score < 0.80`.
- `Tidak cocok` jika `score < 0.60`.

## Mapping ke Status Alumni
- Ada kandidat `Kemungkinan kuat` -> `Teridentifikasi dari sumber publik`.
- Hanya ada kandidat `Perlu verifikasi` -> `Perlu Verifikasi Manual`.
- Tidak ada kandidat layak -> `Belum ditemukan di sumber publik`.
