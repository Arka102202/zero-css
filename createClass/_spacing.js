import { addValueToPropNVals, getClassDefinition, getCompleteClassDefinition, processValuePart } from "./_generic.js";

export const spacingClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // p_[x/y/t/r/b/l]-[max/min]_{breakpoint}-value
  // m_[x/y/t/r/b/l]-[max/min]_{breakpoint}-value

  const properties = [];
  const vals = [];
  const propName = /^p/.test(classParts[0]) ? "padding" : "margin";
  const type = classParts[0].split("_").at(-1);
  const valPart = classParts.at(-1);

  if (/^(?:p|m)$/.test(type)) {
    addValueToPropNVals(properties, vals, [propName, `${processValuePart(valPart)}`]);
  } else {
    if (/^(r|x|p|m)/.test(type)) {
      addValueToPropNVals(properties, vals, [propName + "-right", processValuePart(valPart)]);
    } if (/^(l|x|p|m)/.test(type)) {
      addValueToPropNVals(properties, vals, [propName + "-left", processValuePart(valPart)]);
    } if (/^(t|y|p|m)/.test(type)) {
      addValueToPropNVals(properties, vals, [propName + "-top", processValuePart(valPart)]);
    } if (/^(b|y|p|m)/.test(type)) {
      addValueToPropNVals(properties, vals, [propName + "-bottom", processValuePart(valPart)]);
    }
  }

  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);
  if (returnOnlyPropNVal) return classToBuild;

  return getCompleteClassDefinition(2, classToBuild, classParts);

}