import { HamburgerMenu as BaseHamburgerMenu } from "presentation-navigation";
import Application from "../application/application.js";
import { APP_NAME } from "../constants.js";

class HamburgerMenu extends BaseHamburgerMenu {
  constructor() {
    super({
      "el": "#menu",
      "name": "hamburger",
      "title": `${APP_NAME}`
    });

    this.addItem(
      "home",
      "home",
      "home",
      "Home"
    );

    this.addSpacer();

    this.addItem(
      "createmodel",
      "createmodel",
      "list",
      "Create Model"
    );

    this.addItem(
      "manual",
      "manual",
      "edit",
      "Manual Entry"
    );

    this.addSpacer();

    this.addItem(
      "about",
      "about",
      "help",
      "About"
    );
  };

  about() {
    Application.about();
    this.toggle();
  };

  home() {
    Application.navigate("home");
    this.toggle();
  };

  manual() {
    Application.navigate("manual");
    this.toggle();
  };

  createmodel() {
    Application.navigate("createmodel");
    this.toggle();
  };
};

export default HamburgerMenu;
