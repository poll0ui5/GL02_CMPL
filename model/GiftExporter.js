const Question = require("./semantique/Question.js");

class GiftExporter {
    constructor(questionList) {
        this.questions = questionList;
    }

    // Fonction principale qui retourne tout le fichier GIFT sous forme de string
    export() {
        let giftContent = "";
        
        this.questions.forEach(question => {
            giftContent += this.formatQuestion(question);
            giftContent += "\n\n";
        });

        return giftContent;
    }

    formatQuestion(q) {
        let output = "";

        // 1. Titre (::Title::)
        if (q.number) {
            output += `::${q.number}:: `;
        }

        // 2. Énoncé
        output += q.text;

        // 3. Bloc de réponse
        output += " {";

        switch (q.category) {
            case 'Description':
                break;

            case 'Essay':
                break;
            
            case 'TrueFalse':
                output += q.answer ? "T" : "F";
                break;

            case 'MCQ':
                output += "\n";
                q.choices.forEach(choice => {
                    let prefix = choice.isCorrect ? "=" : "~";
                    output += `\t${prefix}${choice.text}`;
                    if (choice.feedback) {
                        output += ` #${choice.feedback}`;
                    }
                    output += "\n";
                });
                break;

            case 'Credit':
                output += "\n";
                q.choices.forEach(choice => {
                    output += `\t~%${choice.weight}%${choice.text}`;
                    if (choice.feedback) {
                        output += ` #${choice.feedback}`;
                    }
                    output += "\n";
                });
                break;

            case 'Matching':
                output += "\n";
                q.pairs.forEach(pair => {
                    output += `\t=${pair.left} -> ${pair.right}\n`;
                });
                break;

            case 'Numeric':
                output += "#";
                if (q.numericType === 'Range') {
                    output += `${q.value}`;
                    if (q.tolerance !== null && q.tolerance !== undefined) {
                        output += `:${q.tolerance}`;
                    }
                } else if (q.numericType === 'Interval') {
                    output += `${q.min}..${q.max}`;
                }
                break;

            default:
                console.warn(`Type de question inconnu ou non géré : ${q.category}`);
                break;
        }

        output += "}";
        return output;
    }
}

module.exports = GiftExporter;