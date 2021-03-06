import { ConfirmationDialogView } from "presentation-components";
import { CONFIRM_YES, CONFIRM_NO, DELETE } from "../messages.js";

class ConfirmDeleteDialog extends ConfirmationDialogView {
  constructor(options) {
    if (!options) {
      options = {};
    };
    options.message = DELETE;
    options.body = "Do you wish to deleted the selected models?";
    options.el = "#dialogs";
    options.style = "alert";
    super(options);
    if (options.message) {
      this.message = options.message;
    } else {
      this.message = "";
    }
  };

  yes(event) {
    this.sendMessage(`${CONFIRM_YES}${this.message}`);
    this.close(event);
  };

  no(event) {
    this.sendMessage(`${CONFIRM_NO}${this.message}`);
    this.close(event);
  };
};

export default ConfirmDeleteDialog;
