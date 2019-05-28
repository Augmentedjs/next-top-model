import { DirectiveView } from "presentation-decorator";
import Dom from "presentation-dom";
import { ADD_CREATED_MODEL } from "../messages.js";

const MOUNT_POINT = "#main",
      PROPERTY_LIST = "props",
      MODEL_FORM = "model_form";

class CreateModelView extends DirectiveView {
  constructor() {
    super({
      "el": MOUNT_POINT,
      "name": "createmodelview",
      "style": "view"
    });

    this.template = `
      <h1>Create Model</h1>
      <form id="${MODEL_FORM}" name="${MODEL_FORM}">
        <label>Name
          <input data-${this.name}="name" type="text" name="name" required="required"/>
        </label>
        <label>Description
          <textarea data-${this.name}="desc" name="desc" class="small"></textarea>
        </label>
        <label for="${PROPERTY_LIST}">Properties</label>
        <ul id="${PROPERTY_LIST}" class="props">
        </ul>
      </form>
      <div id="controlpanel" class="controlpanel">
        <button data-${this.name}="create" data-click="create" class="primary">Create</button>
        <button data-${this.name}="add" data-click="add">Add Property</button>
        <button data-${this.name}="rem" data-click="rem">Remove Properties</button>
      </div>
    `;
    this._props = 0;
  };

  async create(e) {
    e.preventDefault();
    const formdata = this._formdata;
    this.sendMessage(ADD_CREATED_MODEL, formdata);
    return false;
  };

  get _formdata() {
    const form = document.getElementById(MODEL_FORM);
    let formdata = null;
    if (form) {
      formdata = new FormData(form);
      for(let pair of formdata.entries()) {
        console.log(pair[0]+ ', '+ pair[1]);
      }
    }
    return formdata;
  };

  async rem(e) {
    e.preventDefault();
    const formdata = this._formdata;
    if (formdata) {
      const selected = formdata.getAll("select");
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
      const li = document.createElement("li");
      li.id = `prop_${this._props}`;
      li.innerHTML = `
        <input type="checkbox" name="select" value="prop_${this._props}"/>
        <label>Type
          <select name="type" required="required">
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="array">Array</option>
          </select>
        </label>
        <label>Name
          <input type="text" name="name" placeholder="Name" required="required"/>
        </label>
        <label>Min
          <input type="number" name="min" min="0" class="hidden"/>
        </label>
        <label>Max
          <input type="number" name="max" min="0" class="hidden"/>
        </label>
        <label>Regex
          <input type="type" name="regex"/>
        </label>
      `;
      // const button = document.createElement("button");
      // button.dataset[this.name] = "removeprop";
      // button.dataset.click = "removeprop";
      // button.innerHTML = `<i class="material-icons md-dark">clear</i>`;
      // li.append(button);
      await list.append(li);
      this._props++;
    }
    return false;
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
