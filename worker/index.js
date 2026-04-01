const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    // POST /reviews — submit a review
    if (req.method === 'POST' && url.pathname === '/reviews') {
      let body;
      try { body = await req.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

      const { uuid, name, body: reviewBody, stars } = body;

      if (!uuid || !name || !reviewBody || !stars) {
        return json({ error: 'Faltan campos requeridos' }, 400);
      }
      if (typeof stars !== 'number' || stars < 1 || stars > 5) {
        return json({ error: 'Estrellas inválidas' }, 400);
      }

      // Dedup check
      const existing = await env.DB
        .prepare('SELECT id FROM reviews WHERE uuid = ?')
        .bind(uuid)
        .first();

      if (existing) {
        return json({ duplicate: true });
      }

      await env.DB
        .prepare('INSERT INTO reviews (uuid, name, body, stars, created_at) VALUES (?, ?, ?, ?, ?)')
        .bind(
          uuid,
          name.slice(0, 100),
          reviewBody.slice(0, 1000),
          Math.round(stars),
          new Date().toISOString()
        )
        .run();

      return json({ ok: true }, 201);
    }

    // GET /reviews — fetch latest reviews
    if (req.method === 'GET' && url.pathname === '/reviews') {
      const { results } = await env.DB
        .prepare('SELECT name, body, stars, created_at FROM reviews ORDER BY created_at DESC LIMIT 30')
        .all();
      return json(results);
    }

    return new Response('Not found', { status: 404, headers: CORS });
  },
};
