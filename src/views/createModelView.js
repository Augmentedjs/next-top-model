import { DirectiveView } from "presentation-decorator";

const MOUNT_POINT = "#main";

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
        <label for="name">Name (inside)
          <input data-${this.name}="name" type="text" name="name" id="name"/>
        </label>
        <label for="nameo">Name (outside)</label>
        <input data-${this.name}="nameo" type="text" name="nameo" id="nameo"/>
        
      </form>
    `;
  };

  async render() {
    await super.render();
    this.syncBoundElement("name");
    //this.delegateEvents();
    return this;
  };

  async remove() {
    return super.remove();
  };
};

export default CreateModelView;
