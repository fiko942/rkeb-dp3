# Spesifikasi Output dan Skema Data

## File Input Master
- `data/alumni_tracking_sample_umm.csv`

## File Output Pelacakan
- `data/search_queries_sample.csv`
- `data/candidate_evidence_sample.csv`
- `data/disambiguation_sample.csv`
- `data/tracking_result_sample.csv`

## 1) Query Log
File: `data/search_queries_sample.csv`

Kolom:
- `query_id`: ID unik query.
- `alumni_id`, `nim`: referensi alumni.
- `prodi`, `angkatan`: konteks pencarian.
- `platform_target`: sumber yang ditarget.
- `query_text`: string query.
- `query_type`: tipe query (`identity_affiliation`, `academic_profile`, dll).
- `created_at`: tanggal query dibuat.
- `scheduler_batch_id`: ID batch scheduler.

## 2) Candidate Evidence
File: `data/candidate_evidence_sample.csv`

Kolom:
- `evidence_id`: ID bukti.
- `alumni_id`, `candidate_id`: relasi alumni-kandidat.
- `source_name`, `source_url`: asal data publik.
- `title`, `snippet`: metadata hasil pencarian.
- `signal_name`, `signal_affiliation`, `signal_role`, `signal_location`, `signal_topic`, `signal_activity_year`: sinyal identitas.
- `captured_at`: waktu bukti ditangkap.

## 3) Disambiguation Score
File: `data/disambiguation_sample.csv`

Kolom:
- `disambiguation_id`: ID evaluasi skor.
- `alumni_id`, `candidate_id`: kandidat yang dinilai.
- `name_score`, `affiliation_score`, `timeline_score`, `field_score`.
- `cross_validation_bonus`.
- `final_score`.
- `confidence_level`: `Tinggi`, `Sedang`, `Rendah`.
- `decision_label`: `Kemungkinan kuat`, `Perlu verifikasi`, `Tidak cocok`.
- `review_flag`: perlu review manual atau tidak.
- `evaluated_at`: tanggal evaluasi.

## 4) Tracking Result
File: `data/tracking_result_sample.csv`

Kolom:
- `result_id`: ID hasil akhir.
- `alumni_id`, `nim`, `nama_lengkap`, `prodi`, `angkatan`.
- `tracking_status`: status akhir tracking.
- `final_confidence`: skor kandidat teratas.
- `matched_candidate_id`: kandidat terpilih (jika ada).
- `top_source`: sumber paling kuat.
- `current_role_summary`, `current_org_summary`, `current_location_summary`.
- `evidence_count`: jumlah bukti yang dievaluasi.
- `last_verified_at`: tanggal verifikasi terakhir.
- `notes`: catatan sistem/operator.

## Relasi Antar File
- `alumni_tracking_sample_umm.csv (1) -> (N) search_queries_sample.csv`
- `alumni_tracking_sample_umm.csv (1) -> (N) candidate_evidence_sample.csv`
- `candidate_evidence_sample.csv (1) -> (1) disambiguation_sample.csv` per kandidat-evaluasi
- `alumni_tracking_sample_umm.csv (1) -> (1) tracking_result_sample.csv` per siklus batch
