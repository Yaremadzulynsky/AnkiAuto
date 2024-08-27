export type AnkiNote = {
  deckName: string;
  modelName: "Basic";
  fields: {
    Front: string;
    Back: string;
  };
};

export type AddNotesReq = {
  action: string;
  version: number;
  params: {
    notes: AnkiNote[];
  };
};

export type FindNotesReq = {
  action: string;
  version: number;
  params: {
    query: string;
  };
};

export type UpdateNoteFieldsReq = {
  action: string;
  version: number;
  params: {
    note: {
      id: number;
      fields: {
        Front: string;
        Back: string;
      };
    };
  };
};

export type CreateDeckReq = {
  action: string;
  version: number;
  params: {
    deck: string;
  };
};

export type DeckNamesReq = {
  action: string;
  version: number;
  params: {};
};
