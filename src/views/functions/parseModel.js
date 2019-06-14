const DELIMETER = "_";

const toTitleCase = async (phrase) => {
  return await phrase
    .replace(/[^a-z0-9]+/gi, "")
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const parseModel = async (data) => {
  //console.debug("passed form", data);
  const model = {
    "title": data.title,
    "description": data.description,
    "className": await toTitleCase(data.title)
  },
  propMap = {};

  model.identifier = await data.title.replace(/[^0-9a-z]/gi, "_").toLowerCase();
  // add properties
  await Object.keys(data).forEach( (key) => {
    if (key === "title" || key === "description") {
      return;
    }
    let value;
    if (key === "name") {
      value = (data[key]).replace(/[^a-z0-9 ]+/gi, "_").toLowerCase();
    } else {
      value = (data[key]);
    }

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
