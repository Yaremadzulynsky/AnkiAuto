import fs from "fs";
import { Parser } from "./Parser";
import { Anki } from "./AnkiAPI";

/**
 * Retrieves the list of file paths passed as an argument from the shell script.
 * The paths are expected to be passed as a newline-separated string.
 * @returns An array of file paths.
 */
function getFiles() {
  // Get the argument passed from the shell script
  const filesString = process.argv[2];

  // Split the string into an array of file paths
  const filePaths = filesString.split("\n");

  // Now you can process each file path
  return filePaths;
}

/**
 * Main function that processes each file, extracts key-value pairs using the Parser,
 * and adds or updates notes in Anki based on the parsed data.
 */
async function main() {
  const anki = new Anki();
  
  // Ensure the "Auto Deck" exists in Anki, or create it if it doesn't.
  await anki.ensureDeckExists("Auto Deck");

  // Initialize the parser instance.
  let parser: Parser = new Parser();

  // Retrieve the file paths to process.
  const filePaths = getFiles();

  // Iterate over each file path and process the content.
  for (const filePath of filePaths) {
    // Read the file content as a UTF-8 string.
    const data = fs.readFileSync(filePath, "utf8");

    // Parse the file content to extract key-value pairs.
    for (let keyValPair of parser.parse(data)) {
      // Add or update the note in Anki based on the parsed key-value pair.
      await anki.addOrUpdateNote({
        deckName: "Auto Deck",
        modelName: "Basic",
        fields: {
          Back: keyValPair.val,
          Front: keyValPair.key,
        },
      });
    }
  }
}

// Execute the main function.
main();
