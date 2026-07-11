import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { url } = req.query;
    if (!url) return res.status(400).json({ success: false, error: "Missing url parameter" });

    try {
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        };

        let targetBlogspot = url;

        // 1. Ambil link Blogspot dari halaman Neosatsu jika diperlukan
        if (url.includes('neosatsu.com')) {
            const responseNeosatsu = await axios.get(url, { headers });
            const $neo = cheerio.load(responseNeosatsu.data);
            $neo('a').each((i, el) => {
                const href = $neo(el).attr('href') || '';
                if (href.includes('linkuzu') || href.includes('blogspot.com')) {
                    targetBlogspot = href;
                    return false;
                }
            });
        }

        let finalStreamUrl = "";

        if (targetBlogspot && targetBlogspot.includes('?url=')) {
            const rawParam = targetBlogspot.split('?url=')[1] || "";
            let cleanBase64 = rawParam;

            // A. Kupas pola pembatas depan czo...v
            if (cleanBase64.includes('czo')) {
                const parts = cleanBase64.split(/czo.*?v/);
                if (parts.length > 1) {
                    cleanBase64 = parts.slice(1).join('');
                }
            }

            // B. Kupas ekor string sebelum karakter sampah tambahan
            if (cleanBase64.includes('=')) {
                cleanBase64 = cleanBase64.split('=')[0];
            }

            try {
                // Seimbangkan padding Base64
                while (cleanBase64.length % 4 !== 0) {
                    cleanBase64 += '=';
                }
                
                // Decode teks hasil kupasan
                const decodedText = Buffer.from(cleanBase64, 'base64').toString('utf-8');
                
                // C. EKSTRAKSI ID UTAMA: Ambil 8 karakter ID Pixeldrain setelah teks /u/ atau /e/
                // Pola regex ini akan mencocokkan karakter alfanumerik sepanjang 8 digit setelah /u/ atau /e/
                const matchId = decodedText.match(/\/[ue]\/([A-Za-z0-9_-]{8})/);
                
                if (matchId && matchId[1]) {
                    const cleanId = matchId[1];
                    finalStreamUrl = `https://pixeldrain.com/e/${cleanId}`;
                }
            } catch (cryptoErr) {
                console.error("Gagal melakukan kalkulasi decode Base64:", cryptoErr);
            }
        }

        return res.status(200).json({
            success: true,
            streamUrl: finalStreamUrl || `https://pixeldrain.com/e/mjCAFV3U`
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
