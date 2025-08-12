# Banking app

Une application web réactive de gestion bancaire, construite avec **React** et **Vite**.
Elle est optimisée pour un usage **desktop** et **mobile**, et peut être installée comme une **PWA** (Progressive Web App) pour un accès hors ligne et une expérience proche d'une application native. Utilisez chrome pour cela.

Elle fonctionne sur le backend **Spring Boot** avec une base de données **PostgreSQL** du repo github [banking-spring-api](https:https://github.com/JCalternance/simplon-2024-banking-api)

## Dev

### Installation et lancement

#### Cloner le repo

```bash
git clone https://github.com/JCalternance/simplon-2024-banking-app
cd banking_app
```
#### Installer les dépendances

```bash
npm install
```
#### Lancer le serveur de développement

```bash
npm run dev
```
#### Accéder à l'application

Ouvrez votre navigateur et allez à l'adresse [http://localhost:5173](http://localhost:5173).

### Construire pour la production

Pour construire l'application pour la production, utilisez la commande suivante :

```bash
npm run build
```
Cela créera un dossier `dist` contenant les fichiers optimisés pour la production.

### Visualiser la production

```bash
npm run preview
```
Cela lancera un serveur local pour visualiser la version de production de l'application. Ouvrez votre navigateur et allez à l'adresse [http://localhost:4173](http://localhost:4173).


