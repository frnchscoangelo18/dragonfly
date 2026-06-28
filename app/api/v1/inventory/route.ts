import { NextResponse } from 'next/server';
import { getAllComponents, createComponent } from '@/lib/inventory/server';

export async function GET() {
  const components = await getAllComponents();
  return NextResponse.json(components);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const component = await createComponent(body);
    return NextResponse.json(component, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create component' }, { status: 500 });
  }
}
