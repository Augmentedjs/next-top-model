import { Mediator as BaseMediator } from "presentation-mediator";
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
  TABLE_REFRESH
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
      saveAndShow(model);
    });

    this.on(SAVE_UPDATED_MODEL, (model) => {
      saveAndShow(model);
    });

    this.on(REMOVE_SELECTED_MODELS, () => {
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
      .then( () => {
        //Application.navigate("home");
        mediator.publish(PANEL, TABLE_REFRESH, TABLE_REFRESH);
        return true;
      })
      .catch( (e) => {
        Logger.error(e);
      });
    });

    this.on(EXPORT_SELECTED_MODELS, () => {
      this.publish(PANEL, `${TABLE_GET_SELECTED_MODELS}_${EXPORT_SELECTED_MODELS}`);
    });

    this.on(EXPORT_MODELS, (models) => {
      Logger.debug(`Export Models ${JSON.stringify(models)}`);
      const dialog = new ExportConfirmDialog();
      dialog.render();
    });
  };

  displayErrorMessage(message) {
    displayErrorMessage(message, this);
  };
};

export default Mediator;
