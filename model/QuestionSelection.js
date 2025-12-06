class QuestionSelection {
    constructor() {
        this.questions = [];
    }

    add(question) {
        // Vérifie si la question est déjà dans la liste pour éviter les doublons
        if (!this.exists(question.id)) {
            this.questions.push(question);
            return true;
        }
        return false;
    }

    remove(id) {
        const initialLength = this.questions.length;
        this.questions = this.questions.filter(q => q.id !== id);
        return this.questions.length < initialLength; // Retourne true si une suppression a eu lieu
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
}

module.exports = QuestionSelection;