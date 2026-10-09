# Production et déploiement

Les projets développés avec ofa.js peuvent être directement déployés sur un serveur statique pour être utilisés.

## Environnement de développement

Vous pouvez utiliser le [ofa Studio](https://core.noneos.com/?redirect=studio) officiel pour le développement, il fournit la création et l'aperçu de projets en un clic.

Vous pouvez également construire votre propre serveur statique :

* Utiliser un serveur statique comme Nginx ou Apache
* Utiliser le module [http-server](https://www.npmjs.com/package/http-server) de Node.js
* Utiliser directement l’extension de serveur statique de l’éditeur pour prévisualiser

## Environnement de production

### Exporter le projet

Si vous utilisez un projet construit avec [ofa Studio](https://core.noneos.com/?redirect=studio), il suffit d'utiliser la fonction d'exportation intégrée à l'outil.

Si tu construis manuellement le projet, tu peux directement déployer le dossier du projet sur un serveur statique, en gardant le même mode que l'environnement de développement.

### Compression et obfuscation

En environnement de production, il est généralement nécessaire d'utiliser des outils de minification et d'obfuscation pour réduire la taille des fichiers et améliorer la vitesse de chargement. Vous pouvez utiliser [Terser CLI](https://terser.org/docs/cli-usage/) pour la minification et l'obfuscation.

Si vous ne souhaitez pas utiliser l’outil en ligne de commande, vous pouvez utiliser [ofa build](https://builder.ofajs.com/) en ligne pour compresser et obscurcir vos fichiers. Cet outil est actuellement en version bêta et sera intégré ultérieurement dans ofa Studio.

