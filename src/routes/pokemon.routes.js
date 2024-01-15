const { getAll } = require('../services/pokemon.http')

const router = require('express').Router()

router.get('/', getAll)
router.post('/')

module.exports = router
