// controller/VCardController.js
const fs = require('fs');
const inquirer = require('inquirer');
const Contact = require('../model/Contact');

class VCardController {
    constructor() {
        this.inputData = { nom: '', prenom: '', email: '', etablissement: '' };
    }

    async start() {
        console.log("\n--- GENERATION DE VCARD ---");
        console.log("Veuillez saisir les informations de l'enseignant.\n");

        // 1. Collecte des données via Inquirer
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
    }

    async collectData() {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'nom',
                message: 'Nom de famille :',
                validate: (input) => {
                    const temp = new Contact(input, 'Test', 't@t.com', 'Test');
                    // On teste juste la regex du nom
                    return /^[a-zA-Z\s]{2,}$/.test(input) ? true : "Le nom doit contenir au moins 2 lettres.";
                }
            },
            {
                type: 'input',
                name: 'prenom',
                message: 'Prenom :',
                validate: (input) => {
                    return /^[a-zA-Z\s]{2,}$/.test(input) ? true : "Le prenom doit contenir au moins 2 lettres.";
                }
            },
            {
                type: 'input',
                name: 'email',
                message: 'Adresse e-mail :',
                validate: (input) => {
                    const temp = new Contact('Test', 'Test', input, 'Test');
                    return temp.isValidEmail() ? true : "Format d'e-mail invalide.";
                }
            },
            {
                type: 'input',
                name: 'etablissement',
                message: 'Etablissement :',
                validate: (input) => {
                    return input.trim().length > 0 ? true : "L'etablissement est obligatoire.";
                }
            }
        ]);

        this.inputData = answers;
    }

    genererFichier(contact) {
        const vCardContent = contact.toVCardString();
        const fileName = contact.getFileName();

        try {
            fs.writeFileSync(fileName, vCardContent, 'utf8');
            console.log(`\nSucces : Le fichier ${fileName} a ete cree.`);
            console.log("Contenu du fichier :");
            console.log("-----------------------------------");
            console.log(vCardContent);
            console.log("-----------------------------------\n");
        } catch (err) {
            console.error(`Erreur : Impossible d'ecrire le fichier : ${err.message}`);
        }
    }
}

module.exports = VCardController;