const fs = require('fs');
const path = require('path');
const BanqueDeQuestions = require('./BanqueDeQuestions');
const QuestionSelection = require('../model/QuestionSelection');
const SelectionView = require('../view/SelectionView');
const GiftExporter = require('../model/GiftExporter');

class SelectionController {
    constructor() {
        this.banque = new BanqueDeQuestions();
        this.selection = new QuestionSelection();
        this.view = new SelectionView();
    }

    async start() {
        // 1. Charger la banque de questions au démarrage
        this.banque.chargerBanque();

        let loop = true;
        while (loop) {
            // Afficher le menu et attendre le choix
            const action = await this.view.showMenu();

            switch (action) {
                case 'add':
                    await this.handleAdd();
                    break;
                case 'remove':
                    await this.handleRemove();
                    break;
                case 'list':
                    this.view.displayList(this.selection.getAll());
                    break;
                case 'save':
                    loop = await this.handleSave(); // Retourne false si sauvegardé pour quitter
                    break;
                case 'exit':
                    console.log("Au revoir !");
                    loop = false;
                    break;
            }
        }
    }

    async handleAdd() {
        const idRaw = await this.view.promptForId();
        // Formater l'ID comme dans cli.js (ex: "45" -> "Q45")
        const id = idRaw.toUpperCase().startsWith('Q') ? idRaw.toUpperCase() : `Q${idRaw}`;

        const question = this.banque.getQuestionById(id);

        if (!question) {
            this.view.displayError(`Question ${id} introuvable dans la banque.`);
            return;
        }

        if (this.selection.add(question)) {
            this.view.displaySuccess(`Question ${id} ajoutée.`);
        } else {
            this.view.displayError(`La question ${id} est déjà dans votre sélection.`);
        }
    }

    async handleRemove() {
        if (this.selection.count() === 0) {
            this.view.displayError("La sélection est vide.");
            return;
        }

        const idRaw = await this.view.promptForId();
        const id = idRaw.toUpperCase().startsWith('Q') ? idRaw.toUpperCase() : `Q${idRaw}`;

        if (this.selection.remove(id)) {
            this.view.displaySuccess(`Question ${id} retirée.`);
        } else {
            this.view.displayError(`L'ID ${id} n'est pas dans votre sélection.`);
        }
    }

    async handleSave() {
        if (this.selection.count() === 0) {
            this.view.displayError("Vous ne pouvez pas sauvegarder une sélection vide.");
            return true; // Continue la boucle
        }

        const filename = await this.view.promptForFilename();
        const exporter = new GiftExporter(this.selection.getAll());
        const content = exporter.export(); // Utilise votre GiftExporter existant

        try {
            // Sauvegarde dans le répertoire courant ou un dossier spécifique
            fs.writeFileSync(filename, content, 'utf8');
            this.view.displaySuccess(`Examen généré avec succès : ${filename}`);
            return false; // Quitte la boucle
        } catch (err) {
            this.view.displayError(`Impossible d'écrire le fichier : ${err.message}`);
            return true; // Continue la boucle en cas d'erreur
        }
    }
}

module.exports = SelectionController;