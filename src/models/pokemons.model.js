const { Schema, model } = require('mongoose')

const PokemonsSchema = new Schema({
  name: { type: String, required: true },
  img: { type: String },
  hp: { type: Number, required: true },
  experience: { type: Number, required: true },
  type: { type: String, required: true },
  stats: { type: Array, required: true }

}, {
  timestamps: true
})

module.exports = model('pokemons', PokemonsSchema)
