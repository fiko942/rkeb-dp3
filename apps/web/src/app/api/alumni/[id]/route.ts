import { NextResponse } from 'next/server';

import { findAlumniById } from '@/server/repositories/alumni-repository';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const data = await findAlumniById(params.id);

  if (!data) {
    return NextResponse.json({ message: 'Alumni not found' }, { status: 404 });
  }

  return NextResponse.json({ data });
}
