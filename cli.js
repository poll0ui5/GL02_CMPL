const fs = require('fs');
const colors = require('colors');
const cli = require("@caporal/core").default;

// Imports de vos modules existants
const GiftParser = require('./model/GIFTParser.js');
const BanqueDeQuestions = require('./controller/BanqueDeQuestions.js');
const ProfileController = require('./controller/ProfileController.js');
const VCardController = require('./controller/VCardController.js');
const Affichage = require('./view/Affichage.js');
const ExamController = require('./controller/ExamController.js'); // <-- NOUVEL IMPORT POUR SPEC04

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
    // COMMANDE 2 : RECHERCHER
    // Recherche des questions par mot-clé dans la banque de données (dossier /data)
    // ====================================================================================
    .command('rechercher', 'Recherche des questions par mot-clé dans la banque')
    .argument('<keyword>', 'Le mot-clé à rechercher')
    .action(({args}) => {
        const banque = new BanqueDeQuestions();
        
        // On charge la banque (affiche ses propres logs)
        banque.chargerBanque(); 
        
        const results = banque.rechercherQuestions(args.keyword);
        
        // Utilisation de la vue Affichage.js pour un meilleur rendu de la liste
        Affichage.afficherListeQuestions(results);
    })

    // ====================================================================================
    // COMMANDE 3 : AFFICHER
    // Affiche le contenu complet d'une question par ID
    // ====================================================================================
    .command('afficher', 'Affiche le contenu complet d\'une question par ID')
    .argument('<id>', 'L\'ID de la question à afficher (ex: Q45)')
    .action(({args, logger}) => {
        const banque = new BanqueDeQuestions();
        banque.chargerBanque(); // Nécessaire pour pouvoir chercher par ID
        
        // Assurez-vous que l'ID est correctement formaté (ex: Q45)
        const questionId = args.id.toUpperCase().startsWith('Q') ? args.id.toUpperCase() : `Q${args.id}`;
        
        const question = banque.getQuestionById(questionId);
        
        if (question) {
            // Utilisation de la vue Affichage.js pour l'affichage détaillé
            Affichage.afficherQuestionComplete(question);
        } else {
            logger.error(`Question introuvable avec l'ID: ${questionId}`);
        }
    })

    // ====================================================================================
    // COMMANDE 4 : PROFILE
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
    // COMMANDE 5 : VCARD
    // Générateur interactif de VCard (SPEC03)
    // ====================================================================================
    .command('vcard', 'Générer une vCard pour un enseignant (interactif)')
    .action(async () => {
        // On réutilise votre VCardController existant
        const controller = new VCardController();
        await controller.start();
    })

    // ====================================================================================
    // COMMANDE 6 : SIMULER (SPEC04)
    // Simuler la passation d'un examen
    // ====================================================================================
    .command('simuler', 'Simuler la passation d\'un examen (SPEC04)')
    .argument('<file>', 'Le fichier GIFT d\'examen à simuler')
    .action(async ({args}) => {
        // On instancie le ExamController créé précédemment
        const controller = new ExamController();
        await controller.processExam(args.file);
    });

// Lancement de l'application
cli.run(process.argv.slice(2));