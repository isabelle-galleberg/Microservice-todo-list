
# Elemets of the cloud such as virtual servers,
# networks, firewall rules are created as resources
# syntax is: resource RESOURCE_TYPE RESOURCE_NAME
# https://www.terraform.io/docs/configuration/resources.html

###########  Frontend Servers   #############
# This method creates as many identical instances as the "count" index value
resource "google_compute_instance" "frontend" {
    count = 2
    name = "frontend${count.index+1}"
    machine_type = var.GCP_MACHINE_TYPE
    zone = var.GCP_ZONE

    boot_disk {
        initialize_params {
        # image list can be found at:
        # https://console.cloud.google.com/compute/images
        image = "ubuntu-2004-focal-v20230918"
        }
    }

    network_interface {
        network = "default"
        access_config {
        }
    }

    metadata = {
      ssh-keys = "ubuntu:${file("/home/vagrant/.ssh/id_rsa.pub")}"
    }
  tags = ["frontend"]
}


###########  Load Balancer   #############
resource "google_compute_instance" "balancer" {
    count = 3
    name = "balancer${count.index+1}"
    machine_type = var.GCP_MACHINE_TYPE
    zone = var.GCP_ZONE

    boot_disk {
        initialize_params {
        # image list can be found at:
        # https://console.cloud.google.com/compute/images
        image = "ubuntu-2004-focal-v20230918"
        }
    }

    network_interface {
        network = "default"
        access_config {
        }
    }

    metadata = {
      ssh-keys = "ubuntu:${file("/home/vagrant/.ssh/id_rsa.pub")}"
    }

  tags = ["balancer"]
}

###########  List   #############
resource "google_compute_instance" "list" {
    count = 2
    name = "list${count.index+1}"
    machine_type = var.GCP_MACHINE_TYPE
    zone = var.GCP_ZONE

    boot_disk {
        initialize_params {
        # image list can be found at:
        # https://console.cloud.google.com/compute/images
        image = "ubuntu-2004-focal-v20230918"
        }
    }

    network_interface {
        network = "default"
        access_config {
        }
    }

    metadata = {
      ssh-keys = "ubuntu:${file("/home/vagrant/.ssh/id_rsa.pub")}"
    }

  tags = ["list"]
}


###########  item   #############
resource "google_compute_instance" "item" {
    count = 2
    name = "item${count.index+1}"
    machine_type = var.GCP_MACHINE_TYPE
    zone = var.GCP_ZONE

    boot_disk {
        initialize_params {
        # image list can be found at:
        # https://console.cloud.google.com/compute/images
        image = "ubuntu-2004-focal-v20230918"
        }
    }

    network_interface {
        network = "default"
        access_config {
        }
    }

    metadata = {
      ssh-keys = "ubuntu:${file("/home/vagrant/.ssh/id_rsa.pub")}"
    }

  tags = ["item"]
}


###########  monitor   #############
resource "google_compute_instance" "monitor" {
    name = "monitor"
    machine_type = var.GCP_MACHINE_TYPE
    zone = var.GCP_ZONE

    boot_disk {
        initialize_params {
        # image list can be found at:
        # https://console.cloud.google.com/compute/images
        image = "ubuntu-2004-focal-v20230918"
        }
    }

    network_interface {
        network = "default"
        access_config {
        }
    }

    metadata = {
      ssh-keys = "ubuntu:${file("/home/vagrant/.ssh/id_rsa.pub")}"
    }

  tags = ["monitor"]
}

###########  databases   #############
resource "google_compute_instance" "database" {
    count = 2
    name = "database${count.index+1}"
    machine_type = var.GCP_MACHINE_TYPE
    zone = var.GCP_ZONE

    boot_disk {
        initialize_params {
        # image list can be found at:
        # https://console.cloud.google.com/compute/images
        image = "ubuntu-2004-focal-v20230918"
        }
    }

    network_interface {
        network = "default"
        access_config {
        }
    }

    metadata = {
      ssh-keys = "ubuntu:${file("/home/vagrant/.ssh/id_rsa.pub")}"
    }

  tags = ["database"]
}

resource "local_file" "ansible_inventory" {
  content = templatefile("inventory.template", {
    balancer_names = google_compute_instance.balancer[*].name,
    balancer_ips = google_compute_instance.balancer[*].network_interface.0.access_config.0.nat_ip,
    list_names = google_compute_instance.list[*].name,
    list_ips = google_compute_instance.list[*].network_interface.0.access_config.0.nat_ip,
    item_names = google_compute_instance.item[*].name,
    item_ips = google_compute_instance.item[*].network_interface.0.access_config.0.nat_ip,
    frontend_names = google_compute_instance.frontend[*].name,
    frontend_ips = google_compute_instance.frontend[*].network_interface.0.access_config.0.nat_ip,
    database_names = google_compute_instance.database[*].name,
    database_ips = google_compute_instance.database[*].network_interface.0.access_config.0.nat_ip,
    monitor_name = google_compute_instance.monitor.name,
    monitor_ip = google_compute_instance.monitor.*.network_interface.0.access_config.0.nat_ip
  })
  filename = "inventory"
}