variable "project_name" {}
variable "suffix" {}
variable "rg_name" {}
variable "location" {}

resource "azurerm_container_registry" "acr" {
  name                = lower("acr${var.project_name}${var.suffix}")
  resource_group_name = var.rg_name
  location            = var.location
  sku                 = "Basic"
  # Active l'admin pour simplifier le login
  admin_enabled       = true

  tags = {
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}