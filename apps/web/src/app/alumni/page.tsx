import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { prisma } from '@/lib/prisma';

export default async function AlumniPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; prodi?: string; status?: string }>;
}) {
  const params = await searchParams;

  const alumni = await prisma.alumni.findMany({
    where: {
      ...(params.q
        ? {
            OR: [
              { namaLengkap: { contains: params.q } },
              { nim: { contains: params.q } }
            ]
          }
        : {}),
      ...(params.prodi ? { prodi: params.prodi } : {}),
      ...(params.status ? { statusPelacakan: params.status } : {})
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
            <input name="q" placeholder="Cari nama / NIM" defaultValue={params.q} className="rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm" />
            <input name="prodi" placeholder="Filter prodi" defaultValue={params.prodi} className="rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm" />
            <input name="status" placeholder="Filter status" defaultValue={params.status} className="rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm" />
            <button className="rounded-md bg-excel-primary px-3 py-2 text-sm font-medium text-white">Apply Filters</button>
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
