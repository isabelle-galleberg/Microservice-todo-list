#!/bin/bash

# Define the process name to check
PROCESS_NAME="mongod"

# Check if the process is running
if ! pgrep -x "$PROCESS_NAME" > /dev/null
then
    # Process is not running, start it directly
    mongod --config /etc/mongod.conf
fi