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

export const fetchEpisodes = async (seriesUrl) => {
    try {
        return [];
    } catch (error) {
        console.error("Gagal fetch episodes:", error);
        return [];
    }
}

export const fetchPoster = async (url) => {
    return url || "";
}
