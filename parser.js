// var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
var date = require('date-utils');

var url = 'mongodb://127.0.0.1:27017/olx-teste';
mongoose.connect(url);
// mongoose.set('debug', true);
// mongoose.connection.on('error', function(err) {
//     console.log(err);
// });
var OfertaScheme = mongoose.Schema({
    titulo: String,
    preco: Number,
    categoria: String,
    data: Date
});

var Oferta = mongoose.model('Oferta', OfertaScheme);

// Celulares e tabets:
// http://riodejaneiro.olx.com.br/celulares-tablets-cat-830
for (var i = 1; i < 728; i++) {
    //url = 'http://www.olx.com.br/celulares-smartphones-cat-831-p-' + i;
    url = "http://riodejaneiro.olx.com.br/celulares-tablets-cat-830-p-" + i;
    baixarPagina(i, url);
}

function baixarPagina(pagina, url) {
    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var produtos = [];

            $('.row').filter(function() {
                var data = $(this);
                var json = {};
                json.titulo = data.attr("title").trim();

                json.preco = data.find(".third-column-container").text().replace("Topa negociar", "").trim();
                json.preco = json.preco.split(" ")[1];

                json.categoria = data.find(".itemlistinginfo").text().split("|")[0].trim();

                json.data = data.find(".fourth-column-container").text().trim();

                if (json.preco === "undefined" || json.preco === undefined || json.preco === null) {
                    return null;
                }
                var meses = [];
                meses["Jan"] = "01";
                meses["Fev"] = "02";
                meses["Mar"] = "03";
                meses["Abr"] = "04";
                meses["Mai"] = "05";
                meses["Jun"] = "06";
                meses["Jul"] = "07";
                meses["Ago"] = "08";
                meses["Set"] = "09";
                meses["Out"] = "10";
                meses["Nov"] = "11";
                meses["Dez"] = "12";

                var d = json.data.split(" ");
                data = d[0].replace(",", "");

                if (data === "Hoje") {
                    data = Date.today();
                } else if (data === "Ontem") {
                    data = Date.yesterday();
                } else {
                    data = new Date("2014-" + meses[d[1]] + "-" + d[0]);
                    console.log(data);
                }

                json.data = data;

                json.preco = json.preco.replace(".", "");
                json.preco = parseFloat(json.preco)
                // console.log(json.preco);

                var _oferta = new Oferta({
                    titulo: json.titulo,
                    preco: json.preco,
                    categoria: json.categoria,
                    data: json.data
                }).save(function(err) {
                    if (err)
                        console.log("ERR");
                });
                // produtos.push(json);
            });

        }
    });
}
