// src/api/escapeRoute.js
export async function fetchEscapeRoute(location, calamity) {
    const res = await fetch('http://127.0.0.1:8000/get-escape-route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location, calamity })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Route fetch failed');
    }
    return await res.json();
  }
