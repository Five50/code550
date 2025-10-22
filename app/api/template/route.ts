import { NextRequest, NextResponse } from 'next/server';
import { getTemplateForPath } from '@/lib/wordpress';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path') || '/';

  try {
    const template = await getTemplateForPath(path);
    return NextResponse.json({ template });
  } catch (error) {
    console.error('Error getting template:', error);
    return NextResponse.json({ template: 'default' }, { status: 500 });
  }
}
