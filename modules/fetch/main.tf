#
#
#
# Merci Thomas (Sys. Admin chez Mobivia et mon collègue) pour l'aide précieuse pour m'avoir aidé à rédiger ce code !
# et également pour l'aide dans la compréhension avancée de Terraform :)
#
# Get-Content "$env:TEMP\terraform-docker-build.log"
# Permet de lire le fichier de log généré lors de l'exécution des commandes Docker
#
#
#

# Variables ACR
variable "acr_login_server" {}
variable "acr_name" {}
variable "acr_admin_username" {}
variable "acr_admin_password" {}

variable "github_repository_url" {}
variable "github_app_branch" {}

# Cette ressource ne crée rien dans Azure, mais permet d'exécuter des commandes locales
# L'objectif est de venir récupérer le code source de notre site web (NextJS qui permet de faire le front et le back)
# et ainsi de construire l'image Docker puis de la pousser dans notre ACR
# Bien évidement toute les variables d'environnement nécessaires sont injectées dynamiquement grâce à Terraform
resource "null_resource" "docker_build_push" {
  triggers = {
    # On force l'exécution à chaque fois (car timestamp() change à chaque exécution)
    always_run = "${timestamp()}"
  }

  # Grâce à Terraform, on peut exécuter des commandes locales via le provisioner "local-exec"
  # Voici les étapes dans l'ordre (Login -> Fetch -> Build -> Push)
  provisioner "local-exec" {
    interpreter = ["PowerShell", "-Command"]
    command     = <<EOT
      $ErrorActionPreference = "Continue"
      $logFile = "$env:TEMP\terraform-docker-build.log"
      
      # Connexion à l'ACR
      "$(Get-Date) - Logging into Azure Container Registry..." | Tee-Object -FilePath $logFile -Append
      $loginResult = az acr login --name ${var.acr_name} --username ${var.acr_admin_username} --password "${var.acr_admin_password}" 2>&1
      $loginResult | Tee-Object -FilePath $logFile -Append
      if ($LASTEXITCODE -ne 0) {
        "$(Get-Date) - ERROR: ACR login failed" | Tee-Object -FilePath $logFile -Append
        exit 1
      }

      # On crée un dossier temporaire
      $TEMP_DIR = New-Item -ItemType Directory -Path $env:TEMP -Name "terraform-$(Get-Random)" -Force
      "$(Get-Date) - Created temporary directory at $($TEMP_DIR.FullName)" | Tee-Object -FilePath $logFile -Append
      
      # On clone notre repo
      "$(Get-Date) - Cloning repository from ${var.github_repository_url}..." | Tee-Object -FilePath $logFile -Append
      $cloneResult = git clone --branch ${var.github_app_branch} ${var.github_repository_url} $TEMP_DIR.FullName 2>&1
      $cloneResult | Tee-Object -FilePath $logFile -Append
      if ($LASTEXITCODE -ne 0) {
        "$(Get-Date) - ERROR: Git clone failed" | Tee-Object -FilePath $logFile -Append
        Remove-Item -Recurse -Force $TEMP_DIR -ErrorAction SilentlyContinue
        exit 1
      }
      
      # On vérifie si le Dockerfile existe à la racine
      $dockerfilePath = Join-Path $TEMP_DIR.FullName "Dockerfile"
      if (-Not (Test-Path $dockerfilePath)) {
        "$(Get-Date) - ERROR: Dockerfile not found at $dockerfilePath" | Tee-Object -FilePath $logFile -Append
        Remove-Item -Recurse -Force $TEMP_DIR
        exit 1
      }
      "$(Get-Date) - Dockerfile found at $dockerfilePath" | Tee-Object -FilePath $logFile -Append
      
      # On build l'image Docker
      "$(Get-Date) - Building Docker image..." | Tee-Object -FilePath $logFile -Append
      $buildResult = docker build -t ${var.acr_login_server}/prompt-manager:latest $TEMP_DIR.FullName 2>&1
      $buildResult | Tee-Object -FilePath $logFile -Append
      if ($LASTEXITCODE -ne 0) {
        "$(Get-Date) - ERROR: Docker build failed" | Tee-Object -FilePath $logFile -Append
        Remove-Item -Recurse -Force $TEMP_DIR
        exit 1
      }

      # On push l'image Docker
      "$(Get-Date) - Pushing Docker image to ACR..." | Tee-Object -FilePath $logFile -Append
      $pushResult = docker push ${var.acr_login_server}/prompt-manager:latest 2>&1
      $pushResult | Tee-Object -FilePath $logFile -Append
      if ($LASTEXITCODE -ne 0) {
        "$(Get-Date) - ERROR: Docker push failed" | Tee-Object -FilePath $logFile -Append
        Remove-Item -Recurse -Force $TEMP_DIR
        exit 1
      }

      # Nettoyage du dossier temporaire
      Remove-Item -Recurse -Force $TEMP_DIR
      "$(Get-Date) - Successfully completed! Cleaned up temporary directory." | Tee-Object -FilePath $logFile -Append
      
      Write-Host "======================================"
      Write-Host "SUCCESS! Log file: $logFile"
      Write-Host "======================================"
    EOT
  }
}
