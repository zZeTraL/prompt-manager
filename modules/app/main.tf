variable "project_name" {}
variable "suffix" {}
variable "rg_name" {}
variable "location" {}
variable "acr_login_server" {}
variable "acr_admin_username" {}
variable "acr_admin_password" {}

# Variables Cosmos DB uniquement
variable "cosmos_endpoint" {}
variable "cosmos_primary_key" {}
variable "cosmos_database_name" {}
variable "cosmos_container_name" {}

# Service Plan
resource "azurerm_service_plan" "plan" {
  name                = "asp-${var.project_name}-${var.suffix}"
  location            = var.location
  resource_group_name = var.rg_name
  os_type             = "Linux"
  sku_name            = "B1"

  tags = {
    Environment = var.suffix
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# App Service
resource "azurerm_linux_web_app" "app" {
  name                = "app-${var.project_name}-${var.suffix}"
  location            = var.location
  resource_group_name = var.rg_name
  service_plan_id     = azurerm_service_plan.plan.id

  site_config {
    always_on = false

    application_stack {
      docker_image_name   = "prompt-manager:latest"
      docker_registry_url = "https://${var.acr_login_server}"
    }
  }

  app_settings = {
    # Docker
    DOCKER_REGISTRY_SERVER_URL      = "https://${var.acr_login_server}"
    DOCKER_REGISTRY_SERVER_USERNAME = var.acr_admin_username
    DOCKER_REGISTRY_SERVER_PASSWORD = var.acr_admin_password
    WEBSITES_PORT                   = "3000"
    DOCKER_ENABLE_CI                = "true"

    # Cosmos DB uniquement
    COSMOS_ENDPOINT       = var.cosmos_endpoint
    COSMOS_KEY            = var.cosmos_primary_key
    COSMOS_DATABASE_NAME  = var.cosmos_database_name
    COSMOS_CONTAINER_NAME = var.cosmos_container_name

    # App
    NODE_ENV            = "production"
    NEXT_PUBLIC_API_URL = "https://app-${var.project_name}-${var.suffix}.azurewebsites.net"
  }

  tags = {
    Environment = var.suffix
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}
