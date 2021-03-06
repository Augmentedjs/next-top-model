import { DirectiveView } from "presentation-decorator";
import Dom from "presentation-dom";
import { SAVE_UPDATED_MODEL, NAVIGATION, DISPLAY_ERROR_MESSAGE } from "../messages.js";
import parseModel from "./functions/parseModel.js";

const MOUNT_POINT = "#main",
      PROPERTY_LIST = "props",
      MODEL_FORM = "model_form";

class EditModelView extends DirectiveView {
  constructor(model) {
    super({
      "el": MOUNT_POINT,
      "name": "editmodelview",
      "style": "view"
    });
    this._props = 0;
    if (model) {
      this.template = `
        <h1>Edit Model</h1>
        <form id="${MODEL_FORM}" name="${MODEL_FORM}">
          <label>Title
            <input data-${this.name}="title" type="text" name="title" required="required" value="${model.title}"/>
          </label>
          <label>Description
            <textarea data-${this.name}="desc" name="description" class="small">${model.description}</textarea>
          </label>
          <label for="${PROPERTY_LIST}">Properties</label>
          <ul id="${PROPERTY_LIST}" class="props">
            ${this._addProperties(model)}
          </ul>
        </form>
        <div id="controlpanel" class="controlpanel">
          <button data-${this.name}="save" data-click="save" class="primary">Save</button>
          <button data-${this.name}="add" data-click="add">Add Property</button>
          <button data-${this.name}="rem" data-click="rem">Remove Properties</button>
          <button data-${this.name}="cancel" data-click="cancel">Cancel</button>
        </div>
      `;
    } else {
      this.template = `
        <h1>Edit Model</h1>
        <p class="red">Problem loading model</p>
        <div id="controlpanel" class="controlpanel">
          <button data-${this.name}="cancel" data-click="cancel">Cancel</button>
        </div>
      `;
    }
  };

  async cancel(e) {
    e.preventDefault();
    this.sendMessage(NAVIGATION, "home");
    return false;
  };

  async save(e) {
    e.preventDefault();
    const data = {};
    const form = await this._formdata;
    if (form) {
      await form.forEach((value, key) => { data[key] = value });
      const model = await parseModel(data);
      //console.debug("data", data, "model", model);
      this.sendMessage(SAVE_UPDATED_MODEL, model);
    } else {
      this.sendMessage(DISPLAY_ERROR_MESSAGE,
        "These is a problem with the form, please correct before creating.");
    }
    return false;
  };

  async rem(e) {
    e.preventDefault();
    if (this._formdata) {
      const selected = await this._formdata.getAll("select");
      if (selected) {
        const l = selected.length;
        let i = 0;
        for (i; i < l; i++) {
          const prop = document.getElementById(selected[i]);
          if (prop) {
            prop.parentNode.removeChild(prop);
          }
        }
      }
    }
    return false;
  };

  async add(e) {
    e.preventDefault();
    const list = Dom.selector(`#${PROPERTY_LIST}`);
    if (list) {
      this._addProperty(list);
    }
    return false;
  };

  get _formdata() {
    const form = document.getElementById(MODEL_FORM);
    let formdata = null;
    if (form) {
      const isValidForm = form.checkValidity();
      if (isValidForm) {
        formdata = new FormData(form);
      }
    }
    return formdata;
  };

  _addProperties(model) {
    if (!model || !model.properties) {
      return "";
    }
    const keys = model.properties, l = keys.length;
    let i = 0;
    let markup = "";
    for(i; i < l; i++) {
      //console.log("property", i, model.properties[i]);
      markup += `<li id="prop_${this._props}">`;
      markup += this._createPropertyMarkup(model.properties[i]);
      markup += "</li>\n";
      this._props++;
    }
    //console.log(markup);
    return markup;
  };

  _createPropertyMarkup(model) {
    /*if (!model) {
      throw new Error("What the!!??");
    }*/
    const markup = `
      <input type="checkbox" name="select" value="prop_${this._props}"/>
      <label>Type
        <select name="type_${this._props}" required="required">
          <option value="string" ${(model && model.type === "string") ? "selected=\"selected\"" : ""}>String</option>
          <option value="number" ${(model && model.type === "number") ? "selected=\"selected\"" : ""}>Number</option>
          <option value="array" ${(model && model.type === "array") ? "selected=\"selected\"" : ""}>Array</option>
        </select>
      </label>
      <label>Name
        <input type="text" name="name_${this._props}" placeholder="Name" required="required" value="${(model && model.name) ? model.name : ""}"/>
      </label>
      <label>Min
        <input type="number" name="min_${this._props}" min="0" class="hidden" value="${(model && model.min) ? model.min : ""}"/>
      </label>
      <label>Max
        <input type="number" name="max_${this._props}" min="0" class="hidden" value="${(model && model.max) ? model.max : ""}"/>
      </label>
      <label>Regex
        <input type="type" name="regex_${this._props}" value="${(model && model.regex) ? model.regex : ""}"/>
      </label>
      <label class="required">
        <input type="checkbox" name="required_${this._props}" ${(model && model.required) ? "checked=\"checked\"" : ""}/>
        Required
      </label>
    `;
    return markup;
  };

  async _addProperty(el, model) {
    const li = document.createElement("li");
    li.id = `prop_${this._props}`;
    li.innerHTML = await this._createPropertyMarkup(model);
    await el.append(li);
    this._props++;
  };

  async removeprop(e) {
    await e.preventDefault();
    const list = Dom.selector(`#${PROPERTY_LIST}`);
    const item = e.target.parentNode;
    if (list && item) {
      await list.removeChild(item);
    }
    return false;
  };

  async render() {
    await super.render();
    this.delegateEvents();
    return this;
  };

  async remove() {
    return super.remove();
  };
};

export default EditModelView;
