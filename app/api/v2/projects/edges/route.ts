import { NextResponse } from 'next/server';
import { createEdge } from '@/lib/project/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const edge = await createEdge(body);
    return NextResponse.json(edge, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
