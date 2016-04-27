//Node.js bietet das Modul "fs" an, welches den Zugriff auf Dateien ermöglicht -> var fs = require('fs')
// var chalk = require ('chalk') -> chalk -> damit kann man Buchstarben einfärben -> 1 Schritt -> die Installation npm install --save chalk z.b. kann man mit der Eingabe -> chalk.blue('Hello world!') -> kann man eine Zeichenkette färben
// wofür steht nun "var" -> In JavaScrip deklariert man eine Variable via "var Statement" bevor man es benutzt  

var fs = require('fs');
var chalk = require('chalk');

//Die Funktion -> fs.readFile(__dirname+"/wolkenkratzer.json",function(err,data)) -> ermöglicht das asynchrone Auslesen von Dateien
// __dirname ->  enthält Name des Verzeichnisses , in dem das aktuelle Programm liegt.

fs.readFile(__dirname+"/wolkenkratzer.json", function(err, data) { 

		if (err) throw err;

			var emulated = JSON.parse(data.toString());

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

		fs.writeFile(__dirname+"/sorted_wolkenkratzer.json", JSON.stringify(emulated), function(err) {

			if (err) throw err;

			for(var i in emulated.wolkenkratzer){
				console.log(chalk.green("Name:" + emulated.wolkenkratzer[i].name));
				console.log(chalk.yellow("Stadt:" + emulated.wolkenkratzer[i].stadt));
				console.log(chalk.red("Hoehe:" + emulated.wolkenkratzer[i].hoehe));
				console.log("--------------------------------------");
			}
		});
 });