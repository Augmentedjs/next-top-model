import JSZip from "jszip";
import FileSaver from "file-saver";
import { prettyPrint } from "next-core-utilities";

const saveExport = (json) => {
  if (json) {
    const zip = new JSZip();
    const filenames = Object.keys(json), l = filenames.length;
    let i = 0;

    for (i; i < l; i++) {
      const str = (typeof json[filenames[i]] === "string") ? json[filenames[i]] : prettyPrint(json[filenames[i]]);
      zip.file(filenames[i], str);
    }

    zip.generateAsync({type:"blob"})
    .then( (blob) => {
        const result =
              `exported.zip`.
              split(" ").
              join("");
        FileSaver.saveAs(blob, result);
    });
  }
  return true;
};

export default saveExport;
