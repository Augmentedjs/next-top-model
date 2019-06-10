const MODELS = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Models List",
  "description": "A list of models.",
  "type": "object",
  "properties": {
    "identifier": {
      "description": "Identifier",
      "type" : "string"
    },
    "title": {
      "description": "Title",
      "type" : "string"
    },
    "description": {
      "description": "Description",
      "type" : "string"
    }
  }
};

export default MODELS;
