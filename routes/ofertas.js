var mongoose = require('mongoose'),
    _ = require('underscore')._,
    Oferta = require('../models/oferta.js'),
    moment = require('moment'),
    Cacheman = require('cacheman'),
    async = require('async');

var options = {
    ttl: 24 * 60 * 60, // Cache de um dia.
    engine: 'redis',
    port: 6379,
    host: '127.0.0.1'
};

var cache = new Cacheman('ofertas', options);

/* Busca no banco produtos com o nome especificado
 * na data passada e 3 dias antes e 3 dias depois
 * tirando os 20% maiores e 20% menores preços
 */
function pegarOfertas(nome, date, callback) {

    var less = moment(date).add(3, 'days');
    var gte = moment(date).subtract(3, 'days');

    Oferta.find({
        data: {
            $lt: less,
            $gte: gte
        },
        titulo: {
            $regex: ".*" + nome + ".*",
            $options: 'i'
        }
    }).exec(function(err, output) {
        var media_inicial = 0;

        // Mapeia o array para conter apenas preços
        var precos = _.map(output, function(o) {
            return Number(o.preco);
        });

        var precos = _.filter(precos, function(o) {
            return !isNaN(o) && o > 0;
        });
        // console.log(precos);

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

        if (precos.length > 0) {
            // Calculando a média
            total = (_.reduce(precos, function(acc, preco) {
                return acc + preco;
            }) / precos.length).toFixed(2);
        }

        callback({
            preco: total,
            data: date
        });
    });
}


/* Enfilera consultas ao banco e
 * as executa uma atrás da outra
 */
function calcularDias(nome, numero, cb) {

    var inicial = moment();
    var dias = [];
    for (var i = 0; i < numero; i++) {
        var dia = inicial.subtract(1, 'day');
        dias.push(
            dia.format('L')
        );
    }

    var days = _.map(dias, function(dia) {
        return function(callback) {
            setTimeout(function() {
                pegarOfertas(nome, dia, function(dado) {
                    callback(null, dado);
                });
            }, 200);
        };
    });

    async.parallel(days, function(err, results) {
        cb(results);
    });
}

exports.findNome = function(req, res) {
    var nome = req.params.nome;
    // Hoje

    cache.get(nome.toLowerCase(), function(error, value) {
        if (error) {
            console.log("ERROR: " + error);
        } else {
            if (value !== undefined && value !== null) {
                console.log("Está no cache.");
                res.send(value);
            } else {
                console.log("Chave não existe, criando..");
                async.parallel([

                    function(callback) {
                        calcularDias(nome, 7, function(cb) {
                            callback(null, cb);
                        });
                    },
                    function(callback) {
                        calcularDias(nome, 15, function(cb) {
                            callback(null, cb);
                        });
                    },
                    function(callback) {
                        calcularDias(nome, 30, function(cb) {
                            callback(null, cb);
                        });
                    },

                ], function(err, results) {
                    var ret = {
                        sete: _.filter(results[0], function(r) {
                            return !isNaN(r.preco) && r.preco > 0;
                        }),
                        quinze: _.filter(results[1], function(r) {
                            return !isNaN(r.preco) && r.preco > 0;
                        }),
                        trinta: _.filter(results[2], function(r) {
                            return !isNaN(r.preco) && r.preco > 0;
                        })
                    };

                    // Retorna dados antes de enviar pro cache:
                    res.send(ret);

                    // Salva dados no cache: 
                    cache.set(nome.toLowerCase(), ret, function(err, value) {
                        if (err) {
                            console.log(err);
                        }
                    });
                });
            }
        }
    });
};

exports.index = function(req, res) {
    res.render('index.html');
};