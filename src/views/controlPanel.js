import { Menu } from "presentation-navigation";
import { REMOVE_SELECTED_MODELS, EXPORT_SELECTED_MODELS } from "../messages.js";

const MOUNT_POINT = "#control";

class ControlPanel extends Menu {
  constructor() {
    super({
      "el": MOUNT_POINT,
      "name": "controlpanel"
    });

    this.addItem(
      "removeselected",
      "removeselected",
      "clear",
      "Delete"
    );

    this.addItem(
      "exportselected",
      "exportselected",
      "save",
      "Export"
    );
  };

  async removeselected(e) {
    this.sendMessage(REMOVE_SELECTED_MODELS);
  };

  async exportselected(e) {
    this.sendMessage(EXPORT_SELECTED_MODELS);
  };
};

export default ControlPanel;
