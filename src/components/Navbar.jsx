import { Link, useLocation } from "react-router-dom"

export default function Navbar() {
  const loc = useLocation()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-void/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="font-display text-2xl tracking-widest text-rider group-hover:text-glow-red transition-all duration-300">
            TOKUVEX
          </span>
          <span className="badge bg-plasma/10 text-plasma border border-plasma/20">BETA</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
              loc.pathname === "/"
                ? "text-white bg-border"
                : "text-muted hover:text-white"
            }`}
          >
            Beranda
          </Link>
          <Link
            to="/katalog"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
              loc.pathname.startsWith("/katalog")
                ? "text-white bg-border"
                : "text-muted hover:text-white"
            }`}
          >
            Katalog
          </Link>
        </nav>
      </div>
    </header>
  )
}
