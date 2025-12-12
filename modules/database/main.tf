variable "project_name" {}
variable "suffix" {}
variable "rg_name" {}
variable "location" {}

resource "random_id" "service_id" {
  byte_length = 4
}

# Compte CosmosDB (Base SQL)
resource "azurerm_cosmosdb_account" "db" {
  name                = "cosmos-${var.project_name}-${random_id.service_id.hex}"
  location            = var.location
  resource_group_name = var.rg_name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB" # API SQL/Core

  # Mode Serverless pour économiser
  capabilities {
    name = "EnableServerless"
  }

  # Politique de cohérence
  consistency_policy {
    consistency_level       = "Session"
    max_interval_in_seconds = 5
    max_staleness_prefix    = 100
  }

  # Localisation géographique
  geo_location {
    location          = var.location
    failover_priority = 0
  }

  tags = {
    Environment = var.suffix
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# Base de données
resource "azurerm_cosmosdb_sql_database" "prompts_db" {
  name                = "prompts-db"
  resource_group_name = var.rg_name
  account_name        = azurerm_cosmosdb_account.db.name
}

# Container (équivalent d'une table/collection)
resource "azurerm_cosmosdb_sql_container" "prompts" {
  name                = "prompts"
  resource_group_name = var.rg_name
  account_name        = azurerm_cosmosdb_account.db.name
  database_name       = azurerm_cosmosdb_sql_database.prompts_db.name
  partition_key_paths = ["/id"]

  # Index pour optimiser les queries
  indexing_policy {
    indexing_mode = "consistent"

    included_path {
      path = "/*"
    }

    excluded_path {
      path = "/\"_etag\"/?"
    }
  }
}
