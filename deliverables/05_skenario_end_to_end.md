# Skenario End-to-End (Contoh 1 Alumni)

## Data Alumni Awal
Contoh alumni:
- `alumni_id`: `ALM-2018-01-004`
- `nama_lengkap`: `Arif Andi Kusuma`
- `prodi`: `Informatika`
- `angkatan`: `2018`
- `tahun_lulus`: `2023`

## Langkah Proses
1. Sistem membangun profil target:
   - Variasi nama: `Arif Andi Kusuma`, `A. Andi Kusuma`, `Arif A.`, `Andi Kusuma A.`
   - Afiliasi: `Universitas Muhammadiyah Malang`, `UMM`, `Informatika`
   - Konteks: `Angkatan 2018`, `Lulus 2023`, `Malang/Surabaya`

2. Sistem membuat query:
   - `"Arif Andi Kusuma" "Universitas Muhammadiyah Malang"`
   - `"Arif Andi Kusuma" site:scholar.google.com`
   - `"Arif Andi Kusuma" ORCID`
   - `"Arif Andi Kusuma" "Software Engineer" "Malang"`

3. Sistem mengambil kandidat dari beberapa sumber publik dan menyimpan bukti.

4. Sistem menghitung skor disambiguasi untuk tiap kandidat.

5. Sistem melakukan cross-validation antar sumber.

6. Sistem memilih kandidat tertinggi dan menetapkan status alumni.

## Contoh Hasil Skor Kandidat
- Kandidat A: `0.86` -> `Kemungkinan kuat`
- Kandidat B: `0.68` -> `Perlu verifikasi`
- Kandidat C: `0.49` -> `Tidak cocok`

## Keputusan Akhir
Karena ada kandidat dengan skor `>= 0.80`, maka:
- `tracking_status = Teridentifikasi dari sumber publik`
- sistem menyimpan ringkasan role + instansi + lokasi
- sistem menyimpan jejak bukti dan timestamp verifikasi

## Output yang Tersimpan
- Query tersimpan pada `data/search_queries_sample.csv`
- Bukti kandidat tersimpan pada `data/candidate_evidence_sample.csv`
- Skor tersimpan pada `data/disambiguation_sample.csv`
- Status akhir tersimpan pada `data/tracking_result_sample.csv`
