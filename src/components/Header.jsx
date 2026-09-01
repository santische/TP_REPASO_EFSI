import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <h1 className="header-titulo">Explorador de Pokémon</h1>
      <nav className="header-nav">
        <Link to="/" className="header-link">Inicio</Link>
        <Link to="/favoritos" className="header-link">Favoritos</Link>
      </nav>
    </header>
  )
}

export default Header
