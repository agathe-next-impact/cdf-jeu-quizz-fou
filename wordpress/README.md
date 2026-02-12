# Configuration WordPress - Comme des Fous

Guide complet pour configurer WordPress comme backend headless du jeu-quizz.

---

## Pr\u00e9requis

- **WordPress** 5.9+ install\u00e9 et accessible
- **PHP** 7.4+
- **ACF** (Advanced Custom Fields) version gratuite >= 5.0
- Un compte administrateur WordPress

---

## 1. Installer le plugin

1. Dans votre installation WordPress, cr\u00e9er le dossier :
   ```
   wp-content/plugins/quiz-fou-scores/
   ```

2. Copier le fichier `quiz-fou-scores.php` dans ce dossier :
   ```
   wp-content/plugins/quiz-fou-scores/quiz-fou-scores.php
   ```

3. Dans l'admin WordPress, aller dans **Extensions** et activer **Comme des Fous - Scores & Joueurs**.

---

## 2. Installer ACF (Advanced Custom Fields)

1. Dans l'admin WordPress : **Extensions > Ajouter**
2. Rechercher **Advanced Custom Fields**
3. Installer et activer la version gratuite (ACF Free >= 5.0)

> Les champs ACF sont enregistr\u00e9s automatiquement par le plugin via PHP.
> Il n'y a rien \u00e0 configurer manuellement dans l'interface ACF.

---

## 3. Cr\u00e9er un mot de passe d'application

L'application Next.js utilise l'authentification **Basic Auth** via les mots de passe d'application WordPress.

1. Aller dans **Utilisateurs > Votre Profil**
2. Descendre jusqu'\u00e0 la section **Mots de passe d'application**
3. Entrer un nom (ex: `quiz-app`) et cliquer sur **Ajouter un mot de passe d'application**
4. **Copier le mot de passe g\u00e9n\u00e9r\u00e9** (il ne sera plus affich\u00e9)

---

## 4. Configurer les variables d'environnement

Dans le projet Next.js, copier `.env.example` en `.env.local` et remplir :

```env
WORDPRESS_URL=https://votre-site-wordpress.com
WORDPRESS_USER=admin
WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
```

| Variable | Description |
|---|---|
| `WORDPRESS_URL` | URL de base du site WordPress (sans slash final) |
| `WORDPRESS_USER` | Nom d'utilisateur administrateur |
| `WORDPRESS_APP_PASSWORD` | Mot de passe d'application cr\u00e9\u00e9 \u00e0 l'\u00e9tape 3 |

---

## 5. V\u00e9rifier l'installation

Apr\u00e8s activation du plugin, vous devriez voir dans le menu WordPress :

| Menu | Ic\u00f4ne | Description |
|---|---|---|
| Scores DSM-6 | :heart: | Scores du jeu DSM-6 Version Beta |
| Scores Rorschach | :eye: | Scores du Test de Rorschach |
| Scores \u00c9valuation | :mortar_board: | Scores de l'\u00c9valuation \u00c9motionnelle |
| Scores \u00c9vasion | :lock: | Scores de l'\u00c9vasion Psychiatrique |
| Scores Motricit\u00e9 | :joystick: | Scores du Test de Motricit\u00e9 Fine |
| Scores Cognitif | :bulb: | Scores du Test Cognitif Absurde |
| Joueurs | :busts_in_silhouette: | Profils des joueurs |

Pour v\u00e9rifier que l'API REST fonctionne, ouvrir dans un navigateur :

```
https://votre-site-wordpress.com/wp-json/wp/v2/cdf-players
```

---

## Architecture du plugin

### Custom Post Types (CPT)

Le plugin enregistre 7 CPT :

