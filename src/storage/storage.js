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
      await this.datastore.setItem(MODELS, models);
      this._cache = models;
      return model;
    }
    return null;
  };

  async clear() {
    await this.datastore.removeItem(MODELS);
    this._cache = null;
    return 0;
  };

  async remove(rem) {
    let models;
    if (!this._cache) {
      models = await this.datastore.getItem(MODELS);
    } else {
      models = this._cache;
    }

    if (Array.isArray(rem)) {
      let i = 0;
      const l = rem.length;
      for (i; i < l; i++) {
        await delete models[rem[i].identifier];
      }
    } else {
      await delete models[rem.identifier];
    }
    await this.datastore.setItem(MODELS, models);
    this._cache = models;
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
    return this.save(model);
  };
};

export default Storage;
