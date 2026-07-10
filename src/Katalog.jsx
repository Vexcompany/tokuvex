import { useState, useMemo } from "react"
import SeriesCard from "../components/SeriesCard"
import { seriesList, kategoriList } from "../data/series"

export default function Katalog() {
  const [aktif, setAktif] = useState("Semua")
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    return seriesList.filter(s => {
      const cocokKategori = aktif === "Semua" || s.kategori === aktif
      const cocokQuery = s.nama.toLowerCase().includes(query.toLowerCase())
      return cocokKategori && cocokQuery
    })
  }, [aktif, query])

  const tabs = ["Semua", ...kategoriList]

  return (
    <main className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <span className="section-label block mb-1">Koleksi Lengkap</span>
        <h1 className="text-2xl font-semibold text-white">Katalog Series</h1>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex gap-2 flex-wrap">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setAktif(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                aktif === t
                  ? "bg-rider text-white"
                  : "bg-panel border border-border text-muted hover:text-white hover:border-plasma/40"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari series..."
            className="pl-9 pr-4 py-2 bg-panel border border-border rounded-lg text-white placeholder-muted text-sm focus:outline-none focus:border-plasma/50 transition-colors duration-200 w-full sm:w-56"
          />
        </div>
      </div>

      {/* RESULT COUNT */}
      <p className="section-label mb-5">
        {filtered.length} series ditemukan
      </p>

      {/* GRID */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-4xl mb-3">🎭</p>
          <p className="text-white font-medium mb-1">Tidak ada series</p>
          <p className="text-muted text-sm">Coba kata kunci lain</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
          {filtered.map((s, i) => (
            <SeriesCard key={s.nama} series={s} index={i} />
          ))}
        </div>
      )}
    </main>
  )
}
