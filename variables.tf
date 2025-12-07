variable "project_name" {
    description = "Nom du projet"
    type        = string
}

variable "suffix" {
    description = "Suffixe pour les noms de ressources"
    type        = string
}

variable "rg_name" {
    description = "Nom du groupe de ressources"
    type        = string
}

variable "location" {
    description = "Région Azure"
    type        = string
}

variable "github_repository_url" {
    description = "URL du dépôt GitHub"
    type        = string
}

variable "github_app_branch" {
    description = "Branche de l'application"
    type        = string
}