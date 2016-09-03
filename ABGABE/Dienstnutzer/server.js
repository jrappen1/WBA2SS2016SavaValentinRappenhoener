var faye = require('faye');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var ejs = require('ejs');
var fs = require('fs');

//Server erstellen
var app = express();
var server = http.createServer(app);
app.use(bodyParser.json());

app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - not found');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - internal error');
});


//Adapter konfigurieren
var bayeux = new faye.NodeAdapter({
    mount: '/faye'
});

//Adapter zum Server hinzufügen
bayeux.attach(server);

var client = new faye.Client("http://localhost:8000/faye");

var subscription = client.subscribe('/bewertung', function (message) {
    console.log("Neue Nachricht von " + JSON.stringify(message.userID));
    var options = {
        host: 'localhost',
        port: '3000',
        path: '/bewertung',
        method: 'POST'
    };
    var externalRequest = http.request(options, function (externalResponse) {
        console.log('Bewertung erstellt');
        externalResponse.on("data", function (chunk) {
            console.log("body: " + chunk);
        });
    });
    externalRequest.setHeader("content-type", "application/json");
    externalRequest.write(JSON.stringify(message));
    externalRequest.end();
});

var articleOderAnders = client.subscribe('/articles', function (message) {
    console.log("Neuer Artikel von " + JSON.stringify(message.userID));
    var options = {
        host: 'localhost',
        port: '3000',
        path: '/articles',
        method: 'POST'
    };
    var externalRequest = http.request(options, function (externalResponse) {
        console.log('Artikel erstellt');
        externalResponse.on("data", function (chunk) {
            console.log("body: " + chunk);
        });
    });
    externalRequest.setHeader("content-type", "application/json");
    externalRequest.write(JSON.stringify(message));
    externalRequest.end();
});


//POST auf das ressourcen articles


app.post('/bewertung', function (req, res) {

    var publication = client.publish('/bewertung', {
        "bewertung": req.body.bewertung
    });

    var newBewertung = JSON.stringify(req.body);
    console.log(newBewertung);

    var options = {
        host: 'localhost',
        port: '3000',
        path: '/bewertung',
        method: 'POST'
    };

    var externalRequest = http.request(options, function (externalResponse) {
        console.log('Bewertung erstellt');
        externalResponse.on("data", function (chunk) {
            console.log("body: " + chunk);
            user = JSON.parse(chunk);

            res.json(newBewertung);
            res.end();
        });
    });
    externalRequest.setHeader("content-type", "application/json");
    externalRequest.write(JSON.stringify(req.body));
    externalRequest.end();
});

//GET auf die Ressource Bewertung bezogen


app.get('/bewertung', jsonParser, function (req, res) {

    var options = {
        host: 'localhost',
        port: '3000',
        path: '/bewertung',
        method: 'GET'
    };


    var externalRequest = http.request(options, function (externalResponse) {
        console.log('Bewertung nach Id');
        externalResponse.on('data', function (chunk) {

            var bewertung = JSON.parse(chunk);
            var bubblesort = function (a) {
                var swapped;
                do {
                    swapped = false;
                    for (var i = 0; i < a.length - 1; i++) {
                        if (a[i].id < a[i + 1].id) {
                            var temp = a[i];
                            a[i] = a[i + 1];
                            a[i + 1] = temp;
                            swapped = true;
                        }
                    }
                } while (swapped);
            };
            bubblesort(bewertung);
            console.log(bewertung);

            res.json(bewertung);
            res.end();
        });
    });
    externalRequest.setHeader("content-type", "text/plain");
    externalRequest.end();
});

//POST auf Ressource Artikel

app.post('/articles', function (req, res) {

    /*var publication = client.publish('/articles', {
        "article": req.body.artikel
    });*/

    var newArticle = JSON.stringify(req.body);
    console.log("Neuer Artikel von " + JSON.stringify(newArticle.userID));

    var options = {
        host: 'localhost',
        port: '3000',
        path: '/articles',
        method: 'POST'
    };

    var externalRequest = http.request(options, function (externalResponse) {
        console.log('Artikel eingestellt');
        externalResponse.on("data", function (chunk) {
            console.log("body: " + chunk);
            user = JSON.parse(chunk);

            res.json(newArticle);
            res.end();
        });
    });
    externalRequest.setHeader("content-type", "application/json");
    externalRequest.write(JSON.stringify(newArticle));
    externalRequest.end();
});

//GET auf Ressource article

app.get('/articles/:id', jsonParser, function (req, res) {

    var options = {
        host: 'localhost',
        port: '3000',
        path: '/articles',
        method: 'GET'
    };

    var externalRequest = http.request(options, function (externalResponse) {
        console.log('Artikel nach Id');
        externalResponse.on('data', function (chunk) {

            var artikel = JSON.parse(chunk);


            res.json(article);
            res.end();
        });
    });

    externalRequest.setHeader("content-type", "text/plain");
    externalRequest.end();
});

/*exports.start = function () {
 server.listen(8000, function () {
 console.log("Express listens on Port 8000");
 });
 };*/

server.listen(8000, function () {
    console.log("Server listens on Port 8000");
});

//Als nächstes erstellt man zwei clients der eine soll etwas publishen der andere soll etwas subscriben
