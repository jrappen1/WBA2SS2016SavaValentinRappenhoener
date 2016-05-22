var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var app = express();

var article = [
    
    {Name: "Toaster", 
     Bezeichnung: "Kuechenartikel", 
     Datum: "12.05.2016"},
    
    {Name: "Foehn", 
     Bezeichnung: "Hygieneartikel", 
     Datum: "19.05.2016"},
    
    {Name: "Buegeleisen", 
     Bezeichnung: "Haushaltsartikel", 
     Datum: "22.05.2016"}
    
]

app.get('/article', function (req, res) {
   res.status(200).json(article); 
})

app.post('/article', jsonParser, function (req, res){
    article.push(req.body);
    res.type('plain').send('Added!');
})

app.listen(3000, function logging() {
  console.log('Server listens on port 3000.');
});
