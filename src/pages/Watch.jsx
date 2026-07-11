import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"

const Watch = () => {
  const { id } = useParams()
  const [decodedUrl, setDecodedUrl] = useState("")
  const [error, setError] = useState(false)

  useEffect(() => {
    if (id) {
      try {
        const base64Standard = id.replace(/-/g, '/').replace(/_/g, '+');
        const urlAsli = atob(base64Standard);
        setDecodedUrl(urlAsli);
        setError(false);
      } catch (e) {
        console.error("Gagal membaca ID rute:", e);
        setError(true);
      }
    }
  }, [id])

  return (
    <div style={{ color: "white", padding: "30px", backgroundColor: "#0e0f1a", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <Link to="/" style={{ color: "#00adb5", textDecoration: "none", fontWeight: "bold" }}>← Kembali ke Beranda</Link>
      
      <h1 style={{ marginTop: "20px", fontSize: "24px" }}>Halaman Nonton Tokusatsu</h1>
      
      {error ? (
        <p style={{ color: "red", marginTop: "20px" }}>Error: Data series tidak valid atau rute rusak.</p>
      ) : (
        <>
          <p style={{ color: "#666", fontSize: "14px", wordBreak: "break-all" }}>Target Stream URL: {decodedUrl}</p>

          <div style={{ background: "#161722", padding: "40px", borderRadius: "8px", textAlign: "center", marginTop: "20px", border: "1px solid #222" }}>
            <h3 style={{ color: "#fff" }}>Bagian Pemutar Video / Daftar Link</h3>
            <p style={{ color: "#888", fontSize: "14px" }}>Siap dipasangkan dengan scraper halaman dalam nanti!</p>
          </div>
        </>
      )}
    </div>
  )
}

export default Watch
