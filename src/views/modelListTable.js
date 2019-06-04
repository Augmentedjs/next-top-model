import { AutomaticTable } from "presentation-table";
import MODELS from "../schemas/models.js";
import {
  PANEL,
  REMOVE_SELECTED_MODELS,
  REMOVE_MODELS
} from "../messages.js";

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
    		"wholeRow": true
      }
    });

    this.on(PANEL, (message) => {
      try {
        if (message === REMOVE_SELECTED_MODELS) {
          const selected = this.getSelected();
          // TODO: this is broken in the table
          this.removeRows(selected);
          this.sendMessage(REMOVE_MODELS, this.getSelectedAsJSON());
        }
      } catch(e) {
        console.error(e);
        this.showMessage(e);
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
		return `/#models/${row["identifier"]}`;
  };
};

export default ModelListTable;
