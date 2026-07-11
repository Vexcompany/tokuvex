import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"

const Watch = () => {
  const { id } = useParams()
  const [decodedUrl, setDecodedUrl] = useState("")

  useEffect(() => {
    try {
      if (id) {
        const urlAsli = atob(id)
        setDecodedUrl(urlAsli)
      }
    } catch (error) {
      console.error("Gagal mendecode ID URL:", error)
    }
  }, [id])

  return (
    <div style={{ color: "white", padding: "20px" }}>
      <Link to="/" style={{ color: "#00adb5", textDecoration: "none" }}>← Kembali ke Beranda</Link>
      
      <h1 style={{ marginTop: "20px" }}>Halaman Nonton Tokusatsu</h1>
      <p style={{ color: "#888", fontSize: "14px" }}>Target Stream URL: {decodedUrl}</p>

      <div style={{ background: "#111", padding: "40px", borderRadius: "8px", textAlign: "center", marginTop: "20px" }}>
        <h3>Bagian Pemutar Video / Daftar Link</h3>
        <p style={{ color: "#aaa" }}>Siap dipasangkan dengan scraper halaman dalam nanti!</p>
      </div>
    </div>
  )
}

export default Watch
