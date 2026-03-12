import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

type CsvRecord = Record<string, string>;

function readCsv(fileName: string): CsvRecord[] {
  const csv = readFileSync(resolve(process.cwd(), '..', '..', 'data', fileName), 'utf8');
  return parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  }) as CsvRecord[];
}

function parseDate(input?: string): Date | null {
  if (!input) return null;
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

function mapTrackingStatus(input: string): string {
  const text = input.toLowerCase();
  if (text.includes('teridentifikasi')) return 'TERIDENTIFIKASI';
  if (text.includes('perlu verifikasi')) return 'PERLU_VERIFIKASI_MANUAL';
  if (text.includes('belum ditemukan')) return 'BELUM_DITEMUKAN';
  return 'BELUM_DILACAK';
}

function mapDecisionLabel(input: string): string {
  const text = input.toLowerCase();
  if (text.includes('kemungkinan')) return 'KEMUNGKINAN_KUAT';
  if (text.includes('perlu verifikasi')) return 'PERLU_VERIFIKASI';
  return 'TIDAK_COCOK';
}

async function run() {
  const [alumniRows, queryRows, evidenceRows, disambiguationRows, resultRows] = [
    readCsv('alumni_tracking_sample_umm.csv'),
    readCsv('search_queries_sample.csv'),
    readCsv('candidate_evidence_sample.csv'),
    readCsv('disambiguation_sample.csv'),
    readCsv('tracking_result_sample.csv')
  ];

  await prisma.$transaction([
    prisma.disambiguation.deleteMany(),
    prisma.searchQuery.deleteMany(),
    prisma.trackingResult.deleteMany(),
    prisma.candidateEvidence.deleteMany(),
    prisma.alumni.deleteMany()
  ]);

  await prisma.alumni.createMany({
    data: alumniRows.map((r) => ({
      id: r.alumni_id,
      nim: r.nim,
      namaLengkap: r.nama_lengkap,
      namaVariasi: r.nama_variasi,
      jenisKelamin: r.jenis_kelamin,
      tanggalLahir: parseDate(r.tanggal_lahir),
      kotaAsal: r.kota_asal,
      fakultas: r.fakultas,
      prodi: r.prodi,
      angkatan: Number(r.angkatan),
      tahunLulus: Number(r.tahun_lulus),
      ipk: Number(r.ipk),
      predikat: r.predikat,
      email: r.email,
      noHp: r.no_hp,
      kataKunciAfiliasi: r.kata_kunci_afiliasi,
      kataKunciKonteks: r.kata_kunci_konteks,
      targetRole: r.target_role,
      instansiTerakhir: r.instansi_terakhir,
      lokasiTerakhir: r.lokasi_terakhir,
      statusPelacakan: mapTrackingStatus(r.status_pelacakan),
      confidenceScore: Number(r.confidence_score),
      sumberTerakhir: r.sumber_terakhir,
      tanggalUpdate: parseDate(r.tanggal_update)
    }))
  });

  await prisma.searchQuery.createMany({
    data: queryRows.map((r) => ({
      id: r.query_id,
      alumniId: r.alumni_id,
      nim: r.nim,
      prodi: r.prodi,
      angkatan: Number(r.angkatan),
      platformTarget: r.platform_target,
      queryText: r.query_text,
      queryType: r.query_type,
      createdAt: parseDate(r.created_at) ?? new Date(),
      schedulerBatchId: r.scheduler_batch_id
    }))
  });

  await prisma.candidateEvidence.createMany({
    data: evidenceRows.map((r) => ({
      id: r.evidence_id,
      alumniId: r.alumni_id,
      candidateId: r.candidate_id,
      sourceName: r.source_name,
      sourceUrl: r.source_url,
      title: r.title,
      snippet: r.snippet,
      signalName: r.signal_name,
      signalAffiliation: r.signal_affiliation,
      signalRole: r.signal_role,
      signalLocation: r.signal_location,
      signalTopic: r.signal_topic,
      signalActivityYear: Number(r.signal_activity_year),
      capturedAt: parseDate(r.captured_at) ?? new Date()
    }))
  });

  await prisma.disambiguation.createMany({
    data: disambiguationRows.map((r) => ({
      id: r.disambiguation_id,
      alumniId: r.alumni_id,
      candidateId: r.candidate_id,
      nameScore: Number(r.name_score),
      affiliationScore: Number(r.affiliation_score),
      timelineScore: Number(r.timeline_score),
      fieldScore: Number(r.field_score),
      crossValidationBonus: Number(r.cross_validation_bonus),
      finalScore: Number(r.final_score),
      confidenceLevel: r.confidence_level,
      decisionLabel: mapDecisionLabel(r.decision_label),
      reviewFlag: r.review_flag.toLowerCase() === 'yes',
      evaluatedAt: parseDate(r.evaluated_at) ?? new Date()
    }))
  });

  await prisma.trackingResult.createMany({
    data: resultRows.map((r) => ({
      id: r.result_id,
      alumniId: r.alumni_id,
      nim: r.nim,
      namaLengkap: r.nama_lengkap,
      prodi: r.prodi,
      angkatan: Number(r.angkatan),
      trackingStatus: mapTrackingStatus(r.tracking_status),
      finalConfidence: Number(r.final_confidence),
      matchedCandidateId: r.matched_candidate_id || null,
      topSource: r.top_source,
      currentRoleSummary: r.current_role_summary,
      currentOrgSummary: r.current_org_summary,
      currentLocationSummary: r.current_location_summary,
      evidenceCount: Number(r.evidence_count),
      lastVerifiedAt: parseDate(r.last_verified_at),
      notes: r.notes,
      isManuallyVerified: false
    }))
  });

  process.stdout.write(
    `${JSON.stringify(
      {
        alumni: alumniRows.length,
        queries: queryRows.length,
        evidence: evidenceRows.length,
        disambiguation: disambiguationRows.length,
        results: resultRows.length
      },
      null,
      2
    )}\n`
  );
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
