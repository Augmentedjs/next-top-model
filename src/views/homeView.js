import { DirectiveView } from "presentation-decorator";
import { CREATE_MODEL } from "../messages.js";
import Application from "../application/application.js";
import ModelListTable from "./modelListTable.js";
import ControlPanel from "./controlPanel.js";
import { PANEL } from "../messages.js";
import Logger from "../logger/logger.js";

const MOUNT_POINT = "#main",
build = async (view, models) => {
  try {
    //Logger.debug("Models", models);
    let list = (models) ? await Object.values(models) : [];
    if (!list) {
      list = [];
    }
    view.table = new ModelListTable(list);
    view.controls = new ControlPanel();
  } catch(e) {
    Logger.error(e);
  }
};

class HomeView extends DirectiveView {
  constructor(models) {
    super({
      "el": MOUNT_POINT,
      "name": "homeview",
      "style": "view"
    });

    this.template = `
      <h1>Models</h1>
      <div class="toolbar">
        <nav id="control"></nav>
      </div>
      <div id="modelListTable" class="container"></div>
      <button data-${this.name}="createmodel" data-click="createmodel" title="Create Model" class="round bottom right">
        <i class="material-icons md-light">add</i>
      </button>
    `;
    build(this, models);
  };

  createmodel(e) {
    e.preventDefault();
    this.sendMessage(CREATE_MODEL);
    return false;
  };

  async render() {
    await super.render();
    await this.controls.render();
    await this.table.render();
    this.delegateEvents();
    Application.mediator.observeColleagueAndTrigger(this.table, PANEL, this.table.name);
    Application.mediator.observeColleagueAndTrigger(this.controls, PANEL, this.controls.name);
    return this;
  };

  async remove() {
    await Application.mediator.dismissColleagueTrigger(this.controls, PANEL, this.controls.name);
    await Application.mediator.dismissColleagueTrigger(this.table, PANEL, this.table.name);
    await this.table.remove();
    await this.controls.remove();
    return super.remove();
  };
};

export default HomeView;
