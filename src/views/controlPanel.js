import { Menu } from "presentation-navigation";

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
};

export default ControlPanel;
