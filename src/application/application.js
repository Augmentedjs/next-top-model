import { Application as BaseApplication } from "presentation-application";
import Router from "../router/router.js";
import { APP_NAME } from "../constants.js";
import AboutDialog from "../components/aboutDialog.js";
import Storage from "../storage/storage.js";

class Application extends BaseApplication {
  constructor() {
    const options = {
      "name": APP_NAME,
      "router": new Router()
    };
    super(options);
    this.title = APP_NAME;
    this.datastore = new Storage();
  };

  about() {
    if (!this._about) {
      this._about = new AboutDialog();
    }
    this._about.render();
  };
};

const app = new Application();

export default app;
