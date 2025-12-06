const inquirer = require('inquirer');
const colors = require('colors');

const SelectionController = require('./SelectionController');
const VCardController = require('./VCardController');
const ExamController = require('./ExamController');
const ProfileController = require('./ProfileController');
const BanqueDeQuestions = require('./BanqueDeQuestions');
const Affichage = require('../view/Affichage');

class AppController {

    async start() {
        this.showWelcome();

        while (true) {
            const answer = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'Que souhaitez-vous faire ?',
                    choices: [
                        { name: 'Rechercher une question dans la banque', value: 'search' },
                        { name: 'Creer un examen (Selection)', value: 'create' },
                        { name: 'Simuler un examen existant', value: 'simulate' },
                        { name: 'Analyser un fichier GIFT (Profil)', value: 'profile' },
                        { name: 'Generer ma VCard', value: 'vcard' },
                        new inquirer.Separator(),
                        { name: 'Quitter', value: 'exit' }
                    ]
                }
            ]);

            if (answer.action === 'exit') {
                console.log("Au revoir !");
                break;
            }

            await this.dispatch(answer.action);
            console.log("\n--------------------------------------------------\n");
        }
    }

    showWelcome() {
        console.clear();
        console.log("==================================================".cyan);
        console.log("   SRYEM - GESTIONNAIRE D'EXAMENS GIFT v1.0      ".yellow.bold);
        console.log("==================================================\n".cyan);
    }

    async dispatch(action) {
        switch (action) {
            case 'search':
                await this.handleSearch();
                break;
            case 'create':
                const selectionCtrl = new SelectionController();
                await selectionCtrl.start();
                break;
            case 'simulate':
                await this.handleSimulate();
                break;
            case 'profile':
                await this.handleProfile();
                break;
            case 'vcard':
                const vcardCtrl = new VCardController();
                await vcardCtrl.start();
                break;
        }
    }

    async handleSearch() {
        const answer = await inquirer.prompt([{
            type: 'input',
            name: 'keyword',
            message: 'Mot-cle a rechercher :',
            validate: input => input.trim() !== '' ? true : "Le mot-cle ne peut pas etre vide."
        }]);

        const banque = new BanqueDeQuestions();
        console.log("Chargement de la banque de questions...");
        banque.chargerBanque();

        const results = banque.rechercherQuestions(answer.keyword);

        if (results.length === 0) {
            console.log(`Aucune question trouvee pour "${answer.keyword}".`);
            return;
        }

        let searchLoop = true;
        while (searchLoop) {
            const choices = results.map(q => {
                const snippet = q.text.substring(0, 60).replace(/(\r\n|\n|\r)/gm, " ");
                return {
                    name: `[${q.id}] (${q.category}) ${snippet}...`,
                    value: q.id
                };
            });

            choices.push(new inquirer.Separator());
            choices.push({ name: '<-- Retour au menu principal', value: 'EXIT' });

            const selection = await inquirer.prompt([{
                type: 'list',
                name: 'questionId',
                message: `Resultats (${results.length}). Choisissez une question pour voir les details :`,
                pageSize: 15,
                choices: choices
            }]);

            if (selection.questionId === 'EXIT') {
                searchLoop = false;
            } else {
                const question = banque.getQuestionById(selection.questionId);
                if (question) {
                    Affichage.afficherQuestionComplete(question);
                } else {
                    console.error("Erreur : Question introuvable.");
                }

                await inquirer.prompt([{
                    type: 'input',
                    name: 'pause',
                    message: 'Appuyez sur Entree pour revenir a la liste des resultats...'
                }]);
            }
        }
    }

    async handleSimulate() {
        const answer = await inquirer.prompt([{
            type: 'input',
            name: 'file',
            message: 'Chemin du fichier GIFT a simuler :',
            default: 'test.gift'
        }]);
        const ctrl = new ExamController();
        await ctrl.processExam(answer.file);
    }

    async handleProfile() {
        const answer = await inquirer.prompt([{
            type: 'input',
            name: 'file',
            message: 'Chemin du fichier GIFT a analyser :'
        }]);
        const ctrl = new ProfileController();
        ctrl.processFile(answer.file);

        await inquirer.prompt([{
            type: 'input',
            name: 'pause',
            message: 'Appuyez sur Entree pour continuer...'
        }]);
    }
}

module.exports = AppController;