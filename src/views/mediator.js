import { Mediator as BaseMediator } from "presentation-mediator";
import { Notification } from "presentation-components";
import ErrorDialog from "../components/errorDialog.js";
import MessageDialog from "../components/messageDialog.js";
import ExportConfirmDialog from  "../components/exportConfirmDialog.js";
import ConfirmDialog from  "../components/confirmDialog.js";
import Application from "../application/application.js";
import Logger from "../logger/logger.js";
import {
  DISPLAY_ERROR_MESSAGE,
  DISPLAY_MESSAGE,
  DISPLAY_NOTIFICATION,
  NAVIGATION,
  PANEL,
  VALIDATE,
  RESET,
  GENERATE,
  CREATE_MODEL,
  ADD_CREATED_MODEL,
  SAVE_UPDATED_MODEL,
  REMOVE_SELECTED_MODELS,
  EXPORT_SELECTED_MODELS,
  TABLE_GET_SELECTED_MODELS,
  REMOVE_MODELS,
  EXPORT_MODELS,
  TABLE_REFRESH,
  CONFIRM_YES,
  CONFIRM_NO,
  DELETE,
  CONFIRM_EXPORT_SCHEMAS_ONLY,
  CONFIRM_EXPORT_SCHEMAS_AND_MODELS,
  SCHEMAS_ONLY,
  SCHEMAS_AND_MODELS
} from "../messages.js";

const displayErrorMessage = async (message, context) => {
  if (context.messageDialog) {
    await context.messageDialog.remove();
    context.messageDialog = null;
  }
  context.messageDialog = new ErrorDialog({ "body": message });
  await context.messageDialog.render();
},
displayNotification = async (message, title, context) => {
  if (context.notify) {
    await context.notify.remove();
    context.notify = null;
  }
  context.notify = new Notification({
    "body": message,
    "title": title
  });
  await context.notify.render();
},
displayMessage = async (message, title, context) => {
  if (context.messageDialog) {
    await context.messageDialog.remove();
    context.messageDialog = null;
  }
  context.messageDialog = new MessageDialog({
    "body": message,
    "title": title
  });
  await context.messageDialog.render();
},
saveAndShow = async (model) => {
  await Application.datastore.save(model);
  await Application.navigate("home");
  return true;
};

class Mediator extends BaseMediator {
  constructor() {
    super({
      "name": "appmediator"
    });

    this.on(DISPLAY_ERROR_MESSAGE, (message) => {
      this.displayErrorMessage(message);
    });

    this.on(DISPLAY_MESSAGE, (message, title) => {
      displayMessage(message, title, this);
    });

    this.on(DISPLAY_NOTIFICATION, (message, title) => {
      displayNotification(message, title, this);
    });

    this.on(NAVIGATION, (where) => {
      if (where) {
        Application.navigate(where);
      } else {
        Logger.warn("Can not navigate to nowhere.");
      }
    });

    this.on(VALIDATE, (message) => {
      this.publish(PANEL, VALIDATE, message);
    });

    this.on(RESET, (message) => {
      this.publish(PANEL, RESET, message);
    });

    this.on(GENERATE, (message) => {
      this.publish(PANEL, GENERATE, message);
    });

    this.on(CREATE_MODEL, () => {
      Application.navigate("createmodel");
    });

    this.on(ADD_CREATED_MODEL, (model) => {
      displayNotification("Model Added!", "Add Model", this);
      saveAndShow(model);
    });

    this.on(SAVE_UPDATED_MODEL, (model) => {
      displayNotification("Model Updated!", "Update Model", this);
      saveAndShow(model);
    });

    this.on(REMOVE_SELECTED_MODELS, () => {
      const dialog = new ConfirmDialog({"message": DELETE, "body": "Do you wish to deleted the selected models?"});
      dialog.render();
      this.observeColleagueAndTrigger(dialog, PANEL, dialog.name);
    });

    this.on(`${CONFIRM_YES}${DELETE}`, (model) => {
      this.publish(PANEL, REMOVE_SELECTED_MODELS, REMOVE_SELECTED_MODELS);
    });

    this.on(REMOVE_MODELS, (models) => {
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
          mediator.publish(PANEL, TABLE_REFRESH, TABLE_REFRESH);
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

    this.on(EXPORT_SELECTED_MODELS, () => {
      const dialog = new ExportConfirmDialog();
      dialog.render();
      this.observeColleagueAndTrigger(dialog, PANEL, dialog.name);
      //this.publish(PANEL, `${TABLE_GET_SELECTED_MODELS}_${EXPORT_SELECTED_MODELS}`);
    });

    this.on(`${EXPORT_MODELS}${SCHEMAS_ONLY}`, (models) => {
      displayNotification("Exported Models!", "Export", this);
      Logger.debug(`Export Models ${JSON.stringify(models)}`);

    });

    this.on(`${EXPORT_MODELS}${SCHEMAS_AND_MODELS}`, (models) => {
      displayNotification("Exported Models!", "Export", this);
      Logger.debug(`Export Models ${JSON.stringify(models)}`);

    });

    this.on(CONFIRM_EXPORT_SCHEMAS_ONLY, (models) => {
      this.publish(PANEL, `${TABLE_GET_SELECTED_MODELS}_${EXPORT_SELECTED_MODELS}${SCHEMAS_ONLY}`);
    });

    this.on(CONFIRM_EXPORT_SCHEMAS_AND_MODELS, (models) => {
      this.publish(PANEL, `${TABLE_GET_SELECTED_MODELS}_${EXPORT_SELECTED_MODELS}${SCHEMAS_AND_MODELS}`);
    });
  };

  displayErrorMessage(message) {
    displayErrorMessage(message, this);
  };
};

export default Mediator;
