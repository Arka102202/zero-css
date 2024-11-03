import { addValueToPropNVals, getClassDefinition, getCompleteClassDefinition, processValuePart } from "./_generic.js";

export const sizeClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {
  // [max/min]_[wd/ht/size]-10_imp ==> width: 10%;
  // [max/min]_[wd/ht/size]-10(rem/vh/vw/px)_imp => width: 10(rem/vh/vw/px);
  // [max/min]_[wd/ht/size]-xxl-[10/10(rem/vh/vw/px)]_imp => add @query rule along with the class
  // [max/min]_[wd/ht/size]-[max/min]_xxl-[10/10(rem/vh/vw/px)]_imp => add @query rule along with the class

  const val = processValuePart(classParts.at(-1));
  const properties = [];
  const vals = [];

  addValueToPropNVals(properties, vals, [
    /(wd|size)$/.test(classParts[0]) ? `${!/^(max|min)/.test(classParts[0]) ? "" : `${classParts[0].split("_")[0]}-`}width` : "", val
  ]);
  addValueToPropNVals(properties, vals, [
    /(ht|size)$/.test(classParts[0]) ? `${!/^(max|min)/.test(classParts[0]) ? "" : `${classParts[0].split("_")[0]}-`}height` : "", val
  ]);

  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);
  if(returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);
}

// aspect-ratio
export const aspectClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // aspect_ratio-[max/min]_{breakpoint}-value_imp

  const val = processValuePart(classParts.at(-1));
  const classToBuild = getClassDefinition(["aspect-ratio"], [val], className, returnOnlyPropNVal);
  if(returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);

}