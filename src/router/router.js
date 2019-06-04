import Logger from "../logger/logger.js";
import Application from "../application/application.js";
import { Router as BaseRouter } from "presentation-router";
import { PANEL } from "../messages.js";

// views
import HomeView from "../views/homeView.js";
import ManualView from "../views/manualView.js";
import CreateModelView from "../views/createModelView.js";
import EditModelView from "../views/editModelView.js";

const TRANSITION = {
  "in": 250,
  "out": 250
};

const loadViewAndObserve = async (router, view) => {
  await router.loadView(view);
  await Application.mediator.observeColleagueAndTrigger(view, PANEL, view.name);
};

const loadHome = async (router) => {
  const models = await Application.models;
  loadViewAndObserve(router, new HomeView(models));
  return router;
};

const loadEditModel = async (router) => {
  const models = await Application.models;
  const model = models[0];
  loadViewAndObserve(router, new EditModelView(model));
  return router;
};

class Router extends BaseRouter {
  constructor() {
    super({
      "transition": TRANSITION,
      "routes": {
        "": () => {
          return loadHome(this);
        },
        "home": () => {
          return loadHome(this);
        },
        "manual": () => {
          loadViewAndObserve(this, new ManualView());
          return this;
        },
        "createmodel": () => {
          loadViewAndObserve(this, new CreateModelView());
          return this;
        },
        "models/:id": () => {
          return loadEditModel(this);
        }
      }
    });
  };

  cleanup() {
    if (this.view) {
      Application.mediator.dismissColleagueTrigger(this.view, PANEL, this.view.name);
    }
    return super.cleanup();
  }
};

export default Router;
