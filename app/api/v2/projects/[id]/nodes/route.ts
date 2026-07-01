import { NextResponse } from 'next/server';
import { getNodesByProjectId } from '@/lib/apis/project/supabase/server';

type Params = Promise<{ id: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const nodes = await getNodesByProjectId(id);
    return NextResponse.json(nodes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
