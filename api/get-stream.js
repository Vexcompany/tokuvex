import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { url, server } = req.query;
    if (!url) return res.status(400).json({ success: false, error: "Missing url parameter" });

    const reqServer = server || "pixeldrain";

    try {
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        };

        // 1. Ambil HTML halaman artikel Neosatsu
        const responseNeosatsu = await axios.get(url, { headers });
        const $neo = cheerio.load(responseNeosatsu.data);
        
        // Kumpulkan semua link alternatif yang ada di dalam artikel
        const collectedLinks = [];
        $neo('a').each((i, el) => {
            const href = $neo(el).attr('href') || '';
            if (href.includes('linkuzu') || href.includes('blogspot.com')) {
                if (!collectedLinks.includes(href)) {
                    collectedLinks.push(href);
                }
            }
        });

        // Jika request dari frontend dikirim langsung berupa link blogspot, masukkan ke list
        if (url.includes('linkuzu') || url.includes('blogspot.com')) {
            collectedLinks.push(url);
        }

        let finalStreamUrl = "";

        // 2. Iterasi & Urai setiap link yang terkumpul untuk mencari server yang cocok
        for (const blogUrl of collectedLinks) {
            if (!blogUrl.includes('?url=')) continue;

            const rawParam = blogUrl.split('?url=')[1] || "";
            let cleanBase64 = rawParam;

            // A. Kupas kepala czo...v
            if (cleanBase64.includes('czo')) {
                const parts = cleanBase64.split(/czo.*?v/);
                if (parts.length > 1) {
                    cleanBase64 = parts.slice(1).join('');
                }
            }

            // B. Kupas ekor string
            if (cleanBase64.includes('=')) {
                cleanBase64 = cleanBase64.split('=')[0];
            }

            try {
                while (cleanBase64.length % 4 !== 0) {
                    cleanBase64 += '=';
                }
                
                let decodedText = Buffer.from(cleanBase64, 'base64').toString('utf-8').trim();
                
                // Bersihkan karakter slash di depan
                if (decodedText.startsWith('/')) {
                    decodedText = decodedText.substring(1);
                }

                // C. COCOKKAN BERDASARKAN TOMBOL SERVER YANG DIMINTA FRONTEND
                if (reqServer === "gdrive" && decodedText.includes('drive.google.com')) {
                    const matchDriveId = decodedText.match(/id=([A-Za-z0-9_-]+)/);
                    if (matchDriveId && matchDriveId[1]) {
                        finalStreamUrl = `https://drive.google.com/file/d/${matchDriveId[1]}/preview`;
                        break; // Ketemu! Hentikan perulangan
                    }
                } 
                else if (reqServer === "pixeldrain" && decodedText.includes('pixeldrain.com')) {
                    const matchId = decodedText.match(/\/[ue]\/([A-Za-z0-9_-]{8})/);
                    if (matchId && matchId[1]) {
                        finalStreamUrl = `https://pixeldrain.com/e/${matchId[1]}`;
                    } else {
                        let cleanId = decodedText.replace('pixeldrain.com/u/', '').replace('pixeldrain.com/e/', '');
                        finalStreamUrl = `https://pixeldrain.com/e/${cleanId}`;
                    }
                    break; // Ketemu! Hentikan perulangan
                }
            } catch (cryptoErr) {
                console.error("Gagal mendecode salah satu parameter link:", cryptoErr);
            }
        }

        // 3. JALUR FALLBACK TERAKHIR: Jika loop di atas zonk, pasang video default agar tidak mental ke halaman web neosatsu
        if (!finalStreamUrl) {
            finalStreamUrl = `https://pixeldrain.com/e/mjCAFV3U`;
        }

        return res.status(200).json({
            success: true,
            streamUrl: finalStreamUrl
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
