import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { Duffel } from '@duffel/api';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    server: {
      allowedHosts: [
        '.ngrok-free.app',
        '0b86-103-87-58-17.ngrok-free.app'
      ],
    },
    plugins: [
      react(),
      {
        name: 'duffel-api-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            // Check if it is a request to search flights
            if (req.url && req.url.startsWith('/api/duffel/air/offer_requests') && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk;
              });
              
              req.on('end', async () => {
                try {
                  const token = env.VITE_DUFFEL_API_KEY;
                  if (!token) {
                    res.statusCode = 401;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: "Missing VITE_DUFFEL_API_KEY in environment variables." }));
                    return;
                  }

                  const parsed = JSON.parse(body);
                  const duffel = new Duffel({ token });
                  
                  // Extract parameters
                  const slices = parsed.data?.slices || [];
                  const passengers = parsed.data?.passengers || [];
                  const cabin_class = parsed.data?.cabin_class || 'first';

                  // Execute offer request via Duffel SDK
                  const offerRequest = await duffel.offerRequests.create({
                    slices: slices.map((s: any) => ({
                      origin: s.origin,
                      destination: s.destination,
                      departure_date: s.departure_date
                    })),
                    passengers,
                    cabin_class
                  });

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  // Duffel SDK returns offer requests structure under .data, we wrap it to match client service expectations
                  res.end(JSON.stringify({ data: offerRequest.data }));
                } catch (err: any) {
                  console.error("Duffel middleware error:", err);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ 
                    error: err.message || "Failed to execute Duffel SDK offer request",
                    details: err.errors || err.meta || err
                  }));
                }
              });
            } else if (req.url && req.url.startsWith('/api/duffel/stays/search') && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk;
              });
              
              req.on('end', async () => {
                try {
                  const token = env.VITE_DUFFEL_API_KEY;
                  if (!token) {
                    res.statusCode = 401;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: "Missing VITE_DUFFEL_API_KEY in environment variables." }));
                    return;
                  }

                  const parsed = JSON.parse(body);
                  const duffel = new Duffel({ token });
                  
                  const lat = parseFloat(parsed.lat) || 40.730610;
                  const lng = parseFloat(parsed.lng) || -73.935242;
                  const radius = parseInt(parsed.radius) || 15;
                  
                  const searchParams = {
                    check_in_date: parsed.checkInDate || '2026-06-15',
                    check_out_date: parsed.checkOutDate || '2026-06-22',
                    rooms: 1,
                    guests: [{ type: 'adult' as const }],
                    location: {
                      radius,
                      geographic_coordinates: { latitude: lat, longitude: lng }
                    }
                  };

                  const staysSearch = await duffel.stays.search(searchParams);

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ data: staysSearch.data }));
                } catch (err: any) {
                  console.error("Duffel Stays middleware error. Status:", err.status, "Details:", err.errors || err.meta || err);
                  res.statusCode = err.status || 500;
                  res.setHeader('Content-Type', 'application/json');
                  let errorMessage = err.message || "Failed to execute Duffel Stays search";
                  let errorDetails = err.errors || err.meta || err;
                  if (err.status === 403) {
                    errorMessage = "Access Denied (403): Duffel Stays GDS is not enabled for this account/token. Contact Duffel sales to request access.";
                    errorDetails = { error: "FeatureNotEnabled", message: "Stays GDS features require account activation on your Duffel token." };
                  }
                  res.end(JSON.stringify({ 
                    error: errorMessage,
                    details: errorDetails
                  }));
                }
              });
            } else if (req.url && req.url.startsWith('/api/duffel/cars/search') && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk;
              });
              
              req.on('end', async () => {
                try {
                  const token = env.VITE_DUFFEL_API_KEY;
                  if (!token) {
                    res.statusCode = 401;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: "Missing VITE_DUFFEL_API_KEY in environment variables." }));
                    return;
                  }

                  const parsed = JSON.parse(body);
                  const duffel = new Duffel({ token });
                  
                  const lat = parseFloat(parsed.lat) || 40.730610;
                  const lng = parseFloat(parsed.lng) || -73.935242;
                  
                  const searchParams = {
                    pickup_date: parsed.pickupDate || '2026-06-15',
                    pickup_time: '10:00',
                    dropoff_date: parsed.dropoffDate || '2026-06-22',
                    dropoff_time: '10:00',
                    pickup_location: {
                      radius: 20,
                      geographic_coordinates: { latitude: lat, longitude: lng }
                    },
                    dropoff_location: {
                      radius: 20,
                      geographic_coordinates: { latitude: lat, longitude: lng }
                    },
                    driver: {
                      age: 30,
                      residence_country_code: 'GB'
                    }
                  };

                  const carsSearch = await duffel.cars.search(searchParams);

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ data: carsSearch.data }));
                } catch (err: any) {
                  console.error("Duffel Cars middleware error. Status:", err.status, "Details:", err.errors || err.meta || err);
                  res.statusCode = err.status || 500;
                  res.setHeader('Content-Type', 'application/json');
                  let errorMessage = err.message || "Failed to execute Duffel Cars search";
                  let errorDetails = err.errors || err.meta || err;
                  if (err.status === 403) {
                    errorMessage = "Access Denied (403): Duffel Cars GDS is not enabled for this account/token. Contact Duffel sales to request access.";
                    errorDetails = { error: "FeatureNotEnabled", message: "Cars GDS features require account activation on your Duffel token." };
                  }
                  res.end(JSON.stringify({ 
                    error: errorMessage,
                    details: errorDetails
                  }));
                }
              });
            } else if (req.url && req.url.startsWith('/api/duffel/place_suggestions') && req.method === 'GET') {
              try {
                const token = env.VITE_DUFFEL_API_KEY;
                if (!token) {
                  res.statusCode = 401;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: "Missing VITE_DUFFEL_API_KEY in environment variables." }));
                  return;
                }

                const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
                const query = urlObj.searchParams.get('query') || '';

                if (query.trim().length < 2) {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ data: [] }));
                  return;
                }

                const duffel = new Duffel({ token });
                const suggestions = await duffel.suggestions.list({ query });

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ data: suggestions.data }));
              } catch (err: any) {
                console.error("Duffel suggestions error:", err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ 
                  error: err.message || "Failed to fetch place suggestions",
                  details: err.errors || err.meta || err
                }));
              }
            } else if (req.url && req.url.startsWith('/api/duffel/air/orders') && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk;
              });
              
              req.on('end', async () => {
                try {
                  const token = env.VITE_DUFFEL_API_KEY;
                  if (!token) {
                    res.statusCode = 401;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: "Missing VITE_DUFFEL_API_KEY in environment variables." }));
                    return;
                  }

                  const parsed = JSON.parse(body);
                  const duffel = new Duffel({ token });
                  
                  const selected_offers = parsed.selected_offers || [];
                  const passengers = parsed.passengers || [];
                  const payments = parsed.payments || [];

                  // Execute order creation via Duffel SDK
                  const order = await duffel.orders.create({
                    type: 'instant',
                    selected_offers,
                    passengers,
                    payments
                  });

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ data: order.data }));
                } catch (err: any) {
                  console.error("Duffel Orders middleware error:", err);
                  res.statusCode = err.status || 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ 
                    error: err.message || "Failed to execute Duffel SDK order creation",
                    details: err.errors || err.meta || err
                  }));
                }
              });
            } else if (req.url && req.url.startsWith('/api/razorpay/orders') && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk;
              });
              
              req.on('end', async () => {
                try {
                  const keyId = env.VITE_RAZORPAY_KEY_ID;
                  const keySecret = env.VITE_RAZORPAY_KEY_SECRET;
                  if (!keyId || !keySecret) {
                    res.statusCode = 401;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: "Missing Razorpay credentials in environment variables." }));
                    return;
                  }

                  const parsed = JSON.parse(body);
                  const response = await fetch('https://api.razorpay.com/v1/orders', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64')
                    },
                    body: JSON.stringify({
                      amount: parsed.amount,
                      currency: parsed.currency || 'INR'
                    })
                  });

                  const data = await response.json();
                  res.statusCode = response.status;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                } catch (err: any) {
                  console.error("Razorpay order creation error:", err);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ 
                    error: err.message || "Failed to create Razorpay order"
                  }));
                }
              });
            } else {
              next();
            }
          });
        }
      }
    ]
  };
});
