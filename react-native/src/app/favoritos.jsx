import { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from 'expo-router'
import PokemonCard from '../components/PokemonCard'

export default function FavoritosScreen() {
  const [favoritos, setFavoritos] = useState([])

  // Recarga los favoritos cada vez que la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      const cargarFavoritos = async () => {
        try {
          const guardados = await AsyncStorage.getItem('favoritos')
          if (guardados) setFavoritos(JSON.parse(guardados))
          else setFavoritos([])
        } catch (e) {
          console.log('Error cargando favoritos:', e)
        }
      }
      cargarFavoritos()
    }, [])
  )

  const handleQuitarFavorito = async (pokemon) => {
    const nuevos = favoritos.filter((fav) => fav.id !== pokemon.id)
    setFavoritos(nuevos)
    try {
      await AsyncStorage.setItem('favoritos', JSON.stringify(nuevos))
    } catch (e) {
      console.log('Error guardando favoritos:', e)
    }
  }

  if (favoritos.length === 0) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.mensajeVacio}>No tenés favoritos guardados.</Text>
        <Text style={styles.mensajeSubtitulo}>
          Agregá pokémon desde la pantalla de inicio ⭐
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.contenedor}>
      <FlatList
        data={favoritos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PokemonCard
            pokemon={item}
            esFavorito={true}
            onToggleFavorito={handleQuitarFavorito}
          />
        )}
        contentContainerStyle={styles.lista}
      />
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
    padding: 24,
    backgroundColor: '#0d0d0d',
  },
  mensajeVacio: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  mensajeSubtitulo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  lista: {
    paddingTop: 12,
    paddingBottom: 24,
  },
})
