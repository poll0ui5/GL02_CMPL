// view/ProfileView.js

//vue de la spec05

class ProfileView {
    
    displayTitle(filename) {
        console.log(`\n ANALYSE ET PROFILAGE DU FICHIER : ${filename}`);
        console.log("==================================================");
    }

    displayError(msg) {
        console.error(`Erreur : ${msg}`);
    }

    displayHistogram(report, total) {
        if (!report || total === 0) {
            console.log("Le fichier ne contient aucune question valide.");
            return;
        }

        console.log(`Total de questions : ${total}\n`);

        // Dictionnaire pour traduire les clés techniques en français (comme demandé dans la spec)
        const labels = {
            'MCQ': 'Choix multiples',
            'MissingWord': 'Mot manquant',
            'TrueFalse': 'Vrai / Faux',
            'Matching': 'Correspondance',
            'Numeric': 'Numérique',
            'Essay': 'Question ouverte',
            'Description': 'Description/Info',
            'Credit': 'Choix multiple (Crédit)',
            'Other': 'Autre'
        };

        const maxBarLength = 40; // Longueur max de la barre en caractères

        report.forEach(row => {
            const label = labels[row.type] || row.type;
            const barLength = Math.round((row.percentage / 100) * maxBarLength);
            const bar = '█'.repeat(barLength).padEnd(maxBarLength, ' '); // Caractère plein pour la barre

            // Format : Label |████      | 25.0% (5)
            console.log(`${label.padEnd(25)} |${bar}| ${row.percentage}% (${row.count})`);
        });
        
        console.log("==================================================\n");
    }
}

module.exports = ProfileView;