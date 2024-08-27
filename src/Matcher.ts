import { KeyValPair } from "./KeyValPair";

/**
 * The Matcher class is used to extract key-value pairs from a given string content
 * based on a regular expression. The key and value are extracted using the specified
 * capture group indices.
 */
export class Matcher {
  regExp: RegExp;
  keyCaptureGroupIndex: number;
  valueCaptureGroupIndex: number;

  /**
   * Creates an instance of Matcher.
   * @param regExp - The regular expression used to match and extract key-value pairs.
   * @param keyCaptureGroupIndex - The index of the capture group in the regex that corresponds to the key.
   * @param valueCaptureGroupIndex - The index of the capture group in the regex that corresponds to the value.
   */
  constructor(
    regExp: RegExp,
    keyCaptureGroupIndex: number,
    valueCaptureGroupIndex: number
  ) {
    this.keyCaptureGroupIndex = keyCaptureGroupIndex;
    this.valueCaptureGroupIndex = valueCaptureGroupIndex;
    this.regExp = regExp;
  }

  /**
   * Applies the regular expression to the provided content and extracts key-value pairs.
   * The keys and values are extracted based on the specified capture group indices.
   * @param content - The string content to apply the regex on.
   * @returns An array of KeyValPair objects, each containing a key and a corresponding value.
   */
  apply(content: string): KeyValPair[] {
    const keyValPairs: KeyValPair[] = [];

    let match;
    // Iterate over all matches in the content
    while ((match = this.regExp.exec(content)) !== null) {
      const key = match[this.keyCaptureGroupIndex].trim();
      const definition = match[this.valueCaptureGroupIndex].trim();
      keyValPairs.push(new KeyValPair(key, definition));
    }

    return keyValPairs;
  }
}
