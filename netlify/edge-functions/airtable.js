const AT_TOKEN = 'patUo6zexrT7rFvCd.b6093d871361c8a89f3c79550837be684e946ed6284fc5e65d8afcf4dfcb1302';
const AT_BASE = 'app87BWTrgyjIQncU';
const BASE_URL = `https://api.airtable.com/v0/${AT_BASE}`;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

export default async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('', { status: 200, headers: cors });
  }

  try {
    const url = new URL(request.url);
    const table = url.searchParams.get('table') || 'Postings';
    const recordId = url.searchParams.get('id') || '';

    let atUrl = `${BASE_URL}/${table}`;
    if (recordId) atUrl += `/${recordId}`;

    const fwdParams = new URLSearchParams();
    for (const [k, v] of url.searchParams) {
      if (!['table', 'id'].includes(k)) fwdParams.append(k, v);
    }
    const qs = fwdParams.toString();
    if (qs) atUrl += `?${qs}`;

    const opts = {
      method: request.method,
      headers: {
        'Authorization': `Bearer ${AT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    if (['POST', 'PATCH', 'PUT'].includes(request.method)) {
      opts.body = await request.text();
    }

    const resp = await fetch(atUrl, opts);
    const text = await resp.text();

    return new Response(text, {
      status: resp.status,
      headers: cors
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: cors
    });
  }
};

export const config = { path: '/api/airtable' };
