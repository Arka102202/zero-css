import { processValPartIfOnlyBg } from "./_background.js";
import { addValueToPropNVals, getClassDefinition, getCompleteClassDefinition, processValuePart } from "./_generic.js";

/**
 * Generates CSS filter or backdrop-filter classes.
 * Supports multiple filter types (blur, brightness, contrast, etc.) 
 * and handles combined filters with individual values using `&`.
 * 
 * @param {Array<string>} classParts - Array representing parts of the CSS class.
 * @param {string} className - Name of the CSS class to be generated.
 * @param {boolean} returnOnlyPropNVal - If true, returns only the property-value pairs.
 * @returns {string} - The CSS class definition or property-value pairs.
 */

export const filterClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // filter-[max/min]_{breakpoint}-blur:val&brightness:val&dropShadow:val&....
  // filter_[blur/brightness/contrast/shadow/gray/hue/invert/saturate/sepia/dropShadow]-[max/min]_{breakpoint}-value
  // bdFilter-[max/min]_{breakpoint}-blur:val&brightness:val&....
  // bdFilter_[blur/brightness/contrast/shadow/gray/hue/invert/sat/sepia/dropShadow]-[max/min]_{breakpoint}-value

  const properties = []; // Stores CSS properties like 'filter' or 'backdrop-filter'.
  const vals = [];       // Stores corresponding CSS values.

  // Extract the value part containing the filter values (e.g., blur:5px&brightness:1.2).
  const valPart = classParts.at(-1);

  // Determine whether the filter is a 'filter' or 'backdrop-filter'.
  const filterKind = classParts[0].split("_").at(0); // e.g., 'filter' or 'bdFilter'.

  // Extract the specific filter type if provided (e.g., blur, brightness).
  const filterType = classParts[0].split("_").at(-1);

  let filterVal = ""; // String to hold the complete filter value.

  // Object to store individual filter properties and their values.
  const filterValueObj = {
    blur: "",
    brightness: "",
    contrast: "",
    shadow: "",
    gray: "",
    hue: "",
    invert: "",
    saturate: "",
    sepia: "",
    dropShadow: "",
  };

  // Check if the filter type is a general filter (multiple values) or a specific one.
  if (/^(filter|bdFilter)$/.test(filterType)) {
    // Split the value part into individual filter-value pairs.
    const valParts = valPart.split("&");

    valParts.forEach(el => {
      const elParts = el.split(":");  // Split each pair into property and value.
      const prop = elParts[0];        // Property name (e.g., "blur", "brightness").
      const value = elParts[1];       // Property value (e.g., "5px", "1.2").

      // Store the value in the corresponding key within the filter object.
      getValue(prop, value, filterValueObj);
    });
  } else {
    // If a specific filter type is given, directly store its value.
    getValue(filterType, valPart, filterValueObj);
  }

  // Combine all non-empty filter values into a single string.
  Object.entries(filterValueObj).forEach(([_, value]) => {
    if (value) filterVal += value;
  });

  // Add the filter or backdrop-filter property to the property-value arrays.
  addValueToPropNVals(
    properties,
    vals,
    [filterKind === "filter" ? "filter" : "backdrop-filter", filterVal]
  );

  // Generate the CSS class definition.
  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);

  // If only property-value pairs are needed, return them.
  if (returnOnlyPropNVal) return classToBuild;

  // Generate and return the complete CSS class definition.
  return getCompleteClassDefinition(2, classToBuild, classParts);
}

/**
 * Generates CSS classes for blend modes (background-blend-mode or mix-blend-mode).
 * 
 * @param {Array} classParts - Parts of the class name, used to extract type and value.
 * @param {string} className - Optional class name to apply.
 * @param {boolean} returnOnlyPropNVal - If true, returns only property-value pairs.
 * @returns {string} - The complete class definition or property-value pairs.
 */

export const blendClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // [mix/bg]_blend-[max/min]_{breakpoint}-value

  const properties = []; // Stores CSS properties.
  const vals = []; // Stores corresponding values.

  // Determine if the blend type is 'background-blend-mode' or 'mix-blend-mode'.
  const blendType = classParts[0].split("_")[0] === "bg" ? "background" : "mix";

  // Add property and value to their respective arrays.
  addValueToPropNVals(properties, vals, [
    `${blendType}-blend-mode`,
    processValuePart(classParts.at(-1))
  ]);

  // Build the class definition.
  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);

  // Return property-value pairs if requested.
  if (returnOnlyPropNVal) return classToBuild;

  // Return the complete class definition.
  return getCompleteClassDefinition(2, classToBuild, classParts);
};


/**
 * Generates CSS classes for opacity values.
 * 
 * @param {Array} classParts - Parts of the class name, used to extract value.
 * @param {string} className - Optional class name to apply.
 * @param {boolean} returnOnlyPropNVal - If true, returns only property-value pairs.
 * @returns {string} - The complete class definition or property-value pairs.
 */

export const opacityClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // opacity-[max/min]_{breakpoint}-value

  // Build the class definition with 'opacity' as the property.
  const classToBuild = getClassDefinition(
    ["opacity"],
    [processValuePart(classParts.at(-1))],
    className,
    returnOnlyPropNVal
  );

  // Return property-value pairs if requested.
  if (returnOnlyPropNVal) return classToBuild;

  // Return the complete class definition.
  return getCompleteClassDefinition(2, classToBuild, classParts);
};

