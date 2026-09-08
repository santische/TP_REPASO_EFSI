import axios from 'axios'

const BASE_URL = 'https://pokeapi.co/api/v2'

// Trae la lista completa de nombres y URLs
export const obtenerListaCompleta = async () => {
  const respuesta = await axios.get(`${BASE_URL}/pokemon?limit=1000`)
  return respuesta.data.results
}

// Trae el detalle de un pokémon por su URL
export const obtenerDetalle = async (url) => {
  const respuesta = await axios.get(url)
  return respuesta.data
}
