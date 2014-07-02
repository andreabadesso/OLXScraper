var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    textSearch = require('mongoose-text-search');

var OfertaScheme = mongoose.Schema({
    titulo: String,
    preco: Number,
    categoria: String,
    data: Date
});

OfertaScheme.plugin(textSearch);
OfertaScheme.index({
    titulo: 'text'
});

module.exports = mongoose.model('Oferta', OfertaScheme);
