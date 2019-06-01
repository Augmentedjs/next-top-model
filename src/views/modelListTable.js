import { AutomaticTable } from "presentation-table";
import MODELS from "../schemas/models.js";
import { PANEL, REMOVE_SELECTED_MODELS } from "../messages.js";

const MOUNT_POINT = "#modelListTable";

class ModelListTable extends AutomaticTable {
  constructor(data) {
    super({
      "el": MOUNT_POINT,
      "name": "modellist",
      "title": "Model List",
      "schema": MODELS,
      "data": data,
      "selectable": true,
      "sortable": true,
      "display": null,
      "style": "material",
      "linkable": true,
    	"links": {
    		"column": "identifier",
    		"link": "rowLink",
    		"wholeRow": false
      }
    });

    this.on(PANEL, (message) => {
      try {
        if (message === REMOVE_SELECTED_MODELS) {
          const selected = this.getSelected();
          console.debug("selected", selected);
        }
      } catch(e) {
        console.debug(e);
        //this.message = e.getMessage();
      }
    });
  };

  render() {
    return super.render();
  };

  remove() {
    return super.remove();
  };

  rowLink(row) {
		return `/#${row["type"]}s/${row["identifier"]}`;
  };
};

export default ModelListTable;
