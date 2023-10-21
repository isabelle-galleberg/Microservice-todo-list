# AGISIT 23: Microservice-Based To-Do List

## Authors - Group 16
| Number | Name               |				
| -------|--------------------|
| 108702 | Isabelle Galleberg |
| 108703 | Ådne Svendsrud     |
| 108444 | Tilde Eriksen Eine | 

## Table of Contents
1. [Application](#Application)
3. [Architecture](#Architecture)
4. [Services](#Services)
5. [Kubernetes Components](#Kubernetes-Components)
6. [Build and Deploy](#Build-and-Deploy)
7.  [License](#License)


## Application
Our application is a stimple To-Do list, designed as a microservice-based containerized web application. The frontend is written using Svelte, while the core operations are served by microservices as follows:

1. **Expressed list service** - Handles adding/removing of items (Express.js)
2. **Expressed item service** - Manages checking/unchecking of items (Express.js)
3. **MongoDB service** - Backend service for storage and retrieval of To-Do list items.
4. **Svelte frontend service** - Visualization for our To-Do list connected to the Expressed API functions.


_Expressed_ is a REST API-based implementation which our serves basic To-Do list functions as APIs to the frontend and database. We have two Expressed services:
1. **List service** - Adding/removing items to/from list
2. **Item service** - Checking/unchecking an item

_MongoDB_ serves as a backend service that handles the storage and retrieval of To-Do list items, provided to it via the Expressed APIs. 

The _Svelte_ service is a frontend application designed in Svelte.js. It functions as the visualization for our To-Do list, and is connected to the Expressed API functions.  

## Architecture 
Our microservice-based architecture ensures scalability and performance. 

Here's a basic outline:

1. **Frontend:** Developed in Svelte.js, providing a sleek, fast, and user-friendly interface.
2. **Backend Services:** Consists of two Expressed services handling operations of our To-Do list.
3. **Database:** MongoDB, responsible for persisting our list data.


**Data flow:**
1. Users interact with the Svelte frontend.
2. Requests go through the Expressed services.
3. Any data operation will then be persisted or retrieved from MongoDB.


The complete architecture of this implementation is as follows:

![Architecture](./report/assets/architecture.png)
WORKING: [DRAW.IO](https://drive.google.com/file/d/1YTpFg0gd-9eK2pGvSjLzb5hUPA-y5P1c/view?usp=share_link)

We chose to build our cluster using GKE. 

## Services
| Service                         | Language      |Description                                                          |
| ------------------------------- | ------------- | ------------------------------------------------------------------- |
| [frontend](/microservices/frontend/)    | Svelte        | Renders and displays a simple To Do list, with the option to input a new item, remove an item, or check/uncheck an item.  |
| [itemservice](/microservices/itemservice/)  | Express.js | Checks/unchecks items and stores status in users' To Do list in MongoDB. |
| [listservice](/microservices/listservice/) | Express.js | Adds and removes items from To Do list in MongoDB according to users' actions.   |
| [databaseservice](/microservices/databaseservice/) | MongoDB | Persistent storage for users' To Do list items. |

## Kubernetes components

## Build and Deploy
### Prerequisites
Tools/Software:
1. Vagrant: Download [here](https://developer.hashicorp.com/vagrant/downloads)
2. VirtualBox: Download [here](https://www.virtualbox.org/wiki/Downloads)
3. VirtualBox Extension Pack: Should be installed after installing VirtualBox.
4. Terraform: Download [here](https://developer.hashicorp.com/terraform/downloads)
5. Shell environment with **gcloud**, **git** and **kubectl**


Accounts:
- **Google Cloud Platform (GCP)**: Ensure you have an active GCP account with billing enabled.

Environment Setup:
1. Log in to Google Cloud Platform.
2. Navigate to the **Google Compute Engine** and enable its API.

### Configuration
1. Clone the project repository to your local machine.
```
git clone https://gitlab.rnl.tecnico.ulisboa.pt/agisit/agisit23-g16.git
```
2. Navigate to the root directory of the project
```
cd agisit23-g16
```
1. In the root directory of the project, run the following commands:

```
vagrant up
vagrant ssh project-mgmt
```

4. Upload the exported GCP Service Account **'.json'** key to the **'terraform'** files directory.

5. Navigate to the gcpcloud folder and open the file **'terraform-gcp-variables.tf'**.

6. Replace the placeholder values with your specific GCP configurations.







## License
For open source projects, say how it is licensed.
