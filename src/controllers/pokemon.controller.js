const axios = require('axios')

/**
 * Obtiene una lista paginada de pokémons desde la PokeAPI.
 * @param {Object} options - Opciones para la consulta.
 * @param {number} options.limit - Número máximo de pokémons por página.
 * @param {number} options.page - Página deseada.
 * @param {string} options.name - Filtro opcional por nombre de pokémon.
 * @returns {Promise<Object>} - Un objeto con la lista de pokémons y el total de resultados
 *                              y el número total de páginas.
 * @throws {Object} - Un objeto que representa un error si la operación falla.
 */
const getAllPokemons = async ({ limit, page, name }) => {
  try {
    const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=10000')

    let pokemonsLinks = data.results.sort((a, b) => a.name.localeCompare(b.name))

    if (name) {
      pokemonsLinks = pokemonsLinks.filter(pokemon => pokemon.name.includes(name))
    }
    const totalCount = pokemonsLinks.length

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    const selectedPokemonsLinks = pokemonsLinks.slice(startIndex, endIndex)

    const pokemons = await Promise.all(selectedPokemonsLinks.map(async (pokemon) => {
      const response = await axios.get(pokemon.url)
      return response.data
    }))

    const totalPages = Math.ceil(pokemonsLinks.length / limit)

    return { pokemons, totalCount, totalPages }
  } catch (error) {
    console.log({ error })
    return {
      error
    }
  }
}

/**
 * Obtiene información de un Pokémon por su ID.
 *
 * @param {Object} options - Opciones para la búsqueda del Pokémon.
 * @param {number} options.pokemonId - ID or Nombre del Pokémon que se desea obtener.
 * @returns {Promise<Object>} - Una promesa que se resuelve con los datos del Pokémon o se rechaza con un objeto de error.
 *
 */
const getPokemonByIdOrName = async ({ pokemonId }) => {
  try {
    const { data, status } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)

    return {
      data,
      status
    }
  } catch (err) {
    throw new Error(err.response.status)
  }
}

module.exports = {
  getAllPokemons,
  getPokemonByIdOrName
}
