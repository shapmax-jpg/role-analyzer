const AT_TOKEN = 'patUo6zexrT7rFvCd.1ef9cef613ea30420edaa649b704daa0ef7e26410fc4718f5876624414a046f7';
const AT_BASE = 'app87BWTrgyjIQncU';
const BASE_URL = `https://api.airtable.com/v0/${AT_BASE}`;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const params = event.queryStringParameters || {};
    const table = params.table || 'Postings';
    const recordId = params.id || '';
    const method = event.httpMethod;

    let url = `${BASE_URL}/${table}`;
    if (recordId) url += `/${recordId}`;

    // Forward query params (pageSize, offset, etc)
    const fwdParams = Object.entries(params)
      .filter(([k]) => !['table','id'].includes(k))
      .map(([k,v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    if (fwdParams) url += `?${fwdParams}`;

    const fetchOpts = {
      method,
      headers: {
        'Authorization': `Bearer ${AT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    if (['POST','PATCH','PUT'].includes(method) && event.body) {
      fetchOpts.body = event.body;
    }

    const resp = await fetch(url, fetchOpts);
    const data = await resp.json();

    return {
      statusCode: resp.status,
      headers,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
