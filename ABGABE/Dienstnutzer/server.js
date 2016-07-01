var faye = require('faye');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var ejs = require('ejs');
var fs = require('fs');
var http = require('http');


//Server erstellen
var app = express();
var server = http.createServer(app);
app.use(bodyParser.json());

//Adapter konfigurieren
var bayeux = new faye.NodeAdapter({
    mount:'/faye'
});

//Adapter zum Server hinzufügen
bayeux.attach(server);

var client = new faye.Client("http://localhost:8000/faye");

 var subscription = client.subscribe('/bewertung', function(message){
    console.log("Neue Nachricht von " + JSON.stringify(message.creator));
     var options = {
        host: 'localhost',
        port: '3000',
        path: '/bewertung',
        method: 'POST'
    }

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



//POST auf das ressourcen articles


app.post('/bewertung', function(req,res){ 

       var publication = client.publish('/bewertung',{
            "bewertung": req.body.bewertung
        });
   
    /*publication.then(
        
        function(){
        console.log("nachricht wurde versendet.");
        res.writeHead(200,"OK");
        res.write("Nachricht wurde gesendet");
        res.end();
    },
                     
        function(error){
        console.log("nachricht wurde nicht versendet");
        res.write("Nachricht wurde nicht gesendet");
        next(error);
    }
    
    );*/
    
    //});

// app.post("/bewertung", function(req, res){

     var newBewertung = req.body;

    var newBewertung = JSON.stringify(req.body);
    console.log(newBewertung);

    var options = {
        host: 'localhost',
        port: '3000',
        path: '/bewertung',
        method: 'POST'
    }

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
				          }
     
    
   var externalRequest = http.request(options, function(externalResponse){
   console.log('Bewertung nach Id');
   externalResponse.on('data', function(chunk) {

       var bewertung = JSON.parse(chunk);
      var bubblesort = function(a)
{
    var swapped;
    do {
        swapped = false;
        for (var i=0; i < a.length-1; i++) {
            if (a[i].id < a[i+1].id) {
                var temp = a[i];
                a[i] = a[i+1];
                a[i+1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
}
       bubblesort(bewertung);
											console.log(bewertung);

											res.json(bewertung);
				              res.end();
				            });
				          });
				          externalRequest.setHeader("content-type", "text/plain");
                          externalRequest.end();
				    });


server.listen(8000, function() {
    console.log("Server listens on Port 8000");
});

//Als nächstes erstellt man zwei clients der eine soll etwas publishen der andere soll etwas subscriben
