# Terraform google cloud multi tier deployment

# check how configure the provider here:
# https://www.terraform.io/docs/providers/google/index.html
provider "google" {
    credentials = file("agisit-2324-website-16-c2a38c70de7c.json")
    project = var.GCP_PROJECT_ID
    zone = var.GCP_ZONE
}
