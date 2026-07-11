// Fungsi utilitas utama untuk fetch API backend Vercel kamu
export const fetchNeosatsuData = async () => {
    try {
        // Ganti dengan endpoint Vercel production kamu nanti
        const response = await fetch('/api/neosatsu'); 
        const json = await response.json();
        return json.success ? json.data : [];
    } catch (error) {
        console.error("Gagal mengambil data dari API:", error);
        return [];
    }
}

/**
 * FIX UNTUK VITE BUILD ERROR:
 * Menyediakan fungsi ekspor cadangan agar compiler Rollup/Vite tidak mogok.
 */
export const fetchPoster = async (url) => {
    // Karena scraper baru sudah menyertakan gambar, fungsi ini return URL apa adanya jika dipanggil
    return url || "";
}
