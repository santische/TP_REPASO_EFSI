# Pokédex — Explorador de Pokémon

**Integrantes:** Alejo Campano y Santiago Schettini

**API:** [PokéAPI](https://pokeapi.co/)

---

## Descripción

Aplicación para explorar Pokémon. Muestra un listado obtenido desde la PokéAPI, permite buscar por nombre y guardar favoritos que persisten al cerrar la app.

---

## Componentes

El proyecto está dividido en componentes, páginas y servicios. Los componentes como `PokemonCard` y `SearchBar` son reutilizables. Las páginas `Home` y `Favorites` contienen la lógica principal. En la versión mobile se usó Expo Router para la navegación por tabs y un archivo `api.js` para centralizar las consultas a la API.

---

## Funcionalidades

- Listado de Pokémon con imagen, nombre, tipo y peso
- Buscador en tiempo real sobre los 1000 Pokémon disponibles
- Botón para cargar más resultados
- Agregar y quitar favoritos (sin duplicados)
- Favoritos persistentes con localStorage (web) y AsyncStorage (mobile)
- Navegación entre pantalla de inicio y favoritos

---

## Diferencias entre React Web y React Native

La diferencia principal es que en React Native no se usan etiquetas HTML sino componentes propios como `View`, `Text` o `Pressable`. Los estilos se escriben con `StyleSheet.create()` en lugar de CSS, y las listas se hacen con `FlatList` en vez de `.map()`. El localStorage es reemplazado por `AsyncStorage`, que es asincrónico. La navegación también cambia: en web usamos React Router y en mobile Expo Router.
