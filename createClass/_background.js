import { colors } from "../mappings/_clr.js";
import { addValueToPropNVals, getClassDefinition, getCompleteClassDefinition, processValuePart } from "./_generic.js";

/**
 * Generates CSS background-related classes based on the provided input parts.
 * This function supports background properties such as color, image, position, etc., 
 * and optionally handles the "!important" flag for single CSS prop's values.
 *
 * @param {Array<string>} classParts - An array of parts representing the class and properties.
 * @param {string} className - The name of the CSS class to generate.
 * @param {boolean} returnOnlyPropNVal - If true, returns only the property-value pairs 
 * @returns {string | object} - A string of CSS class definition or just property-value pairs 
 */
export const bgClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // bg-[max/min]_[breakPoint]-s:val&clr:val&img:val&pos:val&re:val&org:val&clip:val&att:val
  // bg_[color/image/position/size/repeat/origin/clip/attachment]-[max/min]_[breakPoint]-value

  // Arrays to store CSS properties and their corresponding values.
  const properties = [];
  const vals = [];

  // Extract the value part (last element) from classParts, if available.
  let valPart = classParts.length ? classParts.at(-1) : "";

  // Common prefix for all background-related CSS properties.
  const prop1stPart = "background-";

  // Check if the class is for generic "background" (e.g., 'bg' class).
  const isOnlyBg = classParts[0] === "bg";

  // Object to store individual background properties and their values.
  let valObj = {
    color: "",
    image: "",
    position: "",
    size: "",
    repeat: "",
    origin: "",
    clip: "",
    attachment: ""
  };

  // String to append "!important" to values, if needed.
  let impString = "";

  if (isOnlyBg) {

    processValPartIfOnlyBg(valPart, valObj);

  } else {
    // Handle cases where the class is not just 'bg' (e.g., 'bg_size', 'bg_color').
    const propLastPart = classParts[0].includes("_")
      ? classParts[0].split("_").at(-1)
      : "";

    // Check if the value part ends with '_imp', indicating "!important".
    if (/_imp$/.test(valPart)) {
      valPart = valPart.replace(/_imp$/, ""); // Remove '_imp' from the value.
      impString = "!important"; // Set the important flag.
    }

    // Split the value part by commas to get multiple values.
    const valParts = valPart.split(",");
    let delimiter = "";

    // Populate valObj with the corresponding property and value.
    valParts.forEach(val => {
      getVal(propLastPart, val, valObj, delimiter);
      delimiter = ", ";
    });
  }

  // Convert valObj into properties and values arrays.
  Object.entries(valObj).forEach(([key, v]) => {
    if (v) {
      // Store the property and value with optional "!important".
      addValueToPropNVals(properties, vals, [prop1stPart + key, v + impString]);
    }
  });

  // Generate the CSS class definition.
  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);

  // If only property-value pairs are needed, return them.
  if (returnOnlyPropNVal) return classToBuild;

  // Otherwise, generate the complete class definition with a specific structure.
  return getCompleteClassDefinition(2, classToBuild, classParts);
};

const getVal = (prop = "", value = "", valObj = {}, delimiter = "") => {

  if (valObj[mappingObj[prop]]) delimiter = ", ";
  
  if (/(?:clr|color)/.test(prop)) valObj.color += (delimiter + processValuePart(value, colors));
  else valObj[mappingObj[prop]] += (delimiter + processValuePart(value));
}

export const processValPartIfOnlyBg = (valPart = "", valObj = {}) => {
  // If the class is 'bg', split the value part by commas (e.g., "color:red,image:url('img.jpg')").
  const allVals = valPart.split(",");

  // Iterate through each value group, separated by "&".
  allVals.forEach((val) => {
    const valParts = val.split("&");

    // For each element, split by ":" to get property and value pairs.
    valParts.forEach(el => {
      const elParts = el.split(":");
      const prop = elParts[0]; // Extract the property name.
      const value = elParts[1] || ""; // Extract the value, or set as an empty string if missing.

      // Populate the valObj with property-value pairs.
      getVal(prop, value, valObj);
    });
  });
}

const mappingObj = {
  clr: "color",
  img: "image",
  pos: "position",
  s: "size",
  re: "repeat",
  org: "origin",
  clip: "clip",
  att: "attachment",
  color: "color",
  image: "image",
  position: "position",
  size: "size",
  repeat: "repeat",
  origin: "origin",
  clip: "clip",
  attachment: "attachment",
} 