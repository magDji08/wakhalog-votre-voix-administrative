# Wakhalog — VoiceBot Services Publics

## Présentation
Wakhalog est une application React TypeScript orientée assistant vocal bilingue Wolof–Français pour l’accès aux démarches administratives sénégalaises.

Le projet combine :
- `@tanstack/react-start` pour SSR et rendu universel
- `@tanstack/react-router` pour le routage file-based
- `@tanstack/react-query` pour le contexte de requête
- `Tailwind CSS` pour le style
- `Vite` pour le bundling de développement

## Structure du projet
- `src/start.ts` : configuration de TanStack Start et middleware global d’erreur.
- `src/server.ts` : entrée serveur SSR.
- `src/router.tsx` : construction du routeur.
- `src/routes/` : routes de l’application.
- `src/components/` : composants réutilisables (shell, gardes, cartes, etc.).
- `src/lib/` : logique d’authentification.
- `src/styles.css` : styles globaux.

## Routes principales
- `/` : page d’accueil marketing.
- `/services` : catalogue des démarches.
- `/services/$slug` : détail d’une démarche.
- `/auth/login` : page de connexion OTP.
- `/auth/otp` : page de vérification OTP.
- `/dashboard`, `/conversations`, `/knowledge`, `/intents`, `/models`, `/documents`, `/settings`, `/users`, `/analytics` : espace administrateur/prototype.

## Authentification
- Implémentée côté client via `localStorage`.
- Rôles disponibles : `citizen`, `consultant`, `super_admin`.
- Permissions définies dans `src/lib/auth.tsx`.
- `RoleGuard` protège les pages sensibles.

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Points clés
- Le projet est principalement une démo front-end.
- Les contenus métiers sont codés en dur dans les routes.
- Le routage et l’architecture sont prêts pour évoluer vers un backend réel.

## Recommandations
- Externaliser les données des procédures dans un module ou une API.
- Implémenter une authentification serveur si le projet passe en production.
- Ajouter de vraies API pour les conversations, la base de connaissances et les statistiques.
