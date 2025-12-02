// controller/VCardController.js
const fs = require('fs');
const Contact = require('../model/Contact');
const CLIView = require('../view/CLIView');

class VCardController {
    constructor() {
        this.view = new CLIView();
        // On initialise les données temporaires
        this.inputData = { nom: '', prenom: '', email: '', etablissement: '' };
    }

    async start() {
        this.view.afficherTitre();

        // 1. Collecte des données via la Vue
        await this.collectData();

        // 2. Création du Modèle
        const contact = new Contact(
            this.inputData.nom,
            this.inputData.prenom,
            this.inputData.email,
            this.inputData.etablissement
        );

        // 3. Génération et Sauvegarde
        this.genererFichier(contact);

        // 4. Fin
        this.view.fermer();
    }

    async collectData() {
        // Boucle pour le NOM
        while (true) {
            const nom = await this.view.ask("Nom de famille : ");
            // On utilise une instance temporaire juste pour valider ce champ
            const tempContact = new Contact(nom, 'Test', 'test@test.com', 'Test');
            if (tempContact.isValidName()) {
                this.inputData.nom = nom;
                break;
            }
            this.view.afficherErreur("Le nom doit contenir au moins 2 lettres.");
        }

        // Boucle pour le PRÉNOM
        while (true) {
            const prenom = await this.view.ask("Prénom : ");
            const tempContact = new Contact('Test', prenom, 'test@test.com', 'Test');
            if (tempContact.isValidName()) {
                this.inputData.prenom = prenom;
                break;
            }
            this.view.afficherErreur("Le prénom doit contenir au moins 2 lettres.");
        }

        // Boucle pour l'EMAIL
        while (true) {
            const email = await this.view.ask("Adresse e-mail : ");
            const tempContact = new Contact('Test', 'Test', email, 'Test');
            if (tempContact.isValidEmail()) {
                this.inputData.email = email;
                break;
            }
            this.view.afficherErreur("Format d'e-mail invalide.");
        }

        // Boucle pour l'ÉTABLISSEMENT
        while (true) {
            const etab = await this.view.ask("Établissement : ");
            const tempContact = new Contact('Test', 'Test', 'test@test.com', etab);
            if (tempContact.isValidEstablishment()) {
                this.inputData.etablissement = etab;
                break;
            }
            this.view.afficherErreur("L'établissement est obligatoire.");
        }
    }

    genererFichier(contact) {
        const vCardContent = contact.toVCardString();
        const fileName = contact.getFileName();

        try {
            fs.writeFileSync(fileName, vCardContent, 'utf8');
            this.view.afficherSucces(`Le fichier ${fileName} a été créé.`);
            this.view.afficherContenu(vCardContent);
        } catch (err) {
            this.view.afficherErreur(`Impossible d'écrire le fichier : ${err.message}`);
        }
    }
}

module.exports = VCardController;