# Prompt Manager - Guide de Déploiement Infrastructure

Ce guide détaille toutes les étapes nécessaires pour déployer l'infrastructure Azure avec Terraform.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir :

1. **Azure CLI** installé et configuré

   ```powershell
   az --version
   ```

2. **Terraform** installé (version ~> 3.0)

   ```powershell
   terraform --version
   ```

3. **Docker** installé (pour la construction des images)

   ```powershell
   docker --version
   ```

4. **Compte Azure** avec les permissions nécessaires pour créer :
   - Resource Groups
   - Azure Container Registry (ACR)
   - Azure Cosmos DB
   - Azure App Service

## 🏗️ Architecture Déployée

L'infrastructure déploie les composants suivants dans l'ordre :

1. **Resource Group** - Groupe de ressources Azure
2. **Azure Container Registry (ACR)** - Registre pour stocker les images Docker
3. **Azure Cosmos DB** - Base de données NoSQL pour stocker les prompts
4. **Module Fetch** - Build et push des images Docker depuis GitHub
5. **Azure App Service** - Hébergement de l'application web

## 🚀 Étapes de Déploiement

### Étape 1 : Authentification Azure

Connectez-vous à votre compte Azure :

```powershell
az login
```

Vérifiez que vous êtes sur le bon abonnement :

```powershell
az account show
```

Si nécessaire, changez d'abonnement :

```powershell
az account set --subscription "VOTRE_SUBSCRIPTION_ID"
```

### Étape 2 : Configuration des Variables

Créez ou modifiez le fichier `terraform.tfvars` avec vos valeurs :

```hcl
project_name          = "prompt-manager"
suffix                = "prod"  # ou "dev", "staging", etc.
rg_name               = "rg-prompt-manager-prod"
location              = "westeurope"  # ou autre région Azure
github_repository_url = "https://github.com/VOTRE_ORG/VOTRE_REPO"
github_app_branch     = "main"  # ou "master", "develop", etc.
```

**Variables disponibles :**

- `project_name` : Nom de base pour toutes les ressources
- `suffix` : Suffixe pour différencier les environnements
- `rg_name` : Nom du Resource Group Azure
- `location` : Région Azure (ex: westeurope, eastus, francecentral)
- `github_repository_url` : URL complète de votre repository GitHub
- `github_app_branch` : Branche à déployer

### Étape 3 : Initialisation Terraform

Initialisez Terraform pour télécharger les providers nécessaires :

```powershell
terraform init
```

Cette commande :

- Télécharge le provider Azure (`azurerm`)
- Initialise le backend Terraform
- Prépare les modules locaux

### Étape 4 : Planification du Déploiement

Visualisez les ressources qui seront créées :

```powershell
terraform plan
```

Examinez attentivement :

- Les ressources à créer (indiquées par `+`)
- Les noms générés pour chaque ressource
- Les dépendances entre modules

### Étape 5 : Application du Déploiement

Déployez l'infrastructure :

```powershell
terraform apply
```

Tapez `yes` pour confirmer lorsque demandé.

**⏱️ Durée estimée :** 15-20 minutes

**Ordre d'exécution automatique :**

1. ✅ Création du Resource Group
2. ✅ Création de l'Azure Container Registry
3. ✅ Création de Cosmos DB (base de données + conteneur)
4. ✅ Build et push des images Docker depuis GitHub
5. ✅ Déploiement de l'App Service avec configuration

### Étape 6 : Vérification du Déploiement

Une fois le déploiement terminé, Terraform affiche l'URL de votre application :

```
Outputs:
app_url = "https://app-prompt-manager-prod.azurewebsites.net"
```

Testez l'accès à votre application :

```powershell
# Ouvrir dans le navigateur
start "https://app-prompt-manager-prod.azurewebsites.net"
```

## 🔄 Redéploiement de l'Infrastructure

### Scénario 1 : Mise à Jour de Configuration

Si vous modifiez uniquement les variables (`terraform.tfvars`) :

