import { useState, useEffect } from "react"
import { fetchNeosatsuData } from "../utils/neosatsu"
import SeriesCard from "../components/SeriesCard"

const Home = () => {
  const [seriesList, setSeriesList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getData = async () => {
      const data = await fetchNeosatsuData()
      setSeriesList(data)
      setLoading(false)
    }
    getData()
  }, [])

  if (loading) {
    return (
      <div style={{ color: "white", padding: "40px", textAlign: "center", fontFamily: "sans-serif" }}>
        <h3>Membuka Gerbang Tokusatsu Terbaru...</h3>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: "#0e0f1a", minHeight: "100vh", padding: "30px", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "white", marginBottom: "25px", fontWeight: "bold", borderLeft: "4px solid #00adb5", paddingLeft: "10px" }}>
        Koleksi Terbaru
      </h2>
      
      {/* KUNCI STRUKTUR GRID: Mengatur tata letak kotak pembungkus */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
        gap: "20px" 
      }}>
        {seriesList && seriesList.length > 0 ? (
          seriesList.map((item, index) => (
            <SeriesCard key={index} data={item} />
          ))
        ) : (
          <p style={{ color: "#aaa" }}>Tidak ada data yang berhasil dimuat.</p>
        )}
      </div>
    </div>
  )
}

export default Home
