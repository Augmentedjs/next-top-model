import { Application as BaseApplication } from "presentation-application";
import { LocalForage } from "presentation-forage-models";
import Router from "../router/router.js";
import Logger from "../logger/logger.js";
import { APP_NAME, STORAGE_KEY } from "../constants.js";
import serialize from "presentation-router";
import AboutDialog from "../components/aboutDialog.js";

const MODELS = "top-model-models";

class Application extends BaseApplication {
  constructor() {
    const options = {
      "name": APP_NAME,
      "router": new Router()
    };

    super(options);
    this.title = APP_NAME;
    this.datastore = new LocalForage({
      "name": STORAGE_KEY,
      "storeName": STORAGE_KEY
    });
  };

  about() {
    if (!this._about) {
      this._about = new AboutDialog();
    }
    this._about.render();
  };

  async saveModel(model) {
    if (model) {
      let models = await this.datastore.getItem(MODELS);
      if (!models || !Array.isArray(models)) {
        models = [];
      }
      models.push(model);
      //Logger.debug("models", models);
      await this.datastore.setItem(MODELS, models);
      return models.length;
    }
  };

  async clearModels() {
    let models = await this.datastore.getItem(MODELS);
    models.length = 0;
    await this.datastore.setItem(MODELS, models);
    return 0;
  };

  async removeModels(models) {
    Logger.debug(`Remove these ${JSON.stringify(models)}`);
    let l = 0, newModels = [];
    if (models && models.length > 0 && this.datastore) {
      let i = 0;
      newModels = await this.datastore.getItem(MODELS);
      l = models.length;
      for(i; i < l; i++) {
        newModels = await newModels.filter(m => m.identifier !== models[i].identifier);
      }
      await this.datastore.setItem(MODELS, newModels);
    }
    await Logger.debug(`new ones ${JSON.stringify(newModels)}`);
    return l;
  };

  get models() {
    return this.datastore.getItem(MODELS);
  };
};

const app = new Application();

export default app;
