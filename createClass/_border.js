import { colors } from "../mappings/_clr.js";
import { addValueToPropNVals, getClassDefinition, getCompleteClassDefinition, processValuePart } from "./_generic.js";

const directions = {
  t: "-top",
  r: "-right",
  b: "-bottom",
  l: "-left",
  "": ""
}

/**
 * Dynamically generates CSS border-related classes based on the provided input.
 * Supports properties like border width, color, style, offset, and radius with different 
 * directions and breakpoints. Also handles outline properties with similar patterns.
 * 
 * @param {Array<string>} classParts - Array representing class parts for parsing CSS properties. 
 * @param {string} className - Name of the CSS class to generate. 
 * @param {boolean} returnOnlyPropNVal - If true, returns only property-value pairs without. 
 * @returns {string | object} - CSS class definition or property-value pairs based on the flag.
 */
export const borderCLasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // Example class formats:
  // border_[t/r/b/l]-[max/min]_{breakpoint}-{wd:val&st:va&clr:val}
  // border_[t/r/b/l]_[width/color/style]-[max/min]_{breakpoint}-value

  // border_rad_[tr/br/bl/tl]_[max/min]_{breakpoint}-value

  // outline_[t/r/b/l]-[max/min]_{breakpoint}-{wd:val&st:va&clr:val&off:val}
  // outline_[t/r/b/l]_[width/color/style/offset]-[max/min]_{breakpoint}-value

  const properties = [];  // Stores the CSS property names.
  const vals = [];        // Stores the corresponding CSS values.

  // Split the first part of the class to determine its structure.
  const class1stParts = classParts[0].split("_");

  // Get the primary property name (e.g., 'border' or 'outline').
  const propName1st = class1stParts[0];

  // Determine the direction (e.g., top, right) if specified.
  const propDirPos = class1stParts.length === 2 ? -1 : (class1stParts.length === 3 ? 1 : null);
  const propDir = propDirPos ? class1stParts.at(propDirPos) : "";

  // Determine the type of property (e.g., width, color, style).
  const propTypePos = class1stParts.length === 2 ? -1 : (class1stParts.length === 3 ? 2 : null);
  const propType = propTypePos ? class1stParts.at(propTypePos) : "";

  // Get the value part (e.g., "1px" or "solid").
  const valPart = classParts.at(-1);

  // Initialize the object to store border-related property values.
  const propValObj = {
    color: "#fff",   // Default color
    width: "1px",    // Default width
    style: "solid",  // Default style
    offset: ""       // For outlines
  };

  // If the class specifies a specific border type (color, width, style, offset).
  if (/^(color|width|style|offset)$/.test(propType)) {
    getVal(propType, valPart, propValObj);  // Populate the property object with the value.
  }
  // Handle border radius properties.
  else if (/^border_rad/.test(classParts[0])) {
    const radDir = class1stParts.length === 3 ? class1stParts.at(2) : "";

    // Add the corresponding border radius property based on direction.
    if (radDir === "tr") {
      addValueToPropNVals(properties, vals, ["border-top-right-radius", processValuePart(valPart)]);
    } else if (radDir === "br") {
      addValueToPropNVals(properties, vals, ["border-bottom-right-radius", processValuePart(valPart)]);
    } else if (radDir === "bl") {
      addValueToPropNVals(properties, vals, ["border-bottom-left-radius", processValuePart(valPart)]);
    } else if (radDir === "tl") {
      addValueToPropNVals(properties, vals, ["border-top-left-radius", processValuePart(valPart)]);
    } else {
      addValueToPropNVals(properties, vals, ["border-radius", processValuePart(valPart)]);
    }
  }
  // Handle other border and outline properties.
  else {

    // Split the value part by '&' to get individual property-value pairs.
    const valParts = valPart.split("&");

    valParts.forEach(el => {
      const elParts = el.split(":"); // Split by ':' to get property and value.
      const prop = elParts[0];       // Property name.
      const value = elParts[1];      // Property value.

      getVal(prop, value, propValObj); // Populate the property object.
    });
  }

  // Convert the property object into properties and values arrays.
  if (!/^border_rad/.test(classParts[0])) {
    Object.entries(propValObj).forEach(([key, v]) => {
      if (v) {
        // Store the property and value, adding any directional prefix if present.
        addValueToPropNVals(properties, vals, [propName1st + directions[propDir] + "-" + key, v]);
      }
    });
  }

  // Generate the CSS class definition.
  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);

  // If only property-value pairs are needed, return them.
  if (returnOnlyPropNVal) return classToBuild;

  // Generate and return the complete class definition.
  return getCompleteClassDefinition(2, classToBuild, classParts);
};


