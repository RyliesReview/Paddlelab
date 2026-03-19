export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Notion-Version');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const notionPath = req.query.path;
  if (!notionPath) return res.status(400).json({ error: 'Missing path' });

  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });

  try {
    const notionRes = await fetch(`https://api.notion.com/v1${notionPath}`, {
      method: req.method,
      headers: {
        'Authorization': authHeader,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: ['POST', 'PATCH', 'PUT'].includes(req.method) ? JSON.stringify(req.body) : undefined,
    });

    const data = await notionRes.json();
    res.status(notionRes.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