| CPT (interne) | REST base | Utilisation |
|---|---|---|
| `dsm6_score` | `dsm6-scores` | Scores DSM-6 Version Beta |
| `rorschach_score` | `rorschach-scores` | Scores Test de Rorschach |
| `evaluation_score` | `evaluation-scores` | Scores \u00c9valuation \u00c9motionnelle |
| `evasion_score` | `evasion-scores` | Scores \u00c9vasion Psychiatrique |
| `motricite_score` | `motricite-scores` | Scores Test de Motricit\u00e9 Fine |
| `cognitif_score` | `cognitif-scores` | Scores Test Cognitif Absurde |
| `cdf_player` | `cdf-players` | Profils joueurs |

### Champs ACF - Scores

Chaque CPT de score poss\u00e8de les m\u00eames champs :

| Champ ACF | Type | Description |
|---|---|---|
| `player_pseudo` | text | Pseudo du joueur |
| `player_score` | number | Score obtenu |
| `player_title` | text | Titre/diagnostic obtenu |
| `score_date` | text | Date de la partie (ISO) |
| `player_answers` | textarea | R\u00e9ponses du joueur (JSON) |

### Champs ACF - Joueurs

| Champ ACF | Type | Description |
|---|---|---|
| `player_pseudo` | text | Pseudo unique |
| `player_email` | email | Adresse email |
| `player_avatar` | text | Emoji avatar |
| `player_password_hash` | text | Hash SHA-256 du mot de passe |
| `player_created_at` | text | Date d'inscription (ISO) |
| `player_madness_since` | text | Date de d\u00e9but de folie (YYYY-MM-DD) |
| `player_bio` | textarea | Citation / mini-bio (160 car. max) |
| `player_autodiagnostic` | textarea | Autodiagnostic (200 car. max) |

### Endpoints REST API

**Scores (par jeu) :**
```
GET  /wp-json/wp/v2/{rest-base}?per_page=100&_fields=id,acf
POST /wp-json/wp/v2/{rest-base}
```

**Joueurs :**
```
GET  /wp-json/wp/v2/cdf-players?search={pseudo}&_fields=id,acf
POST /wp-json/wp/v2/cdf-players
POST /wp-json/wp/v2/cdf-players/{id}   (mise \u00e0 jour)
```

Toutes les requ\u00eates POST n\u00e9cessitent l'en-t\u00eate `Authorization: Basic <base64>`.

---

## CORS (si domaines diff\u00e9rents)

Si le site Next.js et WordPress sont sur des domaines diff\u00e9rents, ajouter dans le `functions.php` du th\u00e8me ou dans un mu-plugin :

```php
add_action( 'init', function () {
    header( 'Access-Control-Allow-Origin: https://votre-app-nextjs.com' );
    header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
    header( 'Access-Control-Allow-Headers: Content-Type, Authorization' );
    header( 'Access-Control-Allow-Credentials: true' );

    if ( $_SERVER['REQUEST_METHOD'] === 'OPTIONS' ) {
        status_header( 200 );
        exit;
    }
} );
```

---

## D\u00e9pannage

| Probl\u00e8me | Solution |
|---|---|
| Les champs ACF n'apparaissent pas | V\u00e9rifier qu'ACF est install\u00e9 et activ\u00e9 |
| Erreur 401 sur les POST | V\u00e9rifier le mot de passe d'application et les identifiants |
| Erreur 403 sur les POST | V\u00e9rifier que l'utilisateur a le r\u00f4le Administrateur |
| `acf` vide dans la r\u00e9ponse REST | D\u00e9sactiver puis r\u00e9activer le plugin pour r\u00e9initialiser les champs |
| Scores non persist\u00e9s | V\u00e9rifier les 3 variables `.env.local` et red\u00e9marrer Next.js |
| Permaliens cassent l'API | Aller dans **R\u00e9glages > Permaliens** et cliquer **Enregistrer** |

---

## Mode d\u00e9veloppement (sans WordPress)

Si les variables `WORDPRESS_*` ne sont pas d\u00e9finies, l'application fonctionne en mode **in-memory** :
- Les scores et profils sont stock\u00e9s en m\u00e9moire Node.js
- Les donn\u00e9es sont perdues au red\u00e9marrage du serveur
- Utile pour le d\u00e9veloppement local sans WordPress
