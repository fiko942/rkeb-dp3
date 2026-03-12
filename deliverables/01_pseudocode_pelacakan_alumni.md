# Rancangan Pseudocode Pelacakan Alumni - Daily Project 2

## Tujuan
Membangun alur pelacakan alumni berbasis sumber publik yang diizinkan, dengan hasil berupa status pelacakan, confidence score, dan jejak bukti yang dapat diaudit.

## Entitas Data Utama
- `AlumniMaster`: data dasar alumni (NIM, nama, prodi, angkatan, tahun_lulus).
- `TargetProfile`: profil target pencarian (variasi nama, kata kunci afiliasi, kata kunci konteks).
- `QueryLog`: daftar query yang dijalankan sistem per alumni.
- `CandidateEvidence`: kandidat hasil pencarian + sinyal identitas.
- `DisambiguationScore`: hasil skor kandidat berdasarkan bobot aturan.
- `TrackingResult`: status akhir pelacakan per alumni.

## Parameter Konfigurasi
- `UPDATE_INTERVAL_MONTH = 6`
- `THRESHOLD_STRONG = 0.80`
- `THRESHOLD_REVIEW = 0.60`
- Bobot disambiguasi:
  - `W_NAME = 0.35`
  - `W_AFFILIATION = 0.30`
  - `W_TIMELINE = 0.20`
  - `W_FIELD = 0.15`
- `CROSS_VALIDATION_BONUS = [0.00..0.10]`

## Pseudocode End-to-End
```text
ALGORITHM AlumniPublicTrackingJob
INPUT: AlumniMaster, SourceRegistry, CurrentDate
OUTPUT: TrackingResult, QueryLog, CandidateEvidence, DisambiguationScore

BEGIN
  EligibleAlumni <- SelectEligibleAlumni(AlumniMaster, CurrentDate)

  FOR each alumni IN EligibleAlumni DO
    profile <- BuildTargetProfile(alumni)
    queries <- GenerateQueries(profile)
    SaveQueryLog(alumni.alumni_id, queries)

    allCandidates <- []

    FOR each source IN PrioritizedSources(alumni, SourceRegistry) DO
      sourceResults <- SearchPublicSource(source, queries)
      candidates <- ExtractIdentitySignals(sourceResults)
      SaveCandidateEvidence(alumni.alumni_id, candidates)
      allCandidates <- allCandidates + candidates
    END FOR

    scoredCandidates <- []
    FOR each candidate IN allCandidates DO
      score <- CalculateDisambiguationScore(alumni, candidate)
      score <- score + CrossValidationAdjustment(alumni, candidate, allCandidates)
      label <- ClassifyCandidate(score)
      SaveDisambiguation(alumni.alumni_id, candidate.candidate_id, score, label)
      scoredCandidates <- scoredCandidates + (candidate, score, label)
    END FOR

    result <- DecideTrackingStatus(scoredCandidates, THRESHOLD_STRONG, THRESHOLD_REVIEW)
    SaveTrackingResult(alumni.alumni_id, result)
  END FOR

  RETURN (TrackingResult, QueryLog, CandidateEvidence, DisambiguationScore)
END
```

## Detail Fungsi

### 1) Seleksi Alumni yang Perlu Dilacak
```text
FUNCTION SelectEligibleAlumni(AlumniMaster, CurrentDate)
BEGIN
  RETURN all alumni WHERE
    tracking_status = "Belum Dilacak"
    OR tracking_status = "Perlu Verifikasi Manual"
    OR MonthsBetween(last_update, CurrentDate) >= UPDATE_INTERVAL_MONTH
END
```

### 2) Membangun Profil Target
```text
FUNCTION BuildTargetProfile(alumni)
BEGIN
  nameVariants <- GenerateNameVariants(alumni.nama_lengkap)
  affiliationKeywords <- ["Universitas Muhammadiyah Malang", "UMM", alumni.prodi]
  contextKeywords <- ["Angkatan " + alumni.angkatan, "Lulus " + alumni.tahun_lulus, alumni.kota_asal]

  RETURN TargetProfile {
    alumni_id: alumni.alumni_id,
    name_variants: nameVariants,
    affiliation_keywords: affiliationKeywords,
    context_keywords: contextKeywords,
    initial_status: "Belum Dilacak"
  }
END
```

### 3) Menentukan Prioritas Sumber
```text
FUNCTION PrioritizedSources(alumni, SourceRegistry)
BEGIN
  IF alumni.track_interest = "academic" THEN
    RETURN [GoogleScholar, ORCID, ResearchGate, WebSearch]
  ELSE
    RETURN [LinkedIn, CompanyDirectory, WebSearch, GitHub]
  END IF
END
```

