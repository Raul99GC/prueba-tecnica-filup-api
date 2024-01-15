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

module.exports = {
  getAllPokemons
}
