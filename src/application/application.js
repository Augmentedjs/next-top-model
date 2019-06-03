import { Application as BaseApplication } from "presentation-application";
import { LocalForage } from "presentation-forage-models";
import Router from "../router/router.js";
import Logger from "../logger/logger.js";
import * as CONSTANTS from "../constants.js";
import serialize from "presentation-router";
import AboutDialog from "../components/aboutDialog.js";

const MODELS = "top-model-models";

class Application extends BaseApplication {
  constructor() {
    const options = {
      "name": CONSTANTS.APP_NAME,
      "datastore": new LocalForage(),
      "router": new Router()
    };

    super(options);
    this.title = CONSTANTS.APP_NAME;
  };

  about() {
    if (!this._about) {
      this._about = new AboutDialog();
    }
    this._about.render();
  };

  saveModel(model) {
    let models = this.datastore.getItem(MODELS);
    if (!models) {
      models = [];
    }

    if (model && mode) {
      models.push(model);
    }
    this.datastore.setItem(MODELS, models);
    return models.length;
  };

  clearModels() {
    let models = this.datastore.getItem(MODELS);
    models.length = 0;
    this.datastore.setItem(MODELS, models);
    return 0;
  };

  removeModels(models) {
    if (models && models.length > 0 && this.datastore) {
      let i = 0;
      let newModels = this.datastore.getItem(MODELS);
      const l = models.length;
      for(i; i < l; i++) {
        newModels = newModels.filter(m => m.identifier !== models[i].identifier);
      }
      this.datastore.setItem(MODELS, models);
    }
    return l;
  };

  get models() {
    return this.datastore.getItem(MODELS);
  };
};

const app = new Application();

export default app;
