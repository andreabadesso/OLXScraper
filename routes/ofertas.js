var mongoose = require('mongoose'),
    _ = require('underscore')._,
    Oferta = require('../models/oferta.js'),
    moment = require('moment');

mongoose.set('debug', true);

function pegarOfertas(nome, date, callback) {
    console.log("Pegando ofertas com nome: " + nome);

    Oferta.textSearch(nome, {
            limit: 1020210,
            filter: {
                data: {
                    $lt: date
                }
            },
            lean: true
        },
        function(err, output) {
            if (err)
                console.log(err);

            output = _.map(output.results, function(o) {
                return o.obj;
            });

            // res.send(output);
            var precos = _.map(output, function(o) {
                return o.preco;
            });

            var media_inicial = 0;
            _.each(precos, function(preco) {
                media_inicial += preco;
            });

            precos = _.sortBy(precos, function(num) {
                return num;
            });

            var cut = precos.length * 0.2;

            // Removendo 20% mais altos e baixos
            precos.splice(0, cut);
            precos.reverse();
            precos.splice(0, cut);

            var total = 0;
            _.each(precos, function(preco) {
                total += preco;
            });

            total = (total / precos.length).toFixed(2);
            // console.log(total);
            callback(total);
        });
}

exports.findAll = function(req, res) {
    // 7
    var hoje = moment();
    hoje.subtract(req.params.periodo, 'day');
    var valores = [];

    for (var i = 0; i < req.params.periodo; i++) {
        hoje.add(i, 'day');
        var valor = pegarOfertas(req.params.nome, hoje, function(val) {
            valores.push({
                preco: val,
                data: hoje.format('L')
            });

            if (valores.length === req.params.periodo - 1) {
                res.send(_.filter(valores, function(valor) {
                    return valor.preco !== "NaN";
                }));
            }
        });
    }

    // console.log(valores);
    // res.send(valores);
};

exports.index = function(req, res) {
    res.render('index.html');
};
