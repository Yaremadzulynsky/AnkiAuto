#!/bin/bash

# This script searches for files in a specified directory that match a given regex pattern.

# Check if an argument (the regex pattern) was provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 regex_pattern"
    exit 1
fi

# The first argument is the regex pattern to search for
REGEX_PATTERN=$1

# Define the directory to search in. Replace <Provide directory here...> with the actual directory path.
# You can also modify this script to accept the directory as an additional argument if needed.
DIRECTORY="<Provide directory here...>"

# Use the 'find' command to search recursively within the specified directory and pipe the results into 'grep' to filter by the regex pattern.
find "$DIRECTORY" -type f | grep "$REGEX_PATTERN"
