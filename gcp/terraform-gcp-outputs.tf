# Terraform GCP
# To output variables, follow pattern:
# value = TYPE.NAME.ATTR

output "balancer" {
  value = formatlist("%s = %s", google_compute_instance.balancer[*].name, google_compute_instance.balancer[*].network_interface.0.access_config.0.nat_ip)
}

output "list"  {
  value = formatlist("%s = %s", google_compute_instance.list[*].name, google_compute_instance.list[*].network_interface.0.access_config.0.nat_ip)
}

output "item"  {
  value = formatlist("%s = %s", google_compute_instance.item[*].name, google_compute_instance.item[*].network_interface.0.access_config.0.nat_ip)
}

output "frontend"  {
  value = formatlist("%s = %s", google_compute_instance.frontend[*].name, google_compute_instance.frontend[*].network_interface.0.access_config.0.nat_ip)
}

output "monitor" {
  value = join(" ", google_compute_instance.monitor.*.network_interface.0.access_config.0.nat_ip)
}

output "databases" {
  value = formatlist("%s = %s", google_compute_instance.database[*].name, google_compute_instance.database[*].network_interface.0.access_config.0.nat_ip)
}