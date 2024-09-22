import { scrollSnapType } from "../mappings/_scroll.js";
import { addValueToPropNVals, getClassDefinition, getCompleteClassDefinition, getPseudoElementDefinition, processValuePart } from "./_generic.js";

export const scrollClasses = (classParts = [], className = "") => {

  // scroll_bar@className-[max/min]_breakpoint-hide

  // scroll_bar@className-[max/min]_breakpoint-wd:val&bgClr:value
  // scroll_bar_[wd/bgClr]@className-[max/min]_breakpoint-value

  // scroll_thumb@className-[max/min]_breakpoint-[ht:val&bgClr:val&border:val]
  // scroll_thumb_[wd/bgClr/border]@className-[max/min]_breakpoint-value

  // scroll_behavior-value

  // xm ==> x mandatory or xp ==> x proximity
  // scroll_snap-[max/min]_breakpoint-[align:val&pad:val&stop:val&type:val&margin:val]
  // scroll_snap_[type/align/stop/pad/margin]-[max/min]_breakpoint-value

  const properties = [];
  const vals = [];
  const value = classParts.at(-1);

  let targetClassName = "";
  let classToBuild = "";

  if (/@/.test(classParts[0])) targetClassName = classParts[0].split("@")[1];

  if (value === "hide") {
    addValueToPropNVals(properties, vals, ["display", "none"]);
    classToBuild = getPseudoElementDefinition(properties, vals, targetClassName, "-webkit-scrollbar");
  } else if (/^(scroll_bar)/.test(classParts[0])) {

    const beforeAt = classParts[0].split("@")[0];
    const beforeAtParts = beforeAt.split("_");

    if (beforeAtParts.length === 2) {
      const valParts = value.split("&");

      valParts.forEach(el => {
        const elParts = el.split(":");
        const prop = elParts[0];
        const tempValue = elParts[1];

        if (prop === "width") {
          addValueToPropNVals(properties, vals, ["width", processValuePart(tempValue)]);
        } else if (prop === "bgClr") {
          addValueToPropNVals(properties, vals, ["background-color", processValuePart(tempValue)]);
        }
      })

    } else if (beforeAtParts.length === 3) {
      const propType = beforeAtParts[2];
      if (propType === "width") {
        addValueToPropNVals(properties, vals, ["width", processValuePart(value)]);
      } else if (propType === "bgClr") {
        addValueToPropNVals(properties, vals, ["background-color", processValuePart(value)]);
      }
    }

    classToBuild = getPseudoElementDefinition(properties, vals, targetClassName, "-webkit-scrollbar");

  } else if (/^(scroll_thumb)/.test(classParts[0])) {

    const beforeAt = classParts[0].split("@")[0];
    const beforeAtParts = beforeAt.split("_");

    if (beforeAtParts.length === 2) {
      const valParts = value.split("&");

      valParts.forEach(el => {
        const elParts = el.split(":");
        const propType = elParts[0];
        const tempValue = elParts[1];

        if (propType === "width") {
          addValueToPropNVals(properties, vals, ["width", processValuePart(tempValue)]);
        } else if (propType === "bgClr") {
          addValueToPropNVals(properties, vals, ["background-color", processValuePart(tempValue)]);
        } else if (propType === "border") {
          let values = tempValue.split("_").map(el => processValuePart(el)).join(" ");
          addValueToPropNVals(properties, vals, ["border", values]);
        }

      })
    } else if (beforeAtParts.length === 3) {
      const propType = beforeAtParts[2];
      if (propType === "width") {
        addValueToPropNVals(properties, vals, ["width", processValuePart(value)]);
      } else if (propType === "bgClr") {
        addValueToPropNVals(properties, vals, ["background-color", processValuePart(value)]);
      } else if (propType === "border") {
        let values = value.split("_").map(el => processValuePart(el)).join(" ");
        addValueToPropNVals(properties, vals, ["border", values]);
      }
    }

    classToBuild = getPseudoElementDefinition(properties, vals, targetClassName, "-webkit-scrollbar-thumb");

  } else if (/^(scroll_behavior)/.test(classParts[0])) {
    addValueToPropNVals(properties, vals, ["scroll-behavior", processValuePart(value)]);
    classToBuild = getClassDefinition(properties, vals, className);
  } else if (/^(scroll_snap)/.test(classParts[0])) {

    const class1stParts = classParts[0].split("_");

    if (class1stParts.length === 2) {
      const valParts = value.split("&");

      valParts.forEach(el => {
        const elParts = el.split(":");
        const propType = elParts[0];
        const tempValue = elParts[1];

        if (propType === "type") {
          addValueToPropNVals(properties, vals, ["scroll-snap-type", processValuePart(tempValue, scrollSnapType)]);
        } else if (propType === "align") {
          addValueToPropNVals(properties, vals, ["scroll-snap-align", processValuePart(tempValue, null, false, false, true)]);
        } else if (propType === "stop") {
          addValueToPropNVals(properties, vals, ["scroll-snap-stop", processValuePart(tempValue)]);
        } else if (propType === "pad") {
          addValueToPropNVals(properties, vals, ["scroll-padding" + getDirection(tempValue), processValuePart(tempValue.split("_").at(-1))]);
        } else if (propType === "margin") {
          addValueToPropNVals(properties, vals, ["scroll-margin" + getDirection(tempValue), processValuePart(tempValue.split("_").at(-1))]);
        }
      })
    } else if (class1stParts.length === 3) {
      const propType = class1stParts[2];
      if (propType === "type") {
        addValueToPropNVals(properties, vals, ["scroll-snap-type", processValuePart(value, scrollSnapType)]);
      } else if (propType === "align") {
        addValueToPropNVals(properties, vals, ["scroll-snap-align", processValuePart(value, null, false, false, true)]);
      } else if (propType === "stop") {
        addValueToPropNVals(properties, vals, ["scroll-snap-stop", processValuePart(value)]);
      } else if (propType === "pad") {
        addValueToPropNVals(properties, vals, ["scroll-padding" + getDirection(value), processValuePart(value.split("_").at(-1))]);
      } else if (propType === "margin") {
        addValueToPropNVals(properties, vals, ["scroll-margin" + getDirection(value), processValuePart(value.split("_").at(-1))]);
      }
    }

    classToBuild = getClassDefinition(properties, vals, className);
  }


  return getCompleteClassDefinition(2, classToBuild, classParts);

}


const getDirection = (value = "") => {
  if (value.startsWith("t")) return "-top";
  if (value.startsWith("r")) return "-right";
  if (value.startsWith("b")) return "-bottom";
  if (value.startsWith("l")) return "-left";

  return "";
}