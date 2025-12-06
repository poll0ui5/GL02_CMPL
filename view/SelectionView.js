const inquirer = require('inquirer');

class SelectionView {

    async showMenu() {
        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'Menu de Sélection :',
                choices: [
                    { name: 'Ajouter une question par ID', value: 'add' },
                    { name: 'Retirer une question par ID', value: 'remove' },
                    { name: 'Visualiser la sélection actuelle', value: 'list' },
                    { name: 'Sauvegarder (Générer l\'examen)', value: 'save' },
                    { name: 'Quitter sans sauvegarder', value: 'exit' }
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
                validate: input => input.trim() !== '' ? true : "L'ID ne peut pas être vide."
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
        console.log("\n=== CONTENU DE LA SÉLECTION ===");
        if (questions.length === 0) {
            console.log("   (Aucune question sélectionnée)");
        } else {
            questions.forEach((q, index) => {
                // On affiche un résumé court de la question
                const snippet = q.text.substring(0, 60).replace(/\n/g, ' ') + "...";
                console.log(`   ${index + 1}. [${q.id}] (${q.category}) : ${snippet}`);
            });
        }
        console.log(`   > Total : ${questions.length} question(s)\n`);
    }

    displaySuccess(msg) {
        console.log(`✅ ${msg}`);
    }

    displayError(msg) {
        console.error(`Erreur : ${msg}`);
    }
}

module.exports = SelectionView;