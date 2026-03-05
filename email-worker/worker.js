/**
 * Cloudflare Worker — EmailJS Proxy for Bogus Basin Mountain Hosts
 *
 * Keeps EmailJS credentials server-side. The HTML frontend calls this
 * Worker instead of the EmailJS SDK directly.
 *
 * Environment secrets (set via `wrangler secret put`):
 *   EMAILJS_SERVICE_ID   — e.g. ***REDACTED***
 *   EMAILJS_TEMPLATE_ID  — e.g. ***REDACTED***
 *   EMAILJS_PUBLIC_KEY   — e.g. ***REDACTED***
 */

const ALLOWED_ORIGINS = [
  'https://mtn-hosts.web.app',
  'https://mountainstogo.github.io',
  'http://localhost:8080',
  'http://127.0.0.1:8080'
];

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const isAllowed = ALLOWED_ORIGINS.includes(origin);

    // ---- CORS preflight ----
    if (request.method === 'OPTIONS') {
      if (!isAllowed) return new Response('Forbidden', { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // ---- Only POST ----
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // ---- Origin check ----
    if (!isAllowed) {
      return new Response('Forbidden', { status: 403 });
    }

    try {
      const body = await request.json();
      const { to_email, to_name, status, message } = body;

      // Validate required fields
      if (!to_email || !message) {
        return new Response(JSON.stringify({ error: 'Missing required fields: to_email, message' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
        });
      }

      // Forward to EmailJS REST API with server-side credentials
      const emailjsResp = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: env.EMAILJS_SERVICE_ID,
          template_id: env.EMAILJS_TEMPLATE_ID,
          user_id: env.EMAILJS_PUBLIC_KEY,
          template_params: { to_email, to_name: to_name || '', status: status || '', message },
        }),
      });

      if (emailjsResp.ok) {
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
        });
      }

      const errText = await emailjsResp.text();
      return new Response(JSON.stringify({ error: errText }), {
        status: emailjsResp.status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      });
    }
  },
};
