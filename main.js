const readline = require('readline');
const BanqueDeQuestions = require('./controller/BanqueDeQuestions.js');
const Affichage = require('./view/Affichage.js');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
}); // Je sais pas si on peut garder comme ça mais pour l'instant ça marche

const banque = new BanqueDeQuestions();
let resultatsRecherche = []; // Pour stocker la dernière liste de résultats

function initialiser() {
    banque.chargerBanque();
    console.log("\nBienvenue dans le Générateur d'Examens.");
    console.log("Commandes disponibles : rechercher <mot-clé>, afficher <ID_question>, quitter");
    attendreCommande();
}

/**
 * Gère la logique de la ligne de commande.
 */
function attendreCommande() {
    rl.question('> ', (input) => {
        const parts = input.trim().split(/\s+/);
        const command = parts[0].toLowerCase();
        const argument = parts.slice(1).join(' ');

        switch (command) {
            case 'rechercher':
                handleRechercher(argument);
                break;
            case 'afficher':
                handleAfficher(argument);
                break;
            case 'quitter':
                console.log("Merci d'avoir utilisé le programme. Au revoir !");
                rl.close();
                return;
            default:
                console.log(`Commande inconnue : ${command}. Essayez 'rechercher', 'afficher', ou 'quitter'.`);
        }
        attendreCommande();
    });
}

/**
 * Traite la commande 'rechercher'.
 * @param {string} keyword - Le mot-clé de recherche.
 */
function handleRechercher(keyword) {
    if (!keyword) {
        console.log("Veuillez spécifier un mot-clé ou une expression pour la recherche.");
        return;
    }

    resultatsRecherche = banque.rechercherQuestions(keyword);
    Affichage.afficherListeQuestions(resultatsRecherche);
}

/**
 * Traite la commande 'afficher'.
 * @param {string} id - L'ID de la question (ex: Q45).
 */
function handleAfficher(id) {
    if (!id) {
        console.log("Veuillez spécifier l'ID de la question à afficher (ex: afficher Q45).");
        return;
    }

    // Assurez-vous que l'ID commence par 'Q' et est en majuscule
    const questionId = id.toUpperCase().startsWith('Q') ? id.toUpperCase() : `Q${id}`;

    const question = banque.getQuestionById(questionId);
    Affichage.afficherQuestionComplete(question);
}


// Lancer l'application
initialiser();