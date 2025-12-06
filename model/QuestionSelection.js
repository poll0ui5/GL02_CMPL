class QuestionSelection {
    constructor() {
        this.questions = [];
    }

    add(question) {
        // SPEC_NF01 : Éviter les doublons
        if (!this.exists(question.id)) {
            this.questions.push(question);
            return true;
        }
        return false;
    }

    remove(id) {
        const initialLength = this.questions.length;
        this.questions = this.questions.filter(q => q.id !== id);
        return this.questions.length < initialLength;
    }

    exists(id) {
        return this.questions.some(q => q.id === id);
    }

    getAll() {
        return this.questions;
    }

    count() {
        return this.questions.length;
    }

    // SPEC_NF01 : Contrôle que l'examen contient entre 15 et 20 questions
    isValid() {
        const count = this.count();
        if (count < 15) {
            return { valid: false, error: `Pas assez de questions. Il en faut au moins 15 (Actuel : ${count}).` };
        }
        if (count > 20) {
            return { valid: false, error: `Trop de questions. Le maximum est de 20 (Actuel : ${count}).` };
        }
        return { valid: true };
    }
}

module.exports = QuestionSelection;