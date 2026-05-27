import { NextResponse } from 'next/server';
import { Duffel } from '@duffel/api';

const getDuffelToken = () => process.env.VITE_DUFFEL_API_KEY || process.env.DUFFEL_API_KEY;

export async function GET(request: Request) {
  try {
    const token = getDuffelToken();
    if (!token) {
      return NextResponse.json({ error: "Missing live GDS API token." }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    
    if (query.trim().length < 2) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    const duffel = new Duffel({ token });
    const suggestions = await duffel.suggestions.list({ query });
    return NextResponse.json({ data: suggestions.data }, { status: 200 });
  } catch (err: any) {
    console.error("GDS suggestions error:", err);
    return NextResponse.json({ 
      error: err.message || "Failed to fetch place suggestions"
    }, { status: 500 });
  }
}
