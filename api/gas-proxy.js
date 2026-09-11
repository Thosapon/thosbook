export default async function handler(req, res) {
  const GAS_URL = process.env.GAS_API_URL; // เก็บ URL จริงไว้ฝั่ง server เท่านั้น
  const targetUrl = req.method === 'GET'
    ? `${GAS_URL}?${new URLSearchParams(req.query).toString()}`
    : GAS_URL;

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: req.method === 'POST' ? { 'Content-Type': 'text/plain;charset=utf-8' } : {},
    body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    redirect: 'follow' // fetch ฝั่ง server ตาม redirect ได้ไม่ติด cookie policy ของ browser
  });

  const data = await response.json();
  res.status(200).json(data);
}
