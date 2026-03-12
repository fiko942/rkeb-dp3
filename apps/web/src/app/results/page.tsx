import { VerifyResultButton } from '@/components/verify-result-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { asDate } from '@/lib/format';
import { prisma } from '@/lib/prisma';

export default async function ResultsPage() {
  const data = await prisma.trackingResult.findMany({
    take: 250,
    orderBy: { lastVerifiedAt: 'desc' },
    include: { alumni: true }
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Tracking Result & Verification Queue</CardTitle>
          <p className="text-sm text-slate-600">Manual verification available for items that need reviewer confirmation.</p>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="overflow-x-auto pt-5">
          <Table>
            <THead>
              <TR>
                <TH>Alumni</TH>
                <TH>Status</TH>
                <TH>Confidence</TH>
                <TH>Top Source</TH>
                <TH>Updated</TH>
                <TH>Action</TH>
              </TR>
            </THead>
            <TBody>
              {data.map((row) => (
                <TR key={row.id}>
                  <TD>
                    <p className="font-medium text-excel-dark">{row.namaLengkap}</p>
                    <p className="text-xs text-slate-500">{row.nim} • {row.prodi}</p>
                  </TD>
                  <TD><Badge>{row.trackingStatus}</Badge></TD>
                  <TD>{row.finalConfidence.toFixed(2)}</TD>
                  <TD>{row.topSource}</TD>
                  <TD>{asDate(row.lastVerifiedAt)}</TD>
                  <TD><VerifyResultButton id={row.id} verified={row.isManuallyVerified} /></TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
