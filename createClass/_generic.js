import { breakPoints } from "../mappings/_variables.js";



const styleImportTag = document.createElement("style");
styleImportTag.id = "style-import";
document.body.appendChild(styleImportTag);

export const transformVarsStyleTag = document.createElement("style");
transformVarsStyleTag.id = "style-transform-var";
document.body.appendChild(transformVarsStyleTag);

export const transformClassesStyleTag = document.createElement("style");
transformClassesStyleTag.id = "style-transform-class";
document.body.appendChild(transformClassesStyleTag);

const styleTag = document.createElement("style");
styleTag.id = "style";
document.body.appendChild(styleTag);

const style_break_point_tags = { 120000: styleTag };
const style_break_points = [120000];

/**
 * Generates a CSS class definition or property-value pairs based on the provided input.
 * 
 * @param {Array} properties - An array of CSS properties (e.g., 'color', 'font-size').
 * @param {Array} vals - An array of values corresponding to the CSS properties (e.g., 'red', '16px').
 * @param {string} className - The name of the CSS class to be generated. Special characters are escaped.
 * @param {boolean} returnOnlyPropVal - If true, returns only the CSS property-value pairs without the class name wrapper.
 * @returns {string} - The generated CSS class definition or the property-value pairs.
 */
export const getClassDefinition = (properties = [], vals = [], className = '', returnOnlyPropVal = false) => {
  if (!properties.length || !vals.length) return "";

  // Escape special characters in the class name for valid CSS selectors
  const modifiedClassName = getFormattedClassName(className);

  // Generate CSS property-value pairs
  const cssBody = properties.map((prop, idx) =>
    `\t${prop}: ${vals[idx]}`).join(";\n");

  // Return only the property-value pairs if requested
  if (returnOnlyPropVal) return `${cssBody};`;

  // Otherwise, return the full class definition
  return `.${modifiedClassName} {\n${cssBody};\n}\n`;
};


