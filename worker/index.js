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
        .prepare('SELECT name, body, stars, created_at FROM reviews ORDER BY created_at DESC LIMIT 200')
        .all();
      return json(results);
    }

    // GET /stats — live counters
    if (req.method === 'GET' && url.pathname === '/stats') {
      const row = await env.DB
        .prepare('SELECT COUNT(*) as total, AVG(stars) as avg_stars, SUM(CASE WHEN stars = 5 THEN 1 ELSE 0 END) as five_star FROM reviews')
        .first();
      const total = row.total || 0;
      const avg = total > 0 ? Math.round(row.avg_stars * 10) / 10 : 0;
      const satisfaction = total > 0 ? Math.round((row.five_star / total) * 100) : 0;
      return json({ total, avg, satisfaction });
    }

    return new Response('Not found', { status: 404, headers: CORS });
  },
};
