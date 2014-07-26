var mongoose = require('mongoose'),
    _ = require('underscore')._,
    Oferta = require('../models/oferta.js'),
    moment = require('moment'),
    async = require('async');

// mongoose.set('debug', true);

function pegarOfertas(nome, date, callback) {
    date = moment();
    // date = date.subtract(10);

    console.log("Buscando por: " + nome);
    console.log("Com data maior que: " + date.format('L'));

    var less = moment(date).add(3, 'days');
    var gte = moment(date).subtract(3, 'days');

    console.log("LESS: " + less);
    console.log("GTE: " + gte);

    Oferta.find({
        titulo: {
            $regex: ".*" + nome + ".*",
            $options: 'i'
        },
        data: {
            $lt: less,
            $gte: gte
        }
    }).exec(function(err, output) {

        var precos = _.map(output, function(o) {
            return o.preco;
        });

        // console.log(precos);

        var media_inicial = 0;
        _.each(precos, function(preco) {
            media_inicial += preco;
        });

        console.log("Soma total: " + media_inicial);

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
        // console.log("Total: " + total);
        callback(total);
    });
}

function calcularDias(nome, numero, cb) {
    // var dados = [];
    var fila = [

        function(callback) {
            var dados = {
                list: [],
                data: moment().subtract(numero, 'day')
            };
            callback(null, dados);
        }
    ];

    for (var i = 0; i < numero; i++) {

        var f = function(dados, callback) {
            dados.data = dados.data.add(1, 'day');
            pegarOfertas(nome, dados.data, function(val) {

                var dado = {
                    preco: val,
                    data: dados.data.format('L')
                };
                dados.list.push(dado);
                callback(null, dados);
            });
        };

        fila.push(f);
    }
    async.waterfall(fila, function(error, result) {
        cb(result.list);
    });
}

exports.findNome = function(req, res) {
    // Hoje

    async.parallel([

        function(callback) {
            calcularDias(req.params.nome, 7, function(cb) {
                callback(null, cb);
            });
        },
        function(callback) {
            calcularDias(req.params.nome, 15, function(cb) {
                callback(null, cb);
            });
        },
        function(callback) {
            calcularDias(req.params.nome, 30, function(cb) {
                callback(null, cb);
            });
        },

    ], function(err, results) {
        var p = _.pluck(results[0], 'preco');

        res.send({
            sete: results[0],
            quinze: results[1],
            trinta: results[2]
        });

    });

};

exports.index = function(req, res) {
    res.render('index.html');
};