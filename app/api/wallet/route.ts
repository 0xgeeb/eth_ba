import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');
  const apiKey = process.env.OCTAV_API_KEY;

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }
  try {
    const response = await fetch(`https://api.octav.fi/v1/portfolio?addresses=${address}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch wallet data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
