const generateSchema = (model) => {
  const schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": (model.title) ? model.title : "Untitled",
    "description": (model.description) ? model.description : "",
    "type": "object",
    "properties": {}
  }
  let i = 0;
  const l = model.properties.length;
  const required = [];
  for (i; i < l; i++) {
    const prop = model.properties[i];
    schema.properties[prop.name] = {
      "description": prop.name,
      "type": prop.type
    }
    if (prop.min && prop.min !== "") {
      if (prop.type === "string") {
        schema.properties[prop.name].minLength = prop.min;
      } else if (prop.type === "number") {
        schema.properties[prop.name].minimum = prop.min;
      } else if (prop.type === "array") {
        schema.properties[prop.name].minItems = prop.min;
      }
    }
    if (prop.max && prop.max !== "") {
      if (prop.type === "string") {
        schema.properties[prop.name].maxLength = prop.max;
      } else if (prop.type === "number") {
        schema.properties[prop.name].maximum = prop.max;
      } else if (prop.type === "array") {
        schema.properties[prop.name].maxItems = prop.max;
      }
    }
    if (prop.regex && prop.regex !== "") {
      if (prop.type === "string") {
        schema.properties[prop.name].pattern = prop.regex;
      }
    }
    if (prop.required) {
      required.push(prop.name);
    }
  }
  schema.required = required;
  return schema;
};

export default generateSchema;
