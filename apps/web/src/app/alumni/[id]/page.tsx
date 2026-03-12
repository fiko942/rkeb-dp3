import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { asDate } from '@/lib/format';
import { prisma } from '@/lib/prisma';

export default async function AlumniDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const data = await prisma.alumni.findUnique({
    where: { id },
    include: {
      searchQueries: { take: 15, orderBy: { createdAt: 'desc' } },
      candidateEvidences: { take: 15, orderBy: { capturedAt: 'desc' } },
      disambiguations: { take: 15, orderBy: { finalScore: 'desc' } },
      trackingResults: { take: 10, orderBy: { lastVerifiedAt: 'desc' } }
    }
  });

  if (!data) notFound();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>{data.namaLengkap}</CardTitle>
            <p className="text-sm text-slate-500">{data.nim} • {data.prodi} • Angkatan {data.angkatan}</p>
          </div>
          <Badge>{data.statusPelacakan}</Badge>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-4">
          <div><p className="text-slate-500">Confidence</p><p className="font-semibold text-excel-dark">{data.confidenceScore.toFixed(2)}</p></div>
          <div><p className="text-slate-500">Instansi terakhir</p><p className="font-semibold text-excel-dark">{data.instansiTerakhir}</p></div>
          <div><p className="text-slate-500">Lokasi</p><p className="font-semibold text-excel-dark">{data.lokasiTerakhir}</p></div>
          <div><p className="text-slate-500">Update</p><p className="font-semibold text-excel-dark">{asDate(data.tanggalUpdate)}</p></div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Candidate Evidence</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto pt-0">
            <Table>
              <THead><TR><TH>Source</TH><TH>Signal</TH><TH>Captured</TH></TR></THead>
              <TBody>
                {data.candidateEvidences.map((ev) => (
                  <TR key={ev.id}>
                    <TD>
                      <p className="font-medium text-excel-dark">{ev.sourceName}</p>
                      <a href={ev.sourceUrl} className="text-xs text-excel-primary">Open source</a>
                    </TD>
                    <TD className="text-xs">{ev.signalRole} • {ev.signalAffiliation}</TD>
                    <TD>{asDate(ev.capturedAt)}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Disambiguation Score</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto pt-0">
            <Table>
              <THead><TR><TH>Candidate</TH><TH>Final</TH><TH>Decision</TH></TR></THead>
              <TBody>
                {data.disambiguations.map((row) => (
                  <TR key={row.id}>
                    <TD>{row.candidateId}</TD>
                    <TD>{row.finalScore.toFixed(2)}</TD>
                    <TD><Badge>{row.decisionLabel}</Badge></TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Query Log (Recent)</CardTitle>
          <Link href="/results" className="text-sm text-excel-primary">Open results queue</Link>
        </CardHeader>
        <CardContent className="overflow-x-auto pt-0">
          <Table>
            <THead><TR><TH>Platform</TH><TH>Query</TH><TH>Date</TH></TR></THead>
            <TBody>
              {data.searchQueries.map((q) => (
                <TR key={q.id}>
                  <TD>{q.platformTarget}</TD>
                  <TD className="max-w-[520px] truncate">{q.queryText}</TD>
                  <TD>{asDate(q.createdAt)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
