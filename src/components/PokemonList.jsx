import PokemonCard from './PokemonCard'

function PokemonList({ pokemones, favoritos, onToggleFavorito }) {
  // Si no hay resultados mostramos un mensaje
  if (pokemones.length === 0) {
    return <p className="mensaje-vacio">No encontramos resultados.</p>
  }

  return (
    <div className="pokemon-list">
      {pokemones.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          esFavorito={favoritos.some((fav) => fav.id === pokemon.id)}
          onToggleFavorito={onToggleFavorito}
        />
      ))}
    </div>
  )
}

export default PokemonList
