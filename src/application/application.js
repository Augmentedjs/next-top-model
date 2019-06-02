import { Application as BaseApplication } from "presentation-application";
import Router from "../router/router.js";
import Logger from "../logger/logger.js";
import * as CONSTANTS from "../constants.js";
import serialize from "presentation-router";
import AboutDialog from "../components/aboutDialog.js";

const getPlace = (where, options) => {
  return (options) ? `${where}?${serialize(options)}` : where;
};

class Application extends BaseApplication {
  constructor() {
    super(CONSTANTS.APP_NAME);
    this.router = new Router();
    this.title = CONSTANTS.APP_NAME;
    this._models = [];
  };

  navigate(where, options) {
    if (this.router && where) {
      this.router.navigate(getPlace(where, options), { "trigger": true });
    }
  };

  launch(where, options) {
    if (this.router && where) {
      this.router.navigate(getPlace(where, options), { "trigger": false });
    }
  };

  about() {
    const view = new AboutDialog();
    view.render();
  };

  saveModel(model) {
    if (model) {
      this._models.push(model);
    }
    return this._models.length;
  };

  clearModels() {
    this._models.length = 0;
    return 0;
  };

  removeModels(models) {
    if (models && models.length > 0 && this._models) {
      let i = 0;
      let newModels = this._models;
      const l = models.length;
      for(i; i < l; i++) {
        newModels = newModels.filter(m => m.identifier !== models[i].identifier);
      }
      this._models = newModels;
    }
    return true;
  };

  get models() {
    return this._models;
  };
};

const app = new Application();

export default app;
