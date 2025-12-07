output "rg" {
  description = "Groupe de ressources créé"
  value       = azurerm_resource_group.rg
}

output "name" {
  description = "Nom du groupe de ressources"
  value       = azurerm_resource_group.rg.name
}

output "id" {
  description = "ID du groupe de ressources"
  value       = azurerm_resource_group.rg.id
}

output "location" {
  description = "Location du groupe de ressources"
  value       = azurerm_resource_group.rg.location
}