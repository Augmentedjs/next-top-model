import JSZip from "jszip";
import FileSaver from "file-saver";
import { prettyPrint } from "next-core-utilities";
import Logger from "../logger/logger.js";

const saveExport = async (json) => {
  try {
    if (json) {
      const zip = new JSZip();
      const filenames = await Object.keys(json), l = filenames.length;
      console.debug("filenames",filenames);
      let i = 0;

      for (i; i < l; i++) {
        const str = (typeof json[filenames[i]] === "string") ? json[filenames[i]] : prettyPrint(json[filenames[i]]);
        console.debug(str);
        await zip.file(filenames[i], str);
      }

      return await zip.generateAsync({type:"blob"})
      .then( (blob) => {
          const result =
                `exported.zip`.
                split(" ").
                join("");
          FileSaver.saveAs(blob, result);
          return result;
      });
    }
  } catch(e) {
    Logger.error(e);
  }
  return false;
};

export default saveExport;
