// var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
// var app = express();

// app.get('/scrape', function(req, res) {
// Celulares e tabets:
// http://riodejaneiro.olx.com.br/celulares-tablets-cat-830
for (var i = 1; i < 1000; i++) {
    //url = 'http://www.olx.com.br/celulares-smartphones-cat-831-p-' + i;
    url = "http://riodejaneiro.olx.com.br/celulares-tablets-cat-830"
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
                json.categoria = data.find(".itemlistinginfo").text().split("|")[0].trim();
                json.data = data.find(".fourth-column-container").text().trim();
                produtos.push(json);
            });

        }

        if (produtos != undefined) {
            fs.writeFile('celulares_tablets/' + pagina + '.json', JSON.stringify(produtos, null, 4), function(err) {
                if (err) {
                    console.log("Deu merda " + err);
                }
            });
            console.log("Pagina: " + pagina + " baixada e salva.");
        }

    });
}
