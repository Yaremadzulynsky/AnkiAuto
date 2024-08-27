#!/bin/bash

# This script compiles TypeScript files, filters a list of files using a specified pattern,
# and then passes the filtered file list to a Node.js program for further processing.

# Compile TypeScript files using the TypeScript compiler (tsc)
tsc

# Run the filter.sh script to generate a list of files matching the specified pattern.
# The pattern used in the filter.sh script can be customized. The output is stored in the fileList variable.
fileList=$("./filter.sh" ".*")
# Alternatively, uncomment the following line to filter files using a different pattern (e.g., files in a /Notes directory).
# fileList=$("./filter.sh" "/Notes")

# Call the Node.js program with the filtered file list as an argument.
# The JavaScript program (Entrypoint.js) is executed, and the file list is passed as a parameter.
node "./bin/Entrypoint.js" "$fileList"
