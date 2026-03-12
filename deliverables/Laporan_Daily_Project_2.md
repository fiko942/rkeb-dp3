# Laporan Daily Project 2
## Rancangan Sistem Pelacakan Alumni Berbasis Sumber Publik

Nama Proyek: Daily Project 2  
Mata Kuliah: Rekayasa Kebutuhan  
Institusi: Universitas Muhammadiyah Malang
Nama: WIJI FIKO TEREN  
NIM: 202310370311437

## 1. Latar Belakang
Pelacakan alumni dibutuhkan kampus untuk mengetahui perkembangan karier, aktivitas akademik, dan sebaran lulusan. Pada project ini, rancangan sistem pelacakan alumni dibuat dengan memanfaatkan sumber publik yang diizinkan, seperti LinkedIn, Google Scholar, ORCID, ResearchGate, directory institusi, dan sumber web umum.

Rancangan menekankan tiga aspek utama:
1. Akurasi identifikasi alumni (disambiguasi nama).
2. Keterlacakan keputusan (audit trail bukti).
3. Kepatuhan sumber data (ToS dan etika penggunaan data publik).

## 2. Tujuan
1. Menyusun pseudocode proses pelacakan alumni end-to-end.
2. Mendesain use case diagram sistem pelacakan alumni.
3. Menetapkan aturan scoring disambiguasi dan keputusan status pelacakan.
4. Menyediakan struktur data output untuk kebutuhan implementasi.
5. Menyediakan contoh dataset simulasi untuk pengujian rancangan.

## 3. Ruang Lingkup
Sistem mencakup:
1. Persiapan profil target per alumni.
2. Penentuan prioritas sumber pelacakan.
3. Eksekusi job berkala (scheduler).
4. Pembentukan query pencarian.
5. Pengambilan kandidat hasil dari sumber publik.
6. Ekstraksi sinyal identitas.
7. Disambiguasi dan scoring kandidat.
8. Cross-validation antar sumber.
9. Penetapan status akhir alumni.
10. Penyimpanan jejak bukti dan riwayat.

## 4. Dataset dan Artefak Data
Dataset project menggunakan data sintetis agar aman untuk simulasi tugas.

### 4.1 File Dataset
1. `data/alumni_tracking_sample_umm.csv` (master alumni)
2. `data/search_queries_sample.csv` (log query)
3. `data/candidate_evidence_sample.csv` (jejak bukti kandidat)
4. `data/disambiguation_sample.csv` (hasil skor kandidat)
5. `data/tracking_result_sample.csv` (hasil status akhir)

### 4.2 Ukuran Data
1. Master alumni: 4.800 data (+ header)
2. Query log: 24.000 data (+ header)
3. Candidate evidence: 14.410 data (+ header)
4. Disambiguation: 14.410 data (+ header)
5. Tracking result: 4.800 data (+ header)

### 4.3 Struktur Data Kunci
Kolom utama yang digunakan:
1. Identitas alumni: `alumni_id`, `nim`, `nama_lengkap`, `prodi`, `angkatan`, `tahun_lulus`
2. Profil pencarian: `nama_variasi`, `kata_kunci_afiliasi`, `kata_kunci_konteks`
3. Bukti kandidat: `source_name`, `source_url`, `signal_affiliation`, `signal_role`, `signal_location`, `signal_topic`
4. Hasil disambiguasi: `name_score`, `affiliation_score`, `timeline_score`, `field_score`, `final_score`, `decision_label`
5. Hasil akhir: `tracking_status`, `final_confidence`, `matched_candidate_id`, `last_verified_at`

## 5. Rancangan Proses Sistem

### 5.1 Alur Utama
1. Sistem memilih alumni yang perlu dilacak ulang (belum dilacak, belum meyakinkan, atau data lama).
2. Sistem membuat profil target pencarian alumni (variasi nama + kata kunci afiliasi/konteks).
3. Sistem membentuk query ke berbagai sumber publik yang diizinkan.
4. Sistem mengambil kandidat hasil dan mengekstrak sinyal identitas.
5. Sistem menghitung skor disambiguasi tiap kandidat.
6. Sistem melakukan cross-validation lintas sumber untuk menaikkan/menurunkan confidence.
7. Sistem menetapkan status pelacakan akhir.
8. Sistem menyimpan jejak bukti lengkap untuk audit.

