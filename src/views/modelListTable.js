import { AutomaticTable } from "presentation-table";
import MODELS from "../schemas/models.js";

const MOUNT_POINT = "#modelListTable";


class ModelListTable extends AutomaticTable {
  constructor(data) {
    super({
      "el": MOUNT_POINT,
      "name": "modellist",
      "title": "Model List",
      "schema": MODELS,
      "data": data,
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
