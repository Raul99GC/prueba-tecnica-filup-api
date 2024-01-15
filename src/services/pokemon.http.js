const { request } = require('express')

const { getAllPokemons, getPokemonByIdOrName, generatePokemonPdf, savePokemonInDb } = require('../controllers/pokemon.controller')

const getAll = async (req, res) => {
  try {
    const { limit = 0, page = 1, name = '' } = req.query

    if (isNaN(limit) || isNaN(page) || page <= 0) {
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

const generatePdf = async (req, res) => {
  const { id } = req.body

  try {
    const { data } = await getPokemonByIdOrName({ pokemonId: id })

    const params = {
      img: data?.sprites.other['official-artwork'].front_default,
      name: data?.name,
      hp: data?.stats[0].base_stat,
      experience: data?.base_experience,
      type: data?.types[1]?.type.name,
      stats: data?.stats.slice(0, 4)
    }

    const pdf = await generatePokemonPdf(params)

    await savePokemonInDb(params)

    res.setHeader('Content-Type', 'application/pdf')
    res.status(200)
    res.send(pdf)
  } catch (error) {
    console.log({ error })
    res.status(404).send('Bad Request')
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
  constByIdOrName,
  generatePdf
}