### 5.2 Status Akhir Alumni
1. `Teridentifikasi dari sumber publik`
2. `Perlu Verifikasi Manual`
3. `Belum ditemukan di sumber publik`
4. `Belum Dilacak` (antrian scheduler)

## 6. Pseudocode Inti
Pseudocode lengkap tersedia pada file:
- `deliverables/01_pseudocode_pelacakan_alumni.md`

Ringkasan pseudocode inti:
```text
FOR setiap alumni eligible:
  build target profile
  generate queries
  ambil kandidat dari sumber publik
  ekstrak sinyal identitas
  hitung skor disambiguasi kandidat
  lakukan cross-validation
  tetapkan status akhir
  simpan query log, evidence, score, dan tracking result
END FOR
```

## 7. Use Case Diagram
File diagram:
- `deliverables/02_usecase_diagram.puml`

Aktor utama:
1. Admin
2. Scheduler
3. Verifikator Manual
4. Sumber Publik/API

Use case inti:
1. Kelola data alumni master
2. Buat profil target pencarian
3. Atur prioritas sumber
4. Jalankan job pelacakan berkala
5. Generate query pencarian
6. Ambil kandidat dari sumber publik
7. Ekstrak sinyal identitas
8. Hitung skor disambiguasi
9. Cross-validation antar sumber
10. Tetapkan status pelacakan
11. Simpan jejak bukti dan riwayat
12. Verifikasi manual kandidat
13. Lihat laporan pelacakan

## 8. Aturan Scoring dan Disambiguasi
Aturan detail tersedia pada:
- `deliverables/03_aturan_scoring_disambiguasi.md`

Formula:
```text
final_score = (0.35 * name_score)
            + (0.30 * affiliation_score)
            + (0.20 * timeline_score)
            + (0.15 * field_score)
            + cross_validation_bonus
            - conflict_penalty
```

Threshold keputusan:
1. `>= 0.80` -> Kemungkinan kuat
2. `0.60 - 0.79` -> Perlu verifikasi
3. `< 0.60` -> Tidak cocok

## 9. Skenario End-to-End (Contoh)
Contoh rinci tersedia pada:
- `deliverables/05_skenario_end_to_end.md`

Ringkas:
1. Sistem memproses 1 alumni.
2. Sistem membuat beberapa query lintas sumber.
3. Sistem mendapat beberapa kandidat.
4. Sistem menghitung skor tiap kandidat.
5. Kandidat skor tertinggi menentukan status akhir.
6. Semua jejak disimpan ke file output.

## 10. Kepatuhan dan Etika Data
1. Sistem hanya menggunakan sumber publik yang diizinkan.
2. Prioritas penggunaan API resmi jika tersedia.
3. Tidak melakukan bypass proteksi, scraping ilegal, atau pelanggaran ToS.
4. Dataset project ini bersifat sintetis untuk simulasi akademik.

## 11. Kesimpulan
Rancangan sistem telah memenuhi kebutuhan tugas Daily Project 2 karena mencakup:
1. Pseudocode lengkap proses pelacakan alumni.
2. Use case diagram dengan aktor dan proses utama.
3. Aturan disambiguasi berbasis scoring dan threshold yang terukur.
4. Skema data output yang dapat diaudit.
5. Dataset simulasi yang siap untuk demonstrasi implementasi.

## 12. Lampiran File
### 12.1 Dokumen Deliverables
1. `deliverables/00_ringkasan_submission.md`
2. `deliverables/01_pseudocode_pelacakan_alumni.md`
3. `deliverables/02_usecase_diagram.puml`
4. `deliverables/03_aturan_scoring_disambiguasi.md`
5. `deliverables/04_spesifikasi_output_dan_skema_data.md`
6. `deliverables/05_skenario_end_to_end.md`

### 12.2 File Data
1. `data/alumni_tracking_sample_umm.csv`
2. `data/search_queries_sample.csv`
3. `data/candidate_evidence_sample.csv`
4. `data/disambiguation_sample.csv`
5. `data/tracking_result_sample.csv`
6. `data/data_dictionary_alumni_tracking_sample.md`
