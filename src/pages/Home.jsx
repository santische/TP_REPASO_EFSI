import { useState, useEffect } from 'react'
import axios from 'axios'
import SearchBar from '../components/SearchBar'
import PokemonList from '../components/PokemonList'

const CANTIDAD_INICIAL = 100
const CANTIDAD_MAS = 50

function Home() {
  // Pokémon con detalle ya cargados (los que se muestran en la lista normal)
  const [pokemones, setPokemones] = useState([])

  // Lista completa de nombres/urls (sin detalle) que trae la API
  const [listaCompleta, setListaCompleta] = useState([])

  // Pokémon con detalle que coinciden con la búsqueda
  const [resultadosBusqueda, setResultadosBusqueda] = useState([])

  // Cuántos pokémon estamos mostrando en el modo normal
  const [cantidadVisible, setCantidadVisible] = useState(CANTIDAD_INICIAL)

  // Texto del buscador
  const [busqueda, setBusqueda] = useState('')

  // Estados de carga
  const [cargando, setCargando] = useState(true)
  const [cargandoMas, setCargandoMas] = useState(false)
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false)

  // Estado de error
  const [error, setError] = useState(null)

  // Favoritos desde localStorage
  const [favoritos, setFavoritos] = useState(() => {
    const guardados = localStorage.getItem('favoritos')
    return guardados ? JSON.parse(guardados) : []
  })

  // Al iniciar: traemos la lista completa y cargamos los primeros 100 con detalle
  useEffect(() => {
    const cargarPokemones = async () => {
      try {
        setCargando(true)
        setError(null)

        const respuesta = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000')
        const lista = respuesta.data.results
        setListaCompleta(lista)

        const primeros = lista.slice(0, CANTIDAD_INICIAL)
        const detallados = await Promise.all(
          primeros.map((p) => axios.get(p.url).then((res) => res.data))
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

  // Cuando cambia la búsqueda, filtramos la lista completa por nombre y cargamos el detalle
  useEffect(() => {
    // Si el buscador está vacío, no hacemos nada
    if (busqueda.trim() === '') {
      setResultadosBusqueda([])
      return
    }

    const buscarEnTodos = async () => {
      try {
        setCargandoBusqueda(true)
        setError(null)

        // Filtramos la lista completa por nombre (solo texto, muy rápido)
        const coincidencias = listaCompleta.filter((p) =>
          p.name.toLowerCase().includes(busqueda.toLowerCase())
        )

        // Cargamos el detalle solo de los que coinciden
        const detallados = await Promise.all(
          coincidencias.map((p) => axios.get(p.url).then((res) => res.data))
        )

        setResultadosBusqueda(detallados)
      } catch (err) {
        setError('No fue posible realizar la búsqueda.')
      } finally {
        setCargandoBusqueda(false)
      }
    }

    // Esperamos 400ms después de que el usuario deja de escribir para no hacer una llamada por cada letra
    const temporizador = setTimeout(buscarEnTodos, 400)
    return () => clearTimeout(temporizador)
  }, [busqueda, listaCompleta])

  // Guardar favoritos en localStorage
  useEffect(() => {
    localStorage.setItem('favoritos', JSON.stringify(favoritos))
  }, [favoritos])

  // Cargar 50 pokémon más en el modo normal
  const cargarMas = async () => {
    try {
      setCargandoMas(true)

      const siguiente = cantidadVisible
      const hasta = siguiente + CANTIDAD_MAS
      const bloque = listaCompleta.slice(siguiente, hasta)

      const detallados = await Promise.all(
        bloque.map((p) => axios.get(p.url).then((res) => res.data))
      )

      setPokemones((prev) => [...prev, ...detallados])
      setCantidadVisible(hasta)
    } catch (err) {
      setError('No fue posible cargar más pokémon.')
    } finally {
      setCargandoMas(false)
    }
  }

  // Agregar o quitar de favoritos
  const handleToggleFavorito = (pokemon) => {
    const yaEsFavorito = favoritos.some((fav) => fav.id === pokemon.id)

    if (yaEsFavorito) {
      setFavoritos(favoritos.filter((fav) => fav.id !== pokemon.id))
    } else {
      setFavoritos([...favoritos, pokemon])
    }
  }

  // Decidimos qué lista mostrar: si hay búsqueda usamos resultadosBusqueda, sino pokemones
  const estaBuscando = busqueda.trim() !== ''
  const pokemonesAMostrar = estaBuscando ? resultadosBusqueda : pokemones

  // Solo mostramos el botón "Cargar más" cuando no hay búsqueda activa
  const hayMas = !estaBuscando && cantidadVisible < listaCompleta.length

  if (cargando) {
    return <p className="mensaje-estado">Cargando información...</p>
  }

  if (error) {
    return <p className="mensaje-estado mensaje-error">{error}</p>
  }

  return (
    <div>
      <SearchBar busqueda={busqueda} onBusquedaChange={setBusqueda} />

      {/* Mientras busca en toda la lista mostramos un mensaje */}
      {cargandoBusqueda && (
        <p className="mensaje-estado">Buscando en todos los pokémon...</p>
      )}

      {!cargandoBusqueda && (
        <PokemonList
          pokemones={pokemonesAMostrar}
          favoritos={favoritos}
          onToggleFavorito={handleToggleFavorito}
        />
      )}

      {hayMas && (
        <div className="cargar-mas-contenedor">
          <button
            className="cargar-mas-btn"
            onClick={cargarMas}
            disabled={cargandoMas}
          >
            {cargandoMas ? 'Cargando...' : 'Cargar más'}
          </button>
        </div>
      )}
    </div>
  )
}

export default Home
