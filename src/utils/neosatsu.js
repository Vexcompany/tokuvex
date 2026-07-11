// Fungsi utama untuk mengambil semua data list Tokusatsu (Kamen rider, Sentai, dll)
export const fetchNeosatsuData = async () => {
    try {
        const response = await fetch('/api/neosatsu'); 
        const json = await response.json();
        return json.success ? json.data : [];
    } catch (error) {
        console.error("Gagal mengambil data dari API:", error);
        return [];
    }
}

/**
 * FIX UNTUK WATCH.JSX BUILD ERROR:
 * Menyediakan fungsi fetchEpisodes agar compiler Vite tidak mogok.
 */
export const fetchEpisodes = async (seriesUrl) => {
    try {
        // Jika nanti kamu butuh scrape list episode spesifik di halaman dalam (Watch),
        // Kamu bisa arahkan fetch ke endpoint baru Vercel (misal: /api/episodes?url=...)
        // Untuk sekarang, kita return array kosong dulu agar build berhasil.
        return [];
    } catch (error) {
        console.error("Gagal fetch episodes:", error);
        return [];
    }
}

/**
 * FIX UNTUK SERIESCARD.JSX BUILD ERROR
 */
export const fetchPoster = async (url) => {
    return url || "";
}
