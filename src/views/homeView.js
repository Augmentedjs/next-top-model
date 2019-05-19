import { DirectiveView } from "presentation-decorator";
import ControlPanelView from "./controlView.js";
import { PANEL, VALIDATE, RESET, GENERATE } from "../messages.js";
import Application from "../application/application.js";
import { prettyPrint } from "next-core-utilities";
import { Model } from "presentation-models";
import { SchemaGenerator } from "next-core-validation";

const MOUNT_POINT = "#main";

const SCHEMA_FIELD = "schema",
MODEL_FIELD = "model";

class HomeView extends DirectiveView {
  constructor() {
    super({
      "el": MOUNT_POINT,
      "name": "homeview",
      "style": "view",
      "customEvents": {
        "change textarea#schema": (event) => {
          const m = event.target;
          if (m) {
            try {
              const data = JSON.parse(m.value);
              console.debug("data", data);
              this._dataModel.schema = data;
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
              this._dataModel.reset(data);
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
      <form id="topmodel">
        <div>
          <label for="schema">JSON Schema (Draft 4)</label>
          <textarea data-${this.name}="${SCHEMA_FIELD}" id="schema"></textarea>
        </div>
        <div>
          <label for="model">Model JSON Data</label>
          <textarea data-${this.name}="${MODEL_FIELD}" id="model"></textarea>
        </div>
        <p data-${this.name}="message" class="message" id="message"></p>
        <div id="controlpanel" class="controlpanel"></div>
      </form>
    `;

    this._control = new ControlPanelView();

    this.on(PANEL, (message) => {
      if (message === VALIDATE) {
        const model = this.model.get("model");
        const schema = this.model.get("schema");
        if (model && schema) {
          this._dataModel.reset(model);
          this._dataModel.schema = schema
          this.model.set("message", `Model is ${ (this._dataModel.isValid()) ? "valid": "not valid" }.`);
        } else {
          this.model.set("message", `Missing requirements to validate.`);
        }
      } else if (message === RESET) {
        this.model.set("schema", "");
        this.model.set("model", "");
        this.model.set("message", "Reset");
      } else if (message === GENERATE) {
        const model = this.model.get("model");
        if (model) {
          const schema = prettyPrint( SchemaGenerator(model) );
          console.log(schema);
          this.model.set("schema", schema);
          this.model.set("message", `Generated schema from model.`);
        } else {
          this.model.set("message", `Missing requirements to generate.`);
        }
      }
    });
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
