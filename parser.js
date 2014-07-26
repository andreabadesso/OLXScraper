// var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var mongoose = require('mongoose');
var date = require('date-utils');
var Socks5ClientHttpAgent = require('socks5-http-client/lib/Agent');

var url = 'mongodb://127.0.0.1:27017/olx-teste';
mongoose.connect(url);
mongoose.set('debug', true);
mongoose.connection.on('error', function(err) {
    console.log(err);
});

var OfertaScheme = mongoose.Schema({
    titulo: String,
    preco: Number,
    categoria: String,
    data: Date,
    url: String,
    imagem: String
});

var Oferta = mongoose.model('Oferta', OfertaScheme);

var fila = [];

// Celulares e tabets:
<<<<<<< HEAD
for (var i = 1; i < 5; i++) {
    // url = "http://riodejaneiro.olx.com.br/celulares-tablets-cat-830-p-" + i;
    url = "http://riodejaneiro.olx.com.br/carros-motos-e-barcos-cat-362-p-" + i;
=======
for (var i = 160; i < 180; i++) {
    url = "http://riodejaneiro.olx.com.br/celulares-tablets-cat-830-p-" + i;
>>>>>>> 82514eb9bd9b51e7265a7ab8bb1292abfb5dd274
    console.log("Adicionando pagina a fila: " + url);
    fila.push(baixarPagina(i, url));
    // baixarPagina(i, url);
}

async.series(fila);

function baixarPagina(pagina, url) {
<<<<<<< HEAD
    request({
            url: url
        },
        function(error, response, html) {
=======
    setTimeout(function() {

        request(url, function(error, response, html) {
		console.log(html === "");
		return false;
>>>>>>> 82514eb9bd9b51e7265a7ab8bb1292abfb5dd274
            if (!error) {
                console.log(html);
                var $ = cheerio.load(html);
                var produtos = [];

                $('.row').filter(function() {

                    var data = $(this);
                    var json = {};

                    json.imagem = data.find('img')[0].attribs.src;
                    json.url = data.find('img')[0].parent.attribs.href;

                    var u = data.find('a')[0].attribs;
                    json.url = u.href;
                    json.titulo = u.title;

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
                        data: json.data,
                        url: json.url,
                        imagem: json.imagem
                    }).save(function(err) {
                        if (err)
                            console.log("ERR");
                        else
                            console.log(json);
                    });
                    // produtos.push(json);
                });
            } else {
                console.log("ERROR");
                console.log(error);
            }
        });
<<<<<<< HEAD
}
=======
        console.log("Esperando 3 segundos");
    }, 3000);
}
>>>>>>> 82514eb9bd9b51e7265a7ab8bb1292abfb5dd274
