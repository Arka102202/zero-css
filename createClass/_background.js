import { colors } from "../mappings/_clr.js";
import { addValueToPropNVals, getClassDefinition, getCompleteClassDefinition, processValuePart } from "./_generic.js";

// background
export const bgClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {
  const properties = [];
  const vals = [];
  let valPart = classParts.length ? classParts.at(-1) : "";
  const prop1stPart = "background-";
  const isOnlyBg = classParts[0] === "bg";
  let valObj = { color: "", image: "", position: "", size: "", repeat: "", origin: "", clip: "", attachment: "" };
  let impString = "";

  if (isOnlyBg) {
    const allVals = valPart.split(",");
    let delimiter = "";

    allVals.forEach((val) => {
      const valParts = val.split("&");

      valParts.forEach(el => {
        const elParts = el.split(":");
        const prop = elParts[0];
        const value = elParts[1] || "";
        getVal(prop, value, valObj, delimiter);
      });

      delimiter = ", ";
    });

  } else {
    const propLastPart = classParts[0].includes("_") ? classParts[0].split("_").at(-1) : "";
    if (/_imp$/.test(valPart)) {
      valPart = valPart.replace(/_imp$/, "");
      impString = "!important";
    }
    const valParts = valPart.split(",");
    let delimiter = "";

    valParts.forEach(val => {
      getVal(propLastPart, val, valObj, delimiter);
      delimiter = ", ";
    });
  }

  Object.entries(valObj).forEach(([key, v]) => {
    if (v) {
      addValueToPropNVals(properties, vals, [prop1stPart + key, v + impString]);
    }
  });

  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);
  if (returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);
};


const getVal = (prop = "", value = "", valObj = {}, delimiter = "") => {
  if (/(clr|color)/.test(prop)) valObj.color += (delimiter + processValuePart(value, colors));
  else if (/(img|image)/.test(prop)) valObj.image += (delimiter + processValuePart(value));
  else if (/(pos|position)/.test(prop)) valObj.position += (delimiter + processValuePart(value));
  else if (/(s|size)/.test(prop)) valObj.size += (delimiter + processValuePart(value));
  else if (/(re|repeat)/.test(prop)) valObj.repeat += (delimiter + processValuePart(value));
  else if (/(org|origin)/.test(prop)) valObj.origin += (delimiter + processValuePart(value));
  else if (/(clip|clip)/.test(prop)) valObj.clip += (delimiter + processValuePart(value));
  else if (/(att|attachment)/.test(prop)) valObj.attachment += (delimiter + processValuePart(value));
}