import { DialogView } from "presentation-components";

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

  ok(event) {
    this.close(event);
  };

  schemas(event) {
    this.close(event);
  };

  both(event) {
    this.close(event);
  };
};

export default ExportConfirmDialog;
