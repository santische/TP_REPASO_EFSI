import PokemonCard from './PokemonCard'

function Favorites({ favoritos, onToggleFavorito }) {
  if (favoritos.length === 0) {
    return (
      <div className="favorites-vacio">
        <p>No tenés pokémon favoritos todavía.</p>
        <p>Andá al inicio y agregá algunos con ⭐</p>
      </div>
    )
  }

  return (
    <div>
      <p className="favorites-contador">
        Tenés {favoritos.length} pokémon favorito{favoritos.length !== 1 ? 's' : ''}.
      </p>
      <div className="pokemon-list">
        {favoritos.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            esFavorito={true}
            onToggleFavorito={onToggleFavorito}
          />
        ))}
      </div>
    </div>
  )
}

export default Favorites
