import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Katalog from "./pages/Katalog"
import Watch from "./pages/Watch"

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/katalog" element={<Katalog />} />
            <Route path="/tonton/:slug" element={<Watch />} />
          </Routes>
        </div>
        <footer className="border-t border-border py-6 px-4 text-center">
          <p className="text-muted text-xs font-mono">
            TOKUVEX · Data dari{" "}
            <a href="https://www.neosatsu.com" target="_blank" rel="noopener noreferrer" className="hover:text-plasma transition-colors">
              Neosatsu
            </a>
            {" "}· Streaming via Pixeldrain
          </p>
        </footer>
      </div>
    </BrowserRouter>
  )
}
