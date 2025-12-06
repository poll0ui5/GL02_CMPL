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
        // SPEC_NF03 : Performance - Chargement unique au début du module
        console.log("Chargement de la banque de questions...");
        this.banque.chargerBanque();

        let loop = true;
        while (loop) {
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
                    loop = await this.handleSave();
                    break;
                case 'exit':
                    loop = false;
                    break;
            }
        }
    }

    async handleAdd() {
        // SPEC_NF01 : Vérification limite haute avant ajout (optionnel mais recommandé)
        if (this.selection.count() >= 20) {
            this.view.displayError("Vous avez atteint la limite maximale de 20 questions.");
            return;
        }

        const idRaw = await this.view.promptForId();
        const id = idRaw.toUpperCase().startsWith('Q') ? idRaw.toUpperCase() : `Q${idRaw}`;
        const question = this.banque.getQuestionById(id);

        if (!question) {
            this.view.displayError(`Question ${id} introuvable.`);
            return;
        }

        if (this.selection.add(question)) {
            this.view.displaySuccess(`Question ${id} ajoutée.`);
        } else {
            this.view.displayError(`La question ${id} est déjà dans la liste (Doublon interdit).`);
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
        // SPEC_NF01 : Validation stricte 15-20 questions
        const validation = this.selection.isValid();
        if (!validation.valid) {
            this.view.displayError(`Validation échouée : ${validation.error}`);
            return true; // On reste dans la boucle pour permettre à l'utilisateur de corriger
        }

        const filename = await this.view.promptForFilename();
        const exporter = new GiftExporter(this.selection.getAll());
        const content = exporter.export();

        try {
            fs.writeFileSync(filename, content, 'utf8');
            this.view.displaySuccess(`✅ Examen valide généré : ${filename}`);
            return false; // Quitte le menu après succès
        } catch (err) {
            this.view.displayError(`Erreur d'écriture : ${err.message}`);
            return true;
        }
    }
}

module.exports = SelectionController;