// model/Contact.js

class Contact {
    constructor(nom, prenom, email, etablissement) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.etablissement = etablissement;
    }

    // Validation des données (Logique métier)
    isValidName() {
        // ABNF: Au moins 2 caractères alphabétiques
        const regex = /^[a-zA-Z\s]{2,}$/;
        return regex.test(this.nom) && regex.test(this.prenom);
    }

    isValidEmail() {
        // Validation format email simple
        const regex = /^[a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~.]+@[a-zA-Z0-9\-]+\.[a-zA-Z]+$/;
        return regex.test(this.email);
    }

    isValidEstablishment() {
        // ABNF: NOTE non vide
        return this.etablissement && this.etablissement.trim().length > 0;
    }

    // Génération de la chaîne vCard selon l'ABNF strict
    toVCardString() {
        // Note: L'espace après BEGIN:VCARD est requis par ton ABNF spécifique
        let content = "BEGIN:VCARD \r\n"; 
        content += "VERSION:4.0\r\n";
        
        // Propriété FN (Nom complet)
        content += `FN:${this.prenom} ${this.nom}\r\n`;
        
        // Propriété N (Nom structuré : Nom;Prénom)
        content += `N:${this.nom};${this.prenom};;;\r\n`;
        
        // Propriété EMAIL
        content += `EMAIL:${this.email}\r\n`;
        
        // Propriété NOTE (Utilisée pour l'établissement car ORG est absent de ton ABNF)
        content += `NOTE:${this.etablissement}\r\n`;
        
        content += "END:VCARD\r\n";
        return content;
    }

    getFileName() {
        return `${this.prenom}_${this.nom}.vcf`.replace(/\s+/g, '_');
    }
}

module.exports = Contact;