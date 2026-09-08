import { View, Text, Image, Pressable, StyleSheet } from 'react-native'

function PokemonCard({ pokemon, esFavorito, onToggleFavorito }) {
  const { name, sprites, types, weight } = pokemon

  const tipos = types.map((t) => t.type.name).join(', ')
  const imagen = sprites?.other?.['official-artwork']?.front_default

  return (
    <View style={styles.card}>
      {imagen ? (
        <Image source={{ uri: imagen }} style={styles.imagen} />
      ) : (
        <View style={styles.imagenPlaceholder} />
      )}

      <Text style={styles.nombre}>{name}</Text>

      <Text style={styles.dato}>
        <Text style={styles.label}>Tipo: </Text>
        {tipos}
      </Text>

      <Text style={styles.dato}>
        <Text style={styles.label}>Peso: </Text>
        {weight / 10} kg
      </Text>

      <Pressable
        style={({ pressed }) => [
          esFavorito ? styles.btnQuitar : styles.btnAgregar,
          pressed && styles.btnPresionado,
        ]}
        onPress={() => onToggleFavorito(pokemon)}
      >
        <Text style={styles.btnTexto}>
          {esFavorito ? '❌ Quitar de favoritos' : '⭐ Agregar a favoritos'}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  imagen: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  imagenPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginTop: 10,
    color: '#ffffff',
    letterSpacing: 1,
  },
  dato: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  label: {
    fontWeight: 'bold',
    color: '#16a34a',
  },
  btnAgregar: {
    marginTop: 12,
    backgroundColor: '#16a34a',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  btnQuitar: {
    marginTop: 12,
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#555',
  },
  btnPresionado: {
    opacity: 0.75,
  },
  btnTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
})

export default PokemonCard
