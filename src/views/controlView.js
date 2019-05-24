import { DirectiveView } from "presentation-decorator";
import { PANEL, VALIDATE, RESET, GENERATE } from "../messages.js";

const MOUNT_POINT = "#controlpanel";

class ControlPanelView extends DirectiveView {
  constructor() {
    super({
      "el": MOUNT_POINT,
      "name": "controlview",
      "style": "view controlpanel"
    });
    this.template = `
      <button data-${this.name}="${VALIDATE}" data-click="validate" id="validate" class="primary">Validate</button>
      <button data-${this.name}="${RESET}" data-click="reset" id="reset">Reset</button>
      <button data-${this.name}="${GENERATE}" data-click="generate" id="generateSchema">Generate Schema</button>
    `;
  };

  async render() {
    await super.render();
    this.delegateEvents();
    return this;
  };

  validate(e) {
    e.preventDefault();
    this.sendMessage(VALIDATE, VALIDATE);
  };

  reset(e) {
    e.preventDefault();
    this.sendMessage(RESET, RESET);
  };

  generate(e) {
    e.preventDefault();
    this.sendMessage(GENERATE, GENERATE);
  };
};

export default ControlPanelView;
