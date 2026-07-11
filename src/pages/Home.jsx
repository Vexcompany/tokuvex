import { useState, useEffect } from "react"
import { fetchNeosatsuData } from "../utils/neosatsu"
import SeriesCard from "../components/SeriesCard"

const Home = () => {
  const [groupedSeries, setGroupedSeries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getData = async () => {
      const rawData = await fetchNeosatsuData()
      
      const groups = {}
      
      rawData.forEach(item => {
        let namaInduk = item.title
          .replace(/\(Episode\s*\d+\)/gi, '')
          .replace(/Episode\s*\d+/gi, '')
          .replace(/Subtitle\s*Indonesia/gi, '')
          .replace(/Batch/gi, '')
          .trim()

        if (!groups[namaInduk]) {
          groups[namaInduk] = {
            title: namaInduk,
            thumbnail: item.thumbnail,
            category: item.category,
            episodes: [] 
          }
        }
        
        groups[namaInduk].episodes.push({
          rawTitle: item.title,
          url: item.url
        })
      })

      setGroupedSeries(Object.values(groups))
      setLoading(false)
    }
    getData()
  }, [])

  if (loading) return <div style={{ color: "white", padding: "40px", textAlign: "center" }}><h3>Membuka Gerbang Tokusatsu...</h3></div>

  return (
    <div style={{ backgroundColor: "#0e0f1a", minHeight: "100vh", padding: "30px", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "white", marginBottom: "25px", fontWeight: "bold", borderLeft: "4px solid #00adb5", paddingLeft: "10px" }}>
        Daftar Series Tokusatsu
      </h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
        {groupedSeries.map((series, index) => (
          <SeriesCard key={index} data={series} />
        ))}
      </div>
    </div>
  )
}

export default Home
