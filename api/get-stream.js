import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ success: false, error: "Missing url parameter" });
    }

    try {
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        };
        const response = await axios.get(url, { headers });
        const $ = cheerio.load(response.data);

        let videoUrl = "";

        $('iframe').each((index, element) => {
            const src = $(element).attr('src') || '';
            if (src.includes('blogger.com') || src.includes('krakenfiles') || src.includes('pixeldrain') || src.includes('drive.google')) {
                videoUrl = src;
                return false;
            }
        });

        if (!videoUrl) {
            const fallbackSrc = $('.entry-content iframe, .video-content iframe, #embed-player iframe').attr('src');
            if (fallbackSrc) videoUrl = fallbackSrc;
        }

        return res.status(200).json({
            success: true,
            streamUrl: videoUrl || url 
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
