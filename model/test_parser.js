// test_parser.js

const fs = require('fs');
// Chemin relatif vers le fichier local
const GiftParser = require('./GIFTParser.js'); 

// Récupère le fichier passé en argument ou utilise 'test.gift' par défaut
const fichierTest = process.argv[2] || 'test.gift';

function testFichierGift(chemin) {
    console.log(`\nLecture du fichier : ${chemin}`);
    console.log("---------------------------------------------------");

    try {
        const data = fs.readFileSync(chemin, 'utf8');
        const parser = new GiftParser(false, false);
        parser.parse(data);

        const questions = parser.parsedQuestion;
        
        if (questions.length === 0) {
            console.log("Aucune question trouvée ou erreur de parsing.");
        } else {
            console.log(`${questions.length} questions analysées avec succès !\n`);
            afficherDetails(questions);
        }

    } catch (err) {
        if (err.code === 'ENOENT') {
            console.error(`Erreur : Le fichier '${chemin}' est introuvable.`);
        } else {
            console.error("Erreur de lecture ou de parsing :", err.message);
        }
    }
}

function afficherDetails(questions) {
    questions.forEach((q, index) => {
        console.log(`Question ${index + 1} [Type: ${q.category}]`);
        
        if (q.title) {
            console.log(`   Titre : ${q.title}`);
        }
        
        console.log(`   Texte : "${q.text}"`);

        // Affichage spécifique selon le type
        switch (q.category) {
            case 'TrueFalse':
                const rep = q.answer ? "VRAI" : "FAUX";
                console.log(`   Réponse : ${rep}`);
                break;

            case 'MCQ':
            case 'Credit':
                console.log(`   Choix :`);
                q.choices.forEach(c => {
                    let status = "";
                    if (c.isCorrect === true) status = "(Correct)";
                    else if (c.isCorrect === false) status = "(Faux)";
                    else if (c.weight !== undefined) status = `(Poids: ${c.weight}%)`;
                    
                    console.log(`     - ${status} "${c.text}" ${c.feedback ? `(Feedback: ${c.feedback})` : ''}`);
                });
                break;

            case 'Matching':
                console.log(`   Paires :`);
                q.pairs.forEach(p => {
                    console.log(`     - "${p.left}" -> "${p.right}"`);
                });
                break;

            case 'Numeric':
                console.log(`   Type Numérique : ${q.numericType}`);
                if (q.numericType === 'Range') {
                    console.log(`     Valeur : ${q.value} (±${q.tolerance})`);
                } else if (q.numericType === 'Interval') {
                    console.log(`     Intervalle : [${q.min} ... ${q.max}]`);
                }
                break;
                
            case 'Essay':
                console.log(`   (Question Ouverte - Pas de réponse automatique)`);
                break;
        }

        // Affichage de la fin de phrase pour les textes à trous
        if (q.tail) {
            console.log(`   Fin de phrase : "${q.tail}"`);
        }

        console.log("---------------------------------------------------");
    });
}

testFichierGift(fichierTest);