import { DirectiveView } from "presentation-decorator";
import { CREATE_MODEL } from "../messages.js";
import ModelListTable from "./modelListTable.js";
import ControlPanel from "./controlPanel.js";

const MOUNT_POINT = "#main";

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
      <div id="modelListTable"></div>
      <button data-${this.name}="createmodel" data-click="createmodel" title="Create Model" class="round bottom right"><i class="material-icons md-light">add</i></button>
    `;
    this.table = new ModelListTable(models);
    this.controls = new ControlPanel();
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
    return this;
  };

  async remove() {
    await this.table.remove();
    await this.controls.remove();
    return super.remove();
  };
};

export default HomeView;
