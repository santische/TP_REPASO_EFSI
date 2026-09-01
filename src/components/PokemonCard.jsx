function PokemonCard({ pokemon, esFavorito, onToggleFavorito }) {
  // Destructuring de los datos del pokemon
  const { name, sprites, types, weight } = pokemon

  // El tipo viene como un array de objetos, lo convertimos a texto
  const tipos = types.map((t) => t.type.name).join(', ')

  // La imagen oficial del pokemon
  const imagen = sprites.other['official-artwork'].front_default

  return (
    <div className="pokemon-card">
      <img
        src={imagen}
        alt={name}
        className="pokemon-card-imagen"
      />
      <h2 className="pokemon-card-nombre">{name}</h2>
      <p className="pokemon-card-dato">
        <span>Tipo:</span> {tipos}
      </p>
      <p className="pokemon-card-dato">
        <span>Peso:</span> {weight / 10} kg
      </p>
      <button
        className={`pokemon-card-btn ${esFavorito ? 'pokemon-card-btn--quitar' : 'pokemon-card-btn--agregar'}`}
        onClick={() => onToggleFavorito(pokemon)}
      >
        {esFavorito ? '❌ Quitar de favoritos' : '⭐ Agregar a favoritos'}
      </button>
    </div>
  )
}

export default PokemonCard
