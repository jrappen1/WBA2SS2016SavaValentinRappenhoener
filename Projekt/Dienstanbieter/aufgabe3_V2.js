var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var redis = require('redis');

var client = redis.createClient();
var app = express();

app.use(bodyParser.json());

// User anlegen
app.post('/users', function (req, res) {
    var newUser = req.body;
    client.incr('nextUserID', function (err, rep) {
        newUser.id = rep;
        newUser.merkzettel = [];
        newUser.bewertung = [];
        newUser.articles = [];
        client.set('user:' + newUser.id, JSON.stringify(newUser), function (err, rep) {
            res.json(newUser);
        });
    });
});

// Alle aufliesten
app.get('/users', function (req, res) {
    client.keys('user:*', function (err, rep) {

        var users = [];

        if (rep.length == 0) {
            res.json(users);
            return;
        }
        client.mget(rep, function (err, rep) {

            rep.forEach(function (val) {
                users.push(JSON.parse(val));
            });
            users = users.map(function (user) {
                return {id: user.id, name: user.name, nickname: user.nickname, wohnort: user.wohnort};
            });
            res.json(users);
        });
    });
});

// Einen User abfragen
app.get('/users/:id', function (req, res) {

    client.get('user:' + req.params.id, function (err, rep) {
        if (rep) {
            res.type('json').send(rep);
        } else {
            res.status(404).type('text').send('Der User mit der ID ' + req.params.id + ' existiert nicht');
        }
    });
});

// Löscht einen Benutzer
app.delete('/users/:id', function (req, res) {

    client.get('user:' + req.params.id, function (err, rep) {
        var article = JSON.parse(rep).article;
        for (var i = 0; i < article.length; i++)
            client.del("article:" + article[i]);
        /*user.article.forEach(function(id){
         client.del("article:"+id);
         });*/
        client.del('user:' + req.params.id, function (err, rep) {
            if (rep == 1) {
                res.status(200).type('text')
                    .send('Erfolgreich den User mit der ID ' + req.params.id + ' gelöscht');
            } else {
                res.status(404).type('text')
                    .send('Der user mit der ID ' + req.params.id + ' existiert nicht');
            }
        });
    });
});

// Überschreibt einen User
app.put('/users/:id', jsonParser, function (req, res) {

    var neu = req.body;
    neu.id = req.params.id;

    client.set('user:' + req.params.id, JSON.stringify(neu), function (err, rep) {
        res.status(200).type('json').send(neu);
    });

});

// erstellt einen Article
app.post('/articles', function (req, res) {

    var newArticle = req.body;

    client.incr('nextArticleID', function (err, rep) {

        newArticle.id = rep;
        client.set('article:' + newArticle.id, JSON.stringify(newArticle), function (err, rep) {
            client.get('user:' + newArticle.userID, function (err, rep) {
                var user = JSON.parse(rep);
                user.article.push(newArticle.id);
                client.set('user:' + user.id, JSON.stringify(user), function (err, rep) {
                    res.json(newArticle)
                });
            });
        });
    });
});

// einen erfragen
app.get('/articles/:id', function (req, res) {

    client.get('article:' + req.params.id, function (err, rep) {

        if (rep) {
            res.type('json').send(rep);
        }
        else {
            res.status(404).type('text').send('Der Artikel mit der ID ' + req.params.id + ' existiert nicht');
        }
    });
});

// einen bearbeiten
app.put('/articles/:id', jsonParser, function (req, res) {

    var neu = req.body;
    neu.id = req.params.id;


    client.set('article:' + req.params.id, JSON.stringify(neu), function (err, rep) {
        res.status(200).type('json').send(neu);
    });

});

// alle ausgeben
app.get('/articles', function (req, res) {
    client.keys('article:*', function (err, rep) {

        var articles = [];

        if (rep.length == 0) {
            res.json(articles);
            return;
        }
        client.mget(rep, function (err, rep) {

            rep.forEach(function (val) {
                articles.push(JSON.parse(val));
            });
            articles = articles.map(function (article) {
                return {id: article.id, name: article.name};
            });
            res.json(articles);
        });

    });
});

// löscht einen Article
app.delete('/articles/:id', function (req, res) {

    client.get('article:' + req.params.id, function (err, rep) {
        var article = JSON.parse(rep);
        client.get('user:' + article.userID, function (err, rep) {
            var user = JSON.parse(rep);
            user.article = user.article.filter((value) => value != article.id);
            client.set('user:' + user.id, JSON.stringify(user), function (err, rep) {
                client.del('article:' + req.params.id, function (err, rep) {
                    if (rep == 1) {
                        res.status(200).type('text').send('Erfolgreich dem Article mit der ID ' + req.params.id + ' gelöscht');
                    } else {
                        res.status(404).type('text').send('Der Article mit der ID ' + req.params.id + ' existiert nicht');
                    }
                });
            });
        });
    });
});





// erstellt eine Bewertung
app.post('/bewertung', function (req, res) {

    var newBewertung = req.body;

    client.incr('nextBewertungID', function (err, rep) {

        newBewertung.id = rep;
        client.set('bewertung:' + newBewertung.id, JSON.stringify(newBewertung), function (err, rep) {
            client.get('user:' + newBewertung.userID, function (err, rep) {
                var user = JSON.parse(rep);
                user.bewertung.push(newBewertung.id);
                client.set('user:' + user.id, JSON.stringify(user), function (err, rep) {
                    res.json(newBewertung)
                });
            });
        });
    });
});

// einen erfragen
app.get('/bewertung/:id', function (req, res) {

    client.get('bewertung:' + req.params.id, function (err, rep) {

        if (rep) {
            res.type('json').send(rep);
        }
        else {
            res.status(404).type('text').send('Die Bewertung mit der ID ' + req.params.id + ' existiert nicht');
        }
    });
});

