import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Duffel } from '@duffel/api';
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';

// Load local environment variables (useful for local production tests)
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// Serve static assets from compile directory
app.use(express.static(path.join(__dirname, 'dist')));

// Helper functions for reading keys from standard App Service / App Runner environment configurations
const getDuffelToken = () => process.env.VITE_DUFFEL_API_KEY || process.env.DUFFEL_API_KEY;
const getRazorpayKeyId = () => process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
const getRazorpayKeySecret = () => process.env.VITE_RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET;

// 1. POST /api/travel/air/offer_requests
app.post('/api/travel/air/offer_requests', async (req, res) => {
  try {
    const token = getDuffelToken();
    if (!token) {
      return res.status(401).json({ error: "Missing live GDS API token." });
    }
    const duffel = new Duffel({ token });
    const { slices = [], passengers = [], cabin_class = 'first' } = req.body.data || req.body || {};

    const offerRequest = await duffel.offerRequests.create({
      slices: slices.map((s) => ({
        origin: s.origin,
        destination: s.destination,
        departure_date: s.departure_date
      })),
      passengers,
      cabin_class
    });

    res.status(200).json({ data: offerRequest.data });
  } catch (err) {
    console.error("GDS middleware error:", err);
    res.status(err.status || 500).json({ 
      error: err.message || "Failed to execute live offer request",
      details: err.errors || err.meta || err
    });
  }
});

// 2. POST /api/travel/stays/search
app.post('/api/travel/stays/search', async (req, res) => {
  try {
    const token = getDuffelToken();
    if (!token) {
      return res.status(401).json({ error: "Missing live GDS API token." });
    }
    const duffel = new Duffel({ token });
    const { lat, lng, radius = 15, checkInDate, checkOutDate } = req.body;

    const searchParams = {
      check_in_date: checkInDate || '2026-06-15',
      check_out_date: checkOutDate || '2026-06-22',
      rooms: 1,
      guests: [{ type: 'adult' }],
      location: {
        radius,
        geographic_coordinates: { latitude: parseFloat(lat), longitude: parseFloat(lng) }
      }
    };

    const staysSearch = await duffel.stays.search(searchParams);
    res.status(200).json({ data: staysSearch.data });
  } catch (err) {
    console.error("GDS Stays error:", err);
    res.status(err.status || 500).json({ 
      error: err.message || "Failed to execute stays search",
      details: err.errors || err.meta || err
    });
  }
});

// 3. POST /api/travel/cars/search
app.post('/api/travel/cars/search', async (req, res) => {
  try {
    const token = getDuffelToken();
    if (!token) {
      return res.status(401).json({ error: "Missing live GDS API token." });
    }
    const duffel = new Duffel({ token });
    const { lat, lng, pickupDate, dropoffDate } = req.body;

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
    res.status(200).json({ data: carsSearch.data });
  } catch (err) {
    console.error("GDS Cars error:", err);
    res.status(err.status || 500).json({ 
      error: err.message || "Failed to execute fleet search",
      details: err.errors || err.meta || err
    });
  }
});

// 4. GET /api/travel/place_suggestions
app.get('/api/travel/place_suggestions', async (req, res) => {
  try {
    const token = getDuffelToken();
    if (!token) {
      return res.status(401).json({ error: "Missing live GDS API token." });
    }
    const query = req.query.query || '';
    if (query.trim().length < 2) {
      return res.status(200).json({ data: [] });
    }
    const duffel = new Duffel({ token });
    const suggestions = await duffel.suggestions.list({ query });
    res.status(200).json({ data: suggestions.data });
  } catch (err) {
    console.error("GDS suggestions error:", err);
    res.status(500).json({ 
      error: err.message || "Failed to fetch place suggestions"
    });
  }
});

// 5. POST /api/travel/air/orders
app.post('/api/travel/air/orders', async (req, res) => {
  try {
    const token = getDuffelToken();
    if (!token) {
      return res.status(401).json({ error: "Missing live GDS API token." });
    }
    const duffel = new Duffel({ token });
    const { selected_offers = [], passengers = [], payments = [] } = req.body;

    const order = await duffel.orders.create({
      type: 'instant',
      selected_offers,
      passengers,
      payments
    });

    res.status(200).json({ data: order.data });
  } catch (err) {
    console.error("GDS Orders error:", err);
    res.status(err.status || 500).json({ 
      error: err.message || "Failed to execute order creation",
      details: err.errors || err.meta || err
    });
  }
});

// 6. POST /api/razorpay/orders
app.post('/api/razorpay/orders', async (req, res) => {
  try {
    const keyId = getRazorpayKeyId();
    const keySecret = getRazorpayKeySecret();
    if (!keyId || !keySecret) {
      return res.status(401).json({ error: "Missing Razorpay credentials." });
    }
    const { amount, currency = 'INR' } = req.body;
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
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    res.status(500).json({ error: err.message || "Failed to create Razorpay order" });
  }
});

// 7. POST /api/concierge/chat
app.post('/api/concierge/chat', async (req, res) => {
  try {
    const key = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!key) {
      return res.status(401).json({ error: "Missing Gemini API Key." });
    }
    const { messages = [], catalog = [] } = req.body;

    // Convert messages array to Gemini contents format
    // Gemini roles: "user" and "model"
    const contents = messages.map(msg => ({
      role: msg.sender === 'concierge' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    const systemInstructionText = `You are the personal "Luxury My Travel" Concierge, an elite hospitality AI planner serving high-net-worth clients.
Your communication style is highly refined, polite, elegant, and standard-setting (refer to the client as "Sir", "Madame", or "Valued Guest").
You must act as a travel advisor, planning exclusive journeys.

Here is the exact catalog of ultra-luxury offerings currently available on the Luxury My Travel platform:
${JSON.stringify(catalog, null, 2)}

Strict Rules:
1. Always recommend curations from the catalog when relevant (e.g. Singapore Airlines Suites, Gulfstream G650ER, Rambagh Palace, Soneva Jani, Osteria Francescana, Benetti Oasis, etc.).
2. You can propose custom itineraries combining private flights, stay curations, and custom concierge excursions.
3. Be helpful, concise, and professional. Do NOT mention developer terms, API mappings, code schemas, mock data, or Duffel. You are a live concierge.`;

    const payload = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: systemInstructionText }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, Valued Guest. I am unable to process your request at this moment.";
    
    res.status(200).json({ reply: replyText });
  } catch (err) {
    console.error("Concierge Chat Error:", err);
    res.status(500).json({ error: err.message || "Failed to generate concierge response" });
  }
});

// SPA Routing: Redirect any unrecognized requests back to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Standalone Express HTTP server running on port ${port}`);
});
