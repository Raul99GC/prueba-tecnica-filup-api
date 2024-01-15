const { getAll, constByIdOrName } = require('../services/pokemon.http')

const router = require('express').Router()

router.get('/', getAll)
router.post('/')

router.get('/:id', constByIdOrName)

module.exports = router
