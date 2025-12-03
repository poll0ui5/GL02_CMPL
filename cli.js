const fs = require('fs');
const colors = require('colors'); // Assurez-vous d'avoir installé 'colors' (npm install colors)
const cli = require("@caporal/core").default; // Assurez-vous d'avoir installé '@caporal/core'

// Imports de vos modules existants
const GiftParser = require('./model/GIFTParser.js');
const BanqueDeQuestions = require('./controller/BanqueDeQuestions.js');
const ProfileController = require('./controller/ProfileController.js');
const VCardController = require('./controller/VCardController.js');

cli
    .version('gift-parser-cli')
    .version('1.0.0')

    // ====================================================================================
    // COMMANDE 1 : CHECK
    // Vérifie la syntaxe d'un fichier GIFT et affiche les erreurs
    // ====================================================================================
    .command('check', 'Vérifie si <file> est un fichier GIFT valide')
    .argument('<file>', 'Le fichier GIFT à vérifier')
    .option('-t, --showTokenize', 'Affiche les tokens générés', { validator: cli.BOOLEAN, default: false })
    .action(({args, options, logger}) => {
        
        fs.readFile(args.file, 'utf8', function (err, data) {
            if (err) {
                return logger.warn(`Erreur de lecture : ${err.message}`.red);
            }
      
            // On utilise votre parser (false pour les symboles par défaut)
            const analyzer = new GiftParser(options.showTokenize, false);
            analyzer.parse(data);
            
            if(analyzer.errorCount === 0){
                logger.info(`Le fichier "${args.file}" est un fichier GIFT valide.`.green);
                logger.info(`${analyzer.parsedQuestion.length} questions identifiées.`.cyan);
            } else {
                logger.info(`Le fichier contient ${analyzer.errorCount} erreurs.`.red);
            }
        });
    })
    
    // ====================================================================================
    // COMMANDE 2 : SEARCH
    // Recherche des questions dans la banque de données (dossier /data)
    // ====================================================================================
    .command('search', 'Recherche des questions par mot-clé dans la banque')
    .argument('<keyword>', 'Le mot-clé à rechercher')
    .action(({args, logger}) => {
        const banque = new BanqueDeQuestions();
        
        // On charge la banque (affiche ses propres logs)
        banque.chargerBanque(); 
        
        const results = banque.rechercherQuestions(args.keyword);
        
        if (results.length === 0) {
            logger.info("Aucun résultat trouvé.".yellow);
        } else {
            logger.info("---------------------------------------------------");
            logger.info(`${results.length} questions trouvées :`.green);
            logger.info("---------------------------------------------------");
            
            results.forEach(q => {
                // Affichage formaté
                const id = `[${q.id}]`.cyan;
                const type = `[${q.category}]`.magenta;
                // On coupe le texte s'il est trop long
                const text = q.text.length > 60 ? q.text.substring(0, 60) + "..." : q.text;
                
                logger.info(`${id} ${type} ${text}`);
            });
        }
    })

    // ====================================================================================
    // COMMANDE 3 : PROFILE
    // Analyse un fichier et affiche l'histogramme (SPEC05)
    // ====================================================================================
    .command('profile', 'Affiche le profil (histogramme des types) d\'un fichier GIFT')
    .argument('<file>', 'Le fichier GIFT à analyser')
    .action(({args}) => {
        // On réutilise votre ProfileController existant
        const controller = new ProfileController();
        controller.processFile(args.file);
    })

    // ====================================================================================
    // COMMANDE 4 : VCARD
    // Générateur interactif de VCard (SPEC03)
    // ====================================================================================
    .command('vcard', 'Générer une vCard pour un enseignant (interactif)')
    .action(async () => {
        // On réutilise votre VCardController existant
        const controller = new VCardController();
        await controller.start();
    });

// Lancement de l'application
cli.run(process.argv.slice(2));