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
    const { lat, lng, pickupDate, dropoffDate } = body;

    const searchParams = {
      pickup_date: pickupDate || '2026-06-15',
      pickup_time: '10:00',
      dropoff_date: dropoffDate || '2026-06-22',
      dropoff_time: '10:00',
      pickup_location: {
        radius: 20,
        geographic_coordinates: { latitude: parseFloat(lat), longitude: parseFloat(lng) }
      },
      dropoff_location: {
        radius: 20,
        geographic_coordinates: { latitude: parseFloat(lat), longitude: parseFloat(lng) }
      },
      driver: {
        age: 30,
        residence_country_code: 'GB'
      }
    };

    const carsSearch = await duffel.cars.search(searchParams);
    return NextResponse.json({ data: carsSearch.data }, { status: 200 });
  } catch (err: any) {
    console.error("GDS Cars error:", err);
    return NextResponse.json({ 
      error: err.message || "Failed to execute fleet search",
      details: err.errors || err.meta || err
    }, { status: err.status || 500 });
  }
}
