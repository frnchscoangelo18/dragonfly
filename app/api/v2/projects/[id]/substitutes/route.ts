import { NextResponse } from 'next/server';
import { getSubstitutesByProjectId } from '@/lib/apis/project/supabase/server';

type Params = Promise<{ id: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const substitutes = await getSubstitutesByProjectId(id);
    return NextResponse.json(substitutes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
