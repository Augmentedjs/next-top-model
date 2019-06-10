import { DialogView } from "presentation-components";
import { CONFIRM_EXPORT_SCHEMAS_ONLY, CONFIRM_EXPORT_SCHEMAS_AND_MODELS } from "../messages.js";

class ExportConfirmDialog extends DialogView {
  constructor() {
    super({
      "el": "#dialogs",
      "buttons": {
        "Schemas Only": "schemas",
        "Both": "both",
        "Cancel": "cancel"
      },
      "style": "form confirm",
      "title": "Confirm Export",
      "body": `Do you wish to export <em class="underline">Schemas only</em> or <em class="underline">Schemas and Models?</em>`
    });
  };

  schemas(event) {
    this.sendMessage(CONFIRM_EXPORT_SCHEMAS_ONLY);
    this.close(event);
  };

  both(event) {
    this.sendMessage(CONFIRM_EXPORT_SCHEMAS_AND_MODELS);
    this.close(event);
  };
};

export default ExportConfirmDialog;
