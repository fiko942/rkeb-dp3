import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { prisma } from '@/lib/prisma';

const STATUS_OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'BELUM_DILACAK', label: 'Belum Dilacak' },
  { value: 'PERLU_VERIFIKASI_MANUAL', label: 'Perlu Verifikasi Manual' },
  { value: 'TERIDENTIFIKASI', label: 'Teridentifikasi' },
  { value: 'BELUM_DITEMUKAN', label: 'Belum Ditemukan' }
] as const;

export default async function AlumniPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; prodi?: string; status?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim();
  const prodi = params.prodi?.trim();
  const status = params.status?.trim();

  const prodiOptions = await prisma.alumni.findMany({
    select: { prodi: true },
    distinct: ['prodi'],
    orderBy: { prodi: 'asc' }
  });

  const alumni = await prisma.alumni.findMany({
    where: {
      ...(q
        ? {
            OR: [
              { namaLengkap: { contains: q } },
              { nim: { contains: q } }
            ]
          }
        : {}),
      ...(prodi ? { prodi } : {}),
      ...(status ? { statusPelacakan: status } : {})
    },
    take: 200,
    orderBy: [{ angkatan: 'desc' }, { namaLengkap: 'asc' }]
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Alumni Management</CardTitle>
          <p className="text-sm text-slate-600">Filter data alumni, cek confidence, dan buka jejak evidence per alumni.</p>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 md:grid-cols-4">
            <input
              name="q"
              placeholder="Cari nama / NIM"
              defaultValue={q}
              className="rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm"
            />
            <select
              name="prodi"
              defaultValue={prodi ?? ''}
              className="rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">Semua Prodi</option>
              {prodiOptions.map((option) => (
                <option key={option.prodi} value={option.prodi}>
                  {option.prodi}
                </option>
              ))}
            </select>
            <select
              name="status"
              defaultValue={status ?? ''}
              className="rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value || 'all'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button className="rounded-md bg-excel-primary px-3 py-2 text-sm font-medium text-white">
              Apply Filters
            </button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="overflow-x-auto pt-5">
          <Table>
            <THead>
              <TR>
                <TH>Alumni</TH>
                <TH>Prodi</TH>
                <TH>Status</TH>
                <TH>Confidence</TH>
                <TH></TH>
              </TR>
            </THead>
            <TBody>
              {alumni.map((item) => (
                <TR key={item.id}>
                  <TD>
                    <p className="font-medium text-excel-dark">{item.namaLengkap}</p>
                    <p className="text-xs text-slate-500">{item.nim}</p>
                  </TD>
                  <TD>{item.prodi}</TD>
                  <TD><Badge>{item.statusPelacakan}</Badge></TD>
                  <TD>{item.confidenceScore.toFixed(2)}</TD>
                  <TD>
                    <Link href={`/alumni/${item.id}`} className="text-sm font-medium text-excel-primary">Open detail</Link>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
