const AT_TOKEN = 'patUo6zexrT7rFvCd.b6093d871361c8a89f3c79550837be684e946ed6284fc5e65d8afcf4dfcb1302';
const AT_BASE = 'app87BWTrgyjIQncU';
const BASE_URL = `https://api.airtable.com/v0/${AT_BASE}`;

export default async (request, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (request.method === 'OPTIONS') {
    return new Response('', { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);
    const table = url.searchParams.get('table') || 'Postings';
    const recordId = url.searchParams.get('id') || '';
    
    let atUrl = `${BASE_URL}/${table}`;
    if (recordId) atUrl += `/${recordId}`;
    
    // Forward other query params
    const fwdParams = new URLSearchParams();
    for (const [k, v] of url.searchParams) {
      if (!['table', 'id'].includes(k)) fwdParams.append(k, v);
    }
    const qs = fwdParams.toString();
    if (qs) atUrl += `?${qs}`;

    const fetchOpts = {
      method: request.method,
      headers: {
        'Authorization': `Bearer ${AT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    if (['POST', 'PATCH', 'PUT'].includes(request.method)) {
      fetchOpts.body = await request.text();
    }

    const resp = await fetch(atUrl, fetchOpts);
    const data = await resp.json();

    return new Response(JSON.stringify(data), {
      status: resp.status,
      headers: corsHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
};

export const config = { path: '/api/airtable' };
