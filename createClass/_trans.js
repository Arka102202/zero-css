import { addValueToPropNVals, getClassDefinition, getCompleteClassDefinition, processValuePart } from "./_generic.js";

export const transformClasses = (classParts = [], className = "") => {

  // transform-[max/min]_{breakpoint}-matrix:1_2_3_4_5_6&perspective:17px&rotate:0.5turn&...
  // transform_[matrix/.../origin/style]-[max/min]_{breakpoint}-value

  const properties = [];
  const vals = [];
  const class1stPart = classParts[0].split("_");
  const valPart = classParts.at(-1);

  if (class1stPart.length === 1) {

    let valueStr = ""
    const valParts = valPart.split("&");

    valParts.forEach(el => {
      const elParts = el.split(":");
      const prop = elParts[0];
      const value = elParts[1];

      const createFuncArgs = value
        .split("_")
        .map(el => processValuePart(el))
        .join(", ");

      valueStr += `${prop}(${createFuncArgs})`;

    });

    addValueToPropNVals(properties, vals, ["transform", valueStr]);

  } else {
    const propType = class1stPart[1];
    const createFuncArgs = valPart
      .split("_")
      .map(el => processValuePart(el))
      .join(", ");

    addValueToPropNVals(properties, vals, ["transform", `${propType}(${createFuncArgs})`]);
  }

  const classToBuild = getClassDefinition(properties, vals, className);
  return getCompleteClassDefinition(2, classToBuild, classParts);


}

export const transitionClasses = (classParts = [], className = "") => {

  // transition-[max/min]_{breakpoint}-usual_way
  // transition_[behavior/delay/duration/property/style]-[max/min]_{breakpoint}-value
  const properties = [];
  const vals = [];
  const class1stPart = classParts[0].split("_");
  const valPart = classParts.at(-1);
  let value = "";

  if (class1stPart.length === 1) {
    value = valPart.split("_").map(el => processValuePart(el, null, true)).join(" ");
  } else {
    value = processValuePart(valPart, null, true);
  }

  addValueToPropNVals(properties, vals, [classParts[0].replace("_", "-"), value]);

  const classToBuild = getClassDefinition(properties, vals, className);
  return getCompleteClassDefinition(2, classToBuild, classParts);
}


export const perspectiveOrgClasses = (classParts = [], className = "") => {

  // perspective_origin-[max/min]_{breakpoint}-value

  const classToBuild = getClassDefinition(["perspective-origin"], [processValuePart(classParts.at(-1), null, true)], className);
  return getCompleteClassDefinition(2, classToBuild, classParts);
}


