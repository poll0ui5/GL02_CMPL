// view/ExamView.js
const readline = require('readline');

class ExamView {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    ask(questionText) {
        return new Promise((resolve) => {
            this.rl.question(questionText, (answer) => {
                resolve(answer);
            });
        });
    }

    displayHeader(filename) {
        console.log("\n==================================================");
        console.log(`SIMULATION D'EXAMEN : ${filename}`);
        console.log("==================================================\n");
    }

    displayQuestion(q, index) {
        console.log(`\n[Question ${index + 1}] (${q.category})`);
        console.log("--------------------------------------------------");
        
        // Afficher le texte avec le trou (si texte à trous)
        console.log(q.text + (q.tail ? " " + q.tail : "")); 

        // Affichage spécifique selon le type pour aider l'utilisateur
        if (q.category === 'MCQ' || q.category === 'Credit') {
            q.choices.forEach((c, i) => {
                // Affiche A) Choix 1, B) Choix 2...
                const letter = String.fromCharCode(65 + i); 
                console.log(`   ${letter}) ${c.text}`);
            });
            console.log("\n-> Entrez la lettre de votre réponse (A, B, C...) :");
        } 
        else if (q.category === 'TrueFalse') {
            console.log("\n-> Répondez par V (Vrai) ou F (Faux) :");
        }
        else if (q.category === 'Numeric') {
            console.log("\n-> Entrez un nombre :");
        }
        else if (q.category === 'Description') {
            console.log("(Ceci est une information, appuyez sur Entrée pour continuer)");
        }
        else {
            console.log("(Ce type de question ne supporte pas la vérification automatique)");
        }
    }

    displayFeedback(isCorrect, correctAnswerText) {
        if (isCorrect) {
            console.log("Bonne réponse !");
        } else {
            console.log("Mauvaise réponse.");
            if (correctAnswerText) {
                console.log(`   La bonne réponse était : ${correctAnswerText}`);
            }
        }
    }

    // Implémentation exacte de la maquette demandée
    displayFinalResult(results) {
        console.log("\n==================================================");
        console.log("📊  RÉSULTAT FINAL");
        console.log("==================================================");
        console.log(`Vous avez obtenu : ${results.score} bonnes réponses sur ${results.total}`);
        console.log(`${results.badAnswers} mauvaises réponses sur ${results.total}`);
        console.log(`Soit un total de ${results.percentage}% de bonnes réponses.`);
        console.log("==================================================\n");
    }

    displayError(msg) {
        console.error(`Erreur : ${msg}`);
    }

    close() {
        this.rl.close();
    }
}

module.exports = ExamView;