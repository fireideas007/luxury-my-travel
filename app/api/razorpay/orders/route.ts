import { NextResponse } from 'next/server';

const getRazorpayKeyId = () => process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
const getRazorpayKeySecret = () => process.env.VITE_RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET;

export async function POST(request: Request) {
  try {
    const keyId = getRazorpayKeyId();
    const keySecret = getRazorpayKeySecret();
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Missing Razorpay credentials." }, { status: 401 });
    }
    const body = await request.json();
    const { amount, currency = 'INR' } = body;
    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({ amount, currency })
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error("Razorpay order creation error:", err);
    return NextResponse.json({ error: err.message || "Failed to create Razorpay order" }, { status: 500 });
  }
}
