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
        console.log("Chargement de la banque de questions...");
        this.banque.chargerBanque();

        let loop = true;
        while (loop) {
            // Petit rappel visuel de l'état actuel pour l'utilisateur (NF02)
            console.log(`\n--- Panier actuel : ${this.selection.count()} questions ---`);

            const action = await this.view.showMenu();

            switch (action) {
                case 'search_add': // Nouvelle action
                    await this.handleSearchAndAdd();
                    break;
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

    // --- NOUVELLE LOGIQUE : Recherche + Ajout ---
    async handleSearchAndAdd() {
        // Vérification de la limite avant de commencer (NF01)
        if (this.selection.count() >= 20) {
            this.view.displayError("Limite atteinte (20 questions max). Impossible d'ajouter plus de questions.");
            return;
        }

        const keyword = await this.view.promptForSearchKeyword();
        const results = this.banque.rechercherQuestions(keyword);

        if (results.length === 0) {
            this.view.displayError(`Aucune question trouvée pour "${keyword}".`);
            return;
        }

        // L'utilisateur coche les questions qu'il veut
        const selectedIds = await this.view.selectQuestionsFromSearch(results);

        if (selectedIds.length === 0) {
            console.log("Aucune question sélectionnée.");
            return;
        }

        let addedCount = 0;
        let duplicateCount = 0;

        for (const id of selectedIds) {
            // Contrôle dynamique de la limite pendant l'ajout en masse
            if (this.selection.count() >= 20) {
                this.view.displayError(`Limite de 20 questions atteinte. Arrêt de l'ajout.`);
                break;
            }

            const question = this.banque.getQuestionById(id);
            if (question) {
                if (this.selection.add(question)) {
                    addedCount++;
                } else {
                    duplicateCount++;
                }
            }
        }

        if (addedCount > 0) this.view.displaySuccess(`${addedCount} question(s) ajoutée(s) au panier.`);
        if (duplicateCount > 0) console.log(`⚠️ ${duplicateCount} question(s) étaient déjà dans le panier (doublons ignorés).`);
    }

    async handleAdd() {
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
        const validation = this.selection.isValid();
        if (!validation.valid) {
            this.view.displayError(`Validation échouée : ${validation.error}`);
            return true;
        }

        const filename = await this.view.promptForFilename();
        const exporter = new GiftExporter(this.selection.getAll());
        const content = exporter.export();

        try {
            fs.writeFileSync(filename, content, 'utf8');
            this.view.displaySuccess(`Examen généré avec succès : ${filename}`);
            return false;
        } catch (err) {
            this.view.displayError(`Impossible d'écrire le fichier : ${err.message}`);
            return true;
        }
    }
}

module.exports = SelectionController;