import { Menu } from "presentation-navigation";
import { REMOVE_SELECTED_MODELS } from "../messages.js";

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
  };

  async removeselected(e) {
    console.debug("removeselected - click!!");
    this.sendMessage(REMOVE_SELECTED_MODELS);
  };
};

export default ControlPanel;
