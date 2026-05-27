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
    const { selected_offers = [], passengers = [], payments = [] } = body;

    const order = await duffel.orders.create({
      type: 'instant',
      selected_offers,
      passengers,
      payments
    });

    return NextResponse.json({ data: order.data }, { status: 200 });
  } catch (err: any) {
    console.error("GDS Orders error:", err);
    return NextResponse.json({ 
      error: err.message || "Failed to execute order creation",
      details: err.errors || err.meta || err
    }, { status: err.status || 500 });
  }
}
