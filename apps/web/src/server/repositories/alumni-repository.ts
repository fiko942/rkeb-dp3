import { prisma } from '@/lib/prisma';

export async function findAlumni(params: {
  q?: string;
  prodi?: string;
  status?: string;
  take?: number;
}) {
  const { q, prodi, status, take = 50 } = params;

  return prisma.alumni.findMany({
    where: {
      ...(q
        ? {
            OR: [
              { namaLengkap: { contains: q } },
              { nim: { contains: q } },
              { id: { contains: q } }
            ]
          }
        : {}),
      ...(prodi ? { prodi } : {}),
      ...(status ? { statusPelacakan: status } : {})
    },
    orderBy: [{ angkatan: 'desc' }, { namaLengkap: 'asc' }],
    take
  });
}

export async function findAlumniById(id: string) {
  return prisma.alumni.findUnique({
    where: { id },
    include: {
      searchQueries: { take: 10, orderBy: { createdAt: 'desc' } },
      candidateEvidences: { take: 10, orderBy: { capturedAt: 'desc' } },
      disambiguations: { take: 10, orderBy: { finalScore: 'desc' } },
      trackingResults: { take: 5, orderBy: { lastVerifiedAt: 'desc' } }
    }
  });
}
