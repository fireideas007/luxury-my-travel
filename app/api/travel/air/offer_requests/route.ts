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
    const { slices = [], passengers = [], cabin_class = 'first' } = body.data || body || {};

    const offerRequest = await duffel.offerRequests.create({
      slices: slices.map((s: any) => ({
        origin: s.origin,
        destination: s.destination,
        departure_date: s.departure_date
      })),
      passengers,
      cabin_class
    });

    return NextResponse.json({ data: offerRequest.data }, { status: 200 });
  } catch (err: any) {
    console.error("GDS middleware error:", err);
    return NextResponse.json({ 
      error: err.message || "Failed to execute live offer request",
      details: err.errors || err.meta || err
    }, { status: err.status || 500 });
  }
}
