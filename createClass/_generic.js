import { breakPoints } from "../mappings/_variables.js";

export const getClassDefinition = (properties = [], vals = [], className = '') => {
  if (!properties.length || !vals.length) return "";
  let modifiedClassName = className.replace(/[.,#%+&:]/g, '\\$&');

  return (
    `.${modifiedClassName} {
    ${properties.map((el, idx) => `${idx !== 0 ? `\t` : ""}${el}: ${vals[idx] ? vals[idx] : processValuePart(vals[idx])}`).join(";\n")};
}\n`)
}
export const getPseudoElementDefinition = (properties = [], vals = [], className = '', pseudoElement = "") => {
  if (!properties.length || !vals.length) return "";
  let modifiedClassName = className.replace(/[.,#%+&:]/g, '\\$&');

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
  const width = breakPoints[classParts[1].split("_").at(-1)];
  return (
    `@media (${isMax ? "max-width" : "min-width"}: ${width}px) {
  ${classToPut.replace(/\n$/, "")}
}\n`);
}

export const addValueToPropNVals = (properties = [], vals = [], valsToAdd = [], isImportant = false) => {
  if (valsToAdd[0]) {
    properties.push(valsToAdd[0]);
    vals.push(`${valsToAdd[1]} ${isImportant ? "!important" : ""}`);
  }
}


export const processValuePart = (val = "", mappingObj = null, breakWordWithDash = false, isFontName = false, breakWord = false, breakWordWithSpace = false) => {

  const impString = /_imp$/.test(val) ? " !important" : "";
  val = val.replace(/_imp$/, "");
  let result = "";

  if (mappingObj) result = mappingObj[val];

  if (!result) {

    const newVal = val
      .replace(/([_\-.,\s])p(\d+)/g, "$1-$2")
      .replace("+", " ")
      .replace(/[A-Z]/g, match => '-' + match.toLowerCase());


    if (/^v/.test(newVal)) {
      return `var(-${newVal.replace(/^v/, "").replace(/[A-Z]/g, match => '-' + match.toLowerCase())})${impString}`;
    } else if (breakWordWithDash) {
      return newVal.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`) + impString;
    } else if (breakWordWithSpace) {
      return newVal.replace(/\+/g, " ") + impString;
    } else if (breakWord) {
      return newVal.replace(/[A-Z]/g, (match) => ` ${match.toLowerCase()}`) + impString;
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
  }
}