const generateModel = (model) => {
  let modelClass = `
    import { Model } from "presentation-models";
    import SCHEMA from "./${model.identifier}_schema.js";

    class ${model.className} extends Model {
      constructor(data, options) {
        options.schema = SCHEMA;
        super(data, options);
      };
    };

    export default ${model.className};
  `;
  return modelClass;
};

export default generateModel;
