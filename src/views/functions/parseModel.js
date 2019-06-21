const DELIMETER = "_",
      WORD_REPLACE_REGEX = /\W/g;

const toTitleCase = async (phrase) => {
  return await phrase
    .replace(WORD_REPLACE_REGEX, "")
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

  model.identifier = await data.title.replace(WORD_REPLACE_REGEX, "_").toLowerCase();
  // add properties
  await Object.keys(data).forEach( async (key) => {
    if (key === "title" || key === "description") {
      return;
    }
    const value = (data[key]);
    const keyAndIndex = await key.split(DELIMETER);
    const prop = propMap[keyAndIndex[1]] || {};

    if (keyAndIndex[0] === "name") {
      prop[keyAndIndex[0]] = await (value).replace(WORD_REPLACE_REGEX, "_").toLowerCase();
    } else {
      prop[keyAndIndex[0]] = value;
    }

    propMap[keyAndIndex[1]] = prop;
  });
  model.properties = await Object.values(propMap);
  return model;
};

export default parseModel;
