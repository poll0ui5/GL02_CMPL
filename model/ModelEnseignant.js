const fs = require('fs');
const readline = require('readline');

// Configuration de l'interface de lecture
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class VCardGenerator {
    constructor() {
        this.data = {
            nomComplet: '',
            email: '',
            etablissement: '' // Sera mappé sur NOTE
        };
    }

    // Fonction utilitaire pour poser une question
    ask(question) {
        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                resolve(answer.trim());
            });
        });
    }

    // Validation selon l'ABNF
    validateName(name) {
        // ABNF: 2*(ALPHA / WSP) -> Au moins 2 caractères, lettres ou espaces uniquement
        const regex = /^[a-zA-Z\s]{2,}$/;
        return regex.test(name);
    }

    validateEmail(email) {
        // ABNF: partieLocale "@" domaine
        // partieLocale = 1*(VCHAR / "." / "_" / "-")
        // domaine = 1*(ATEXT/"-") "." 1*(ALPHA)
        // Simplification pour regex JS basée sur vos règles
        const regex = /^[a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~.]+@[a-zA-Z0-9\-]+\.[a-zA-Z]+$/;
        return regex.test(email);
    }

    // Le cœur du processus (SPEC03)
    async run() {
        console.log("=== GÉNÉRATEUR DE VCARD ENSEIGNANT (SPEC03) ===");
        console.log("Veuillez saisir les informations suivantes :\n");

        // 1. Saisie et Validation du Nom (FN)
        while (true) {
            this.data.nomComplet = await this.ask("Nom et Prénom : ");
            if (this.validateName(this.data.nomComplet)) break;
            console.error("Erreur : Le nom doit contenir au moins 2 lettres (Alphabets et espaces uniquement).");
        }

        // 2. Saisie et Validation de l'Email (EMAIL)
        while (true) {
            this.data.email = await this.ask("Adresse e-mail : ");
            if (this.validateEmail(this.data.email)) break;
            console.error("Erreur : Format d'e-mail invalide (ex: prof@ecole.com).");
        }

        // 3. Saisie de l'Établissement (Mappé sur NOTE car ORG absent de l'ABNF)
        while (true) {
            this.data.etablissement = await this.ask("Établissement : ");
            // ABNF NOTE: 1*(VCHAR / WSP) -> Au moins 1 caractère
            if (this.data.etablissement.length > 0) break;
            console.error("Erreur : L'établissement est obligatoire.");
        }

        // 4. Génération du fichier
        this.generateFile();
        rl.close();
    }

    generateFile() {
        // Construction du contenu selon l'ABNF strict fourni
        // Note: Votre ABNF demande "BEGIN:VCARD" WSP CRLF -> donc un espace après VCARD
        
        let content = "";
        content += "BEGIN:VCARD \r\n"; // WSP ajouté
        content += "VERSION:4.0\r\n";
        
        // Propriété FN (Nom complet)
        content += `FN:${this.data.nomComplet}\r\n`;
        
        // Propriété EMAIL
        content += `EMAIL:${this.data.email}\r\n`;
        
        // Propriété NOTE (pour l'établissement)
        content += `NOTE:${this.data.etablissement}\r\n`;
        
        content += "END:VCARD\r\n";

        // Création du nom de fichier (nettoyage des espaces pour le fichier)
        const filename = `${this.data.nomComplet.replace(/\s+/g, '_')}.vcf`;

        try {
            fs.writeFileSync(filename, content, 'utf8');
            console.log(`\n✅ Succès ! La vCard a été générée : ${filename}`);
            console.log("--- Aperçu du contenu ---");
            console.log(content);
        } catch (err) {
            console.error("Erreur lors de l'écriture du fichier :", err.message);
        }
    }
}

// Lancement du programme
const generator = new VCardGenerator();
generator.run();