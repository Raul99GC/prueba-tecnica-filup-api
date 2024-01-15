const { getAll, constByIdOrName, generatePdf } = require('../services/pokemon.http')

const router = require('express').Router()

router.get('/', getAll)
router.post('/', generatePdf)

router.get('/:id', constByIdOrName)

module.exports = router
