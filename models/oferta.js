var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
// textSearch = require('mongoose-text-search');

var OfertaScheme = mongoose.Schema({
    id: String,
    titulo: String,
    preco: Number,
    categoria: String,
    data: Date,
    url: String,
    imagem: String
});

OfertaScheme.index({
    id: 1,
    categoria: 1
}, {
    unique: true
});

OfertaScheme.index({
    titulo: 'text'
});

module.exports = mongoose.model('Oferta', OfertaScheme);