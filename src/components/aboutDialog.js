import { DialogView } from "presentation-components";
import { APP_NAME, AUTHOR } from "../constants.js";

class AboutDialog extends DialogView {
  constructor() {
    super({
      "el": "#dialogs",
      "buttons": {
        "cancel": "cancel"
      },
      "style": "bigForm about",
      "name": "about",
      "body": `
        <h2><em>Next</em> Top Model</h2>
        <h3>Version ${VERSION}</h3>
        <p>Design data models and contracts for use with Augmented.js Next
            applications or anything that uses models.
        </p>
        <p class="author">Written by ${AUTHOR}</p>
      `,
      "title": `About ${APP_NAME}`
    });
  };
};

export default AboutDialog;
