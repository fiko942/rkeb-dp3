# Data Dictionary - Alumni Tracking Sample UMM

File utama: `data/alumni_tracking_sample_umm.csv`

Skema dibuat untuk mendukung alur project pelacakan alumni dari sumber publik.

| Kolom | Tipe | Deskripsi |
|---|---|---|
| alumni_id | string | ID unik internal alumni. |
| nim | string | Nomor induk mahasiswa sintetis per prodi-angkatan. |
| nama_lengkap | string | Nama alumni. |
| nama_variasi | string | Variasi nama untuk query/disambiguasi, dipisah `|`. |
| jenis_kelamin | string | `L` atau `P`. |
| tanggal_lahir | date | Tanggal lahir format `YYYY-MM-DD`. |
| kota_asal | string | Kota asal/domisili awal. |
| fakultas | string | Fakultas alumni. |
| prodi | string | Program studi alumni. |
| angkatan | int | Tahun masuk kuliah. |
| tahun_lulus | int | Tahun lulus estimasi. |
| ipk | float | IPK sintetis. |
| predikat | string | Predikat kelulusan berdasarkan IPK. |
| email | string | Email alumni sintetis. |
| no_hp | string | Nomor HP sintetis. |
| kata_kunci_afiliasi | string | Kata kunci afiliasi untuk query pencarian. |
| kata_kunci_konteks | string | Konteks prodi/angkatan/lulus/kota untuk query. |
| target_role | string | Perkiraan role pekerjaan (sinyal konteks). |
| instansi_terakhir | string | Instansi kerja/afiliasi terakhir sintetis. |
| lokasi_terakhir | string | Lokasi aktivitas terbaru sintetis. |
| status_pelacakan | string | Status awal/hasil pelacakan publik. |
| confidence_score | float | Skor keyakinan identifikasi (0-1). |
| sumber_terakhir | string | Sumber publik terakhir yang terkait. |
| tanggal_update | date | Tanggal pembaruan status. |
