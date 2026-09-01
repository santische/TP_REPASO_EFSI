import { useState, useEffect } from 'react'
import Favorites from '../components/Favorites'

function FavoritesPage() {
  // Leemos los favoritos desde localStorage al entrar a esta página
  const [favoritos, setFavoritos] = useState(() => {
    const guardados = localStorage.getItem('favoritos')
    return guardados ? JSON.parse(guardados) : []
  })

  // Cada vez que cambian los favoritos, los guardamos en localStorage
  useEffect(() => {
    localStorage.setItem('favoritos', JSON.stringify(favoritos))
  }, [favoritos])

  // Función para quitar un pokémon de favoritos
  const handleToggleFavorito = (pokemon) => {
    setFavoritos(favoritos.filter((fav) => fav.id !== pokemon.id))
  }

  return (
    <div>
      <h2 className="seccion-titulo">Mis Favoritos</h2>
      <Favorites favoritos={favoritos} onToggleFavorito={handleToggleFavorito} />
    </div>
  )
}

export default FavoritesPage
