import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const PLACEHOLDER = "https://placehold.co/180x260/0e0f1a/5a5c7a?text=No+Image"

const SeriesCard = ({ data }) => {
  const navigate = useNavigate()

  const posterUrl = data?.thumbnail || PLACEHOLDER

  return (
    <div 
      className="series-card" 
      onClick={() => navigate(`/series/${btoa(data?.url)}`)}
      style={{ cursor: 'pointer', border: '1px solid #222', borderRadius: '8px', padding: '10px' }}
    >
      <img 
        src={posterUrl} 
        alt={data?.title || "Poster"} 
        style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '6px' }}
        onError={(e) => { e.target.src = PLACEHOLDER }} // Antisipasi jika link gambar mati
      />
      <h3 style={{ fontSize: '14px', marginTop: '8px' }}>{data?.title || "Untitled"}</h3>
      <span className="badge-cat" style={{ fontSize: '12px', color: '#aaa' }}>
        {data?.category || "Tokusatsu"}
      </span>
    </div>
  )
}

export default SeriesCard
