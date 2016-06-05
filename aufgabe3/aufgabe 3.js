var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var redis = require('redis');
var client = redis.createClient();
var app = express();

app.use(bodyParser.json());


/*------------------USER-----------------------*/

app.post('/users', function(req,res){
         var newUser = req.body;
         client.incr('id:users', function(err, rep){
            newUser.id = rep;
            client.set('user:'+newUser.id, JSON.stringify(newUser), function(err,rep){
                       res.json(newUser);
            });
    });    
});

app.get('/users', function (req, res) {
   client.keys('user:*', function(err,rep){
       
       var users = [];
       
       if(rep.length == 0){
       res.json(users);
       return;
   }
              client.mget(rep,function(err,rep){
       
       rep.forEach(function(val){
           users.push(JSON.parse(val));
       });
 users = users.map(function(user){
                             return {id: user.id, name : user.name, nickname : user.nickname, wohnort : user.wohnort};
                             });
                   res.json(users);
    }); 
   });
});
/*------------------USER ID------------------*/
app.get('/users/:id', function(req, res){

    client.get('user:'+req.params.id, function(err, rep){

        if (rep) {
            res.type('json').send(rep);
        }
        else{
            res.status(404).type('text').send('Der User mit der ID '+req.params.id+' existiert nicht');
        }
    });
});


app.delete('/users/:id', function(req, res){ 

    client.del('user:'+req.params.id, function(err, rep) {
        if (rep == 1) {
            res.status(200).type('text').send('Erfolgreich den User mit der ID '+ req.params.id + ' gelöscht');
        }
        else {
            res.status(404).type('text').send('Der user mit der ID ' + req.params.id + ' existiert nicht');
        }
    });
});

app.put('/users/:id', jsonParser, function(req, res){
            
            var neu = req.body;
            neu.id = req.params.id;


            client.set('user:'+req.params.id, JSON.stringify(neu),  function(err, rep){
                res.status(200).type('json').send(neu);
            });

});

/*-----------------------USER ID BEWERTUNG-------------------*/

app.post('/bewertungen/',function(req, res){
             
            var newBewertung = req.body;
            
    client.incr('id:bewertungen',function(err,rep){
                
        newBewertung.id = rep;
                
        client.set('bewertung:'+newBewertung.id, JSON.stringify(newBewertung),function(err,rep){
                    res.json(newBewertung)
                });
            });
});


app.get('/bewertungen/:id', function(req, res){

    client.get('bewertung:'+req.params.id, function(err, rep){

        if (rep) {
            res.type('json').send(rep);
        }
        else{
            res.status(404).type('text').send('Der User mit der ID '+req.params.id+' existiert nicht');
        }
    });
});

app.put('/bewertungen/:id', jsonParser, function(req, res){
            
            var neu = req.body;
            neu.id = req.params.id;


            client.set('bewertung:'+req.params.id, JSON.stringify(neu),  function(err, rep){
                res.status(200).type('json').send(neu);
            });

});

/*------------------------MERKZETTEL---------------------------*/
app.post('/merkzettel/',function(req, res){
             
            var newMerkzettel = req.body;
            
    client.incr('id:merkzettel',function(err,rep){
                
        newMerkzettel.id = rep;
                
        client.set('merkzettel:'+newMerkzettel.id, JSON.stringify(newMerkzettel),function(err,rep){
                    res.json(newMerkzettel)
                });
            });
});

app.delete('/merkzettel/:id', function(req, res){ 

    client.del('merkzettel:'+req.params.id, function(err, rep) {
        if (rep == 1) {
            res.status(200).type('text').send('Eintrag gelöscht');
        }
        else {
            res.status(404).type('text').send('Es existiert kein Eintrag zur ID');
        }
    });
});

/*------------------------ARTICLE--------------------------*/

app.get('/articles', function (req, res) {
   client.keys('article:*', function(err,rep){
       
       var articles = [];
       
       if(rep.length == 0){
       res.json(articles);
       return;
   }
              client.mget(rep,function(err,rep){
       
       rep.forEach(function(val){
           articles.push(JSON.parse(val));
       });
 articles = articles.map(function(article){
                             return {id: article.id, name : article.name};
                             });
                   res.json(articles);
   }); 

});
        });

app.post('/articles',function(req, res){
             
            var newArticle = req.body;
            
    client.incr('id:articles',function(err,rep){
                
        newArticle.id = rep;
                
        client.set('article:'+newArticle.id, JSON.stringify(newArticle),function(err,rep){
                    res.json(newArticle)
                });
            });
});


app.get('/articles/:id', function(req, res){

    client.get('article:'+req.params.id, function(err, rep){

        if (rep) {
            res.type('json').send(rep);
        }
        else{
            res.status(404).type('text').send('Der Artikel mit der ID '+req.params.id+' existiert nicht');
        }
    });
});

app.put('/articles/:id', jsonParser, function(req, res){
             
            var neu = req.body;
            neu.id = req.params.id;
 
 
            client.set('article:'+req.params.id, JSON.stringify(neu),  function(err, rep){
                res.status(200).type('json').send(neu);
            });
 
});

app.delete('/articles/:id', function(req, res){ 
 
    client.del('article:'+req.params.id, function(err, rep) {
        if (rep == 1) {
            res.status(200).type('text').send('Erfolgreich dem Article mit der ID '+ req.params.id + ' gelöscht');
        }
        else {
            res.status(404).type('text').send('Der Article mit der ID ' + req.params.id + ' existiert nicht');
        }
    });
});

/*----------------------------Categorie----------------*/
app.get('/categorie/:id', function(req, res){

    client.get('categorie:'+req.params.id, function(err, rep){

        if (rep) {
            res.type('json').send(rep);
        }
        else{
            res.status(404).type('text').send('Keine Categorie unter dieser ID vorhanden');
        }
    });
});

app.listen(3000);