// einen bearbeiten
app.put('/bewertung/:id', jsonParser, function (req, res) {

    var neu = req.body;
    neu.id = req.params.id;


    client.set('bewertung:' + req.params.id, JSON.stringify(neu), function (err, rep) {
        res.status(200).type('json').send(neu);
    });

});

// alle ausgeben
app.get('/bewertung', function (req, res) {
    client.keys('bewertung:*', function (err, rep) {

        var bewertungen = [];

        if (rep.length == 0) {
            res.json(articles);
            return;
        }
        client.mget(rep, function (err, rep) {

            rep.forEach(function (val) {
                bewertungen.push(JSON.parse(val));
            });
            bewertung = bewertung.map(function (bewertung) {
                return {id: bewertung.id, name: bewertung.name};
            });
            res.json(bewertung);
        });

    });
});

// löscht eine Bewertung
app.delete('/bewertung/:id', function (req, res) {

    client.get('bewertung:' + req.params.id, function (err, rep) {
        var article = JSON.parse(rep);
        client.get('user:' + bewertung.userID, function (err, rep) {
            var user = JSON.parse(rep);
            user.bewertung = user.bewertung.filter((value) => value != bewertung.id);
            client.set('user:' + user.id, JSON.stringify(user), function (err, rep) {
                client.del('bewertung:' + req.params.id, function (err, rep) {
                    if (rep == 1) {
                        res.status(200).type('text').send('Erfolgreich die Bewertung mit der ID ' + req.params.id + ' gelöscht');
                    } else {
                        res.status(404).type('text').send('Die Bewertung mit der ID ' + req.params.id + ' existiert nicht');
                    }
                });
            });
        });
    });
});

// erstellt eine Message
app.post('/messages', function (req, res) {

    var newMessage = req.body;

    client.incr('nextMessageID', function (err, rep) {

        newMessage.id = rep;
        client.set('message:' + newMessage.id, JSON.stringify(newMessage), function (err, rep) {
            client.get('user:' + newMessage.userID, function (err, rep) {
                var user = JSON.parse(rep);
                user.message.push(newMessage.id);
                client.set('user:' + user.id, JSON.stringify(user), function (err, rep) {
                    res.json(newMessage)
                });
            });
        });
    });
});

// einen erfragen
app.get('/messages/:id', function (req, res) {

    client.get('message:' + req.params.id, function (err, rep) {

        if (rep) {
            res.type('json').send(rep);
        }
        else {
            res.status(404).type('text').send('Die Message mit der ID ' + req.params.id + ' existiert nicht');
        }
    });
});

// einen bearbeiten
app.put('/messages/:id', jsonParser, function (req, res) {

    var neu = req.body;
    neu.id = req.params.id;


    client.set('message:' + req.params.id, JSON.stringify(neu), function (err, rep) {
        res.status(200).type('json').send(neu);
    });

});

// alle ausgeben
app.get('/messages', function (req, res) {
    client.keys('message:*', function (err, rep) {

        var messages = [];

        if (rep.length == 0) {
            res.json(messages);
            return;
        }
        client.mget(rep, function (err, rep) {

            rep.forEach(function (val) {
                messages.push(JSON.parse(val));
            });
            messages = messages.map(function (article) {
                return {id: message.id, name: message.name};
            });
            res.json(message);
        });

    });
});

// löscht eine Message
app.delete('/messages/:id', function (req, res) {

    client.get('message:' + req.params.id, function (err, rep) {
        var message = JSON.parse(rep);
        client.get('user:' + message.userID, function (err, rep) {
            var user = JSON.parse(rep);
            user.message = user.message.filter((value) => value != message.id);
            client.set('user:' + user.id, JSON.stringify(user), function (err, rep) {
                client.del('message:' + req.params.id, function (err, rep) {
                    if (rep == 1) {
                        res.status(200).type('text').send('Erfolgreich die Message mit der ID ' + req.params.id + ' gelöscht');
                    } else {
                        res.status(404).type('text').send('Die Message mit der ID ' + req.params.id + ' existiert nicht');
                    }
                });
            });
        });
    });
});

// erstellt einen Eintrag in der Merkliste
// {"userID":"<der wo es eingetragen werden soll>","articleID":"<welcher gemerkt wird>"}
app.post('/merkzettel', function (req, res) {
    var newEintrag = req.body;
    client.get('user:' + newEintrag.userID, function (err, rep) {
        var user = JSON.parse(rep);
        user.merkzettel.push(newEintrag.articleID);
        client.set('user:' + user.id, JSON.stringify(user), function (err, rep) {
            res.json(user.merkzettel);
        });
    });
});


// löscht einen Eintrag im Merkzettel
app.delete('/merkzettel/:userID/:articleID', function (req, res) {
    client.get('user:' + req.params.userID, function (err, rep) {
        var user = JSON.parse(rep);
        user.merkzettel = user.merkzettel.filter((value) => value != req.params.articleID);
        client.set('user:' + user.id, JSON.stringify(user), function (err, rep) {
            res.json(user.merkzettel);
        });
    });
});

// alle ausgeben
app.get('/merkzettel/:userID', function (req, res) {
    
    client.get('user:' + req.params.userID, function (err, rep) {
        var user = JSON.parse(rep);
        var articles = [];
        if (user.merkzettel.length == 0) {
            res.json(articles);
            return;
        }
        client.mget(user.merkzettel.map(function(zettel){
            return "article:"+zettel
        }), function(err, rep){
            rep.forEach(function (val) {
                articles.push(JSON.parse(val));
            });
            articles = articles.map(function (article) {
                return {id: article.id, text: article.text};
            });
            res.json(articles);
        });
    });
});

app.listen(3000);