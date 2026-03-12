import { NextResponse } from 'next/server';

import { findAlumni } from '@/server/repositories/alumni-repository';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') ?? undefined;
  const prodi = searchParams.get('prodi') ?? undefined;
  const status = searchParams.get('status') ?? undefined;
  const take = Number(searchParams.get('take') ?? '50');

  const data = await findAlumni({ q, prodi, status, take });
  return NextResponse.json({ data });
}