export const getFormattedClassName = (className = "") => {
  return className.replace(/[.,#%+&:/@]/g, '\\$&');
}



/**
 * Generates a CSS definition for a pseudo-element.
 *
 * @param {string[]} properties - The CSS properties to define.
 * @param {string[]} vals - The corresponding values for the properties.
 * @param {string} className - The class name for the element to which the pseudo-element is applied.
 * @param {string} pseudoElement - The pseudo-element (e.g., 'before', 'after').
 * @param {boolean} returnOnlyPropVal - Whether to return only the property-value pairs without the selector.
 * @returns {string} - A string representing the CSS definition or property-value pairs.
 */
export const getPseudoElementDefinition = (properties = [], vals = [], className = '', pseudoElement = "", returnOnlyPropVal = false) => {
  if (!properties.length || !vals.length) return "";

  // Escape special characters in class name for valid CSS
  const escapedClassName = className;

  // Create CSS property-value pairs
  const propValPairs = properties
    .map((prop, idx) => `\t${prop}: ${vals[idx]}`)
    .join(';\n');

  // Return only property-value pairs if required
  if (returnOnlyPropVal) {
    return `${propValPairs};`;
  }

  // Return full CSS rule with pseudo-element
  return `${escapedClassName}::${pseudoElement} {\n${propValPairs};\n}\n`;
};


/**
 * Constructs a full class definition, optionally adding a media query.
 *
 * @param {number} lengthWithoutMediaQuery - The number of parts that define a class without any media query.
 * @param {string} classToBuild - The base class name that is being built.
 * @param {string[]} classParts - An array of parts that might include media query definitions.
 * @returns {string} - The complete class definition with or without a media query.
 */

export const getCompleteClassDefinition = (lengthWithoutMediaQuery = 2, classToBuild = "", classParts = []) => {
  // If there's no class to build, return an empty string
  if (!classToBuild) return "";

  // If the number of class parts matches the length for no media query, return the class directly
  if (classParts.length === lengthWithoutMediaQuery) {

    if (classParts[0].startsWith("vars")) {
      styleTag.innerHTML = classToBuild + styleTag.innerHTML;
    } else if (classParts[0].startsWith("import")) {
      styleImportTag.innerHTML += classToBuild;
    } else {
      styleTag.innerHTML += classToBuild;
    }

    return "";
  }

  // If the class includes media query parts, add them using a helper function
  return addMediaQuery(classToBuild, classParts);
}

/**
 * Adds a media query to the class definition.
 *
 * @param {string} classToPut - The base class name or styles that need to be wrapped in a media query.
 * @param {string[]} classParts - The parts of the class that contain media query conditions, including breakpoints.
 * @returns {string} - A string representing the CSS definition with a media query.
 */
export const addMediaQuery = (classToPut = "", classParts = []) => {

  // Validate that classParts contains the expected values
  if (!classParts || !classParts.length || !classParts[1]) return "";

  // Determine if it's a "max-width" query if classParts[1] does not start with "min"
  const isMax = !/^(min)/.test(classParts[1]);

  // Extract the breakpoint key from classParts[1], and look it up in the breakPoints object
  let width = breakPoints[classParts[1].split("_").at(-1)];

  // If no breakpoint is found in the breakPoints object, use the value directly from classParts[1]
  if (!width) {
    width = classParts[1].split("_").at(-1);
    if (!/[0-9]/.test(width)) {
      return "";
    }
  }

  const completeClassName = `@media (${isMax ? "max-width" : "min-width"}: ${width}) {
  ${classToPut.replace(/\n$/, "")}
}\n`;

  addNewBreakPointToDOM(parseInt(width));

  style_break_point_tags[parseInt(width)].innerHTML += completeClassName;

  // Return the complete media query with either "max-width" or "min-width" based on the condition
  return "";
}



const addNewBreakPointToDOM = (new_break_point = 10) => {
  let high = 0, low = style_break_points.length - 1;
  let isBreakPointFound = false;

  // Binary search
  while (high <= low) {
    const mid = Math.floor((high + low) / 2);
    if (style_break_points[mid] === new_break_point) {
      isBreakPointFound = true;
      break;
    }
    if (style_break_points[mid] < new_break_point) {
      low = mid - 1;
    } else {
      high = mid + 1;
    }
  }

  if (!isBreakPointFound) {
    // Create a new style tag
    const newStyleTag = document.createElement("style");
    newStyleTag.id = `style-${new_break_point}`;

    // Insert into DOM after closest smaller breakpoint
    style_break_point_tags[style_break_points[high - 1]].insertAdjacentElement("afterend", newStyleTag);

    // Update structures
    style_break_point_tags[new_break_point] = newStyleTag;
    style_break_points.splice(high, 0, new_break_point);
  }

};



/**
 * Adds a new value to the properties and vals arrays, marking it as important if necessary.
 *
 * @param {string[]} properties - The list of CSS properties.
 * @param {string[]} vals - The list of corresponding values for the properties.
 * @param {string[]} valsToAdd - An array where the first element is the property and the second is the value to add.
 * @param {boolean} isImportant - Whether to append `!important` to the value.
 */

export const addValueToPropNVals = (properties = [], vals = [], valsToAdd = [], isImportant = false) => {
  // Ensure that valsToAdd contains at least one valid property before proceeding
  if (valsToAdd[0]) {
    // Add the property from valsToAdd to the properties array
    properties.push(valsToAdd[0]);

    // Add the corresponding value, appending !important if isImportant is true
    vals.push(`${valsToAdd[1]}${isImportant ? " !important" : ""}`);
  }
}



/**
 * Processes a value for a CSS property, handling special cases like !important, URLs, variables, and font names.
 *
 * @param {string} val - The value to process.
 * @param {object} mappingObj - An optional object for mapping specific values to predefined strings.
 * @param {boolean} isFontName - A flag indicating if the value is a font name (for special processing).
 * @returns {string} - The processed CSS value.
 */

export const processValuePart = (val = "", mappingObj = null, isFontName = false) => {
  // Check for !important and remove _imp suffix
  const impString = val.endsWith('_imp') ? ' !important' : '';
  val = val.replace(/_imp$/, "");

  // Return mapped value if available
  const mappedValue = mappingObj?.[val];
  if (mappedValue) return mappedValue + impString;

  // Skip processing if it's a font name or URL
  if (isFontName) return formatFontName(val) + impString;
  if (/^url@/.test(val)) return `url(${val.split("@")[1]})${impString}`;

  // Default processing for variables and regular values
  let processedVal = val
    .replace(/\+/g, " ")          // Replace All '+' with space
    .replace(/p(\d+)/g, "+$1")    // Convert 'p<number>' to '+<number>'
    .replace(/m(\d+)/g, "-$1")    // Convert 'm<number>' to '-<number>'
    .replace(/[A-Z]/g, match => '-' + match.toLowerCase());  // Convert camelCase to kebab-case

  // Handle CSS variable notation (v<var>)
  if (processedVal.startsWith("v")) {
    return `var(-${processedVal.slice(1)})${impString}`;
  }

  // Return processed value with optional !important
  return processedVal + impString;
};

/**
 * Formats a font name by replacing special characters.
 *
 * @param {string} val - The font name to format.
 * @returns {string} - The formatted font name.
 */
const formatFontName = (val = "") => {
  if (/\+/.test(val)) {
    return '"' + val.replace(/\+/g, " ") + '"';  // Replace '+' with space and wrap in quotes
  } else if (/[A-Z]/.test(val)) {
    return val.replace(/[A-Z]/g, match => '-' + match.toLowerCase());  // Convert camelCase to kebab-case
  } else return val;  // Return as-is if no special characters
}


/**
 * Splits a string into a specified number of parts using a given delimiter.
 * If the string has more segments than the specified number, 
 * the last part will contain the remaining segments joined by the delimiter.
 *
 * @param {string} str - The input string to be split.
 * @param {number} num - The number of parts to divide the string into. Must be > 0.
 * @param {string} delimiter - The character(s) used to split the string.
 * @returns {Array<string>} - An array containing the split parts. If the input 
 *                            string has fewer segments than `num`, all segments are returned.
 */
export const splitStringByParts = (str, num, delimiter) => {
  // If the requested number of parts is less than or equal to zero, return an empty array.
  if (num <= 0) {
    return [];
  }

  // Split the string using the specified delimiter.
  const parts = str.split(delimiter);

  // If the number of resulting parts is less than or equal to the requested number,
  // return all parts since no further splitting or joining is needed.
  if (parts.length <= num) {
    return parts;
  }

  // Create the result array by taking the first (num - 1) parts.
  const result = parts.slice(0, num - 1);

  // Join the remaining parts into a single string for the last chunk and add it to the result.
  result.push(parts.slice(num - 1).join(delimiter));

  // Return the final array containing the specified number of parts.
  return result;
};


export const addClassToTransformClassTag = (className = "", isFormatted = false) => {

  const formattedClassName = isFormatted ? className : ("." + getFormattedClassName(className));

  transformClassesStyleTag.innerHTML = formattedClassName + "," + transformClassesStyleTag.innerHTML;
}