```powershell
terraform plan   # Vérifier les changements
terraform apply  # Appliquer les modifications
```

### Scénario 2 : Mise à Jour du Code (Nouvelle Image)

Pour redéployer avec une nouvelle version du code :

```powershell
# Option 1 : Forcer la reconstruction de tout
terraform taint module.fetch
terraform apply

# Option 2 : Détruire et recréer le module fetch
terraform destroy -target=module.fetch
terraform apply
```

### Scénario 3 : Redéploiement Complet (Clean Slate)

Pour tout détruire et recréer :

```powershell
# 1. Détruire toute l'infrastructure
terraform destroy

# 2. Confirmer avec "yes"

# 3. Redéployer
terraform apply
```

⚠️ **ATTENTION :** Cette opération supprime **TOUTES** les données dans Cosmos DB !

### Scénario 4 : Mise à Jour d'un Module Spécifique

Pour ne redéployer qu'un composant :

```powershell
# Redéployer uniquement l'App Service
terraform apply -target=module.app_service

# Redéployer uniquement la base de données
terraform apply -target=module.database
```

## 🧹 Nettoyage et Suppression

Pour supprimer toute l'infrastructure et arrêter les frais :

```powershell
terraform destroy
```

Confirmez avec `yes`. Toutes les ressources seront supprimées dans l'ordre inverse de création.

## 📊 Commandes Utiles

### Consulter l'État Actuel

```powershell
# Voir toutes les ressources déployées
terraform state list

# Afficher les détails d'une ressource
terraform state show module.app_service

# Voir les outputs
terraform output
```

### Validation de Configuration

```powershell
# Vérifier la syntaxe Terraform
terraform validate

# Formater les fichiers .tf
terraform fmt
```

### Débogage

```powershell
# Mode debug détaillé
$env:TF_LOG="DEBUG"
terraform apply

# Désactiver le mode debug
$env:TF_LOG=""
```

## 🔧 Résolution de Problèmes

### Problème : Erreur d'authentification Azure

```powershell
az login
az account set --subscription "VOTRE_SUBSCRIPTION_ID"
```

### Problème : Le Resource Group existe déjà

Si le groupe de ressources existe déjà, vous pouvez :

- L'importer : `terraform import module.resource.azurerm_resource_group.rg /subscriptions/XXX/resourceGroups/VOTRE_RG`
- Ou le renommer dans `terraform.tfvars`

### Problème : Lock State Terraform

Si Terraform est bloqué par un autre processus :

```powershell
terraform force-unlock LOCK_ID
```

### Problème : Erreur de Build Docker

Vérifiez que :

- Docker est en cours d'exécution
- Vous avez accès au repository GitHub
- La branche spécifiée existe

## 📝 Variables d'Environnement Injectées

L'App Service reçoit automatiquement ces variables :

- `COSMOS_ENDPOINT` : URL de votre Cosmos DB
- `COSMOS_KEY` : Clé primaire Cosmos DB
- `COSMOS_DATABASE_NAME` : Nom de la base de données
- `COSMOS_CONTAINER_NAME` : Nom du conteneur

Pas besoin de fichier `.env` en production ! 🎉

## 🔐 Sécurité

- Les secrets (clés Cosmos DB, ACR) sont gérés par Terraform State
- Ne committez **JAMAIS** le fichier `terraform.tfstate`
- Ajoutez `*.tfstate*` et `*.tfvars` dans `.gitignore`
- Utilisez un backend distant (Azure Storage) pour la production

## 📚 Ressources Complémentaires

- [Documentation Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [Azure Cosmos DB Best Practices](https://learn.microsoft.com/azure/cosmos-db/)
- [Azure App Service Documentation](https://learn.microsoft.com/azure/app-service/)

## 📞 Support

En cas de problème :

1. Vérifiez les logs Azure : `az webapp log tail --name VOTRE_APP --resource-group VOTRE_RG`
2. Consultez le portail Azure pour les détails des erreurs
3. Activez le mode debug Terraform pour plus d'informations
