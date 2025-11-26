# 🧠 GL02 — Générateur d'Examens GIFT & Outils CLI

## 📌 Présentation

Ce projet vise à fournir aux enseignants du **Sealand Republic Youth Education Ministry (SRYEM)** un outil en ligne de commande permettant de gérer, analyser et générer des examens numériques basés sur le format **GIFT (General Import Format Technology)**, compatible avec Moodle.

L'application facilite la création d'examens, la manipulation d'une banque de questions certifiée et la génération d'une carte de contact au format **vCard (RFC 6350 / RFC 6868)**. Elle inclut également un mode de simulation pour tester les examens ainsi que des outils d’analyse statistique.

---

## 🚀 Fonctionnalités principales

| Fonction | Description |
|---------|-------------|
| 🔍 **Recherche de questions** | Recherche par mots-clés dans la banque nationale et affichage détaillé. |
| 📝 **Création d’examen GIFT** | Sélection, validation (pas de doublons, 15–20 questions), export en `.gift`. |
| 🧑‍🏫 **Génération de vCard** | Création d'un fichier `.vcf` contenant les informations de l’enseignant. |
| 🎓 **Simulation d’examen** | Interface console permettant de répondre aux questions GIFT et d'afficher un score final. |
| 📊 **Analyse de fichier GIFT** | Lecture d'un examen existant et génération d’un histogramme textuel des types de questions. |
| ⚖️ **Comparaison d’examens** | Comparaison statistique d’un examen généré avec les banques nationales. |
| 📂 **Gestion de sélection** | Ajout, suppression, affichage et sauvegarde des questions sélectionnées. |

---

## 🏗️ Architecture recommandée

- `/src`
  - `modele/` → Gestion des données (questions, parsing, collections)
  - `vue/` → Interface CLI et affichage utilisateur
  - `controleur/` → Logique métier (simulation, analyse, validation)
  - `data/` → Banque de questions + fichiers générés (GIFT/vCard)


---

## 📎 Exigences techniques

### Fonctionnelles

- Manipulation et recherche de questions certifiées
- Génération d’examens valides selon le format GIFT
- Vérification automatique (15–20 questions, absence de doublons)
- Mode simulation interactif
- Statistiques et comparaison d’examens

### Non fonctionnelles

- ✔ Multiplateforme (**Windows / Linux / macOS**)
- ✔ Interface simple et intuitive (CLI)
- ✔ Données stockées uniquement en local (conformité RGPD)
- ✔ Performances optimisées pour fichiers volumineux

---

## 🧪 Exemple d’utilisation

```bash
# Lancer l'application
python3 main.py

# Rechercher une question
> rechercher "physique"

# Ajouter une question
> ajouter Q45

# Générer un examen
> generer_examen "Examen_Physique_S1"

# Simuler le test
> simuler "Examen_Physique_S1.gift"

# Générer une vCard
> vcard
Nom: Dupont
Prénom: Elise
Email: elise.dupont@ac-sryem.edu
Établissement: Lycée République
