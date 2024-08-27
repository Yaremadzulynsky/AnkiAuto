/**
 * The Processor class provides a base for processing text through a user-defined
 * function. It serves as a foundation for more specific processors, such as
 * KeyPostProcessor and ValuePostProcessor.
 */
class Processor {
  processor: (text: string) => string;

  /**
   * Creates an instance of Processor.
   * @param processor - A function that takes a string as input and returns a processed string.
   */
  constructor(processor: (text: string) => string) {
    this.processor = processor;
  }

  /**
   * Applies the processing function to the given string.
   * @param key - The string to be processed.
   * @returns The processed string.
   */
  process(key: string): string {
    return this.processor(key);
  }
}

/**
 * The KeyPostProcessor class extends Processor to specifically handle
 * the post-processing of keys extracted during parsing. It inherits the
 * processing behavior defined in the Processor class.
 */
export class KeyPostProcessor extends Processor {}

/**
 * The ValuePostProcessor class extends Processor to specifically handle
 * the post-processing of values extracted during parsing. It inherits the
 * processing behavior defined in the Processor class.
 */
export class ValuePostProcessor extends Processor {}
