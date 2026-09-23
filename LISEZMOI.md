# Dossier Shinobi — jeu de rôle Naruto

Jeu de rôle web (français), non officiel, dans l'univers de Naruto : création de
personnage (village + clan) puis prologue jouable à l'académie, avec jets de dés
visibles, réputation, moral, missions et fiche de personnage.

## Structure du dépôt

```
app/          → l'implémentation jouable, en HTML/CSS/JS pur (à utiliser)
  index.html    la page du jeu
  styles.css    les couleurs et polices
  game.js       toute la logique du jeu et l'affichage
  game-data.js  les villages, clans, texte du prologue, missions

project/      → l'export original de Claude Design (prototype de référence,
                utilise un moteur de rendu propriétaire, ne pas déployer tel quel)
chats/        → l'historique de conversation qui a défini le projet
README.md     → le README du dépôt GitHub d'origine
```

**C'est le dossier `app/` qu'il faut utiliser.** Le dossier `project/` est le
prototype de conception d'origine, gardé comme référence ; `app/` en est
l'implémentation réelle, testée et fonctionnelle.

## Lancer le jeu

Aucune installation nécessaire. Deux façons :

1. **Le plus simple** : ouvrir `app/index.html` directement dans un navigateur.
2. **Via un petit serveur local** (recommandé, évite certaines restrictions du
   navigateur sur les modules JS) :
   ```
   cd app
   python3 -m http.server 8000
   ```
   puis ouvrir `http://localhost:8000`.

La sauvegarde se fait automatiquement dans le navigateur (`localStorage`) — pas
de compte, pas de serveur.

## Mettre ça en ligne

- **GitHub Pages** : une fois le contenu du dossier `app/` (ou tout le dépôt)
  poussé sur GitHub, active GitHub Pages dans les réglages du dépôt (Settings →
  Pages) en pointant sur la branche `main` et le dossier `/app` (ou `/`).
- **N'importe quel hébergement statique** (Netlify, Vercel, etc.) : il suffit
  de déployer le contenu du dossier `app/`, sans étape de build.

## Comment pousser ce dépôt sur GitHub

Cette session Claude n'a pas l'autorisation de pousser directement vers
`VANTAvertex/Shinobi-JDR` (le proxy git de l'environnement bloque l'accès à ce
dépôt tant qu'il n'est pas ajouté à ses sources autorisées). Ce zip contient
donc **tout l'historique git déjà prêt** (dossier `.git/` inclus, avec les 3
commits déjà signés et le `remote origin` déjà configuré vers ce dépôt) :

1. Dézippe l'archive.
2. Ouvre un terminal dans le dossier dézippé.
3. Vérifie que tu es bien connecté à GitHub avec le bon compte, puis :
   ```
   git push origin main
   ```
   Comme l'historique local part d'un ancêtre commun avec le dépôt distant
   (déjà fusionné), ce push devrait passer directement, sans conflit.

Si tu préfères ne pas utiliser git en ligne de commande : sur la page du
dépôt GitHub → **Add file → Upload files**, glisse le contenu du dossier
dézippé (en gardant l'arborescence, notamment `app/` et `project/_ds/`), puis
valide le commit sur `main`. Cette méthode ne reprend pas l'historique des
commits, seulement le contenu final des fichiers.

## Ce qui est jouable dans cette version

- **Création de personnage** (périmètre bêta) : 2 villages jouables (Konoha,
  Kiri — les 8 autres au registre, non jouables), 4 clans avec spécificité,
  techniques de départ et contrainte propres (Konoha : Uchiha, Senju ; Kiri :
  Kaguya, Yuki), origine, répartition de points d'aptitude.
- **Prologue** (~20 nœuds narratifs) : de l'inscription à l'académie jusqu'à la
  remise du bandeau de genin, avec des embranchements exclusifs pour les clans
  Uchiha, Senju et Kaguya (Yuki passe par le nœud d'héritage générique), et
  pour chaque village (pierre du souvenir à Konoha, socles des Sept Épéistes à
  Kiri), plus un nœud jinchūriki.
- **Résolution des choix** : jet de d20 + stat visible contre un seuil ; un
  échec au prologue ne bloque jamais la suite, il fait juste bifurquer la
  trame. Un 20 naturel réussit toujours.
- **Progression maîtrisée** : plafond d'aptitude par grade (un élève ne sort
  pas de l'académie avec des stats au maximum), coût d'entraînement croissant.
- **Onglets en jeu** : Récit (l'histoire en cours), Carte (villages + missions
  de rang D/C/B une fois le prologue terminé), Fiche (dossier complet,
  échelle des grades, trames suivies, journal des décisions), Entraînement
  (dépenser ses séances pour monter ses aptitudes).

## Ce qui n'est pas encore jouable

D'après l'historique de conception (`chats/chat1.md`), plusieurs arcs sont
**suivis comme des conditions** dans l'onglet Fiche (drapeaux posés par les
choix du joueur) mais **pas encore construits comme des arcs jouables** :
l'examen chūnin, la sélection jōnin, l'ANBU, la Grande Guerre des shinobi,
la voie de la trahison / un groupe criminel, le recrutement dans l'Akatsuki,
et la lignée (transmettre une partie de ses stats à un enfant). Suna, Kumo et
Iwa restent au registre sans clans détaillés.