/**
 * Generates CSS ring classes with optional directional properties using `box-shadow`.
 * Supports customization of width and color and handles directional shadows for top, right, 
 * bottom, and left. If no direction is specified, a full border effect is applied.
 * 
 * @param {Array<string>} classParts - Array representing parts of the CSS class.  
 * @param {string} className - Name of the CSS class to be generated. 
 * @param {boolean} returnOnlyPropNVal - If true, returns only the property-value pairs. 
 * @returns {string | object} - The CSS class definition or property-value pairs based on the flag.
 */
export const ringClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // Example input format:
  // ring_[t/r/b/l]-[max/min]_[breakpoint]-[wd:val&clr:val]

  const properties = [];  // Stores CSS property names.
  const vals = [];        // Stores corresponding CSS values.

  // Split the first part of the class to get direction information.
  const class1stParts = classParts[0].split("_");

  // Determine the direction (t = top, r = right, b = bottom, l = left).
  const propDirPos = class1stParts.length === 2 ? -1 : (class1stParts.length === 3 ? 1 : null);
  const propDir = propDirPos ? class1stParts.at(propDirPos) : "";

  // Get the value part, which contains width and color details.
  const valPart = classParts.at(-1);

  // Initialize default values for width and color.
  let clr = "#fff";  // Default color.
  let wd = "1px";    // Default width.

  // Split the value part by '&' to separate individual property-value pairs.
  const valParts = valPart.split("&");

  valParts.forEach(el => {
    const elParts = el.split(":");  // Split each pair into property and value.
    const prop = elParts[0];        // Property name (e.g., "clr", "wd").
    const value = elParts[1];       // Property value (e.g., "#000", "2px").

    // Process the value based on the property type.
    if (prop === "clr") {
      clr = processValuePart(value, colors);  // Handle color.
    } else if (prop === "wd") {
      wd = processValuePart(value);  // Handle width.
    }
  });

  // Add the appropriate box-shadow value based on the direction.
  if (propDir === "t") {
    // Top border effect using inset shadow.
    addValueToPropNVals(properties, vals, ["box-shadow", `inset 0 ${wd} 0 ${clr}`]);
  } else if (propDir === "r") {
    // Right border effect.
    addValueToPropNVals(properties, vals, ["box-shadow", `inset -${wd} 0 0 ${clr}`]);
  } else if (propDir === "b") {
    // Bottom border effect.
    addValueToPropNVals(properties, vals, ["box-shadow", `inset 0 -${wd} 0 ${clr}`]);
  } else if (propDir === "l") {
    // Left border effect.
    addValueToPropNVals(properties, vals, ["box-shadow", `inset ${wd} 0 0 ${clr}`]);
  } else {
    // Full ring effect if no specific direction is given.
    addValueToPropNVals(properties, vals, ["box-shadow", `inset 0 0 0 ${wd} ${clr}`]);
  }

  // Generate the CSS class definition.
  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);

  // If only property-value pairs are needed, return them.
  if (returnOnlyPropNVal) return classToBuild;

  // Generate and return the complete CSS class definition.
  return getCompleteClassDefinition(2, classToBuild, classParts);
};

const getVal = (propType = "", valPart = "", propValObj = {}) => {
  if (/(color|clr)/.test(propType)) {
    propValObj.color = processValuePart(valPart, colors);
  } else if (/(width|wd)/.test(propType)) {
    propValObj.width = processValuePart(valPart);
  } else if (/(style|st)/.test(propType)) {
    propValObj.style = processValuePart(valPart);
  } else if (/(offset|off)/.test(propType)) {
    propValObj.offset = processValuePart(valPart);
  }
}

