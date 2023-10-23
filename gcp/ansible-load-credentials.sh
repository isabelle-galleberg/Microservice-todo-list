#!/bin/bash
export GCE_PEM_FILE_PATH=./agisit-2324-website-16-c2a38c70de7c.json
export GCE_PROJECT=$(grep project_id $GCE_PEM_FILE_PATH | sed -e 's/  "project_id": "//g' -e 's/",//g')
export GCE_EMAIL=$(grep client_email $GCE_PEM_FILE_PATH | sed -e 's/  "client_email": "//g' -e 's/",//g')
gcloud config set project $GCE_PROJECT
