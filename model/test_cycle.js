const fs = require('fs');
const GiftParser = require('./GIFTParser.js');
const GiftExporter = require('./GiftExporter.js');

const inputFile = process.argv[2] || 'test.gift';
const outputFile = 'questionsToGift.gift';

function convertGiftToGift() {
    console.log(`\n1. Lecture du fichier source : ${inputFile}`);
    console.log("---------------------------------------------------");

    try {
        if (!fs.existsSync(inputFile)) {
            console.error(`Erreur : Le fichier '${inputFile}' est introuvable.`);
            console.log("Veuillez créer un fichier 'test.gift' ou passer un fichier en argument.");
            return;
        }

        const data = fs.readFileSync(inputFile, 'utf8');
        const parser = new GiftParser(false, false);
        parser.parse(data);

        const questions = parser.parsedQuestion;

        if (questions.length === 0) {
            console.log("Aucune question trouvée dans le fichier source. Arrêt du processus.");
            return;
        }

        console.log(`>> Succès ! ${questions.length} questions ont été analysées.`);

        console.log(`\n2. Génération du nouveau code GIFT`);
        console.log("---------------------------------------------------");

        const exporter = new GiftExporter(questions);
        const newGiftContent = exporter.export();

        fs.writeFileSync(outputFile, newGiftContent, 'utf8');

        console.log(`>> Succès ! Le nouveau fichier GIFT a été créé : ${outputFile}`);
        console.log(`\nVous pouvez maintenant comparer '${inputFile}' et '${outputFile}' pour vérifier la fidélité.`);

    } catch (err) {
        console.error("Une erreur s'est produite :", err.message);
        console.error(err.stack);
    }
}

convertGiftToGift();