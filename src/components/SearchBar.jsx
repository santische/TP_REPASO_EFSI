function SearchBar({ busqueda, onBusquedaChange }) {
  return (
    <div className="searchbar">
      <input
        type="text"
        placeholder="Buscar Pokémon..."
        value={busqueda}
        onChange={(e) => onBusquedaChange(e.target.value)}
        className="searchbar-input"
      />
    </div>
  )
}

export default SearchBar
