output "acr_id" {
  value = azurerm_container_registry.acr.id
}

output "login_server" {
  description = "L'URL pour se connecter au container registry"
  value       = azurerm_container_registry.acr.login_server
}

output "acr_name" {
  description = "Le nom du container registry"
  value       = azurerm_container_registry.acr.name
}

output "acr_admin_username" {
  value     = azurerm_container_registry.acr.admin_username
  sensitive = true
}

output "acr_admin_password" {
  value     = azurerm_container_registry.acr.admin_password
  sensitive = true
}
