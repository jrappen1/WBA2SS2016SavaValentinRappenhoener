//Aufgabe 1 

//Node.js bietet das Modul "fs" an, welches den Zugriff auf Dateien ermöglicht -> var fs = require('fs')
// wofür steht nun "var" -> In JavaScrip deklariert man eine Variable via "var Statement" bevor man es benutzt 

var fs = require('fs');
//Aufgabe 2 -> Das Einfärben 
//var chalk = require ('chalk') -> chalk -> damit kann man Buchstarben einfärben -> 1 Schritt -> die Installation npm install --save chalk z.b. kann man mit der Eingabe -> chalk.blue('Hello world!') -> kann man eine Zeichenkette färben
var chalk = require('chalk');

//Die Funktion -> fs.readFile(__dirname+"/wolkenkratzer.json",function(err,data)) -> ermöglicht das asynchrone Auslesen von Dateien
// __dirname ->  enthält Name des Verzeichnisses , in dem das aktuelle Programm liegt.
//err -> error
// Der Parameter -> data ist normalerweise ein Buffer mit Binärdaten, der mittels data.toString() in einen String umgewandelt werden kann.

fs.readFile(__dirname+"/wolkenkratzer.json", function(err, data) { 

		if (err) throw err;
    
        // die Javascript Funktion JSON.parse(text) wird benutzt um einen JSON text  in ein javascript objekt umzuwandeln
        var emulated = JSON.parse(data.toString());
    
    //Aufgabe 3 -> Sortieren nach Höhe macht man Durch eine If-Anweisung (Siehe Beispiellink)
    emulated.wolkenkratzer.sort(function(a,b) {

				if (a.hoehe > b.hoehe) {
   					return 1;
  				}
  				if (a.hoehe < b.hoehe) {
    				return -1;
  				}
  				// a muss gleich sein mit b 
  					return 0;
				}
			);

    //hatte da vorher dirname+ data stehen dadurch hat es einfach die unveränderte json datei ausgegeben
    //damit konnte ich die wolkenkratzer datei verändern 
    //fs.writeFile -> ermöglicht das asynchrone Schreiben von Dateien
    
    //Zu Aufgabe3 -> Liste in einer neuen Datei Speichern -> d.h ich muss den Namen verändern
    //vergessen JSON.stringify anzugeben -> Methode konvertiert einen JavaScript-Wert in eine JSON-Zeichenkette.
    fs.writeFile(__dirname+"/sorted_wolkenkratzer.json",JSON.stringify(emulated),function(err) {

			if (err) throw err;
        
            //Beispiel einer for-Schleife in JSON -> for(var k in result) {console.log(k, result[k]);}
            // Farben eingefügt für Name, Stadt und Höhe
            for(var i in emulated.wolkenkratzer){
            console.log(chalk.green("Name:" + emulated.wolkenkratzer[i].name));
            console.log(chalk.red("Stadt:" + emulated.wolkenkratzer[i].stadt));
            console.log(chalk.yellow("Hoehe:" + emulated.wolkenkratzer[i].hoehe));
            console.log("--------------------------------------");
            }
    });
});