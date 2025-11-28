require(semantique / Question.js);
require(semantique / ColletionQuestion.js);

// GiftParser


var GiftParser = function (sTokenize, sParsedSymb) {
	// The list of questions parsed from the input file.
	this.parsedQuestion = [];
	this.symb = [
		"::",
		"{",
		"}",
		"=",
		"~",
		"#",
		"T",
		"F",
		"->",
		":",
		"..",
		"-",
		"%"
	];
	this.showTokenize = sTokenize;
	this.showParsedSymbols = sParsedSymb;
	this.errorCount = 0;
}

// Parser procedure

// tokenize : tranform the data input into a list
GiftParser.prototype.tokenize = function (data) {
	var separator = /(\r\n|::|{|}|=|~|#|->|:|\.\.|\-|\%)/; //définir les symboles de séparation 
	data = data.split(separator);
	data = data.filter((val, idx) => !val.match(separator)); // ne garder que les jetons qui ne sont PAS des séparateurs				
	return data;
}

//=========================================== Outils pour parser ====================================================/

VpfParser.prototype.next = function (input) {
	var curS = input.shift(); //supprime le premier élément du tableau
	if (this.showParsedSymbols) {
		console.log(curS);
	}
	return curS
}

GiftParser.prototype.check = function (s, input) { //observe le jeton actuel et le compare, sans le supprimer
	if (this.accept(input[0]) == this.accept(s)) {
		return true;
	}
	return false;
}

GiftParser.prototype.expect = function (s, input) { // passe au jeton suivant et répond à une question sur le symbole
	if (s == this.next(input)) {
		return true;
	} else {
		this.errMsg("symbol " + s + " doesn't match", input);
	}
	return false;
}

VpfParser.prototype.accept = function (s) { //vérifie si le symbôle fait bien partie de la liste autorisée
	var idx = this.symb.indexOf(s);
	// index 0 exists
	if (idx === -1) {
		this.errMsg("symbol " + s + " unknown", [" "]);
		return false;
	}

	return idx;
}

VpfParser.prototype.errMsg = function (msg, input) { // pour afficher un message d'erreur
	this.errorCount++;
	console.log("Parsing Error ! on " + input + " -- msg : " + msg);
}

// Vérifie si un symbole spécifique  est présent dans le bloc 
GiftParser.prototype.containsSymbol = function(input, sym){
    var i = 0;
    // On boucle tant qu'on est pas à la fin du fichier 
    // ET qu'on n'a pas atteint la fin du bloc de réponse "}"
    while(i < input.length && input[i] !== "}"){
        if(input[i] === sym){
            return true; 
        }
        i++;
    }
    return false; 
}
//=====================================================================================================================//

GiftParser.prototype.parseQuestion = function (input) {
	var question = new Question;

	if (this.check("::", input)) {
		this.expect('::', input);
		question.number = this.next(input);
		this.expect('::', input);
	}

	var text = "";
	while (!this.check == "{" && input.length > 0) {
		text += this.next(input) + " ";
	}
	question.text = text.trim(); // stocke l'énoncé nettoyé

	this.expect("{", input);
	if (this.check('}', input)) { // si l'ensemble de réponse est vide, alors c'est une question ouverte 
		this.expect('}', input);
		question.category = "Essay";
		this.parsedQuestion.push(question);
	}
	else if (this.check('T', input)|| this.check('F', input)) { // si l'ensemble de réponse est juste T ou F, alors c'est un vrai/faux
		this.parseTrueFalse(input, question);
	}
	else if (this.check('#', input)){ // si l'ensemble de réponse commence par un #, alors c'est une plage numérique
		this.parseNumeric(input, question);
	}
	else { // si le bloc réponse commence par un =, il y'a une ambiguité. Il faut vérifier la présence de symboles dans les bloc réponse, et pas forcément au tout début
		if (this.containsSymbol(input, '->')){
			this.parseMatching(input, question);
		}
		else if (this.containsSymbol(input, '%')){
			this.parseCredit(input, question);
		}
		else{
			this.parseMCQ(input, question);
		}
	}

}



