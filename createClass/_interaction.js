import { addValueToPropNVals, getClassDefinition, getCompleteClassDefinition, processValuePart } from "./_generic.js";

/**
 * Generates CSS classes for interaction-related properties, such as cursor styles, 
 * touch actions, pointer events, and other user interaction settings.
 * 
 * @param {Array} classParts - An array containing parts of the class name to identify the type and value.
 * @param {string} className - Optional class name for additional customization.
 * @param {boolean} returnOnlyPropNVal - If true, returns only property-value pairs without a complete class definition.
 * @returns {string} - The final CSS class or property-value pairs, depending on `returnOnlyPropNVal`.
 */

export const interactionClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // Supported class patterns:
  // - accent_color-[max/min]_breakpoint-value
  // - caret_color-[max/min]_breakpoint-value
  // - cursor-value
  // - pointer_events-value
  // - resize-[max/min]_breakpoint-value
  // - touch_act-value
  // - user_select-value

  const class1stPart = classParts[0];  // Extract the first part of the class name (e.g., "cursor" or "touch_act").
  const value = classParts.at(-1);     // Extract the last part of the class name (usually the value).
  const properties = [];  // Stores CSS property names.
  const vals = [];        // Stores the corresponding values.

  // Handle the special case for 'touch-action'.
  if (class1stPart === "touch_act") {
    addValueToPropNVals(properties, vals, [
      "touch-action", 
      processValuePart(value) 
    ]);
  } else {
    // For other interaction classes, replace underscores with hyphens to match CSS property names.
    addValueToPropNVals(properties, vals, [
      class1stPart.replace("_", "-"), 
      processValuePart(value) 
    ]);
  }

  // Generate the CSS class definition.
  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);

  // If only property-value pairs are requested, return them.
  if (returnOnlyPropNVal) return classToBuild;

  // Return the complete class definition with all required components.
  return getCompleteClassDefinition(2, classToBuild, classParts);
};
