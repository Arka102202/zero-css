import { breakPoints } from "../mappings/_variables.js";

export const getClassDefinition = (properties = [], vals = [], className = '') => {
  if (!properties.length || !vals.length) return "";
  let modifiedClassName = className.replace(/[.,#%+&:/@]/g, '\\$&');

  return (
    `.${modifiedClassName} {
    ${properties.map((el, idx) => `${idx !== 0 ? `\t` : ""}${el}: ${vals[idx] ? vals[idx] : processValuePart(vals[idx])}`).join(";\n")};
}\n`)
}
export const getPseudoElementDefinition = (properties = [], vals = [], className = '', pseudoElement = "") => {
  if (!properties.length || !vals.length) return "";
  let modifiedClassName = className.replace(/[.,#%+&:/@]/g, '\\$&');

  return (
    `${modifiedClassName ? "." : ""}${modifiedClassName}::${pseudoElement} {
    ${properties.map((el, idx) => `${idx !== 0 ? `\t` : ""}${el}: ${vals[idx] ? vals[idx] : processValuePart(vals[idx])}`).join(";\n")};
}\n`)
}

export const getCompleteClassDefinition = (lengthWithoutMediaQuery = 2, classToBuild = "", classParts = []) => {
  if (!classToBuild) return "";
  return classParts.length === lengthWithoutMediaQuery ? classToBuild : addMediaQuery(classToBuild, classParts);
}

const addMediaQuery = (classToPut = "", classParts = []) => {

  if (!classParts || !classParts.length || !classParts[1]) return "";

  const isMax = !/^(min)/.test(classParts[1]);
  let width = breakPoints[classParts[1].split("_").at(-1)];

  if(!width) width = classParts[1].split("_").at(-1);

  return (
    `@media (${isMax ? "max-width" : "min-width"}: ${width}) {
  ${classToPut.replace(/\n$/, "")}
}\n`);
}

export const addValueToPropNVals = (properties = [], vals = [], valsToAdd = [], isImportant = false) => {
  if (valsToAdd[0]) {
    properties.push(valsToAdd[0]);
    vals.push(`${valsToAdd[1]} ${isImportant ? "!important" : ""}`);
  }
}


/**
 * 
 * Process_val_part 
 * 
 * 
 * @param {*} val 
 * @param {*} mappingObj 
 * @param {*} isFontName 
 * @returns 
 */

export const processValuePart = (val = "", mappingObj = null, isFontName = false) => {

  const impString = /_imp$/.test(val) ? " !important" : "";
  val = val.replace(/_imp$/, "");
  let result = "";

  if (mappingObj) result = mappingObj[val];

  if (!result) {
    let newVal = val;
    if (!isFontName && !/^url@/.test(newVal)) {
      newVal = val
        .replace(/p(\d+)/g, "-$1")
        .replace("+", " ")
        .replace(/[A-Z]/g, match => '-' + match.toLowerCase());
    }

    if (/^v/.test(newVal)) {
      return `var(-${newVal.replace(/^v/, "")})${impString}`;
    } else if (/^url@/.test(newVal)) {
      const valParts = newVal.split("@");
      return `url(${valParts[1]})${impString}`;
    } else if (isFontName) {
      return formatFontName(newVal) + impString;
    } else return newVal + impString;

  }

  return result;
}

const formatFontName = (val = "") => {
  if (/\+/.test(val)) {
    return '"' + val.replace(/\+/g, " ") + '"';
  } else if (/#/.test(val)) {
    return val.replace(/#/g, "-");
  } else return val;
}