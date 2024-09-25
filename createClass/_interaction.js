import { addValueToPropNVals, getClassDefinition, getCompleteClassDefinition, processValuePart } from "./_generic.js";

export const interactionClasses = (classParts = [], className = "") => {

  // accent_clr-[max/min]_breakpoint-value
  // cursor-value
  // pointer_events-value
  // resize-[max/min]_breakpoint-value
  // touch_act-value
  // user_select-value

  const class1stPart = classParts[0];
  const value = classParts.at(-1);
  const properties = [];
  const vals = [];

  if (class1stPart === "accent_clr") {
    addValueToPropNVals(properties, vals, ["accent-color", processValuePart(value)]);
  } else if (class1stPart === "cursor") {
    addValueToPropNVals(properties, vals, ["cursor", processValuePart(value)]);
  } else if (class1stPart === "pointer_events") {
    addValueToPropNVals(properties, vals, ["pointer-events", processValuePart(value)]);
  } else if (class1stPart === "resize") {
    addValueToPropNVals(properties, vals, ["resize", processValuePart(value)]);
  } else if (class1stPart === "resize") {
    addValueToPropNVals(properties, vals, ["resize", processValuePart(value)]);
  } else if (class1stPart === "touch_act") {
    addValueToPropNVals(properties, vals, ["touch-action", processValuePart(value)]);
  } else if (class1stPart === "user_select") {
    addValueToPropNVals(properties, vals, ["user-select", processValuePart(value)]);
  }

  const classToBuild = getClassDefinition(properties, vals, className);
  return getCompleteClassDefinition(2, classToBuild, classParts);

}