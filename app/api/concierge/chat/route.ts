import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const key = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!key) {
      return NextResponse.json({ error: "Missing Gemini API Key." }, { status: 401 });
    }
    const body = await request.json();
    const { messages = [], catalog = [] } = body;

    const contents = messages.map((msg: any) => ({
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
    
    return NextResponse.json({ reply: replyText }, { status: 200 });
  } catch (err: any) {
    console.error("Concierge Chat Error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate concierge response" }, { status: 500 });
  }
}
