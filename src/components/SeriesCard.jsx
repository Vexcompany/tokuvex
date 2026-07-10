import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { fetchPoster } from "../utils/neosatsu"

const PLACEHOLDER = "https://placehold.co/180x260/0e0f1a/5a5c7a?text=Loading..."

export default function SeriesCard({ series, index }) {
  const [poster, setPoster] = useState(PLACEHOLDER)
  const [loaded, setLoaded] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    fetchPoster(series.link_sumber).then(url => {
      if (!cancelled) setPoster(url)
    })
    return () => { cancelled = true }
  }, [series.link_sumber])

  const slug = encodeURIComponent(series.nama)

  return (
    <div
      className="card-series group animate-fade-in"
      style={{ animationDelay: `${(index % 12) * 40}ms` }}
      onClick={() => navigate(`/tonton/${slug}`, { state: { series } })}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-panel">
        <img
          src={poster}
          alt={series.nama}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setPoster("https://placehold.co/180x260/0e0f1a/5a5c7a?text=No+Poster")
            setLoaded(true)
          }}
        />
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-plasma/30 border-t-plasma rounded-full animate-spin" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <span className="btn-primary text-xs py-1.5 px-3 w-full justify-center">
            ▶ Tonton Sekarang
          </span>
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-white leading-snug line-clamp-2 group-hover:text-plasma transition-colors duration-200">
          {series.nama}
        </p>
        <span className="section-label text-[10px] mt-1 block">{series.kategori}</span>
      </div>
    </div>
  )
}
