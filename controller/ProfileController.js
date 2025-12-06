// controller/ProfileController.js

//pour la spec05

const fs = require('fs');
const GiftParser = require('../model/GIFTParser');
const GiftProfile = require('../model/GiftProfile');
const ProfileView = require('../view/ProfileView');

class ProfileController {
    constructor() {
        this.view = new ProfileView();
    }

    processFile(filePath) {
        // 1. Vérification de l'existence du fichier (Précondition)
        if (!fs.existsSync(filePath)) {
            this.view.displayError(`Le fichier '${filePath}' n'existe pas.`);
            return;
        }

        try {
            // 2. Lecture du fichier
            const content = fs.readFileSync(filePath, 'utf8');

            // Vérification fichier vide
            if (!content || content.trim().length === 0) {
                this.view.displayError("Le fichier est vide.");
                return;
            }

            this.view.displayTitle(filePath);

            // 3. Parsing (Utilisation de ton parser existant)
            const parser = new GiftParser(false, false);
            parser.parse(content);

            const questions = parser.parsedQuestion;

            // 4. Analyse via le Modèle
            const profileModel = new GiftProfile(questions);
            const report = profileModel.calculate();

            // 5. Affichage via la Vue
            this.view.displayHistogram(report, profileModel.total);

        } catch (err) {
            this.view.displayError(`Problème de lecture ou de format : ${err.message}`);
        }
    }
}

module.exports = ProfileController;