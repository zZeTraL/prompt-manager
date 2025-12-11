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


5. **Cloner** la branche ```terraform``` du repo

   ```git
   git clone -b terraform https://github.com/zZeTraL/prompt-manager.git
   ```

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
suffix                = "lbtp"
rg_name               = "rg-prompt-manager-prod"
location              = "westeurope"  # sélectionner la région vous souhaitez
```

**Variables disponibles :**

- `project_name` : Nom du projet
- `suffix` : Suffixe ajouté à la fin du nom de projet
- `rg_name` : Nom du groupe de ressources Azure
- `location` : Région Azure (ex: westeurope, eastus, francecentral)
- `github_repository_url` : URL complète du repository Github qui contient l'application web à déployer
- `github_app_branch` : Branche cible lors du clone

### Étape 3 : Initialisation Terraform

Initialisez Terraform afin de télécharger les providers nécessaires :

```powershell
terraform init
```

Cette commande va :
- Télécharger le provider Azure (`azurerm`)
- Initialiser le backend Terraform
- Préparer les modules locaux

### Étape 4 : Planification du déploiement

Visualisez les ressources qui seront créées :

```powershell
terraform plan
```

### Étape 5 : Application du Déploiement

Déployez l'infrastructure :

```powershell
terraform apply
```

Tapez `yes` pour confirmer lorsque demandé.

**⏱️ Durée estimée :** 5-12 minutes

**Ordre d'exécution automatique :**

1. Création du Resource Group
2. Création de l'Azure Container Registry
3. Création de Cosmos DB (base de données + conteneur)
4. Clone du repo Github de l'application.
5. Build de l'image Docker de l'application
6. Push de l'image sur l'ACR (Azure Container Registry)
7. Déploiement de l'App Service avec configuration

### Étape 6 : Vérification du Déploiement

Une fois le déploiement terminé, Terraform affiche l'URL de votre application :

```
Outputs:
app_url = "https://app-prompt-manager-prod.azurewebsites.net"
```

## 📝 Variables d'Environnement Injectées

L'App Service reçoit automatiquement ces variables par injection :

- `COSMOS_ENDPOINT` : URL de votre Cosmos DB
- `COSMOS_KEY` : Clé primaire Cosmos DB
- `COSMOS_DATABASE_NAME` : Nom de la base de données
- `COSMOS_CONTAINER_NAME` : Nom du conteneur
