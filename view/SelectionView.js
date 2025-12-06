const inquirer = require('inquirer');

class SelectionView {

    async showMenu() {
        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'Menu de Sélection :',
                pageSize: 10,
                choices: [
                    { name: '🔍 Rechercher et ajouter des questions', value: 'search_add' }, // NOUVEAU
                    { name: '➕ Ajouter une question par ID (Manuel)', value: 'add' },
                    { name: '➖ Retirer une question par ID', value: 'remove' },
                    { name: '👀 Visualiser la sélection actuelle', value: 'list' },
                    new inquirer.Separator(),
                    { name: '💾 Sauvegarder (Générer l\'examen)', value: 'save' },
                    { name: '❌ Quitter sans sauvegarder', value: 'exit' }
                ]
            }
        ]);
        return answer.action;
    }

    // --- NOUVELLE MÉTHODE : Prompt Recherche ---
    async promptForSearchKeyword() {
        const answer = await inquirer.prompt([
            {
                type: 'input',
                name: 'keyword',
                message: 'Entrez un mot-clé pour rechercher des questions :',
                validate: input => input.trim() !== '' ? true : "Le mot-clé ne peut pas être vide."
            }
        ]);
        return answer.keyword;
    }

    // --- NOUVELLE MÉTHODE : Sélection multiple dans une liste ---
    async selectQuestionsFromSearch(questions) {
        // On prépare l'affichage : [ID] (Type) Début du texte...
        const choices = questions.map(q => {
            const snippet = q.text.substring(0, 80).replace(/(\r\n|\n|\r)/gm, " ");
            return {
                name: `[${q.id}] (${q.category}) ${snippet}`,
                value: q.id
            };
        });

        const answer = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'selectedIds',
                message: 'Cochez les questions à ajouter (Espace pour cocher, Entrée pour valider) :',
                choices: choices,
                pageSize: 15 // Affiche plus de résultats pour faciliter la lecture
            }
        ]);
        return answer.selectedIds;
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
        console.error(`❌ Erreur : ${msg}`);
    }
}

module.exports = SelectionView;