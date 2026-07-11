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

  if (loading) return <p style={{ color: "white", padding: "20px" }}>Loading Tokusatsu Terbaru...</p>

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "white", marginBottom: "20px" }}>Koleksi Terbaru</h2>
      
      {/* KUNCI PERBAIKAN GRID: Pastikan container membungkus .map dengan benar */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
        gap: "20px" 
      }}>
        {seriesList && seriesList.map((item, index) => (
          <SeriesCard key={index} data={item} />
        ))}
      </div>
    </div>
  )
}

export default Home
