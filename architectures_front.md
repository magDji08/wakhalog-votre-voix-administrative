# Architecture Frontend

## Vue générale
L’application est une application React TypeScript construite avec :
- `Vite` pour le bundling et le développement
- `@tanstack/react-start` pour la couche SSR/routeur
- `@tanstack/react-router` pour le routage basé sur les fichiers
- `@tanstack/react-query` pour la gestion de l’état de requête
- `Tailwind CSS` pour le style

La structure est centrée sur `src/routes/`, chaque fichier `.tsx` définit une route accessible.

## Point d’entrée
- `src/start.ts` : initialise TanStack Start et ajoute un middleware global de gestion des erreurs.
- `src/server.ts` : wrapper SSR qui invoque `@tanstack/react-start/server-entry` et remplace les erreurs de rendu par une page d’erreur HTML.
- `src/router.tsx` : construit le routeur avec `routeTree` généré automatiquement.

## Routage
- `src/routes/__root.tsx` : layout racine, contexte global, meta tags et shell HTML.
- `src/routes/index.tsx` : page d’accueil marketing / landing page.
- `src/routes/services.tsx` : catalogue des démarches administratives.
- `src/routes/services.$slug.tsx` : page détail d’une démarche, avec audio, FAQ et simulateur.
- `src/routes/auth.login.tsx` et `src/routes/auth.otp.tsx` : flux de connexion OTP en mode démo.
- pages protégées : `dashboard`, `conversations`, `knowledge`, `intents`, `models`, `documents`, `settings`, `users`, `analytics`.

## Authentification et RBAC
- `src/lib/auth.tsx` : gestion de session client avec `localStorage`.
- Sessions simulées : `phone`, `role`, `name`.
- Rôles disponibles : `citizen`, `consultant`, `super_admin`.
- Permissions déclarées côté client pour pages et actions.
- `src/components/role-guard.tsx` : redirection des non-authentifiés vers `/auth/login` et écran 403 pour les permissions manquantes.
- `src/components/app-shell.tsx` : layout admin avec sidebar calculée selon les permissions.

## Composants clés
- `src/components/app-shell.tsx` : layout principal de l’application interne.
- `src/components/role-guard.tsx` : garde d’accès RBAC.
- `src/components/stat-card.tsx` : carte de métriques utilisée dans le dashboard.

## Données et logique
- Les contenus métiers sont majoritairement codés en dur dans les pages : procédures, catégories, FAQ, tableaux de bord.
- Aucun backend réel n’est présent dans le dépôt ; le projet est actuellement une POC front-end avec SSR et des écrans administratifs.

## Observations techniques
- L’architecture est prête à être enrichie par une API backend.
- Le routage TanStack permet une évolution vers des loaders et des routes imbriquées plus complexes.
- Le composant `AppShell` offre un bon point d’entrée pour des écrans d’administration modulaires.

## Recommandation
- Externaliser les données de procédures dans un module ou une API pour améliorer la maintenabilité.
- Ajout d’une gestion d’authentification serveur si le projet doit sortir du stade de démo.
- Compléter le routage avec des layouts partagés pour les pages `/services` et `/dashboard`.
