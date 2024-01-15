const { request } = require('express')

const { getAllPokemons, getPokemonByIdOrName } = require('../controllers/pokemon.controller')

const getAll = async (req, res) => {
  try {
    const { limit = 0, page = 1, name = '' } = req.query

    if (isNaN(limit) || isNaN(page) || limit <= 0 || page <= 0) {
      res.status(404).send('Bad Request')
      return
    }

    const params = {
      limit: Number(limit),
      page: Number(page),
      name
    }

    const { pokemons, totalCount } = await getAllPokemons(params)

    if (!limit) {
      res.status(200).json({ pokemons, totalCount })
      return
    }

    const totalPages = Math.ceil(totalCount / limit)

    const nextPage = page < totalPages ? `${req.protocol}://${req.get('host')}/api/v1/pokemon?name=${name}&limit=${limit}&page=${+page + 1}` : null
    const prevPage = page > 1 ? `${req.protocol}://${req.get('host')}/api/v1/pokemon?name=${name}&limit=${limit}&page=${+page - 1}` : null

    res.status(200).json({
      pokemons,
      totalCount,
      pagination: {
        totalPages,
        currentPage: +page,
        nextPage,
        prevPage
      }
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const constByIdOrName = (req = request, res) => {
  const { id } = req.params

  getPokemonByIdOrName({ pokemonId: id })
    .then(({ data }) => {
      res.status(200).json({ ...data })
    })
    .catch(() => {
      res.status(400).send('Valor invalido')
    })
}

module.exports = {
  getAll,
  constByIdOrName
}
