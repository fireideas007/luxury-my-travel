import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    posthogKey: process.env.VITE_POSTHOG_KEY || process.env.POSTHOG_KEY || '',
    posthogHost: process.env.VITE_POSTHOG_HOST || process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
    razorpayKeyId: process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || '',
    googleClientId: process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || ''
  });
}
