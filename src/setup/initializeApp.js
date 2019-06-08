import Mediator from "../views/mediator.js";
import Article from "../components/article.js";
import Header from "../components/header.js";
import Application from "../application/application.js";
import HamburgerMenu from "../components/hamburger.js";
import { HEADER, FONT } from "../constants.js";
import Logger from "../logger/logger.js";

const initializeApp = async () => {
  try {

    // TODO: remove this (cooking data)
    /*let i = 0;
    for (i; i < 10; i++) {
      await Application.datastore.save({
        "title": `Test${i}`,
        "desc": `Test Model ${i}`,
        "type_0": "string",
        "name_0": "name",
        "type_1": "string",
        "name_1": "address",
        "identifier": `test${i}`
      });
    }*/

    Application.registerStylesheet(FONT.BUTTONS);

    Application.mediator = new Mediator();
    if (!Application.mediator) {
      throw new Error("Error creating mediator!");
    }

    Application.mediator.article = new Article();
    if (!Application.mediator.article) {
      throw new Error("Error creating mediator!");
    }

    Application.mediator.header = new Header();
    if (!Application.mediator.header) {
      throw new Error("Error creating header!");
    }

    Application.mediator.menu = new HamburgerMenu();
    if (!Application.mediator.menu) {
      throw new Error("Error creating hamburger menu!");
    }

    let view = await Application.mediator.article.render();
    if (!view) {
      throw new Error("Error creating mediator!");
    }

    view = await Application.mediator.header.render();
    if (!view) {
      throw new Error("Error creating header!");
    }

    view = await Application.mediator.menu.render();
    if (!view) {
      throw new Error("Error rendering hamburger menu!");
    }

    Application.mediator.observeColleagueAndTrigger(Application.mediator.article, "article", HEADER);
    Application.mediator.observeColleagueAndTrigger(Application.mediator.header, "header", HEADER);
    Application.mediator.observeColleagueAndTrigger(Application.mediator.menu, "menu", HEADER);
    if (!Application.mediator.channels) {
      throw new Error("Error observing views!");
    }

    const p = await Application.start();
    if (!p) {
      throw new Error("Error starting application!");
    }

  } catch(e) {
    const err = `Error initializing Application - ${e}`;
    Logger.error(e);
    throw new Error(err);
  }
};

export default initializeApp;
