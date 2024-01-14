const express = require('express')
const cors = require('cors')

class Server {
  constructor () {
    this.app = express()

    this.paths = {
      server: '/',
      tablePdf: '/api/v1/pokemonPdf'
    }

    // Middlewares
    this.middleware()

    // Rutas de mi aplicacion
    this.routes()

    // Conectar Database
    this.database()
  }

  routes () {
    this.app.use(this.paths.server, require('../routes/server.routes'))
  }

  middleware () {
    // CORS
    this.app.use(cors())

    // Analiza JSON en el cuerpo de la solicitud
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  database () {
    require('../configs/database')
  }

  listen () {
    this.app.listen(process.env.PORT || 8080, () => {
      console.log(`Server started at port ${process.env.PORT}`)
    })
  }
}

module.exports = Server
