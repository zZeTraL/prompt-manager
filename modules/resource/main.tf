variable "project_name" {}
variable "suffix" {}
variable "location" {}
variable "rg_name" {}

resource "azurerm_resource_group" "rg" {
  name     = lower("${var.rg_name}")
  location = var.location

  tags = {
    Project   = var.project_name
    ManagedBy = "Terraform"
  }
}
