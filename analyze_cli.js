// analyze_cli.js
const ProfileController = require('./controller/ProfileController');

// Récupération de l'argument (nom du fichier)
const args = process.argv.slice(2);

if (args.length === 0) {
    console.error("Usage : node analyze_cli.js <chemin_du_fichier_gift>");
    process.exit(1);
}

const filename = args[0];
const controller = new ProfileController();

// Lancement du traitement
controller.processFile(filename);