const axios = require('axios');
const cheerio = require('cheerio');

export default async function handler(req, res) {
    // 1. SUNTIKKAN SURAT IZIN CORS DI SINI (WAJIB)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // mengizinkan semua domain (termasuk localhost-mu)
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // 2. Handle Request Preflight (Uji coba otomatis dari browser)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 3. Masukkan Logika Scraper Agresif kita yang sudah sukses di Colab tadi
    const targetUrl = "https://www.neosatsu.com/";
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    };

    try {
        const response = await axios.get(targetUrl, { headers });
        const $ = cheerio.load(response.data);
        const allData = [];

        // Replikasi persis logika Python Colab ke Cheerio Node.js
        $('article, div').each((index, element) => {
            const className = $(element).attr('class') || '';
            
            // Cek apakah class mengandung indikasi post/item
            if (['post', 'item', 'b-item', 'hentry'].some(c => className.includes(c))) {
                const judul = $(element).find('.entry-title, .post-title, h2, h3').text().trim();
                const link = $(element).find('a').attr('href');
                const gambar = $(element).find('img').attr('src') || $(element).find('img').attr('data-src');
                const kategori = $(element).find('.category, .cat-links').text().trim() || "Tokusatsu";

                if (judul && link && link.startsWith('http') && judul.length > 5) {
                    // Hindari duplikasi data
                    if (!allData.some(item => item.title === judul)) {
                        allData.push({
                            title: judul,
                            url: link,
                            thumbnail: gambar,
                            category: kategori
                        });
                    }
                }
            }
        });

        // Kembalikan JSON matang
        return res.status(200).json({
            success: true,
            total_items: allData.length,
            data: allData
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
