# Kidizy — Frontend

Application mobile de babysitting développée dans le cadre du projet de fin de formation à La Capsule. Permet la mise en relation entre parents et babysitters, avec géolocalisation, messagerie en temps réel et authentification Google.

Backend : [github.com/Len0f/kidizy-backend](https://github.com/Len0f/kidizy-backend)

## Technologies

- **Framework** : React Native 0.79 / Expo 53
- **Navigation** : React Navigation 6 (stack + bottom tabs)
- **Etat global** : Redux Toolkit, React-Redux, Redux Persist
- **Carte** : react-native-maps, expo-location
- **Messagerie temps réel** : Pusher
- **Authentification** : Google Sign-In
- **Upload** : expo-image-picker
- **Tests** : Jest, jest-expo, Testing Library React Native
- **Langage** : JavaScript

## Fonctionnalites

- Inscription et connexion avec authentification Google
- Géolocalisation et carte des babysitters disponibles
- Messagerie en temps réel via Pusher
- Upload de photo de profil
- Recherche avec autocomplétion
- Gestion des disponibilités avec sélecteur de dates
- Tests unitaires avec Jest et Testing Library

## Structure du projet

- `__tests__/` — Tests unitaires
- `api/` — Appels API vers le backend
- `assets/` — Images et ressources statiques
- `components/` — Composants React Native réutilisables
- `contexts/` — Contextes React
- `fonts/` — Polices personnalisées
- `reducers/` — Reducers Redux
- `screens/` — Ecrans de l'application
- `App.js` — Point d'entrée de l'application

## Auteur

**Caroline Viot** — Développeuse web fullstack JS  
[GitHub](https://github.com/Len0f)
