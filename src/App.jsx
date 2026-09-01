import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import FavoritesPage from './pages/FavoritesPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="contenido-principal">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favoritos" element={<FavoritesPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
