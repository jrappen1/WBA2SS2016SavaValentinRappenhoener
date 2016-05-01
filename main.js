//Aufgabe 1 

//Node.js bietet das Modul "fs" an, welches den Zugriff auf Dateien ermöglicht -> var fs = require('fs')
// wofür steht nun "var" -> In JavaScrip deklariert man eine Variable via "var Statement" bevor man es benutzt 

var fs = require('fs');

//Die Funktion -> fs.readFile(__dirname+"/wolkenkratzer.json",function(err,data)) -> ermöglicht das asynchrone Auslesen von Dateien
// __dirname ->  enthält Name des Verzeichnisses , in dem das aktuelle Programm liegt.
//err -> error
// Der Parameter -> data ist normalerweise ein Buffer mit Binärdaten, der mittels data.toString() in einen String umgewandelt werden kann.

fs.readFile(__dirname+"/wolkenkratzer.json", function(err, data) { 

		if (err) throw err;
    
        // die Javascript Funktion JSON.parse(text) wird benutzt um einen JSON text  in ein javascript objekt umzuwandeln
        var emulated = JSON.parse(data.toString());

    //hatte da vorher dirname+ data stehen dadurch hat es einfach die unveränderte json datei ausgegeben
    //damit konnte ich die wolkenkratzer datei verändern 
    //fs.writeFile -> ermöglicht das asynchrone Schreiben von Dateien
    fs.writeFile(__dirname+"/wolkenkratzer.json",function(err) {

			if (err) throw err;
        
            //Beispiel einer for-Schleife in JSON -> for(var k in result) {console.log(k, result[k]);}
            for(var i in emulated.wolkenkratzer){
            console.log("Name:" + emulated.wolkenkratzer[i].name);
            console.log("Stadt:" + emulated.wolkenkratzer[i].stadt);
            console.log("Hoehe:" + emulated.wolkenkratzer[i].hoehe);
            console.log("--------------------------------------");
            }
    });
});