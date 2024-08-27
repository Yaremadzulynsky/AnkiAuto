import { KeyValPair } from "./KeyValPair";
import { Matcher } from "./Matcher";
import { KeyPostProcessor, ValuePostProcessor } from "./Processor";

/**
 * The Parser class is responsible for extracting key-value pairs from text using
 * regular expressions and applying post-processing steps to the extracted keys and values.
 */
export class Parser {
  /**
   * Regular expression to match definitions in the text.
   * It captures keys and values based on specific patterns.
   */
  matchDefinitions = /\\d (.*?)(:)((.|\n)+?)\\e/g;

  /**
   * Array of Matcher instances used to apply different regex patterns on the text.
   */
  matchers: Matcher[] = [new Matcher(this.matchDefinitions, 1, 3)];

  /**
   * Array of KeyPostProcessor instances used to clean and format the extracted keys.
   */
  keyProcessors: KeyPostProcessor[] = [
    new KeyPostProcessor((key: string) => {
      let replaced = key.replace(/(\*)/g, "");
      return replaced.trim();
    }),
    new KeyPostProcessor((key: string) => {
      let replaced = key.replace(/(^-)/g, "");
      return replaced.trim();
    }),
    new KeyPostProcessor((key: string) => {
      let replaced = key.replace(/(\d*\. )/g, "");
      return replaced.trim();
    }),
  ];

  /**
   * Array of ValuePostProcessor instances used to clean and format the extracted values.
   */
  valueProcessors: ValuePostProcessor[] = [
    new ValuePostProcessor((val: string) => val.trim()),
  ];

  /**
   * Parses the provided text, extracts key-value pairs using matchers, and optionally
   * processes the results to clean and format the keys and values.
   * @param text - The text to parse for key-value pairs.
   * @param processResult - Boolean indicating whether to process the results using the post-processors.
   * @returns An array of KeyValPair objects containing the extracted and processed key-value pairs.
   */
  parse(text: string, processResult: boolean = true): KeyValPair[] {
    let keyValPairs: KeyValPair[] = [];

    // Apply each matcher to the text to extract key-value pairs
    this.matchers.forEach((matcher) => {
      const matches = matcher.apply(text);

      // Remove any matches that contain non-ASCII characters or certain unwanted characters
      for (let i = 0; i < matches.length; i++) {
        if (
          /[^\x00-\x7F]/.test(matches[i].key) ||
          /[^\x00-\x7F]/.test(matches[i].val) ||
          /[{]/.test(matches[i].val) ||
          /[]/.test(matches[i].val)
        ) {
          matches.splice(i, 1);
          i--;
        }
      }

      // If processing is enabled, apply key and value post-processors
      if (processResult) {
        this.keyProcessors.forEach((processor) => {
          matches.forEach((keyValPair) => {
            keyValPair.key = processor.process(keyValPair.key);
          });
        });
        this.valueProcessors.forEach((processor) => {
          matches.forEach((keyValPair) => {
            keyValPair.val = processor.process(keyValPair.val);
          });
        });
      }

      // Add the processed matches to the final list of key-value pairs
      keyValPairs.push(...matches);
    });

    return keyValPairs;
  }
}
