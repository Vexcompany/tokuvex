import { useNavigate } from "react-router-dom"

const PLACEHOLDER = "https://placehold.co/180x260/0e0f1a/5a5c7a?text=No+Image"

const SeriesCard = ({ data }) => {
  const navigate = useNavigate()
  
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return null;
  }

  const posterUrl = data.thumbnail || PLACEHOLDER
  
  const title = data.title || "Untitled"
  
  const category = data.category || "Tokusatsu"

  return (
    <div 
      className="series-card" 
      onClick={() => navigate(`/series/${btoa(data.url)}`)}
      style={{ 
        cursor: 'pointer', 
        border: '1px solid #222', 
        borderRadius: '8px', 
        padding: '15px',
        backgroundColor: '#161722',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
      }}
    >
      <img 
        src={posterUrl} 
        alt={title} 
        style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '6px' }}
        onError={(e) => { e.target.src = PLACEHOLDER }} 
      />
      <div style={{ marginTop: '12px' }}>
        <h3 style={{ fontSize: '14px', color: 'white', margin: '0 0 5px 0', lineHeight: '1.4' }}>
          {title}
        </h3>
        <span className="badge-cat" style={{ fontSize: '12px', color: '#00adb5', fontWeight: 'bold' }}>
          {category}
        </span>
      </div>
    </div>
  )
}

export default SeriesCard
