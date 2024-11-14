import { addClassToTransformClassTag, addValueToPropNVals, getClassDefinition, getCompleteClassDefinition, processValuePart } from "./_generic.js";

export const fontClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // font-[max/min]_{breakpoint}-st:val&weight:val&s:val&family:val
  // font_family-name-1,name-2,nameDifferent 
  // font_[style/weight/size]-[max/min]_{breakpoint}-value

  const properties = [];
  const vals = [];
  const propName = classParts[0].split("_").at(-1);
  let value = "";
  const valPart = classParts.at(-1);

  if (propName === "font") {
    const valParts = valPart.split("&");

    valParts.forEach(el => {
      const elParts = el.split(":");
      const prop = elParts[0];
      const tempValue = elParts[1];

      if (prop === "s") {
        addValueToPropNVals(properties, vals, ["font-size", processValuePart(tempValue)]);
      } else if (prop === "weight") {
        addValueToPropNVals(properties, vals, ["font-weight", processValuePart(tempValue)]);
      } else if (prop === "st") {
        addValueToPropNVals(properties, vals, ["font-style", processValuePart(tempValue)]);
      } else if (prop === "family") {
        value = tempValue.split(",").map(el => processValuePart(el, null, true)).join(", ");
        addValueToPropNVals(properties, vals, ["font-family", value]);
      }

    });

  } else {

    if (propName === "family") {
      value = classParts.at(-1).split(",").map(el => processValuePart(el, null, true)).join(", ");
    } else {
      value = processValuePart(classParts.at(-1));
    }

    addValueToPropNVals(properties, vals, [classParts[0].replace("_", "-"), value]);
  }

  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);

  if (returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);
}

export const letterClass = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // letter_space-[max/min]_{breakpoint}-value
  // letter_dir-[max/min]_{breakpoint}-value ==> writing mode

  const propType = classParts[0].split("_").at(-1);
  let classToBuild = "";

  if (propType === "space") {
    classToBuild = getClassDefinition(["letter-spacing"], [processValuePart(classParts.at(-1))], className, returnOnlyPropNVal);
    if (returnOnlyPropNVal) return classToBuild;
  } else {

    const val = classParts.at(-1);
    const properties = [];
    const vals = [];
    if (val === "up") {
      addValueToPropNVals(properties, vals, ["writing-mode", "horizontal-tb"]);
    } else if (val === "down") {
      addValueToPropNVals(properties, vals, ["writing-mode", "horizontal-tb"]);
      addValueToPropNVals(properties, vals, ["--scale", "-1"]);
    } else if (val === "right") {
      addValueToPropNVals(properties, vals, ["writing-mode", "vertical-lr"]);
    } else if (val === "left") {
      addValueToPropNVals(properties, vals, ["writing-mode", "vertical-rl"]);
      addValueToPropNVals(properties, vals, ["--rotate", "180deg"]);
    }

    classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);
    if (returnOnlyPropNVal) return classToBuild;

    addClassToTransformClassTag(className);
  }

  return getCompleteClassDefinition(2, classToBuild, classParts);
}

export const lineClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // line_height-[max/min]_{breakpoint}-value
  // line_clamp-[max/min]_{breakpoint}-value
  // line_break-[max/min]_{breakpoint}-value

  const properties = [];
  const vals = [];
  const propType = classParts[0].split("_").at(-1);
  const value = classParts.at(-1);


  if (propType === "height") {
    addValueToPropNVals(properties, vals, ["line-height", processValuePart(value)]);
  } else if (propType === "clamp") {
    addValueToPropNVals(properties, vals, ["overflow", "hidden"]);
    addValueToPropNVals(properties, vals, ["display", "-webkit-box"]);
    addValueToPropNVals(properties, vals, ["-webkit-box-orient", "vertical"]);
    addValueToPropNVals(properties, vals, ["-webkit-line-clamp", processValuePart(value)]);
  } else {
    addValueToPropNVals(properties, vals, ["word-break", processValuePart(value)]);
  }

  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);
  if (returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);
}

export const textClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // txt_decor-[max/min]_{breakpoint}-type+color+style+thick
  // txt_decor_[type/color/style/thick]-[max/min]_{breakpoint}-value
  // txt_underline_offset-[max/min]_{breakpoint}-value
  // txt_transform-value
  // ** add hyphen as a value of overflow
  // txt_[overflow/wrap/indent/justify]-[max/min]_{breakpoint}-value 
  // txt_align[X/Y]-[max/min]_{breakpoint}-value
  // txt_orientation-[max/min]_{breakpoint}-value
  // txt_stroke-[max/min]_{breakpoint}-[width+color]
  // txt_stroke_[width/color]-[max/min]_{breakpoint}-value // add -webkit in front


  const properties = [];
  const vals = [];
  const propType = classParts[0].split("_").at(1);
  const class1stParts = classParts[0].split("_");
  const valPart = classParts.at(-1);

  if (/^(decor|stroke)$/.test(propType)) {
    const actualName = propType === "decor" ? "text-decoration" : "-webkit-text-stroke";
    if (class1stParts.length === 2) {
      addValueToPropNVals(properties, vals, [actualName, processValuePart(valPart)]);
    } else {
      const propSubType = class1stParts.at(2);
      addValueToPropNVals(properties, vals, [actualName + "-" + propSubType, processValuePart(valPart)]);
    }
  } else if (propType === "underline") {
    addValueToPropNVals(properties, vals, ["text-underline-offset", processValuePart(valPart)]);
  } else {
    addValueToPropNVals(properties, vals, ["text-" + propType, processValuePart(valPart)]);
  }

  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);
  if (returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);
}

export const fontImportClass = (classParts = []) => {

  // @import-value

  return `${classParts[0]} url('${classParts[1]}');\n`;
}

export const colorClass = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // color-[max/min]_{breakpoint}-value

  const classToBuild = getClassDefinition(["color"], [processValuePart(classParts.at(-1))], className, returnOnlyPropNVal);
  if (returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);
}