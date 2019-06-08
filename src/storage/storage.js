import { LocalForage } from "presentation-forage-models";
import { STORAGE_KEY } from "../constants.js";
const MODELS = "top-model-models";

class Storage {
  constructor() {
    this.datastore = new LocalForage({
      "name": STORAGE_KEY,
      "storeName": STORAGE_KEY
    });
    this._cache = null;
  };

  async save(model) {
    if (model) {
      let models;
      if (!this._cache) {
        models = await this.datastore.getItem(MODELS);
      } else {
        models = this._cache;
      }

      if (!models) {
        models = {};
      }
      models[model.identifier] = model;
      //Logger.debug("models", models);
      await this.datastore.setItem(MODELS, models);
      this._cache = models;
      return model;
    }
    return null;
  };

  async clear() {
    await this.datastore.setItem(MODELS, {});
    this._cache = null;
    return 0;
  };

  async remove(rem) {
    Logger.debug(`Remove these ${JSON.stringify(rem)}`);
    let models;
    if (!this._cache) {
      models = this.datastore.getItem(MODELS);
    } else {
      models = this._cache;
    }

    if (Array.isArray(rem)) {
      let i = 0;
      const l = rem.length;
      for (i; i < l; i++) {
        models[rem[i].identifier] = null;
      }
    } else {
      models[rem.identifier] = null;
    }
    await this.datastore.setItem(MODELS, models);
    this._cache = models;

    /*
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
    await Logger.debug(`new ones ${JSON.stringify(newModels)}`);*/
    return rem.length;
  };

  get models() {
    let models;
    if (!this._cache) {
      models = this.datastore.getItem(MODELS);
    } else {
      models = this._cache;
    }
    return models;
  };

  getModel(identifier) {
    let models;
    if (!this._cache) {
      models = this.datastore.getItem(MODELS);
    } else {
      models = this._cache;
    }
    return models[identifier];
  };

  setModel(model) {
    let models;
    if (!this._cache) {
      models = this.datastore.getItem(MODELS);
    } else {
      models = this._cache;
    }
    models[model.identifier] = model;
    return model;
  };
};

export default Storage;
