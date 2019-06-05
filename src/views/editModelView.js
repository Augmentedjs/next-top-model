import { DirectiveView } from "presentation-decorator";
import Dom from "presentation-dom";
import { ADD_CREATED_MODEL, NAVIGATION } from "../messages.js";

const MOUNT_POINT = "#main",
      PROPERTY_LIST = "props",
      MODEL_FORM = "model_form";

class CreateModelView extends DirectiveView {
  constructor(model) {
    super({
      "el": MOUNT_POINT,
      "name": "createmodelview",
      "style": "view"
    });

    this.template = `
      <h1>Edit Model</h1>
      <form id="${MODEL_FORM}" name="${MODEL_FORM}">
        <label>Title
          <input data-${this.name}="title" type="text" name="title" required="required" value="${model.title}"/>
        </label>
        <label>Description
          <textarea data-${this.name}="desc" name="desc" class="small">${model.desc}</textarea>
        </label>
        <label for="${PROPERTY_LIST}">Properties</label>
        <ul id="${PROPERTY_LIST}" class="props">
          ${addProperties()}
        </ul>
      </form>
      <div id="controlpanel" class="controlpanel">
        <button data-${this.name}="save" data-click="save" class="primary">Save</button>
        <button data-${this.name}="add" data-click="add">Add Property</button>
        <button data-${this.name}="rem" data-click="rem">Remove Properties</button>
        <button data-${this.name}="cancel" data-click="cancel">Cancel</button>
      </div>
    `;
    this._props = 0;
  };

  async cancel(e) {
    e.preventDefault();
    this.sendMessage(NAVIGATION, "home");
    return false;
  };

  async save(e) {
    e.preventDefault();
    const data = {};
    await this._formdata.forEach((value, key) => { data[key] = value });
    data.identifier = data.title.replace(/[^0-9a-z]/gi, "_").toLowerCase();
    //console.debug("data", data);
    this.sendMessage(ADD_CREATED_MODEL, data);
    return false;
  };

  get _formdata() {
    const form = document.getElementById(MODEL_FORM);
    let formdata = null;
    if (form) {
      formdata = new FormData(form);
    }
    return formdata;
  };

  async rem(e) {
    e.preventDefault();
    if (this._formdata) {
      const selected = this._formdata.getAll("select");
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

  async _addProperty(el, model) {
    const li = document.createElement("li");
    li.id = `prop_${this._props}`;
    li.innerHTML = `
      <input type="checkbox" name="select" value="prop_${this._props}"/>
      <label>Type
        <select name="type_${this._props}" required="required" value="${model.type}">
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="array">Array</option>
        </select>
      </label>
      <label>Name
        <input type="text" name="name_${this._props}" placeholder="Name" required="required" value="${model.name}"/>
      </label>
      <label>Min
        <input type="number" name="min_${this._props}" min="0" class="hidden" value="${model.min}"/>
      </label>
      <label>Max
        <input type="number" name="max_${this._props}" min="0" class="hidden" value="${model.max}"/>
      </label>
      <label>Regex
        <input type="type" name="regex_${this._props}" value="${model.regex}"/>
      </label>
      <label>
        <input type="checkbox" name="required_${this._props}" ${model.required ? "checked=\"checked\"" : ""}/>
        Required
      </label>
    `;
    await list.append(li);
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
    //this.syncBoundElement("name");
    //this.syncBoundElement("desc");
    this.delegateEvents();
    return this;
  };

  async remove() {
    return super.remove();
  };
};

export default CreateModelView;
