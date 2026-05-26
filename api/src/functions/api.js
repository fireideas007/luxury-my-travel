const { app } = require('@azure/functions');
const { Duffel } = require('@duffel/api');

app.http('apiRouter', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    route: 'api/{*segments}',
    handler: async (request, context) => {
        try {
            const path = request.params.segments;
            const method = request.method;

            // Load credentials (checks both local development VITE_ keys and Azure SWA standard keys)
            const duffelToken = process.env.VITE_DUFFEL_API_KEY || process.env.DUFFEL_API_KEY;
            const razorpayKeyId = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
            const razorpayKeySecret = process.env.VITE_RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET;

            // 1. POST duffel/air/offer_requests
            if (path === 'duffel/air/offer_requests' && method === 'POST') {
                if (!duffelToken) {
                    return { status: 401, jsonBody: { error: "Missing VITE_DUFFEL_API_KEY." } };
                }
                const parsed = await request.json();
                const duffel = new Duffel({ token: duffelToken });
                const slices = parsed.data?.slices || [];
                const passengers = parsed.data?.passengers || [];
                const cabin_class = parsed.data?.cabin_class || 'first';

                const offerRequest = await duffel.offerRequests.create({
                    slices: slices.map((s) => ({
                        origin: s.origin,
                        destination: s.destination,
                        departure_date: s.departure_date
                    })),
                    passengers,
                    cabin_class
                });
                return { status: 200, jsonBody: { data: offerRequest.data } };
            }

            // 2. POST duffel/stays/search
            if (path === 'duffel/stays/search' && method === 'POST') {
                if (!duffelToken) {
                    return { status: 401, jsonBody: { error: "Missing VITE_DUFFEL_API_KEY." } };
                }
                const parsed = await request.json();
                const duffel = new Duffel({ token: duffelToken });
                const lat = parseFloat(parsed.lat) || 40.730610;
                const lng = parseFloat(parsed.lng) || -73.935242;
                const radius = parseInt(parsed.radius) || 15;

                const searchParams = {
                    check_in_date: parsed.checkInDate || '2026-06-15',
                    check_out_date: parsed.checkOutDate || '2026-06-22',
                    rooms: 1,
                    guests: [{ type: 'adult' }],
                    location: {
                        radius,
                        geographic_coordinates: { latitude: lat, longitude: lng }
                    }
                };

                const staysSearch = await duffel.stays.search(searchParams);
                return { status: 200, jsonBody: { data: staysSearch.data } };
            }

            // 3. POST duffel/cars/search
            if (path === 'duffel/cars/search' && method === 'POST') {
                if (!duffelToken) {
                    return { status: 401, jsonBody: { error: "Missing VITE_DUFFEL_API_KEY." } };
                }
                const parsed = await request.json();
                const duffel = new Duffel({ token: duffelToken });
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
                return { status: 200, jsonBody: { data: carsSearch.data } };
            }

            // 4. GET duffel/place_suggestions
            if (path === 'duffel/place_suggestions' && method === 'GET') {
                if (!duffelToken) {
                    return { status: 401, jsonBody: { error: "Missing VITE_DUFFEL_API_KEY." } };
                }
                // Parse URL to query suggestions
                const url = new URL(request.url);
                const query = url.searchParams.get('query') || '';
                if (query.trim().length < 2) {
                    return { status: 200, jsonBody: { data: [] } };
                }
                const duffel = new Duffel({ token: duffelToken });
                const suggestions = await duffel.suggestions.list({ query });
                return { status: 200, jsonBody: { data: suggestions.data } };
            }

            // 5. POST duffel/air/orders
            if (path === 'duffel/air/orders' && method === 'POST') {
                if (!duffelToken) {
                    return { status: 401, jsonBody: { error: "Missing VITE_DUFFEL_API_KEY." } };
                }
                const parsed = await request.json();
                const duffel = new Duffel({ token: duffelToken });
                const selected_offers = parsed.selected_offers || [];
                const passengers = parsed.passengers || [];
                const payments = parsed.payments || [];

                const order = await duffel.orders.create({
                    type: 'instant',
                    selected_offers,
                    passengers,
                    payments
                });
                return { status: 200, jsonBody: { data: order.data } };
            }

            // 6. POST razorpay/orders
            if (path === 'razorpay/orders' && method === 'POST') {
                if (!razorpayKeyId || !razorpayKeySecret) {
                    return { status: 401, jsonBody: { error: "Missing Razorpay credentials." } };
                }
                const parsed = await request.json();
                const authHeader = 'Basic ' + Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
                
                const response = await fetch('https://api.razorpay.com/v1/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authHeader
                    },
                    body: JSON.stringify({
                        amount: parsed.amount,
                        currency: parsed.currency || 'INR'
                    })
                });

                const data = await response.json();
                return { status: response.status, jsonBody: data };
            }

            // Fallback
            return { status: 404, jsonBody: { error: `Route not found: ${method} /api/${path}` } };
        } catch (err) {
            context.error("Azure SWA Router Error:", err);
            return {
                status: 500,
                jsonBody: { error: err.message || "Failed to execute serverless API call" }
            };
        }
    }
});
