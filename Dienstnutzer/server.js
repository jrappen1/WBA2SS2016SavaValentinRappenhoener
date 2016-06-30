// Requires
var http = require('http');
var faye = require('faye');
var express = require('express');
var bodyParser = require('body-parser');

//Server erstellen
var app = express();
var server = http.createServer();
app.use(bodyParser.json());

//Adapter konfigurieren
var bayeux = new faye.NodeAdapter({
	mount: '/faye'
});

bayeux.attach(server);

//Serverseitigen Pub-Sub Client erzeugen
var client = new faye.Client("http://localhost:8000/faye");

//Channel bzw Topic "category" abonnieren
var subscription = client.subscribe('/articles', function(message) {
	console.log("Neuer Artikel von " + message.article + ": " + message.content);
});

app.post("/users",function(req,res){
	res.json(req.body);
});

//POST
app.post('/articles', function(req, res){

	//Nachricht an 'articles' publishen
	var publication = client.publish('/articles', {
		"category": req.body.category,
		"articles": req.body.articles,
	});

	publication.then(

		//Promise-Handler wenn Publishen erfolgreich
		function () {
			console.log("Nachricht wurde gesendet.");
			res.writeHead(200, "OK");
			res.write("Nachricht wurde gesendet.");
			res.end();
		},

		//Promise-Handler wenn Publishen fehlgeschlagen
		function (error) {
			console.log("Nachricht wurde nicht gesendet.");
			res.write("Nachricht wurde nicht gesendet.");
			next(error)
		}
		);

});

server.listen(6000, function () {
	console.log("Server listens on port 6000.");
})