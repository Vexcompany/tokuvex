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
    <div className="series-container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "20px", padding: "20px" }}>
      {seriesList.map((item, index) => (
        // Masukkan data hasil scrape ke properti data
        <SeriesCard key={index} data={item} />
      ))}
    </div>
  )
}

export default Home
