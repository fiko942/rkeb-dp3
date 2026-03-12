import Link from 'next/link';

import { RunTrackingButton } from '@/components/run-tracking-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const [alumniCount, resultCount, reviewCount, identifiedCount] = await Promise.all([
    prisma.alumni.count(),
    prisma.trackingResult.count(),
    prisma.trackingResult.count({ where: { trackingStatus: 'PERLU_VERIFIKASI_MANUAL' } }),
    prisma.trackingResult.count({ where: { trackingStatus: 'TERIDENTIFIKASI' } })
  ]);

  const recent = await prisma.trackingResult.findMany({
    take: 6,
    orderBy: { lastVerifiedAt: 'desc' },
    include: { alumni: true }
  });

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-emerald-200 bg-white p-5 md:flex-row md:items-center">
        <div>
          <p className="text-sm uppercase tracking-wide text-excel-soft">Daily Project 3</p>
          <h1 className="text-2xl font-semibold text-excel-dark">Alumni Tracking Operations Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Pipeline simulasi tracking alumni berbasis evidence dan disambiguation score.</p>
        </div>
        <RunTrackingButton />
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader><CardTitle>Total Alumni</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-semibold text-excel-dark">{alumniCount}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Results</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-semibold text-excel-dark">{resultCount}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Need Manual Review</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-semibold text-amber-700">{reviewCount}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Identified</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-semibold text-excel-primary">{identifiedCount}</p></CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent Tracking Results</CardTitle>
            <Link href="/results" className="text-sm font-medium text-excel-primary">Open full queue</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recent.map((item) => (
                <div key={item.id} className="flex flex-col items-start justify-between gap-2 rounded-lg border border-emerald-100 p-3 md:flex-row md:items-center">
                  <div>
                    <p className="font-medium text-excel-dark">{item.namaLengkap}</p>
                    <p className="text-xs text-slate-500">{item.nim} • {item.prodi}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>{item.trackingStatus}</Badge>
                    <Badge className="bg-white">{item.finalConfidence.toFixed(2)}</Badge>
                    <Link href={`/alumni/${item.alumniId}`} className="text-sm text-excel-primary">Detail</Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
