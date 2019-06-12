import { DirectiveView } from "presentation-decorator";
import Application from "../application/application.js";
import { prettyPrint } from "next-core-utilities";
import { Model } from "presentation-models";
import { SchemaGenerator } from "next-core-validation";
import ControlPanelView from "./controlView.js";
import { PANEL, VALIDATE, RESET, GENERATE } from "../messages.js";

const MOUNT_POINT = "#main",
      SCHEMA_FIELD = "schema",
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
              this.message = "Updated schema.";
              m.setAttribute("class", "good");
              this.model.set("schema", prettyPrint(data));
            } catch(e) {
              this.message = "Could Not parse schema!";
              m.setAttribute("class", "bad");
            }
          }
        },
        "change textarea#model": (event) => {
          const m = event.target;
          if (m) {
            try {
              const data = JSON.parse(m.value);
              this.message = "Updated model data.";
              m.setAttribute("class", "good");
              this.model.set("model", prettyPrint(data));
            } catch(e) {
              this.message = "Could Not parse model data!";
              m.setAttribute("class", "bad");
            }
          }
        }
      }
    });

    this.template = `
      <h1>Manual Entry</h1>
      <form id="${this.name}">
        <div>
          <label for="${SCHEMA_FIELD}">JSON Schema (Draft 4)</label>
          <textarea data-${this.name}="${SCHEMA_FIELD}" id="${SCHEMA_FIELD}"></textarea>
        </div>
        <div>
          <label for="${MODEL_FIELD}">Model JSON Data</label>
          <textarea data-${this.name}="${MODEL_FIELD}" id="${MODEL_FIELD}"></textarea>
        </div>
        <p data-${this.name}="message" class="message" id="message"></p>
        <div id="controlpanel" class="controlpanel"></div>
      </form>
    `;

    this._control = new ControlPanelView();

    this.on(PANEL, (message) => {
      try {
        if (message === VALIDATE) {
          this._validate();
        } else if (message === RESET) {
          this._reset();
        } else if (message === GENERATE) {
          this._generate();
        }
      } catch(e) {
        this.message = "Could Not parse model data!";
      }
    });
  };

  set message(message) {
    return this.model.set("message", message);
  };

  _validate() {
    const model = this.model.get("model");
    const schema = this.model.get("schema");
    if (model && schema) {
      const dataModel = new Model();
      dataModel.reset(model);
      dataModel.schema = schema
      this.message = `Model is ${ (dataModel.isValid()) ? "valid": "not valid" }.`;
    } else {
      this.message = "Missing requirements to validate.";
    }
    return this;
  };

  _reset() {
    this.model.set("schema", "");
    this.model.set("model", "");
    this.message = "Reset";
    return this;
  };

  _generate() {
    const model = this.model.get("model");
    if (model) {
      const obj = JSON.parse(model);
      const schema = prettyPrint( SchemaGenerator(obj) );
      this.model.set("schema", schema);
      this.message = "Generated schema from model.";
    } else {
      this.message = "Missing requirements to generate.";
    }
    return this;
  };

  async render() {
    await super.render();
    this.syncModelChange("schema");
    this.syncModelChange("model");
    this.syncModelChange("message");
    await this.delegateEvents();
    await this._control.render();
    Application.mediator.observeColleagueAndTrigger(this._control, PANEL, this._control.name);
    return this;
  };

  async remove() {
    Application.mediator.dismissColleagueTrigger(this._control, PANEL, this._control.name);
    await this._control.remove();
    this._control = null;
    return super.remove();
  };
};

export default HomeView;