### 4) Membuat Query
```text
FUNCTION GenerateQueries(profile)
BEGIN
  queries <- []
  FOR each name IN profile.name_variants DO
    queries.add("\"" + name + "\" \"Universitas Muhammadiyah Malang\"")
    queries.add("\"" + name + "\" \"" + profile.context_keywords[0] + "\" \"UMM\"")
    queries.add("\"" + name + "\" site:scholar.google.com")
    queries.add("\"" + name + "\" ORCID")
  END FOR
  RETURN Deduplicate(queries)
END
```

### 5) Pengambilan Data Sumber Publik
```text
FUNCTION SearchPublicSource(source, queries)
BEGIN
  IF source.hasOfficialAPI THEN
    RETURN ExecuteAPIQuery(source, queries)
  ELSE IF source.hasPublicEndpoint THEN
    RETURN ExecutePublicEndpointQuery(source, queries)
  ELSE
    RETURN ExecuteAllowedWebSearch(source, queries)
  END IF
END
```

### 6) Ekstraksi Sinyal Identitas
```text
FUNCTION ExtractIdentitySignals(sourceResults)
BEGIN
  candidates <- []
  FOR each result IN sourceResults DO
    candidate <- {
      candidate_id,
      source_name,
      source_url,
      title,
      snippet,
      signal_name,
      signal_affiliation,
      signal_role,
      signal_location,
      signal_topic,
      signal_activity_year
    }
    candidates.add(candidate)
  END FOR
  RETURN candidates
END
```

### 7) Disambiguasi dan Scoring
```text
FUNCTION CalculateDisambiguationScore(alumni, candidate)
BEGIN
  name_score <- CompareName(alumni.name_variants, candidate.signal_name)
  affiliation_score <- CompareAffiliation(alumni, candidate.signal_affiliation)
  timeline_score <- CompareTimeline(alumni.tahun_lulus, candidate.signal_activity_year)
  field_score <- CompareField(alumni.prodi, candidate.signal_topic, candidate.signal_role)

  final_score <- (W_NAME * name_score)
               + (W_AFFILIATION * affiliation_score)
               + (W_TIMELINE * timeline_score)
               + (W_FIELD * field_score)

  RETURN final_score
END
```

### 8) Cross-Validation Antar Sumber
```text
FUNCTION CrossValidationAdjustment(alumni, candidate, allCandidates)
BEGIN
  support_count <- CountConsistentSources(candidate, allCandidates)
  conflict_count <- CountConflictingSources(candidate, allCandidates)

  bonus <- 0.00
  IF support_count >= 2 THEN
    bonus <- 0.05
  END IF
  IF support_count >= 3 THEN
    bonus <- 0.08
  END IF

  penalty <- 0.00
  IF conflict_count >= 1 THEN
    penalty <- 0.05
  END IF

  RETURN bonus - penalty
END
```

### 9) Klasifikasi Kandidat
```text
FUNCTION ClassifyCandidate(score)
BEGIN
  IF score >= THRESHOLD_STRONG THEN
    RETURN "Kemungkinan kuat"
  ELSE IF score >= THRESHOLD_REVIEW THEN
    RETURN "Perlu verifikasi"
  ELSE
    RETURN "Tidak cocok"
  END IF
END
```

### 10) Menetapkan Status Akhir Alumni
```text
FUNCTION DecideTrackingStatus(scoredCandidates, THRESHOLD_STRONG, THRESHOLD_REVIEW)
BEGIN
  topCandidate <- MaxScore(scoredCandidates)

  IF topCandidate.score >= THRESHOLD_STRONG THEN
    RETURN {
      tracking_status: "Teridentifikasi dari sumber publik",
      final_confidence: topCandidate.score,
      matched_candidate: topCandidate,
      top_candidates_for_review: []
    }
  ELSE IF topCandidate.score >= THRESHOLD_REVIEW THEN
    RETURN {
      tracking_status: "Perlu Verifikasi Manual",
      final_confidence: topCandidate.score,
      matched_candidate: null,
      top_candidates_for_review: TopN(scoredCandidates, 5)
    }
  ELSE
    RETURN {
      tracking_status: "Belum ditemukan di sumber publik",
      final_confidence: topCandidate.score,
      matched_candidate: null,
      top_candidates_for_review: []
    }
  END IF
END
```

## Catatan Implementasi
- Sistem menyimpan `query log`, `evidence`, `score`, dan `hasil akhir` sebagai audit trail.
- Sistem hanya menggunakan sumber publik yang diizinkan dan tidak bypass pembatasan akses.
- Proses scheduler direkomendasikan berjalan mingguan.
