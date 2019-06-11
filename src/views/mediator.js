import { Mediator as BaseMediator } from "presentation-mediator";

import Application from "../application/application.js";

import ExportConfirmDialog from  "../components/exportConfirmDialog.js";
import ConfirmDialog from  "../components/confirmDialog.js";
import Logger from "../logger/logger.js";
import * as MESSAGES from "../messages.js";
import { displayErrorMessage, displayNotification, displayMessage } from "./functions/mediation.js";

export const saveAndShow = async (model) => {
  await Application.datastore.save(model);
  await Application.navigate("home");
  return true;
};

class Mediator extends BaseMediator {
  constructor() {
    super({
      "name": "appmediator"
    });

    this.on(MESSAGES.DISPLAY_ERROR_MESSAGE, (message) => {
      displayErrorMessage(message, this);
    });

    this.on(MESSAGES.DISPLAY_MESSAGE, (message, title) => {
      displayMessage(message, title, this);
    });

    this.on(MESSAGES.DISPLAY_NOTIFICATION, (message, title) => {
      displayNotification(message, title, this);
    });

    this.on(MESSAGES.NAVIGATION, (where) => {
      if (where) {
        Application.navigate(where);
      } else {
        Logger.warn("Can not navigate to nowhere.");
      }
    });

    this.on(MESSAGES.VALIDATE, (message) => {
      this.publish(MESSAGES.PANEL, MESSAGES.VALIDATE, message);
    });

    this.on(MESSAGES.RESET, (message) => {
      this.publish(MESSAGES.PANEL, MESSAGES.RESET, message);
    });

    this.on(MESSAGES.GENERATE, (message) => {
      this.publish(MESSAGES.PANEL, MESSAGES.GENERATE, message);
    });

    this.on(MESSAGES.CREATE_MODEL, () => {
      Application.navigate("createmodel");
    });

    this.on(MESSAGES.ADD_CREATED_MODEL, (model) => {
      displayNotification("Model Added!", "Add Model", this);
      saveAndShow(model);
    });

    this.on(MESSAGES.SAVE_UPDATED_MODEL, (model) => {
      displayNotification("Model Updated!", "Update Model", this);
      saveAndShow(model);
    });

    this.on(MESSAGES.REMOVE_SELECTED_MODELS, () => {
      const dialog = new ConfirmDialog({"message": MESSAGES.DELETE, "body": "Do you wish to deleted the selected models?"});
      dialog.render();
      this.observeColleagueAndTrigger(dialog, MESSAGES.PANEL, dialog.name);
    });

    this.on(`${MESSAGES.CONFIRM_YES}${MESSAGES.DELETE}`, (model) => {
      this.publish(MESSAGES.PANEL, MESSAGES.REMOVE_SELECTED_MODELS, MESSAGES.REMOVE_SELECTED_MODELS);
    });

    this.on(MESSAGES.REMOVE_MODELS, (models) => {
      const mediator = this;
      return new Promise( (resolve, reject) => {
        const l = Application.datastore.remove(models);
        if (l) {
          resolve(l);
        } else {
          reject(0);
        }
      })
      .then( (changes) => {
        if (changes && changes > 0) {
          mediator.publish(MESSAGES.PANEL, MESSAGES.TABLE_REFRESH, MESSAGES.TABLE_REFRESH);
        }
        return true;
      })
      .then( () => {
        displayNotification("Deleted Models!", "Delete", this);
      })
      .catch( (e) => {
        Logger.error(e);
      });
    });

    this.on(MESSAGES.EXPORT_SELECTED_MODELS, () => {
      const dialog = new ExportConfirmDialog();
      dialog.render();
      this.observeColleagueAndTrigger(dialog, MESSAGES.PANEL, dialog.name);
    });

    this.on(MESSAGES.CONFIRM_EXPORT_SCHEMAS_ONLY, (models) => {
      this.publish(MESSAGES.PANEL, `${MESSAGES.TABLE_GET_SELECTED_MODELS}_${MESSAGES.EXPORT_SELECTED_MODELS}${MESSAGES.SCHEMAS_ONLY}`);
    });

    this.on(MESSAGES.CONFIRM_EXPORT_SCHEMAS_AND_MODELS, (models) => {
      this.publish(MESSAGES.PANEL, `${MESSAGES.TABLE_GET_SELECTED_MODELS}_${MESSAGES.EXPORT_SELECTED_MODELS}${MESSAGES.SCHEMAS_AND_MODELS}`);
    });

    this.on(`${MESSAGES.EXPORT_MODELS}${MESSAGES.SCHEMAS_ONLY}`, (models) => {
      displayNotification("Exported Models!", "Export", this);
      //Logger.debug(`Export Models ${JSON.stringify(models)}`);
      const process = new Promise( (resolve, reject) => {
        const json = Application.exportSchemas(models);
        if (json) {
          resolve(json);
        } else {
          reject("Problem exporting");
        }
      })
      .then( (json) => {
        return Application.saveExport(json);
      })
      .catch( (e) => {
        displayNotification(e, "Export", this);
      });
    });

    this.on(`${MESSAGES.EXPORT_MODELS}${MESSAGES.SCHEMAS_AND_MODELS}`, (models) => {
      displayNotification("Exported Models!", "Export", this);
      const process = new Promise( (resolve, reject) => {
        const json = Application.exportModels(models);
        if (json) {
          resolve(json);
        } else {
          reject("Problem exporting");
        }
      })
      .then( (json) => {
        return Application.saveExport(json);
      })
      .catch( (e) => {
        displayNotification(e, "Export", this);
      });
      //Logger.debug(`Export Models ${JSON.stringify(models)}`);
    });
  };

  displayErrorMessage(message) {
    displayErrorMessage(message, this);
  };
};

export default Mediator;
