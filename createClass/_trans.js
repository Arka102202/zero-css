import { addClassToTransformClassTag, addValueToPropNVals, getClassDefinition, getCompleteClassDefinition, processValuePart, transformClassesStyleTag, transformVarsStyleTag } from "./_generic.js";

export const transformClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // transform-[max/min]_{breakpoint}-matrix:1,2,3,4,5,6&perspective:17px&rotate:0.5turn&...
  // transform_[matrix/.../origin/style]-[max/min]_{breakpoint}-value

  const properties = [];
  const vals = [];
  const class1stPart = classParts[0].split("_");
  const valPart = classParts.at(-1);

  if (class1stPart.length === 1) {
    const valParts = valPart.split("&");

    valParts.forEach(el => {
      const elParts = el.split(":");
      const prop = elParts[0];
      const value = elParts[1];

      addValueToPropNVals(properties, vals, ["--" + prop, processValuePart(value)]);
    });

  } else {
    const propType = class1stPart[1];
    if (/^(?:origin|style|box)$/.test(propType)) addValueToPropNVals(properties, vals, ["transform-" + propType, processValuePart(valPart)]);
    else addValueToPropNVals(properties, vals, ["--" + propType, processValuePart(valPart)]);
  }

  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);
  if (returnOnlyPropNVal) return classToBuild;

  addClassToTransformClassTag(className);

  return getCompleteClassDefinition(2, classToBuild, classParts);


}

export const transitionClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // transition-[max/min]_{breakpoint}-usual_way
  // transition_[behavior/delay/duration/property/style]-[max/min]_{breakpoint}-value
  const properties = [];
  const vals = [];
  const valPart = classParts.at(-1);
  let value = "";

  value = processValuePart(valPart);

  addValueToPropNVals(properties, vals, [classParts[0].replace("_", "-"), value]);

  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);
  if (returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);
}

export const perspectiveOrgClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // perspective_origin-[max/min]_{breakpoint}-value

  const classToBuild = getClassDefinition(["perspective-origin"], [processValuePart(classParts.at(-1))], className, returnOnlyPropNVal);
  if (returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);
}

export const generalTransformClass = () => {

  const transMatrix = {
    matrix: "1,0,0,1,0,0",
    matrix3d: "1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1",
    perspective: "none",
    rotate: "0deg",
    rotate3d: "0, 0, 0, 0deg",
    rotateX: "0deg",
    rotateY: "0deg",
    rotateZ: "0deg",
    translate: "0px, 0px",
    translate3d: "0px, 0px, 0px",
    translateX: "0px",
    translateY: "0px",
    translateZ: "0px",
    scale: "1, 1",
    scale3d: "1, 1, 1",
    scaleX: "1",
    scaleY: "1",
    scaleZ: "1",
    skew: "0deg, 0deg",
    skewX: "0deg",
    skewY: "0deg",
  };

  let transformVariables = "";
  let transformStr = "";

  Object.entries(transMatrix).forEach(([key, value]) => {
    transformVariables += `\t--${key}: ${value};\n`;
    transformStr += `${key}(var(--${key})) `;
  });

  let classToBuild = getClassDefinition(["transform"], [transformStr], "transform");

  transformClassesStyleTag.innerHTML = classToBuild;

  classToBuild = `html {\n${transformVariables}\n`;

  transformVarsStyleTag.innerHTML += classToBuild;

}