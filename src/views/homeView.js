import { DirectiveView } from "presentation-decorator";
import ControlPanelView from "./controlView.js";
import { PANEL, VALIDATE, RESET, GENERATE } from "../messages.js";
import Application from "../application/application.js";
import { prettyPrint } from "next-core-utilities";
import Model from "presentation-models";

const MOUNT_POINT = "#main";

const SCHEMA_FIELD = "schema",
      MODEL_FIELD = "model";

class HomeView extends DirectiveView {
  constructor() {
    super({
      "el": MOUNT_POINT,
      "name": "homeview",
      "style": "view",
      "events": {
        "change textarea#schema": (event) => {
          const m = event.target;
          if (m) {
              try {
                  const data = JSON.parse(m.value);
                  this.dataModel.schema = data;
                  this.model.set("message", "Updated schema.");
                  m.setAttribute("class", "good");
                  this.model.set("schema", prettyPrint(data));
              } catch(e) {
                  this.model.set("message", "Could Not parse schema!");
                  m.setAttribute("class", "bad");
              }
          }
        },
        "change textarea#model": (event) => {
          const m = event.target;
          if (m) {
              try {
                  const data = JSON.parse(m.value);
                  this.dataModel.reset(data);
                  this.model.set("message", "Updated model data.");
                  m.setAttribute("class", "good");
                  //m.value = prettyPrint(data);
                  this.model.set("model", prettyPrint(data));
              } catch(e) {
                  this.model.set("message", "Could Not parse model data!");
                  m.setAttribute("class", "bad");
              }
          }
        }
      }
    });

    this._dataModel = new Model();

    this.template = `
      <form>
        <div>
          <label for="schema">JSON Schema (Draft 4)</label>
          <textarea data-${this.name}="${SCHEMA_FIELD}" id="schema" data-func="_pretty"></textarea>
        </div>
        <div>
          <label fr="model">Model JSON Data</label>
          <textarea data-${this.name}="${MODEL_FIELD}" id="model" data-func="_pretty"></textarea>
        </div>
        <p data-${this.name}="message" class="message" id="message"></p>
        <div id="controlpanel" class="controlpanel"></div>
      </form>
    `;

    this._control = new ControlPanelView();

    this.on(PANEL, (message) => {
      if (message === VALIDATE) {
        this.model.set("message", this.model.toString());
      } else if (message === RESET) {

      } else if (message === GENERATE) {

      }
    });
  };

  async _pretty(what) {
    let ret = null;
    if (what) {
      console.debug("what", what);
      console.debug("model", this.model.toString());
      const current = await this.model.get(what);
      console.debug("current", current);
      const pretty = await prettyPrint(current);
      console.debug("pretty", pretty);
      ret = await this.model.set(what, pretty);
    }
    return ret;
  };

  async render() {
    await super.render();
    //this.syncBoundElement(SCHEMA_FIELD);
    //this.syncBoundElement(MODEL_FIELD);
    this.syncModelChange("schema");
    this.syncModelChange("model");
    this.syncModelChange("message");
    await this.delegateEvents();
    await this._control.render();
    Application.mediator.observeColleagueAndTrigger(this._control, PANEL, this._control.name);
    return this;
  };

  async remove() {
    await this._control.remove();
    this._control = null;
    return super.remove();
  };
};

export default HomeView;
