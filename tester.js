var async = require('async'),
    moment = require('moment');

var numero = 5;
var inicial = moment();

var fila = [

    function(callback) {
        var dados = {
            dias: [],
            dia: inicial
        };
        callback(null, dados);
    }
];

for (var i = 0; i < numero; i++) {

    var f = function(dados, callback) {
        dados.dias.push(dados.dia.subtract(1, 'day').format('L'));
        callback(null, dados);
    };

    fila.push(f);
}

async.waterfall(fila, function(error, result) {
    console.log(result.dias);
});