/**
 * Generates CSS classes for box or text shadows. Multiple comma separated values are also acceptable.
 * 
 * @param {Array} classParts - Parts of the class name, used to extract shadow type and value.
 * @param {string} className - Optional class name to apply.
 * @param {boolean} returnOnlyPropNVal - If true, returns only property-value pairs.
 * @returns {string} - The complete class definition or property-value pairs.
 */

export const shadowClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // [txt_]shadow-[max/min]_{breakpoint}-value

  const valueParts = classParts.at(-1).split(",");
  let value = "", delimiter = "";

  valueParts.forEach(valPart => {
    value += (delimiter + valPart.split("+").map(el => processValuePart(el)).join(" "));
    delimiter = ", ";
  })

  // Determine if it's a 'box-shadow' or 'text-shadow'.
  const shadowType = classParts[0] === "shadow" ? "box-shadow" : "text-shadow";

  // Build the class definition with the determined shadow type.
  const classToBuild = getClassDefinition([shadowType], [value], className, returnOnlyPropNVal);

  // Return property-value pairs if requested.
  if (returnOnlyPropNVal) return classToBuild;

  // Return the complete class definition.
  return getCompleteClassDefinition(2, classToBuild, classParts);
};


/**
 * Generates CSS classes for text gradients.
 * 
 * @param {Array} classParts - Parts of the class name, used to extract gradient value.
 * @param {string} className - Optional class name to apply.
 * @param {boolean} returnOnlyPropNVal - If true, returns only property-value pairs.
 * @returns {string} - The complete class definition or property-value pairs.
 */

export const textGradClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // text_grad-[max/min]_{breakpoint}-value

  const properties = []; // Stores CSS properties.
  const vals = []; // Stores corresponding values.

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

  const valPart = classParts.at(-1);

  processValPartIfOnlyBg(valPart, valObj);

  // Convert valObj into properties and values arrays.
  Object.entries(valObj).forEach(([key, v]) => {
    if (v) {
      // Store the property and value with optional "!important".
      addValueToPropNVals(properties, vals, ["background-" + key, v]);
    }
  });

  // Add transparent color and background gradient properties.
  addValueToPropNVals(properties, vals, ["color", "transparent !important"]);
  // addValueToPropNVals(properties, vals, ["background", processValuePart(classParts.at(-1))]);
  addValueToPropNVals(properties, vals, ["background-clip", "text"]);

  // Build the class definition.
  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);

  // Return property-value pairs if requested.
  if (returnOnlyPropNVal) return classToBuild;

  // Return the complete class definition.
  return getCompleteClassDefinition(2, classToBuild, classParts);
};



/**
 * Generates CSS classes for backface visibility.
 * 
 * @param {Array} classParts - Parts of the class name, used to extract value.
 * @param {string} className - Optional class name to apply.
 * @param {boolean} returnOnlyPropNVal - If true, returns only property-value pairs.
 * @returns {string} - The complete class definition or property-value pairs.
 */

export const backFaceClass = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // backface_visibility-[max/min]_{breakpoint}-value

  // Build the class definition with 'backface-visibility' as the property.
  const classToBuild = getClassDefinition(
    ["backface-visibility"],
    [processValuePart(classParts.at(-1))],
    className,
    returnOnlyPropNVal
  );

  // Return property-value pairs if requested.
  if (returnOnlyPropNVal) return classToBuild;

  // Return the complete class definition.
  return getCompleteClassDefinition(2, classToBuild, classParts);
};



/**
 * Generates CSS classes for content visibility.
 * @param {Array} classParts - Parts of the class name, used to extract value.
 * @param {string} className - Optional class name to apply.
 * @param {boolean} returnOnlyPropNVal - If true, returns only property-value pairs.
 * @returns {string} - The complete class definition or property-value pairs.
 */
export const content_visibilityClass = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // content_visibility-[max/min]_{breakpoint}-value

  // Build the class definition with 'content-visibility' as the property.
  const classToBuild = getClassDefinition(
    ["content-visibility"],
    [processValuePart(classParts.at(-1))],
    className,
    returnOnlyPropNVal
  );

  // Return property-value pairs if requested.
  if (returnOnlyPropNVal) return classToBuild;

  // Return the complete class definition.
  return getCompleteClassDefinition(2, classToBuild, classParts);
};



const getValue = (prop = "", value = "", propValObj = {}) => {
  if (prop === "dropShadow") {
    const valueParts = value.split(",");
    let val = "", delimiter = "";
    valueParts.forEach(valPart => {
      val += (delimiter + valPart.split("+").map(el => processValuePart(el)).join(" "));
      delimiter = ", ";
    })
    propValObj[prop] = `drop-shadow(${val}) `;
  } else if (/(sat|saturate)/.test(prop)) {
    propValObj.saturate = `saturate(${processValuePart(value)}) `;
  } else if (/(bright|brightness)/.test(prop)) {
    propValObj.brightness = `brightness(${processValuePart(value)}) `;
  } else {
    propValObj[prop] = `${prop}(${processValuePart(value)}) `;
  }
}