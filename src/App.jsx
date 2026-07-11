import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Watch from "./pages/Watch" // Pastikan halaman Watch diimport

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute Halaman Utama */}
        <Route path="/" element={<Home />} />
        
        {/* FIX ERROR CONSOLE: Daftarkan rute series dengan parameter dinamis :id */}
        <Route path="/series/:id" element={<Watch />} />
      </Routes>
    </Router>
  )
}

export default App
