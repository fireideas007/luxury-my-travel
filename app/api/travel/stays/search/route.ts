import { NextResponse } from 'next/server';
import { Duffel } from '@duffel/api';

const getDuffelToken = () => process.env.VITE_DUFFEL_API_KEY || process.env.DUFFEL_API_KEY;

export async function POST(request: Request) {
  try {
    const token = getDuffelToken();
    if (!token) {
      return NextResponse.json({ error: "Missing live GDS API token." }, { status: 401 });
    }
    const duffel = new Duffel({ token });
    const body = await request.json();
    const { lat, lng, radius = 15, checkInDate, checkOutDate } = body;

    const searchParams = {
      check_in_date: checkInDate || '2026-06-15',
      check_out_date: checkOutDate || '2026-06-22',
      rooms: 1,
      guests: [{ type: 'adult' as const }],
      location: {
        radius,
        geographic_coordinates: { latitude: parseFloat(lat), longitude: parseFloat(lng) }
      }
    };

    const staysSearch = await duffel.stays.search(searchParams);
    return NextResponse.json({ data: staysSearch.data }, { status: 200 });
  } catch (err: any) {
    console.error("GDS Stays error:", err);
    return NextResponse.json({ 
      error: err.message || "Failed to execute stays search",
      details: err.errors || err.meta || err
    }, { status: err.status || 500 });
  }
}
