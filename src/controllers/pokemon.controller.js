const axios = require('axios')
const htmlPdf = require('html-pdf')
const Handlebars = require('handlebars')
const fs = require('fs')

const Pokemon = require('../models/pokemons.model')

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
    console.log({ pokemonsLinks })
    const totalCount = pokemonsLinks.length

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + (limit || totalCount)

    const selectedPokemonsLinks = pokemonsLinks.slice(startIndex, endIndex)

    console.log({ selectedPokemonsLinks })

    const pokemons = await Promise.all(selectedPokemonsLinks.map(async (pokemon) => {
      const response = await axios.get(pokemon.url)
      return {
        img: response.data?.sprites.other['official-artwork'].front_default,
        name: response.data?.name,
        hp: response.data?.stats[0].base_stat,
        experience: response.data?.base_experience,
        type: response.data?.types[0]?.type.name,
        stats: response.data?.stats.slice(0, 4),
        id: response.data?.id
      }
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

const generatePokemonPdf = ({ img, name, hp, experience, type, stats }) => {
  const options = { format: 'Letter' }
  const source = fs.readFileSync(process.cwd() + '/src/templates/pokemon.hbs', 'utf8')

  const template = Handlebars.compile(source)

  const data = { img, name, hp, experience, type, stats }

  const html = template(data)

  return new Promise((resolve, reject) => {
    htmlPdf.create(html, options).toBuffer(function (err, buffer) {
      if (err) {
        reject(err)
      } else {
        resolve(buffer)
      }
    })
  })
}

const savePokemonInDb = async ({ img, name, hp, experience, type, stats }) => {
  try {
    const newPokemon = new Pokemon({
      name,
      img,
      hp,
      experience,
      type,
      stats
    })

    const response = await newPokemon.save()
    return response
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = {
  getAllPokemons,
  getPokemonByIdOrName,
  generatePokemonPdf,
  savePokemonInDb
}
