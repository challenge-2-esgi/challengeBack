# Challenge

## Environnement de dev

### API Gateway
Pour simuler une API Gateway, on a utilisé **Caddy** comme ***reverse proxy***.  
Pour toute nouvelle route, veuillez la déclarer dans le fichier de configuration ***Caddyfile***   

**note:** pour chaque modification de fichier ***Caddyfile***,
veuillez lancer la commande suivantes
```
$ make caddy-reload
```
### Lancement
Ajouter le fichier **.env** au dossier racine puis définir les variable décrite sur le fichier **.env.dist**  
faire la même manipulation sur le dossier racine de chaque service.  

une fois les variables définies, vous pouvez lancer l'environnement de dev en suivant les instructions suivantes:
```
$ make up

$ make back-install
$ make back-dev

# ou lancer chaque service séparément
$ make auth-dev
$ make candidate-dev
$ make recruiter-dev
```
