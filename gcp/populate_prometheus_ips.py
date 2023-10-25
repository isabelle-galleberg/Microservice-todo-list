import jinja2
import re

prometheus_yml_path = "./monitoring/prometheus/prometheus.yml.j2"
prometheus_template_path = "./monitoring/prometheus/prometheus_template.yml.j2"
inventory_path = "inventory"

port_mapping = {
    "frontend": "5173",
    "list": "3000",
    "item": "3000",
    "database": "27017",
    "monitor": "9090", #not sure
    "balancer": "80" #missing
}


def extract_ips_from_inventory():
    with open(inventory_path, "r") as file:
        lines = file.readlines()

    hosts = {}
    for line in lines:
        if "ansible_host=" in line:
            split_line = line.split()
            name = re.split(r'(\d+)', split_line[0])
            host_type = name[0] if len(name) > 1 else split_line[0]  # Get the host type or the full name if there's no number
            ip = split_line[1].split('=')[1]
            port = port_mapping.get(host_type, "3000")  # Default to 3000 if not found
            hosts[split_line[0]] = f"{ip}:{port}"
            
    return hosts

if __name__ == "__main__":
    hosts = extract_ips_from_inventory()

    with open(prometheus_template_path, "r") as file:
        template_content = file.read()

    template = jinja2.Template(template_content)
    prom_config = template.render(hosts=hosts)

    with open(prometheus_yml_path, "w") as file:
        file.write(prom_config)
