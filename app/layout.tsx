import React from 'react';
import '../src/index.css';
import { AppProvider } from '../src/context/AppContext';
import { ClientShell } from '../src/components/ClientShell';

export const metadata = {
  title: 'LuxeTravel | Bespoke Luxury Travel, Stays, Yacht Charters & Fine Dining',
  description: 'Experience bespoke luxury travel. Reserve private jets via Duffel API, book 5-star villas and superyachts via Amadeus, and secure Michelin-starred dining via TripAdvisor integrations.',
  icons: {
    icon: '/favicon.svg',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Inject the environment configuration directly to the window on load
  const envInjectionScript = `
    window.ENV = {
      VITE_POSTHOG_KEY: ${JSON.stringify(process.env.VITE_POSTHOG_KEY || process.env.POSTHOG_KEY || '')},
      VITE_POSTHOG_HOST: ${JSON.stringify(process.env.VITE_POSTHOG_HOST || process.env.POSTHOG_HOST || 'https://us.i.posthog.com')},
      VITE_RAZORPAY_KEY_ID: ${JSON.stringify(process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || '')},
      VITE_GOOGLE_CLIENT_ID: ${JSON.stringify(process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '')}
    };
  `;

  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: envInjectionScript }} />
      </head>
      <body>
        <AppProvider>
          <ClientShell>
            {children}
          </ClientShell>
        </AppProvider>
      </body>
    </html>
  );
}
