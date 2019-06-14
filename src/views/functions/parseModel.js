const DELIMETER = "_";

const parseModel = async (data) => {
  //console.debug("passed form", data);
  const model = {
    "title": data.title,
    "description": data.description
  },
  propMap = {};

  model.identifier = await data.title.replace(/[^0-9a-z]/gi, "_").toLowerCase();
  // add properties
  await Object.keys(data).forEach( (key) => {
    if (key === "title" || key === "description") {
      return;
    }
  	const value = (data[key]);
    const keyAndIndex = key.split(DELIMETER);
    const prop = propMap[keyAndIndex[1]] || {};
    //console.debug("prop in form", prop);
    prop[keyAndIndex[0]] = value;
    propMap[keyAndIndex[1]] = prop;
  });
  model.properties = await Object.values(propMap);
  return model;
};

export default parseModel;
