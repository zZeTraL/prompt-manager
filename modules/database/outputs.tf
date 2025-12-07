output "cosmos_endpoint" {
  description = "Endpoint Cosmos DB"
  value       = azurerm_cosmosdb_account.db.endpoint
}

output "cosmos_primary_key" {
  description = "Primary key Cosmos DB"
  value       = azurerm_cosmosdb_account.db.primary_key
  sensitive   = true
}

output "database_name" {
  description = "Nom de la base de données"
  value       = azurerm_cosmosdb_sql_database.prompts_db.name
}

output "container_name" {
  description = "Nom du container"
  value       = azurerm_cosmosdb_sql_container.prompts.name
}

output "cosmos_account_name" {
  description = "Nom du compte Cosmos DB"
  value       = azurerm_cosmosdb_account.db.name
}
