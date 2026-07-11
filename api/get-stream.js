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
        
        let blogspotUrl = "";
        $neo('a').each((i, el) => {
            const href = $neo(el).attr('href') || '';
            if (href.includes('linkuzu') || href.includes('blogspot.com') || $neo(el).text().toLowerCase().includes('open link')) {
                blogspotUrl = href;
                return false;
            }
        });
        
        if (!blogspotUrl) blogspotUrl = url;

        let directStream = "";
        if (blogspotUrl.includes('?url=')) {
            const encodedPart = blogspotUrl.split('?url=')[1] || "";
            let cleanBase64 = encodedPart.split('=')[0] + '=';
            
            try {
                if (cleanBase64.startsWith('758czo758v')) {
                    cleanBase64 = cleanBase64.replace('758czo758v', '');
                }
                const decoded = atob(cleanBase64);
                if (decoded.includes('pixeldrain.com')) {
                    directStream = decoded.replace('/u/', '/e/'); 
                }
            } catch (e) {
                console.log("Gagal decode langsung, lanjut scrape standar.");
            }
        }

        if (!directStream && blogspotUrl.startsWith('http')) {
            const responseBlog = await axios.get(blogspotUrl, { headers });
            const $blog = cheerio.load(responseBlog.data);
            
            $blog('a, iframe').each((i, el) => {
                const src = $blog(el).attr('src') || $blog(el).attr('href') || '';
                if (src.includes('pixeldrain.com')) {
                    directStream = src.replace('/u/', '/e/'); 
                    return false;
                }
            });
        }

        if (directStream && directStream.includes('pixeldrain.com') && !directStream.includes('/e/')) {
            directStream = directStream.replace('/u/', '/e/');
        }

        return res.status(200).json({
            success: true,
            streamUrl: directStream || `https://pixeldrain.com/e/mjCAFV3U` 
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
