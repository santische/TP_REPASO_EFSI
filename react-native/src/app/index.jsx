import { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { obtenerListaCompleta, obtenerDetalle } from '../services/api'
import PokemonCard from '../components/PokemonCard'

const CANTIDAD_INICIAL = 20
const CANTIDAD_MAS = 20

export default function HomeScreen() {
  const [pokemones, setPokemones] = useState([])
  const [listaCompleta, setListaCompleta] = useState([])
  const [resultadosBusqueda, setResultadosBusqueda] = useState([])
  const [cantidadVisible, setCantidadVisible] = useState(CANTIDAD_INICIAL)
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [cargandoMas, setCargandoMas] = useState(false)
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false)
  const [error, setError] = useState(null)
  const [favoritos, setFavoritos] = useState([])

  // Cargar favoritos desde AsyncStorage al iniciar
  useEffect(() => {
    const cargarFavoritos = async () => {
      try {
        const guardados = await AsyncStorage.getItem('favoritos')
        if (guardados) setFavoritos(JSON.parse(guardados))
      } catch (e) {
        console.log('Error cargando favoritos:', e)
      }
    }
    cargarFavoritos()
  }, [])

  // Guardar favoritos en AsyncStorage cuando cambian
  useEffect(() => {
    const guardarFavoritos = async () => {
      try {
        await AsyncStorage.setItem('favoritos', JSON.stringify(favoritos))
      } catch (e) {
        console.log('Error guardando favoritos:', e)
      }
    }
    guardarFavoritos()
  }, [favoritos])

  // Carga inicial de pokémon
  useEffect(() => {
    const cargarPokemones = async () => {
      try {
        setCargando(true)
        setError(null)

        const lista = await obtenerListaCompleta()
        setListaCompleta(lista)

        const primeros = lista.slice(0, CANTIDAD_INICIAL)
        const detallados = await Promise.all(
          primeros.map((p) => obtenerDetalle(p.url))
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

  // Búsqueda con debounce
  useEffect(() => {
    if (busqueda.trim() === '') {
      setResultadosBusqueda([])
      return
    }

    const buscarEnTodos = async () => {
      try {
        setCargandoBusqueda(true)
        setError(null)

        const coincidencias = listaCompleta.filter((p) =>
          p.name.toLowerCase().includes(busqueda.toLowerCase())
        )

        const detallados = await Promise.all(
          coincidencias.map((p) => obtenerDetalle(p.url))
        )

        setResultadosBusqueda(detallados)
      } catch (err) {
        setError('No fue posible realizar la búsqueda.')
      } finally {
        setCargandoBusqueda(false)
      }
    }

    const temporizador = setTimeout(buscarEnTodos, 400)
    return () => clearTimeout(temporizador)
  }, [busqueda, listaCompleta])

  // Cargar más pokémon
  const cargarMas = async () => {
    try {
      setCargandoMas(true)

      const siguiente = cantidadVisible
      const hasta = siguiente + CANTIDAD_MAS
      const bloque = listaCompleta.slice(siguiente, hasta)

      const detallados = await Promise.all(
        bloque.map((p) => obtenerDetalle(p.url))
      )

      setPokemones((prev) => [...prev, ...detallados])
      setCantidadVisible(hasta)
    } catch (err) {
      setError('No fue posible cargar más pokémon.')
    } finally {
      setCargandoMas(false)
    }
  }

  const handleToggleFavorito = (pokemon) => {
    const yaEsFavorito = favoritos.some((fav) => fav.id === pokemon.id)
    if (yaEsFavorito) {
      setFavoritos(favoritos.filter((fav) => fav.id !== pokemon.id))
    } else {
      setFavoritos([...favoritos, pokemon])
    }
  }

  const estaBuscando = busqueda.trim() !== ''
  const pokemonesAMostrar = estaBuscando ? resultadosBusqueda : pokemones
  const hayMas = !estaBuscando && cantidadVisible < listaCompleta.length

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.mensajeEstado}>Cargando información...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.mensajeError}>{error}</Text>
      </View>
    )
  }

  return (
    <View style={styles.contenedor}>
      {/* Buscador */}
      <TextInput
        style={styles.buscador}
        placeholder="Buscar pokémon..."
        value={busqueda}
        onChangeText={setBusqueda}
        placeholderTextColor="#999"
      />

      {/* Cargando búsqueda */}
      {cargandoBusqueda && (
        <View style={styles.centrado}>
          <ActivityIndicator size="small" color="#16a34a" />
          <Text style={styles.mensajeEstado}>Buscando...</Text>
        </View>
      )}

      {/* Sin resultados */}
      {!cargandoBusqueda && estaBuscando && pokemonesAMostrar.length === 0 && (
        <View style={styles.centrado}>
          <Text style={styles.mensajeEstado}>No encontramos resultados.</Text>
        </View>
      )}

      {/* Lista */}
      {!cargandoBusqueda && (
        <FlatList
          data={pokemonesAMostrar}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PokemonCard
              pokemon={item}
              esFavorito={favoritos.some((fav) => fav.id === item.id)}
              onToggleFavorito={handleToggleFavorito}
            />
          )}
          contentContainerStyle={styles.lista}
          ListFooterComponent={
            hayMas ? (
              <Pressable
                style={styles.btnCargarMas}
                onPress={cargarMas}
                disabled={cargandoMas}
              >
                <Text style={styles.btnCargarMasTexto}>
                  {cargandoMas ? 'Cargando...' : 'Cargar más'}
                </Text>
              </Pressable>
            ) : null
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0d0d0d',
  },
  mensajeEstado: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
  mensajeError: {
    fontSize: 16,
    color: '#f87171',
    textAlign: 'center',
  },
  buscador: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 2,
    borderColor: '#333',
    color: '#ffffff',
  },
  lista: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  btnCargarMas: {
    borderWidth: 2,
    borderColor: '#16a34a',
    marginHorizontal: 40,
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  btnCargarMasTexto: {
    color: '#16a34a',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 1,
  },
})
