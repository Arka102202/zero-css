import { addValueToPropNVals, getClassDefinition, getCompleteClassDefinition, getPseudoElementDefinition, processValuePart } from "./_generic.js";


/**
 * Generates CSS classes for different scroll property.
 * Some Special Class definitions:
 * 1. scroll_bar_[./#][className/id/element]-hide -- will hide the scroll bar.
 * 
 * @param {Array} classParts - Splits the className by the delimiter "-"
 * @param {string} className - A string representing the base class name.
 * @param {boolean} returnOnlyPropNVal - If true, returns only the CSS property-value 
 *                                       mappings instead of the complete class definition.
 * @returns {string} - Returns a CSS class definition string or returns only the CSS property-value 
 *                                       mappings.
 * 
 */

export const scrollClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // scroll_bar_[./#][className/element/id]-[max/min]_breakpoint-hide

  // scroll_bar_[./#][className/element/id]-[max/min]_breakpoint-wd:val&bgClr:value
  // scroll_bar_[./#][className/element/id]_[width/bgClr]-[max/min]_breakpoint-value

  // scroll_thumb_[./#][className/element/id]-[max/min]_breakpoint-[ht:val&bgClr:val&border:val&borderRad:val]
  // scroll_thumb_[./#][className/element/id]_[height/bgClr/border/borderRad]-[max/min]_breakpoint-value

  // scroll_behavior-value
  // overscroll_behavior-[max/min]_breakpoint-value

  // xm ==> x mandatory or xp ==> x proximity
  // scroll_snap-[max/min]_breakpoint-[align:val&padding:val&stop:val&type:val&margin:val]
  // scroll_snap_[type/align/stop/padding/margin]-[max/min]_breakpoint-value

  // to store different properties name
  const properties = [];
  // to store different properties val
  const vals = [];

  // getting the value part from the class definition
  const value = classParts.at(-1);

  let callPseudo = false, pseudoElement = "", dirPart = { padding: "", margin: "" };

  let classToBuild = "";

  const class1stParts = classParts[0].split("_");

  // for pseudo class definitions
  let targetClassName = class1stParts[2] ? class1stParts[2] : "";

  // for storing the scroll bar and thumb property values
  const scroll_bar_thumb = {
    width: "",
    height: "",
    "background-color": "",
    border: "",
    "border-radius": "",
  };

  // for storing scroll snap properties
  const scrollSnap = {
    "scroll-snap-align": "",
    "scroll-snap-type": "",
    "scroll-snap-stop": "",
    "scroll-padding": "",
    "scroll-margin": "",
  };


  if (value === "hide") {

    callPseudo = true;
    pseudoElement = "-webkit-scrollbar";
    addValueToPropNVals(properties, vals, ["display", "none"]);

  } else if (/^(scroll_bar)/.test(classParts[0])) {

    callPseudo = true;
    pseudoElement = "-webkit-scrollbar";

    if (class1stParts.length === 3) {
      const valParts = value.split("&");

      valParts.forEach(el => {
        const elParts = el.split(":");
        const prop = elParts[0];
        const tempValue = elParts[1];
        getVal(prop, tempValue, scroll_bar_thumb);
      })

    } else if (class1stParts.length === 4) {
      const propType = class1stParts[3];
      getVal(propType, value, scroll_bar_thumb);
    }

  } else if (/^(scroll_thumb)/.test(classParts[0])) {

    callPseudo = true;
    pseudoElement = "-webkit-scrollbar-thumb";

    if (class1stParts.length === 3) {
      const valParts = value.split("&");

      valParts.forEach(el => {
        const elParts = el.split(":");
        const propType = elParts[0];
        const tempValue = elParts.at(-1);
        getVal(propType, tempValue, scroll_bar_thumb);
      })
    } else if (class1stParts.length === 4) {
      const propType = class1stParts[3];
      getVal(propType, value, scroll_bar_thumb);
    }
  } else if (/^(scroll_behavior)/.test(classParts[0])) {
    addValueToPropNVals(properties, vals, ["scroll-behavior", processValuePart(value)]);
  } else if (/^(overscroll_behavior)/.test(classParts[0])) {
    addValueToPropNVals(properties, vals, ["overscroll-behavior", processValuePart(value)]);
  } else if (/^(scroll_snap)/.test(classParts[0])) {

    const class1stParts = classParts[0].split("_");

    if (class1stParts.length === 2) {
      const valParts = value.split("&");

      valParts.forEach(el => {
        const elParts = el.split(":");
        const propType = elParts[0];
        const valParts = elParts.at(-1).split("+");
        const valPart = valParts.at(-1);
        if (/(?:pad|margin)/.test(propType)) {
          dirPart[propType] = valParts[0];
        }

        getVal(propType, valPart, scrollSnap);
      });

    } else if (class1stParts.length === 3) {
      const propType = class1stParts[2];
      const valParts = value.split("+");
      const valPart = valParts.at(-1);
      if (/(?:pad|margin)/.test(propType)) {
        dirPart[propType] = valParts[0];
      }
      getVal(propType, valPart, scrollSnap);
    }
  }

  Object.entries(scroll_bar_thumb).forEach(([key, val]) => {
    if (val) addValueToPropNVals(properties, vals, [key, val]);
  })

  Object.entries(scrollSnap).forEach(([key, val]) => {
    let dir = "";
    if (/(?:padding|margin)$/.test(key)) {
      dir = dirPart[key.split("-")[1]];
    }
    if (val) addValueToPropNVals(properties, vals, [key + getDirection(dir), val]);
  })

  if (callPseudo) {
    classToBuild = getPseudoElementDefinition(properties, vals, targetClassName, pseudoElement, returnOnlyPropNVal);
  }
  else {
    classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);
  }
  if (returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);

}


const getDirection = (value = "") => {
  if (value.startsWith("t")) return "-top";
  if (value.startsWith("r")) return "-right";
  if (value.startsWith("b")) return "-bottom";
  if (value.startsWith("l")) return "-left";

  return "";
}

const getVal = (propType = "", value = "", propValObj = {}) => {
  if (/(?:height|ht)/.test(propType)) {
    propValObj.height = processValuePart(value);
  } else if (/(?:width|wd)/.test(propType)) {
    propValObj.width = processValuePart(value);
  } else if (/bgClr/.test(propType)) {
    propValObj["background-color"] = processValuePart(value);
  } else if (/^border$/.test(propType)) {
    propValObj.border = processValuePart(value);
  } else if (/^borderRad$/.test(propType)) {
    propValObj["border-radius"] = processValuePart(value);
  } else if (propType === "type") {
    propValObj["scroll-snap-align"] = processValuePart(value);
  } else if (propType === "align") {
    propValObj["scroll-snap-type"] = processValuePart(value);
  } else if (propType === "stop") {
    propValObj["scroll-snap-stop"] = processValuePart(value);
  } else if (propType === "padding") {
    propValObj["scroll-padding"] = processValuePart(value);
  } else if (propType === "margin") {
    propValObj["scroll-margin"] = processValuePart(value);
  }
}