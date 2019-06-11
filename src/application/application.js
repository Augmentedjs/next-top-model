import { Application as BaseApplication } from "presentation-application";
import Router from "../router/router.js";
import { APP_NAME } from "../constants.js";
import AboutDialog from "../components/aboutDialog.js";
import Storage from "../storage/storage.js";
import generateSchema from "../utility/generateSchema.js";
import generateModel from "../utility/generateModel.js";
import saveExport from "../utility/saveExport.js";

class Application extends BaseApplication {
  constructor() {
    const options = {
      "name": APP_NAME,
      "router": new Router()
    };
    super(options);
    this.title = APP_NAME;
    this.datastore = new Storage();
  };

  about() {
    if (!this._about) {
      this._about = new AboutDialog();
    }
    this._about.render();
  };

  async exportSchemas(models) {
    const schemas = {};
    if (models) {
      let i = 0;
      const l = models.length;
      for (i; i < l; i++) {
        const model = await this.datastore.getModel(models[i].identifier);
        if (model) {
          const schema = await generateSchema(model);
          if (schema) {
            schemas[`./${model.identifier}_schema.js`] = schema;
          }
        }
      }
    }
    return schemas;
  };

  async exportModels(models) {
    const models_schemas = {};
    if (models) {
      let i = 0;
      const l = models.length;
      for (i; i < l; i++) {
        const model = await this.datastore.getModel(models[i].identifier);
        if (model) {
          const m = generateModel(model);
          const schema = generateSchema(model);
          if (schema) {
            models_schemas[`./${model.identifier}_schema.js`] = schema;
          }
          if (m) {
            models_schemas[`./${model.identifier}.js`] = m;
          }
        }
      }
    }
    return models_schemas;
  };

  async saveExport(json) {
    return await saveExport(json);
  };
};

const app = new Application();

export default app;
