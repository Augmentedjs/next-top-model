import { AutomaticTable } from "presentation-table";
import MODELS from "../schemas/models.js";
import Logger from "../logger/logger.js";
import {
  PANEL,
  REMOVE_SELECTED_MODELS,
  REMOVE_MODELS,
  TABLE_GET_SELECTED_MODELS,
  EXPORT_SELECTED_MODELS,
  EXPORT_MODELS,
  TABLE_REFRESH,
  SCHEMAS_ONLY,
  SCHEMAS_AND_MODELS
} from "../messages.js";
import Application from "../application/application.js";

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
      "display": ["identifier", "title", "description"],
      "style": "material models",
      "linkable": true,
    	"links": {
    		"column": "identifier",
    		"link": "rowLink",
    		"wholeRow": true
      },
      "messagePosition": "top"
    });

    this.on(PANEL, (message) => {
      try {
        if (message === REMOVE_SELECTED_MODELS) {
          const selected = this.getSelected();
          // TODO: this is broken in the table
          if (selected && selected.length > 0) {
            //this.removeRows(selected);
            this.sendMessage(REMOVE_MODELS, this.getSelectedAsJSON());
          } else {
            this.showMessage("Please select something to delete.");
          }
        } else if (message === `${TABLE_GET_SELECTED_MODELS}_${EXPORT_SELECTED_MODELS}`) {
          const selected = this.getSelected();
          //Logger.debug(`Table get selected ${selected}`);
          if (selected && selected.length > 0) {
            this.sendMessage(EXPORT_MODELS, this.getSelectedAsJSON());
          } else {
            this.showMessage("Please select something to export.");
          }
        } else if (message === TABLE_REFRESH) {
          const models = Application.datastore.models;
          this.populate(Object.values(models));
          this.render();
        } else if (message === `${TABLE_GET_SELECTED_MODELS}_${EXPORT_SELECTED_MODELS}${SCHEMAS_AND_MODELS}`) {
          const selected = this.getSelected();
          //Logger.debug(`Table get selected ${selected}`);
          if (selected && selected.length > 0) {
            this.sendMessage(`${EXPORT_MODELS}${SCHEMAS_AND_MODELS}`, this.getSelectedAsJSON());
          } else {
            this.showMessage("Please select something to export.");
          }
        } else if (message === `${TABLE_GET_SELECTED_MODELS}_${EXPORT_SELECTED_MODELS}${SCHEMAS_ONLY}`) {
          const selected = this.getSelected();
          //Logger.debug(`Table get selected ${selected}`);
          if (selected && selected.length > 0) {
            this.sendMessage(`${EXPORT_MODELS}${SCHEMAS_ONLY}`, this.getSelectedAsJSON());
          } else {
            this.showMessage("Please select something to export.");
          }
        }
      } catch(e) {
        Logger.error(e);
        this.showMessage(e);
      }
    });
  };

  rowLink(row) {
		return `#models/${row["identifier"]}`;
  };
};

export default ModelListTable;
