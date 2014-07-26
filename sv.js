var mongoose = require('mongoose'),
    ofertas = require('./routes/ofertas'),
    express = require('express'),
    path = require('path');

var url = 'mongodb://127.0.0.1:27017/olx';
mongoose.connect(url);
// mongoose.set('debug', true);
mongoose.connection.on('error', function(err) {
    console.log(err);
});

var app = express();

app.use(express.static(__dirname + '/public/dist'));
app.set('views', path.join(__dirname, 'views'));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
});

// Routes:
// app.get('/ofertas/:nome/:periodo', ofertas.findAll);
app.get('/ofertas/:nome/:cidade', ofertas.findNome);
app.get('/', ofertas.index);

app.listen(3000);
console.log('Listening on port 3000...');