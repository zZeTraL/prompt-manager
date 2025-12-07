# Créer le groupe de ressources avant de faire quoique ce soit d'autre
# Sans ce module, Terraform échoue car le groupe de ressources n'existe pas
module "resource" {
  source       = "./modules/resource"
  project_name = var.project_name
  suffix       = var.suffix
  location     = var.location
  rg_name      = var.rg_name
}

# Ensuite, on autorise Terraform à créer le "container registry" dans le groupe de ressources créé précédemment
# Un ACR (Azure Container Registry) est nécessaire pour stocker les images Docker
module "container" {
  source       = "./modules/container"
  project_name = var.project_name
  suffix       = var.suffix
  rg_name      = var.rg_name
  location     = var.location

  # Important: on doit s'assurer que le groupe de ressources est créé avant de créer l'ACR
  depends_on = [module.resource]
}

# Maintenant, on peut créer la base de données Cosmos DB nécessaire pour stocker les prompts
module "database" {
  source       = "./modules/database"
  project_name = var.project_name
  suffix       = var.suffix
  rg_name      = var.rg_name
  location     = var.location

  depends_on = [module.resource]
}

# Une fois qu'on a créé nos deux ressources, on peut maintenant "Fetch" depuis notre repo GitHub
# le front et le back afin de créer les images Docker et les pousser dans l'ACR
module "fetch" {
  source                = "./modules/fetch"
  acr_login_server      = module.container.login_server
  acr_name              = module.container.acr_name
  acr_admin_username    = module.container.acr_admin_username
  acr_admin_password    = module.container.acr_admin_password
  github_repository_url = var.github_repository_url
  github_app_branch     = var.github_app_branch

  depends_on = [module.resource, module.container]
}

# Déployer l'App Service Linux qui va héberger notre application web
# On utilise l'image Docker stockée dans l'ACR précédemment créé
module "app_service" {
  source       = "./modules/app"
  project_name = var.project_name
  suffix       = var.suffix
  rg_name      = var.rg_name
  location     = var.location

  # Informations ACR pour que l'App Service puisse récupérer l'image Docker
  acr_login_server   = module.container.login_server
  acr_admin_username = module.container.acr_admin_username
  acr_admin_password = module.container.acr_admin_password

  # Informations Cosmos DB pour que l'application puisse s'y connecter
  # Surtout utilie pour l'injection des variables d'environnement pas besoin de .env :)
  cosmos_endpoint       = module.database.cosmos_endpoint
  cosmos_primary_key    = module.database.cosmos_primary_key
  cosmos_database_name  = module.database.database_name
  cosmos_container_name = module.database.container_name

  depends_on = [module.fetch, module.database]
}
