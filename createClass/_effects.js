import { addValueToPropNVals, getClassDefinition, getCompleteClassDefinition, processValuePart } from "./_generic.js";

export const filterClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // filter-[max/min]_{breakpoint}-blur:val&brightness:val&dropShadow:val&....
  // filter_[blur/brightness/contrast/shadow/gray/hue/invert/sat/sepia/dropShadow]-[max/min]_{breakpoint}-value
  // bdFilter-[max/min]_{breakpoint}-blur:val&brightness:val&....
  // bdFilter_[blur/brightness/contrast/shadow/gray/hue/invert/sat/sepia/dropShadow]-[max/min]_{breakpoint}-value

  const properties = [];
  const vals = [];
  const valPart = classParts.at(-1);

  const filterKind = classParts[0].split("_").at(0);
  const filterType = classParts[0].split("_").at(-1);
  let filterVal = "";

  if (/^(filter|bdFilter)$/.test(filterType)) {

    const valParts = valPart.split("&");

    valParts.forEach(el => {
      const elParts = el.split(":");
      const prop = elParts[0];
      const value = elParts[1];

      if (prop === "blur") {
        filterVal += `blur(${processValuePart(value)}) `;

      } else if (prop === "brightness") {
        filterVal += `brightness(${processValuePart(value)}) `;

      } else if (prop === "contrast") {
        filterVal += `contrast(${processValuePart(value)}) `;

      } else if (prop === "shadow") {
        filterVal += `shadow(${processValuePart(value)}) `;

      } else if (prop === "gray") {
        filterVal += `gray(${processValuePart(value)}) `;

      } else if (prop === "hue") {
        filterVal += `hue(${processValuePart(value)}) `;

      } else if (prop === "invert") {
        filterVal += `invert(${processValuePart(value)}) `;

      } else if (prop === "sat") {
        filterVal += `saturation(${processValuePart(value)}) `;

      } else if (prop === "sepia") {
        filterVal += `sepia(${processValuePart(value)}) `;

      } else if (prop === "dropShadow") {
        filterVal += `drop-shadow(${processValuePart(value)}) `;
      }
    })

  } else {
    if (filterType === "blur") {
      filterVal += `blur(${processValuePart(valPart)}) `;

    } else if (filterType === "brightness") {
      filterVal += `brightness(${processValuePart(valPart)}) `;

    } else if (filterType === "contrast") {
      filterVal += `contrast(${processValuePart(valPart)}) `;

    } else if (filterType === "shadow") {
      filterVal += `shadow(${processValuePart(valPart)}) `;

    } else if (filterType === "gray") {
      filterVal += `gray(${processValuePart(valPart)}) `;

    } else if (filterType === "hue") {
      filterVal += `hue(${processValuePart(valPart)}) `;

    } else if (filterType === "invert") {
      filterVal += `invert(${processValuePart(valPart)}) `;

    } else if (filterType === "sat") {
      filterVal += `saturation(${processValuePart(valPart)}) `;

    } else if (filterType === "sepia") {
      filterVal += `sepia(${processValuePart(valPart)}) `;

    } else if (filterType === "dropShadow") {
      filterVal += `drop-shadow(${processValuePart(valPart)}) `;
    }
  }

  addValueToPropNVals(properties, vals, [filterKind === "filter" ? "filter" : "backdrop-filter", filterVal]);

  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);
  if(returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);
}

export const blendClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // [mix/bg]_blend-[max/min]_{breakpoint}-value

  const properties = [];
  const vals = [];

  const blendType = classParts[0].split("_")[0] === "bg" ? "background" : "mix";

   
  addValueToPropNVals(properties, vals, [blendType + "-blend-mode", processValuePart(classParts.at(-1))]);


  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);
  if(returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);

}

export const opacityClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // opacity-[max/min]_{breakpoint}-value


  const classToBuild = getClassDefinition(["opacity"], [processValuePart(classParts.at(-1))], className, returnOnlyPropNVal);
  if(returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);

}

export const shadowClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // [txt_]shadow-[max/min]_{breakpoint}-value

  const value = processValuePart(classParts.at(-1));

  const classToBuild = getClassDefinition([classParts[0] === "shadow" ? "box-shadow" : "text-shadow"], [value], className, returnOnlyPropNVal);
  if(returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);
}

export const textGradClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // text_grad-[max/min]_{breakpoint}-value

  const properties = [];
  const vals = [];

  addValueToPropNVals(properties, vals, ["color", "transparent"]);
  addValueToPropNVals(properties, vals, ["background", processValuePart(classParts.at(-1))]);
  addValueToPropNVals(properties, vals, ["background-clip", "text"]);


  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);
  if(returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);

}

export const backFaceClass = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // backface_visibility-[max/min]_{breakpoint}-value


  const classToBuild = getClassDefinition(["backface-visibility"], [processValuePart(classParts.at(-1))], className, returnOnlyPropNVal);
  if(returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);

}

export const content_visibilityClass = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // content_visibility-[max/min]_{breakpoint}-value


  const classToBuild = getClassDefinition(["content-visibility"], [processValuePart(classParts.at(-1))], className, returnOnlyPropNVal);
  if(returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);

}