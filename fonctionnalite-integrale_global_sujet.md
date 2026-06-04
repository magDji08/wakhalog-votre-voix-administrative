# Fonctionnalités globales du projet

## Objectif principal
Wakhalog est présenté comme un assistant vocal bilingue Wolof–Français destiné à faciliter l’accès aux services publics sénégalais.

## Fonctionnalités visibles
- Page d’accueil marketing avec présentation du service et démonstration.
- Catalogue des démarches administratives (`/services`) avec filtres et recherche.
- Pages de détail de procédure (`/services/$slug`) avec :
  - description de la démarche
  - difficulté, coût, délai, documents requis
  - étapes détaillées
  - FAQ
  - sources officielles
  - audio en Wolof via synthèse vocale du navigateur
  - chat simulé pour des questions en contexte
- Flux de connexion OTP:
  - saisie du numéro et choix du rôle démo
  - validation de code OTP fictif
  - création de session côté client
- Interface d’administration et supervision pour les rôles autorisés.

## Pages d’administration et de supervision
- Tableau de bord (`/dashboard`) : indicateurs d’usage et historique des conversations.
- Conversations (`/conversations`) : liste des échanges et détails (interface fictive).
- Base de connaissances (`/knowledge`) : interface de gestion des fiches de procédures.
- Intentions (`/intents`) : statistiques et gestion des intentions NLU.
- Modèles (`/models`) : paramètres IA et performances.
- Documents (`/documents`) : génération / accès de documents de démonstration.
- Paramètres (`/settings`) : réglages généraux et configuration.
- Utilisateurs (`/users`) : gestion des comptes.
- Analytique (`/analytics`) : mesures ASR, NLU, TTS.

## Sujet global
- Inclusion numérique au Sénégal via un assistant vocal.
- Aide à la compréhension des démarches administratives pour des utilisateurs ne maîtrisant pas forcément le français écrit.
- Mise en avant d’une chaîne technique : ASR, NLU, RAG, TTS.
- Composante multirôle : citoyen, consultant, super administrateur.

## Comportements importants
- RBAC côté client pour masquer ou afficher les sections du menu.
- Authentification légère stockée en local.
- Navigation fluide via TanStack Router.
- Présentation « product-led » avec sections marketing et démonstrations de contenu.

## Limites actuelles
- Données statiques et fictives intégrées directement dans les pages.
- Pas de backend API ni de persistance réelle pour les utilisateurs ou les conversations.
- OTP simulé en front-end sans validation serveur.
- Le service vocal est géré côté client uniquement via `SpeechSynthesis`.

## Pistes de développement
- Rendre les pages `/services` et `/services/$slug` dynamiques avec une source de vérité partagée.
- Ajouter une API de backend pour l’authentification, la persistance des sessions et le stockage des procédures.
- Intégrer un moteur RAG réel pour la base de connaissances.
- Remplacer la logique de chat simulé par un assistant alimenté par un LLM externe.
