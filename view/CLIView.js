// view/CLIView.js
const readline = require('readline');

class CLIView {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    // Méthode générique pour poser une question et attendre la réponse
    ask(questionText) {
        return new Promise((resolve) => {
            this.rl.question(questionText, (answer) => {
                resolve(answer.trim());
            });
        });
    }

    afficherTitre() {
        console.log("\n============================================");
        console.log("   GÉNÉRATEUR DE VCARD ENSEIGNANT (MVC)   ");
        console.log("============================================");
    }

    afficherErreur(message) {
        console.error(`Erreur : ${message}`);
    }

    afficherSucces(message) {
        console.log(`Succès : ${message}`);
    }

    afficherContenu(contenu) {
        console.log("\n--- Aperçu du fichier généré ---");
        console.log(contenu);
        console.log("--------------------------------");
    }

    fermer() {
        this.rl.close();
    }
}
module.exports = CLIView;