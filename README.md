# To-Do List Web Application
AGISIT 2023

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
Our application is a stimple To-Do list, designed as a microservice-based containerized web application. The frontend is written using Svelte, while the core operations (adding/removing, and checking/unchecking items), are served by the following microservices:
1. _Expressed_ list service, adding/removing (Express.js)
2. _Expressed_ item service, checking/unchecking (Express.js)
3. _MongoDB_ service (MongoDB)
4. _Svelte_  frontend service (Svelte.js)

_Expressed_ is a REST API-based implementation which our serves basic To-Do list functions as APIs to the frontend and database. We have two Expressed services:
1. **List service** - Adding/removing items to/from list
2. **Item service** - Checking/unchecking an item

_MongoDB_ serves as a backend service that handles the storage and retrieval of To-Do list items, provided to it via the Expressed APIs. 

The _Svelte_ service is a frontend application designed in Svelte.js. It functions as the visualization for our To-Do list, and is connected to the Expressed API functions.  

## Architecture 



## Services
### Svelte

### Expressed

### MongoDB

## Kubernetes components

## Build and Deploy
### Pre-Requisites

### Build


## License
For open source projects, say how it is licensed.
