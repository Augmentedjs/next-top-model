const DELIMETER = "_";

const parseModel = async (data) => {
  //console.debug("passed form", data);
  const model = {
    "title": data.title,
    "description": data.description,
    "properties": []
  };

  model.identifier = await data.title.replace(/[^0-9a-z]/gi, "_").toLowerCase();

  // add properties
  await Object.keys(data).forEach( (key) => {
    if (key === "title" || key === "description") {
      return;
    }
  	const value = (data[key]);
    const keyAndIndex = key.split(DELIMETER);
    const prop = model.properties[keyAndIndex[1]] || {};
    prop[keyAndIndex[0]] = value;
    model.properties[keyAndIndex[1]] = prop;
  });

  return model;
};

export default parseModel;
