const inquirer = require('inquirer');
const colors = require('colors');

// Import des contrôleurs existants
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
                        { name: 'Créer un examen (Sélection)', value: 'create' },
                        { name: 'Simuler un examen existant', value: 'simulate' },
                        { name: 'Analyser un fichier GIFT (Profil)', value: 'profile' },
                        { name: 'Générer ma VCard', value: 'vcard' },
                        new inquirer.Separator(),
                        { name: 'Quitter', value: 'exit' }
                    ]
                }
            ]);

            if (answer.action === 'exit') {
                console.log("Au revoir !".cyan);
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

    // --- Wrappers pour les fonctionnalités "One-shot" ---

    async handleSearch() {
        const answer = await inquirer.prompt([{
            type: 'input',
            name: 'keyword',
            message: 'Mot-clé à rechercher :'
        }]);

        const banque = new BanqueDeQuestions();
        banque.chargerBanque();
        const results = banque.rechercherQuestions(answer.keyword);
        Affichage.afficherListeQuestions(results);

        // Petit hack pour laisser le temps de lire
        await inquirer.prompt([{type: 'input', name: 'pause', message: 'Appuyez sur Entrée pour continuer...'}]);
    }

    async handleSimulate() {
        const answer = await inquirer.prompt([{
            type: 'input',
            name: 'file',
            message: 'Chemin du fichier GIFT à simuler :',
            default: 'test.gift' // Valeur par défaut pour faciliter le test
        }]);
        const ctrl = new ExamController();
        await ctrl.processExam(answer.file);
    }

    async handleProfile() {
        const answer = await inquirer.prompt([{
            type: 'input',
            name: 'file',
            message: 'Chemin du fichier GIFT à analyser :'
        }]);
        const ctrl = new ProfileController();
        ctrl.processFile(answer.file);
        await inquirer.prompt([{type: 'input', name: 'pause', message: 'Appuyez sur Entrée pour continuer...'}]);
    }
}

module.exports = AppController;