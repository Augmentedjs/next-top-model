import { Notification } from "presentation-components";
import ErrorDialog from "../../components/errorDialog.js";
import MessageDialog from "../../components/messageDialog.js";

export const displayErrorMessage = async (message, context) => {
  if (context.messageDialog) {
    await context.messageDialog.remove();
    context.messageDialog = null;
  }
  context.messageDialog = new ErrorDialog({ "body": message });
  await context.messageDialog.render();
};
export const displayNotification = async (message, title, context) => {
  if (context.notify) {
    await context.notify.remove();
    context.notify = null;
  }
  context.notify = new Notification({
    "body": message,
    "title": title
  });
  await context.notify.render();
};
export const displayMessage = async (message, title, context) => {
  if (context.messageDialog) {
    await context.messageDialog.remove();
    context.messageDialog = null;
  }
  context.messageDialog = new MessageDialog({
    "body": message,
    "title": title
  });
  await context.messageDialog.render();
};
