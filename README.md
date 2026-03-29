# 🏡 ARMANCE ET FRED CHERCHENT UN APPART !!!!

Appli React pour comparer et classer les appartements visités à Barcelone.

## Lancer en local

```bash
npm install
npm start
```

L'appli s'ouvre sur http://localhost:3000

## Déployer sur Netlify

### Option 1 : Depuis GitHub (recommandé)
1. Pousse ce repo sur GitHub
2. Va sur [app.netlify.com](https://app.netlify.com)
3. Clique **"Add new site" → "Import an existing project"**
4. Connecte ton repo GitHub
5. Configure :
   - **Build command** : `npm run build`
   - **Publish directory** : `build`
6. Clique **Deploy** — c'est tout !

### Option 2 : Deploy manuel
```bash
npm run build
```
Puis glisse le dossier `build/` sur [app.netlify.com/drop](https://app.netlify.com/drop)

## Fonctionnalités

- ✅ Ajouter des appartements avec détails (prix, surface, pièces, étage...)
- ✅ Noter chaque bien sur 10 critères pondérés
- ✅ Classement automatique par score pondéré
- ✅ Points forts / points faibles par bien
- ✅ Marquer comme favori ❤️ ou visité ✓
- ✅ Données sauvegardées dans le navigateur (localStorage)
- ✅ 100% en français 🇫🇷

## Note sur les données

Les données sont stockées dans le `localStorage` du navigateur. Ça veut dire :
- Chaque navigateur/appareil a ses propres données
- Si vous voulez partager les mêmes données, utilisez le même appareil
- Les données persistent même si vous fermez le navigateur
