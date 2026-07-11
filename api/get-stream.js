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

        // 1. Scrape halaman Neosatsu jika input berupa link artikel utama
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

            // A. Potong pola enkripsi kepala (czo...v)
            if (cleanBase64.includes('czo')) {
                const parts = cleanBase64.split(/czo.*?v/);
                if (parts.length > 1) {
                    cleanBase64 = parts.slice(1).join('');
                }
            }

            // B. Potong ampas ekor string sebelum tanda sama dengan tambahan
            if (cleanBase64.includes('=')) {
                cleanBase64 = cleanBase64.split('=')[0];
            }

            try {
                // Seimbangkan padding Base64
                while (cleanBase64.length % 4 !== 0) {
                    cleanBase64 += '=';
                }
                
                // Decode teks utama
                let decodedText = Buffer.from(cleanBase64, 'base64').toString('utf-8').trim();
                
                // KUNCI UTAMA: Buang tanda slash (/) liar di baris paling depan jika ada!
                if (decodedText.startsWith('/')) {
                    decodedText = decodedText.substring(1);
                }

// C. LOGIKA PEMILIHAN OTOMATIS BERDASARKAN TOMBOL FRONTEND
                const reqServer = req.query.server || "pixeldrain";

                if (reqServer === "gdrive" && decodedText.includes('drive.google.com')) {
                    const matchDriveId = decodedText.match(/id=([A-Za-z0-9_-]+)/);
                    if (matchDriveId && matchDriveId[1]) {
                        finalStreamUrl = `https://drive.google.com/file/d/${matchDriveId[1]}/preview`;
                    }
                } else {
                    // Default / Fallback balik ke Pixeldrain
                    const matchId = decodedText.match(/\/[ue]\/([A-Za-z0-9_-]{8})/);
                    if (matchId && matchId[1]) {
                        finalStreamUrl = `https://pixeldrain.com/e/${matchId[1]}`;
                    } else {
                        let cleanId = decodedText.replace('pixeldrain.com/u/', '').replace('pixeldrain.com/e/', '');
                        finalStreamUrl = `https://pixeldrain.com/e/${cleanId}`;
                    }
                }
                // D. JALUR COCOK GOOGLE DRIVE
                else if (decodedText.includes('drive.google.com')) {
                    // Ambil ID file Google Drive dari parameter id=xxxx
                    const matchDriveId = decodedText.match(/id=([A-Za-z0-9_-]+)/);
                    if (matchDriveId && matchDriveId[1]) {
                        finalStreamUrl = `https://drive.google.com/file/d/${matchDriveId[1]}/preview`;
                    }
                }
            } catch (cryptoErr) {
                console.error("Gagal kalkulasi Base64:", cryptoErr);
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
