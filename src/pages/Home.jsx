import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import SeriesCard from "../components/SeriesCard"
import { seriesList } from "../data/series"

const FEATURED = seriesList.slice(0, 5)
const RECENT = seriesList.slice(0, 12)

export default function Home() {
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    if (!query.trim()) return []
    return seriesList.filter(s =>
      s.nama.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-rider/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-plasma/8 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 39px, #4f8eff 39px, #4f8eff 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, #4f8eff 39px, #4f8eff 40px)"
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <span className="section-label mb-4 block">Platform Streaming</span>
          <h1 className="font-display text-6xl md:text-8xl tracking-widest text-white mb-2">
            TOKU<span className="text-rider text-glow-red">VEX</span>
          </h1>
          <p className="text-muted text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Nonton Tokusatsu favorit kamu dengan subtitle Indonesia. Kamen Rider, Super Sentai, dan banyak lagi.
          </p>

          {/* SEARCH BAR */}
          <div className="relative max-w-lg mx-auto">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Cari series, e.g. Kamen Rider Build..."
              className="w-full pl-10 pr-4 py-3.5 bg-panel border border-border rounded-xl text-white placeholder-muted text-sm focus:outline-none focus:border-plasma/50 transition-colors duration-200"
            />
          </div>

          {/* SEARCH RESULTS */}
          {query && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-full max-w-lg bg-panel border border-border rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
              {results.length === 0 ? (
                <p className="px-4 py-6 text-muted text-sm">Tidak ada hasil untuk "{query}"</p>
              ) : (
                results.slice(0, 6).map(s => (
                  <Link
                    key={s.nama}
                    to={`/tonton/${encodeURIComponent(s.nama)}`}
                    state={{ series: s }}
                    onClick={() => setQuery("")}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-border transition-colors duration-150 border-b border-border/50 last:border-0"
                  >
                    <span className="w-8 h-8 rounded-lg bg-rider/15 flex items-center justify-center text-rider text-xs font-bold flex-shrink-0">
                      {s.nama.charAt(s.nama.lastIndexOf(" ") + 1)}
                    </span>
                    <div className="text-left min-w-0">
                      <p className="text-sm font-medium text-white truncate">{s.nama}</p>
                      <p className="section-label text-[10px]">{s.kategori}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* STATS */}
      <section className="px-4 max-w-7xl mx-auto mb-12">
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          {[
            { val: seriesList.length, label: "Series" },
            { val: "39+", label: "Rider" },
            { val: "HD", label: "Kualitas" },
          ].map(s => (
            <div key={s.label} className="text-center p-4 rounded-xl border border-border bg-panel">
              <p className="font-display text-3xl text-rider">{s.val}</p>
              <p className="section-label text-[10px] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RECENT SERIES */}
      <section className="px-4 max-w-7xl mx-auto pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="section-label block mb-1">Koleksi Terbaru</span>
            <h2 className="text-xl font-semibold text-white">Series Populer</h2>
          </div>
          <Link to="/katalog" className="btn-ghost text-xs">
            Lihat Semua →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {RECENT.map((s, i) => (
            <SeriesCard key={s.nama} series={s} index={i} />
          ))}
        </div>
      </section>
    </main>
  )
}
