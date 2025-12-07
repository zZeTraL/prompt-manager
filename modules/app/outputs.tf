output "app_url" {
  description = "URL de l'application"
  value       = "https://${azurerm_linux_web_app.app.default_hostname}"
}

output "app_name" {
  description = "Nom de l'App Service"
  value       = azurerm_linux_web_app.app.name
}

output "app_id" {
  description = "ID de l'App Service"
  value       = azurerm_linux_web_app.app.id
}