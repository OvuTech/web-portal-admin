import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'https://ovu-transport-staging.fly.dev';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.headers.get('authorization');
    const body = await request.json();
    const reason = body.reason;
    
    if (!token) {
      return NextResponse.json({ detail: 'No token provided' }, { status: 401 });
    }

    if (!reason || reason.length < 10 || reason.length > 500) {
      return NextResponse.json(
        { detail: 'Reason is required and must be between 10 and 500 characters' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/api/v1/admin/partners/${id}/suspend?reason=${encodeURIComponent(reason)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Admin Suspend Partner] Error:', error);
    return NextResponse.json(
      { detail: 'Failed to suspend partner' },
      { status: 500 }
    );
  }
}


