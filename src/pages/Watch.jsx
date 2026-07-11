import { useState, useEffect } from "react"
import { useParams, useLocation, Link } from "react-router-dom"

const Watch = () => {
  const { id } = useParams()
  const location = useLocation()
  const seriesTitle = location.state?.title || "Streaming Tokusatsu"
  
  const [playlist, setPlaylist] = useState([])
  const [activeEpisode, setActiveEpisode] = useState(null)
  const [embedUrl, setEmbedUrl] = useState("")
  const [loadingVideo, setLoadingVideo] = useState(false)
  
  // State untuk menyimpan pilihan server aktif ('pixeldrain' atau 'gdrive')
  const [currentServer, setCurrentServer] = useState("pixeldrain")

  // 1. Urai Playlist saat halaman dibuka
  useEffect(() => {
    if (id) {
      try {
        const decodedString = decodeURIComponent(escape(atob(id)))
        const listEpisode = JSON.parse(decodedString)
        setPlaylist(listEpisode)
        
        if (listEpisode.length > 0) {
          setActiveEpisode(listEpisode[0])
        }
      } catch (e) {
        console.error("Gagal memuat playlist:", e)
      }
    }
  }, [id])

  // 2. Ambil Stream berdasarkan Episode AKTIF dan SERVER yang dipilih
  useEffect(() => {
    const fetchRealStream = async () => {
      if (!activeEpisode?.url) return

      setLoadingVideo(true)
      try {
        // Kirim url episode BESERTA jenis server yang dimau ke backend
        const res = await fetch(`/api/get-stream?url=${encodeURIComponent(activeEpisode.url)}&server=${currentServer}`)
        const json = await res.json()
        
        if (json.success && json.streamUrl) {
          setEmbedUrl(json.streamUrl)
        } else {
          setEmbedUrl(activeEpisode.url)
        }
      } catch (err) {
        console.error("Gagal menarik video stream:", err)
        setEmbedUrl(activeEpisode.url)
      } finally {
        setLoadingVideo(false)
      }
    }

    fetchRealStream()
  }, [activeEpisode, currentServer]) // Akan merefresh video tiap kali tombol server diganti!

  return (
    <div style={{ color: "white", padding: "30px", backgroundColor: "#0e0f1a", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <Link to="/" style={{ color: "#00adb5", textDecoration: "none", fontWeight: "bold" }}>← Kembali ke Beranda</Link>
      
      <h1 style={{ marginTop: "15px", fontSize: "24px", color: "#fff" }}>{seriesTitle}</h1>
      
      <div style={{ display: "flex", gap: "25px", marginTop: "20px", flexWrap: "wrap" }}>
        
        {/* AREA VIDEO PLAYER */}
        <div style={{ flex: "2", minWidth: "500px" }}>
          <div style={{ 
            width: "100%", aspectRatio: "16/9", background: "#000", 
            borderRadius: "8px", border: "1px solid #222", overflow: "hidden", position: "relative"
          }}>
            {loadingVideo ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <p style={{ color: "#00adb5" }}>Mengalihkan Server & Membypass Iklan...</p>
              </div>
            ) : embedUrl ? (
              <iframe
                src={embedUrl}
                title={activeEpisode?.rawTitle}
                style={{ width: "100%", height: "100%", border: "none" }}
                allowFullScreen
              />
            ) : (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <p style={{ color: "#aaa" }}>Silakan pilih episode</p>
              </div>
            )}
          </div>

          {/* Navigasi Pilihan Server */}
          <div style={{ marginTop: "15px", display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "14px", color: "#aaa", marginRight: "5px" }}>Pilih Server:</span>
            
            <button 
              onClick={() => setCurrentServer("pixeldrain")}
              style={{
                padding: "8px 16px", borderRadius: "4px", border: "none", cursor: "pointer",
                backgroundColor: currentServer === "pixeldrain" ? "#00adb5" : "#1f202f",
                color: currentServer === "pixeldrain" ? "#000" : "#fff", fontWeight: "bold"
              }}
            >
              🚀 Pixeldrain (Fast)
            </button>

            <button 
              onClick={() => setCurrentServer("gdrive")}
              style={{
                padding: "8px 16px", borderRadius: "4px", border: "none", cursor: "pointer",
                backgroundColor: currentServer === "gdrive" ? "#25d366" : "#1f202f",
                color: currentServer === "gdrive" ? "#000" : "#fff", fontWeight: "bold"
              }}
            >
              🎬 Google Drive (HD)
            </button>
          </div>
          
          <div style={{ marginTop: "15px", padding: "15px", background: "#161722", borderRadius: "6px" }}>
            <h4>Sedang Diputar:</h4>
            <p style={{ color: "#00adb5", marginTop: "5px", fontWeight: "bold" }}>{activeEpisode?.rawTitle}</p>
          </div>
        </div>

        {/* AREA HOTBAR LIST EPISODE */}
        <div style={{ flex: "1", minWidth: "280px", background: "#161722", padding: "20px", borderRadius: "8px", border: "1px solid #222", maxHeight: "450px", overflowY: "auto" }}>
          <h3 style={{ fontSize: "16px", marginBottom: "15px", borderBottom: "1px solid #333", paddingBottom: "10px", color: "#00adb5" }}>
            Daftar Episode ({playlist.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {playlist.map((ep, idx) => {
              const isActive = activeEpisode?.url === ep.url
              return (
                <button
                  key={idx}
                  onClick={() => setActiveEpisode(ep)}
                  style={{
                    textAlign: "left", padding: "12px", borderRadius: "6px", border: "none",
                    backgroundColor: isActive ? "#00adb5" : "#1f202f",
                    color: isActive ? "#000" : "#fff",
                    fontWeight: isActive ? "bold" : "normal", cursor: "pointer"
                  }}
                >
                  {ep.rawTitle.split("Subtitle")[0]}
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Watch
