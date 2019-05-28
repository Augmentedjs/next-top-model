import { DirectiveView } from "presentation-decorator";
import Dom from "presentation-dom";

const MOUNT_POINT = "#main",
      PROPERTY_LIST = "props";

class CreateModelView extends DirectiveView {
  constructor() {
    super({
      "el": MOUNT_POINT,
      "name": "createmodelview",
      "style": "view"
    });

    this.template = `
      <h1>Create Model</h1>
      <form>
        <label>Name
          <input data-${this.name}="name" type="text" name="name"/>
        </label>
        <label>Description
          <textarea data-${this.name}="desc" name="desc" class="small"></textarea>
        </label>
        <label for="${PROPERTY_LIST}">Properties</label>
        <ul id="${PROPERTY_LIST}" class="properties">
        </ul>
      </form>
      <div id="controlpanel" class="controlpanel">
        <button data-${this.name}="add" data-click="add">Add Property</button>
      </div>
    `;
  };

  async add(e) {
    e.preventDefault();
    const list = Dom.selector(`#${PROPERTY_LIST}`);
    if (list) {
      const li = document.createElement("li");
      li.innerHTML = `
        <select>
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="array">Array</option>
        <select>
        <input name="title" placeholder="title" typew="text"/>
        <input name="min" placeholder="0" type="number" class="hidden"/>
        <input name="max" placeholder="1" type="number" min="1" class="hidden"/>
        <input name="regex" placeholder="regex" type="text" class="hidden"/>
        <label>
          <input name="required" type="checkbox"/>
          Required
        </label>
      `;
      const button = document.createElement("button");
      button.dataset[this.name] = "remove";
      button.dataset.click = "removeprop";
      button.innerHTML = `<i class="material-icons md-dark">clear</i>`;
      li.append(button);
      await list.append(li);

    }
    return this;
  };

  async removeprop(e) {
    e.preventDefault();
    const list = Dom.selector(`#${PROPERTY_LIST}`);
    const item = e.target.parentNode;
    if (list && item) {
      await list.removeChild(item);
      this.delegateEvents();
    }
    return this;
  };

  async render() {
    await super.render();
    this.syncBoundElement("name");
    this.syncBoundElement("desc");
    this.delegateEvents();
    return this;
  };

  async remove() {
    return super.remove();
  };
};

export default CreateModelView;
