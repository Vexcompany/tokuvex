import { useState, useEffect, useCallback } from "react"
import { useParams, useLocation, Link } from "react-router-dom"
import { fetchEpisodes, fetchPoster } from "../utils/neosatsu"
import { seriesList } from "../data/series"

export default function Watch() {
  const { slug } = useParams()
  const { state } = useLocation()
  const nama = decodeURIComponent(slug)

  const series = state?.series || seriesList.find(s => s.nama === nama)

  const [episodes, setEpisodes] = useState([])
  const [poster, setPoster] = useState(null)
  const [loading, setLoading] = useState(true)
  const [aktifEps, setAktifEps] = useState(null)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    if (!series) return
    setLoading(true)
    setError(false)
    try {
      const [eps, img] = await Promise.all([
        fetchEpisodes(series.link_sumber),
        fetchPoster(series.link_sumber),
      ])
      setEpisodes(eps)
      setPoster(img)
      if (eps.length > 0) setAktifEps(eps[0])
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [series])

  useEffect(() => { load() }, [load])

  if (!series) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-5xl mb-4">🎭</p>
          <p className="text-white font-medium mb-2">Series tidak ditemukan</p>
          <Link to="/katalog" className="btn-ghost">← Kembali ke Katalog</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      {/* BREADCRUMB */}
      <div className="px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
          <span>/</span>
          <Link to="/katalog" className="hover:text-white transition-colors">Katalog</Link>
          <span>/</span>
          <span className="text-white truncate max-w-[180px]">{series.nama}</span>
        </div>
      </div>

      <div className="px-4 max-w-7xl mx-auto pb-16">
        {loading ? (
          <LoadingState nama={series.nama} />
        ) : error ? (
          <ErrorState onRetry={load} />
        ) : episodes.length === 0 ? (
          <EmptyState series={series} poster={poster} />
        ) : (
          <PlayerLayout
            series={series}
            poster={poster}
            episodes={episodes}
            aktifEps={aktifEps}
            setAktifEps={setAktifEps}
          />
        )}
      </div>
    </main>
  )
}

function PlayerLayout({ series, poster, episodes, aktifEps, setAktifEps }) {
  const idx = episodes.findIndex(e => e.id_file === aktifEps?.id_file)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      {/* PLAYER AREA */}
      <div>
        <div className="relative bg-black rounded-2xl overflow-hidden aspect-video border border-border shadow-2xl shadow-black/50">
          {aktifEps ? (
            <video
              key={aktifEps.id_file}
              src={aktifEps.url_embed}
              controls
              autoPlay
              className="w-full h-full"
            >
              Browser kamu tidak mendukung pemutar video.
            </video>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted text-sm">Pilih episode</p>
            </div>
          )}
        </div>

        {/* NOW PLAYING INFO */}
        {aktifEps && (
          <div className="mt-4 flex items-start gap-4">
            {poster && (
              <img
                src={poster}
                alt={series.nama}
                className="w-14 h-20 rounded-lg object-cover flex-shrink-0 border border-border hidden sm:block"
                onError={e => { e.target.style.display = "none" }}
              />
            )}
            <div className="flex-1 min-w-0">
              <span className="section-label text-[10px]">Sedang diputar</span>
              <h1 className="text-lg font-semibold text-white mt-0.5 leading-tight">{series.nama}</h1>
              <p className="text-plasma text-sm font-mono mt-1">{aktifEps.episode}</p>
            </div>
            <a
              href={aktifEps.url_download}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-xs flex-shrink-0"
            >
              ⬇ Download
            </a>
          </div>
        )}

        {/* PREV / NEXT */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => idx > 0 && setAktifEps(episodes[idx - 1])}
            disabled={idx <= 0}
            className="btn-ghost text-xs flex-1 justify-center disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Episode Sebelumnya
          </button>
          <button
            onClick={() => idx < episodes.length - 1 && setAktifEps(episodes[idx + 1])}
            disabled={idx >= episodes.length - 1}
            className="btn-primary text-xs flex-1 justify-center disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Episode Berikutnya →
          </button>
        </div>
      </div>

      {/* EPISODE LIST */}
      <div className="bg-panel border border-border rounded-2xl overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div>
            <span className="section-label text-[10px] block">Daftar Putar</span>
            <p className="text-white text-sm font-medium">{episodes.length} Episode</p>
          </div>
          <span className="badge bg-rider/15 text-rider border border-rider/20">
            {idx + 1}/{episodes.length}
          </span>
        </div>

        <div className="overflow-y-auto flex-1" style={{ maxHeight: "480px" }}>
          {episodes.map((eps, i) => {
            const isAktif = eps.id_file === aktifEps?.id_file
            return (
              <button
                key={eps.id_file}
                onClick={() => setAktifEps(eps)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors duration-150 border-b border-border/40 last:border-0 ${
                  isAktif
                    ? "bg-plasma/10 border-l-2 border-l-plasma"
                    : "hover:bg-border/50"
                }`}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono flex-shrink-0 ${
                  isAktif
                    ? "bg-plasma text-void font-bold"
                    : "bg-border text-muted"
                }`}>
                  {isAktif ? "▶" : i + 1}
                </span>
                <span className={`text-sm leading-snug truncate ${isAktif ? "text-white font-medium" : "text-muted"}`}>
                  {eps.episode}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function LoadingState({ nama }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-2 border-rider/20 rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-rider rounded-full animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-white font-medium">{nama}</p>
        <p className="text-muted text-sm mt-1">Memuat daftar episode...</p>
      </div>
    </div>
  )
}

function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <p className="text-4xl">⚠️</p>
      <div className="text-center">
        <p className="text-white font-medium mb-1">Gagal memuat episode</p>
        <p className="text-muted text-sm mb-4">Periksa koneksi dan coba lagi</p>
        <button onClick={onRetry} className="btn-primary">Coba Lagi</button>
      </div>
    </div>
  )
}

function EmptyState({ series, poster }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center max-w-sm mx-auto">
      {poster && (
        <img
          src={poster}
          alt={series.nama}
          className="w-28 rounded-xl border border-border opacity-60"
          onError={e => { e.target.style.display = "none" }}
        />
      )}
      <div>
        <p className="text-white font-medium">{series.nama}</p>
        <p className="text-muted text-sm mt-1 mb-4">
          Tidak ada episode yang ditemukan. Kemungkinan format link berbeda atau belum ada upload.
        </p>
        <a href={series.link_sumber} target="_blank" rel="noopener noreferrer" className="btn-ghost text-xs">
          Buka di Neosatsu ↗
        </a>
      </div>
    </div>
  )
}
