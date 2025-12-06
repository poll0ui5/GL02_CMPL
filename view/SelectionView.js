const inquirer = require('inquirer');

class SelectionView {

    async showMenu() {
        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'Menu de Selection :',
                pageSize: 12,
                choices: [
                    { name: 'Rechercher des questions (pour ajout ou consultation)', value: 'search_mode' },
                    new inquirer.Separator(),
                    { name: 'Ajouter une question par ID (Manuel)', value: 'add' },
                    { name: 'Retirer une question par ID', value: 'remove' },
                    { name: 'Visualiser la selection actuelle', value: 'list' },
                    new inquirer.Separator(),
                    { name: 'Sauvegarder (Generer l\'examen)', value: 'save' },
                    { name: 'Quitter sans sauvegarder', value: 'exit' }
                ]
            }
        ]);
        return answer.action;
    }

    async promptForSearchKeyword() {
        const answer = await inquirer.prompt([
            {
                type: 'input',
                name: 'keyword',
                message: 'Entrez un mot-cle pour rechercher des questions :',
                validate: input => input.trim() !== '' ? true : "Le mot-cle ne peut pas etre vide."
            }
        ]);
        return answer.keyword;
    }

    async showSearchResults(questions) {
        const choices = questions.map(q => {
            const snippet = q.text.substring(0, 60).replace(/(\r\n|\n|\r)/gm, " ");
            return {
                name: `[${q.id}] (${q.category}) ${snippet}`,
                value: q.id
            };
        });

        choices.push(new inquirer.Separator());
        choices.push({ name: '<-- Retour au menu principal', value: 'BACK' });

        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedId',
                message: `Resultats de la recherche (${questions.length} trouves). Choisissez une question :`,
                pageSize: 15,
                choices: choices
            }
        ]);
        return answer.selectedId;
    }

    async showQuestionActionMenu(questionId) {
        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: `Action pour la question ${questionId} :`,
                choices: [
                    { name: 'Voir les details complets', value: 'view' },
                    { name: 'Ajouter a la selection', value: 'add' },
                    { name: 'Retour a la liste de recherche', value: 'back' }
                ]
            }
        ]);
        return answer.action;
    }

    async promptForId() {
        const answer = await inquirer.prompt([
            {
                type: 'input',
                name: 'id',
                message: 'Entrez l\'ID de la question (ex: Q1, Q45) :',
                validate: input => input.trim() !== '' ? true : "L'ID ne peut pas etre vide."
            }
        ]);
        return answer.id;
    }

    async promptForFilename() {
        const answer = await inquirer.prompt([
            {
                type: 'input',
                name: 'filename',
                message: 'Nom du fichier de sortie (sans l\'extension .gift) :',
                validate: input => /^[a-zA-Z0-9-_]+$/.test(input) ? true : "Nom invalide (lettres, chiffres, - et _ uniquement)."
            }
        ]);
        return answer.filename + ".gift";
    }

    displayList(questions) {
        console.log("\n=== CONTENU DE LA SELECTION ===");
        if (questions.length === 0) {
            console.log("   (Aucune question selectionnee)");
        } else {
            questions.forEach((q, index) => {
                const snippet = q.text.substring(0, 60).replace(/\n/g, ' ') + "...";
                console.log(`   ${index + 1}. [${q.id}] (${q.category}) : ${snippet}`);
            });
        }
        console.log(`   > Total : ${questions.length} question(s)\n`);
    }

    displaySuccess(msg) {
        console.log(`OK : ${msg}`);
    }

    displayError(msg) {
        console.error(`ERREUR : ${msg}`);
    }
}

module.exports = SelectionView;