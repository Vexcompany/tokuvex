import { useState, useEffect } from "react"
import { useParams, useLocation, Link } from "react-router-dom"

const Watch = () => {
  const { id } = useParams()
  const location = useLocation()
  const seriesTitle = location.state?.title || "Streaming Tokusatsu"
  
  const [playlist, setPlaylist] = useState([])
  const [activeEpisode, setActiveEpisode] = useState(null)

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

  return (
    <div style={{ color: "white", padding: "30px", backgroundColor: "#0e0f1a", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <Link to="/" style={{ color: "#00adb5", textDecoration: "none", fontWeight: "bold" }}>← Kembali ke Beranda</Link>
      
      <h1 style={{ marginTop: "15px", fontSize: "24px", color: "#fff" }}>{seriesTitle}</h1>
      
      <div style={{ display: "flex", gap: "25px", marginTop: "20px", flexWrap: "wrap" }}>
        
{/* AREA VIDEO PLAYER */}
<div style={{ flex: "2", minWidth: "500px" }}>
  <div style={{ 
    width: "100%", 
    aspectRatio: "16/9", 
    background: "#000", 
    borderRadius: "8px", 
    border: "1px solid #222", 
    overflow: "hidden", 
    position: "relative"
  }}>
    {activeEpisode?.url ? (
      <iframe
        src={activeEpisode.url} 
        title={activeEpisode.rawTitle}
        style={{ width: "100%", height: "100%", border: "none" }}
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-forms" 
      />
    ) : (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: "100%" }}>
        <span style={{ fontSize: "40px" }}>🎬</span>
        <h3 style={{ marginTop: "15px", color: "#aaa" }}>Memilih Episode...</h3>
      </div>
    )}
  </div>
  
  <div style={{ marginTop: "15px", padding: "15px", background: "#161722", borderRadius: "6px" }}>
    <h4>Sedang Diputar:</h4>
    <p style={{ color: "#00adb5", marginTop: "5px", fontWeight: "bold" }}>{activeEpisode?.rawTitle}</p>
  </div>
</div>

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
                    fontWeight: isActive ? "bold" : "normal",
                    cursor: "pointer", transition: "0.2s"
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
