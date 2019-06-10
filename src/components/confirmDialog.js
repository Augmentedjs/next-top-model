import { ConfirmationDialogView } from "presentation-components";
import { CONFIRM_YES, CONFIRM_NO } from "../messages.js";

class ConfirmDialog extends ConfirmationDialogView {
  constructor(options) {
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
    console.debug("sent yes", `${CONFIRM_YES}${this.message}`);
    this.close(event);
  };

  no(event) {
    this.sendMessage(`${CONFIRM_NO}${this.message}`);
    console.debug("sent no", `${CONFIRM_NO}${this.message}`);
    this.close(event);
  };
};

export default ConfirmDialog;
