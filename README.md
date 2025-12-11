# Prompt Manager

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

## 📝 Variables d'Environnement Injectées

L'App Service reçoit automatiquement ces variables :

- `COSMOS_ENDPOINT` : URL de votre Cosmos DB
- `COSMOS_KEY` : Clé primaire Cosmos DB
- `COSMOS_DATABASE_NAME` : Nom de la base de données
- `COSMOS_CONTAINER_NAME` : Nom du conteneur
