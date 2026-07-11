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

        const responseNeosatsu = await axios.get(url, { headers });
        const $neo = cheerio.load(responseNeosatsu.data);
        
        let targetBlogspot = "";
        $neo('a').each((i, el) => {
            const href = $neo(el).attr('href') || '';
            const text = $neo(el).text().toLowerCase();
            if (href.includes('linkuzu') || href.includes('blogspot.com') || text.includes('open link')) {
                targetBlogspot = href;
                return false;
            }
        });

        if (!targetBlogspot && url.includes('linkuzu')) {
            targetBlogspot = url;
        }

        let finalStreamUrl = "";

        if (targetBlogspot && targetBlogspot.includes('?url=')) {
            const rawParam = targetBlogspot.split('?url=')[1] || "";
            let cleanBase64 = rawParam.split('=')[0]; 
            
            if (cleanBase64.includes('758czo758v')) {
                cleanBase64 = cleanBase64.replace('758czo758v', '');
            }

            try {
                while (cleanBase64.length % 4 !== 0) {
                    cleanBase64 += '=';
                }
                
                let decodedText = Buffer.from(cleanBase64, 'base64').toString('utf-8').trim();
                
                if (decodedText.startsWith('/')) {
                    decodedText = decodedText.substring(1);
                }

                if (decodedText.includes('pixeldrain.com')) {
                    let cleanId = decodedText.replace('pixeldrain.com/u/', '').replace('pixeldrain.com/e/', '');
                    finalStreamUrl = `https://pixeldrain.com/e/${cleanId}`;
                }
            } catch (cryptoErr) {
                console.error("Gagal parsing base64:", cryptoErr);
            }
        }

        if (!finalStreamUrl && targetBlogspot && targetBlogspot.startsWith('http')) {
            try {
                const responseBlog = await axios.get(targetBlogspot, { headers });
                const $blog = cheerio.load(responseBlog.data);
                $blog('a, iframe').each((i, el) => {
                    const src = $blog(el).attr('src') || $blog(el).attr('href') || '';
                    if (src.includes('pixeldrain.com')) {
                        let cleanId = src.replace('https://pixeldrain.com/u/', '').replace('https://pixeldrain.com/e/', '').split('?')[0];
                        finalStreamUrl = `https://pixeldrain.com/e/${cleanId}`;
                        return false;
                    }
                });
            } catch (e) {
                console.error("Scraper blogspot gagal:", e);
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
