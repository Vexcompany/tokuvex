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

        // 1. Jika rute dari frontend masih mengarah ke artikel Neosatsu, cari dulu link Blogspot-nya
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
            
            // --- ALGORITMA DEKRIPSI LINKUZU VERSI 2026 ---
            let cleanBase64 = rawParam;

            // A. Kupas bagian depan (mencari pola ...czo...v)
            if (cleanBase64.includes('czo')) {
                const parts = cleanBase64.split(/czo.*?v/);
                if (parts.length > 1) {
                    cleanBase64 = parts.slice(1).join(''); // Ambil string setelah huruf 'v' pembatas
                }
            }

            // B. Kupas ampas di ekor string (memotong setelah tanda '=' pertama jika ada teks acak)
            if (cleanBase64.includes('=')) {
                cleanBase64 = cleanBase64.split('=')[0] + '=';
            }

            try {
                // Sempurnakan padding agar valid Base64
                while (cleanBase64.length % 4 !== 0) {
                    cleanBase64 += '=';
                }
                
                let decodedText = Buffer.from(cleanBase64, 'base64').toString('utf-8').trim();
                
                // Hilangkan tanda slash liar di depan hasil decode jika ada
                if (decodedText.startsWith('/')) {
                    decodedText = decodedText.substring(1);
                }

                if (decodedText.includes('pixeldrain.com')) {
                    // Ekstrak ID unik file Pixeldrain secara bersih
                    let cleanId = decodedText
                        .replace('pixeldrain.com/u/', '')
                        .replace('pixeldrain.com/e/', '')
                        .trim();
                        
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
