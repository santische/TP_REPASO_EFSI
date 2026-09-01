import { useState, useEffect } from 'react'
import axios from 'axios'
import SearchBar from '../components/SearchBar'
import PokemonList from '../components/PokemonList'

function Home() {
  // Estado para guardar todos los pokémon cargados desde la API
  const [pokemones, setPokemones] = useState([])

  // Estado para el texto que escribe el usuario en el buscador
  const [busqueda, setBusqueda] = useState('')

  // Estado para saber si la API está cargando
  const [cargando, setCargando] = useState(true)

  // Estado para guardar un mensaje de error si algo sale mal
  const [error, setError] = useState(null)

  // Estado para los favoritos, lo inicializamos desde localStorage
  const [favoritos, setFavoritos] = useState(() => {
    const guardados = localStorage.getItem('favoritos')
    return guardados ? JSON.parse(guardados) : []
  })

  // useEffect para cargar los pokémon al iniciar la app
  useEffect(() => {
    const cargarPokemones = async () => {
      try {
        setCargando(true)
        setError(null)

        // Primero pedimos la lista con los nombres y URLs de los primeros 50 pokémon
        const respuesta = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=50')
        const lista = respuesta.data.results

        // Por cada pokémon pedimos su información detallada (imagen, tipo, peso)
        const detallados = await Promise.all(
          lista.map((p) => axios.get(p.url).then((res) => res.data))
        )

        setPokemones(detallados)
      } catch (err) {
        setError('No fue posible obtener la información.')
      } finally {
        setCargando(false)
      }
    }

    cargarPokemones()
  }, [])

  // useEffect para guardar los favoritos en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem('favoritos', JSON.stringify(favoritos))
  }, [favoritos])

  // Función para agregar o quitar un pokémon de favoritos
  const handleToggleFavorito = (pokemon) => {
    const yaEsFavorito = favoritos.some((fav) => fav.id === pokemon.id)

    if (yaEsFavorito) {
      // Si ya está, lo quitamos con filter
      setFavoritos(favoritos.filter((fav) => fav.id !== pokemon.id))
    } else {
      // Si no está, lo agregamos con spread operator
      setFavoritos([...favoritos, pokemon])
    }
  }

  // Filtramos los pokémon según lo que escribió el usuario
  const pokemonesFiltrados = pokemones.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(busqueda.toLowerCase())
  )

  // Renderizado condicional: cargando
  if (cargando) {
    return <p className="mensaje-estado">Cargando información...</p>
  }

  // Renderizado condicional: error
  if (error) {
    return <p className="mensaje-estado mensaje-error">{error}</p>
  }

  return (
    <div>
      <SearchBar busqueda={busqueda} onBusquedaChange={setBusqueda} />
      <PokemonList
        pokemones={pokemonesFiltrados}
        favoritos={favoritos}
        onToggleFavorito={handleToggleFavorito}
      />
    </div>
  )
}

export default Home
