export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'Missing URL' });

    try {
        const response = await fetch(decodeURIComponent(url), {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        const html = await response.text();

        // Paksa buka gerbang CORS khusus untuk domain Vercel kamu sendiri
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(html);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}
