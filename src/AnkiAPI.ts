import { DeckNamesReq, FindNotesReq, AnkiNote, AddNotesReq, CreateDeckReq, UpdateNoteFieldsReq } from "./Types";

/**
 * The Anki class provides methods to interact with AnkiConnect, allowing for the
 * management of Anki decks, notes, and fields through HTTP requests.
 */
export class Anki {
  location: string = "http://localhost:8765";
  autoDeckName: string = "Auto Notes";

  /**
   * Ensures that a deck with the specified name exists. If the deck does not exist,
   * it will be created.
   * @param deckName - The name of the deck to ensure exists.
   */
  async ensureDeckExists(deckName: string) {
    const deckNames = await this.getDeckNames();
    if (deckNames && !deckNames.includes(deckName)) {
      console.log(`Deck "${deckName}" does not exist. Creating it now...`);
      await this.createDeck(deckName);
    } else {
      console.log(`Deck "${deckName}" already exists.`);
    }
  }

  /**
   * Retrieves the names of all existing decks in Anki.
   * @returns A promise that resolves to an array of deck names, or undefined if an error occurs.
   */
  async getDeckNames(): Promise<string[] | undefined> {
    const requestBody: DeckNamesReq = {
      action: "deckNames",
      version: 6,
      params: {},
    };

    try {
      const response = await fetch(this.location, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.result; // This will be an array of deck names
    } catch (error) {
      console.error("Error getting deck names:", error);
    }
  }

  /**
   * Creates a new deck in Anki with the specified name.
   * @param deckName - The name of the deck to create.
   * @returns A promise that resolves to the response data from Anki, or undefined if an error occurs.
   */
  async createDeck(deckName: string) {
    const requestBody: CreateDeckReq = {
      action: "createDeck",
      version: 6,
      params: {
        deck: deckName,
      },
    };

    try {
      const response = await fetch(this.location, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Deck "${deckName}" created successfully.`);
      return data;
    } catch (error) {
      console.error("Error creating deck:", error);
    }
  }

  /**
   * Finds notes in Anki based on the provided query.
   * @param query - The search query to find specific notes.
   * @returns A promise that resolves to an array of note IDs, or undefined if an error occurs.
   */
  async findNotes(query: string): Promise<number[] | undefined> {
    const requestBody: FindNotesReq = {
      action: "findNotes",
      version: 6,
      params: {
        query,
      },
    };

    try {
      const response = await fetch(this.location, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.result; // This will be an array of note IDs
    } catch (error) {
      console.error("Error finding notes:", error);
    }
  }

  /**
   * Updates the fields of an existing note in Anki.
   * @param noteId - The ID of the note to update.
   * @param fields - The fields to update, typically containing 'Front' and 'Back' text.
   * @returns A promise that resolves to the response data from Anki, or undefined if an error occurs.
   */
  async updateNoteFields(
    noteId: number,
    fields: { Front: string; Back: string }
  ) {
    const requestBody: UpdateNoteFieldsReq = {
      action: "updateNoteFields",
      version: 6,
      params: {
        note: {
          id: noteId,
          fields,
        },
      },
    };

    try {
      const response = await fetch(this.location, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating note:", error);
    }
  }

  /**
   * Adds a new note to Anki or updates an existing note if a duplicate is found.
   * If a note with the same 'Front' field exists in the specified deck, it updates the existing note.
   * Otherwise, it adds the new note to the deck.
   * @param note - The AnkiNote object containing the note's data.
   * @returns A promise that resolves to the response data from Anki, or undefined if an error occurs.
   */
  async addOrUpdateNote(note: AnkiNote) {
    // Ensure there are no duplicate notes
    const query = `"deck:${note.deckName}" "Front:${note.fields.Front}"`;
    const existingNotes = await this.findNotes(query);

    if (existingNotes && existingNotes.length > 0) {
      // Update the existing note with new content
      const noteId = existingNotes[0]; // Assuming only one match, but could loop through if needed
      console.log(`Updating existing note with ID: ${noteId}`);
      return this.updateNoteFields(noteId, note.fields);
    } else {
      // Add the new note
      const requestBody: AddNotesReq = {
        action: "addNotes",
        version: 6,
        params: {
          notes: [note],
        },
      };

      try {
        const response = await fetch(this.location, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error adding note:", error);
      }
    }
  }
}
