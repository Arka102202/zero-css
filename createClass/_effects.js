import { addValueToPropNVals, getClassDefinition, getCompleteClassDefinition, processValuePart } from "./_generic.js";

export const filterClasses = (classParts = [], className = "") => {

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
        let values = value.split("_").map(el => processValuePart(el));
        filterVal += `drop-shadow(${values.join(" ")}) `;
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
      let values = valPart.split("_");
      values = values.map(el => processValuePart(el));
      filterVal += `drop-shadow(${values.join(" ")}) `;

    }
  }

  addValueToPropNVals(properties, vals, [filterKind === "filter" ? "filter" : "backdrop-filter", filterVal]);

  const classToBuild = getClassDefinition(properties, vals, className);
  return getCompleteClassDefinition(2, classToBuild, classParts);
}



export const blendClasses = (classParts = [], className = "") => {

  // [mix/bg]_blend-[max/min]_{breakpoint}-value

  const properties = [];
  const vals = [];

  const blendType = classParts[0].split("_")[0] === "bg" ? "background" : "mix";

  addValueToPropNVals(properties, vals, [blendType + "-blend-mode", processValuePart(classParts.at(-1), null, true)]);


  const classToBuild = getClassDefinition(properties, vals, className);
  return getCompleteClassDefinition(2, classToBuild, classParts);

}


export const opacityClasses = (classParts = [], className = "") => {

  // opacity-[max/min]_{breakpoint}-value


  const classToBuild = getClassDefinition(["opacity"], [processValuePart(classParts.at(-1))], className);
  return getCompleteClassDefinition(2, classToBuild, classParts);

}


export const shadowClasses = (classParts = [], className = "") => {

  // shadow-[max/min]_{breakpoint}-value

  const values = classParts.at(-1).split("_");
  const val = values.map(el => processValuePart(el)).join(" ");

  const classToBuild = getClassDefinition(["box-shadow"], [val], className);
  return getCompleteClassDefinition(2, classToBuild, classParts);
}

export const textGradClasses = (classParts = [], className = "") => {

  // text_grad-[max/min]_{breakpoint}-value

  const properties = [];
  const vals = [];

  addValueToPropNVals(properties, vals, ["color", "transparent"]);
  addValueToPropNVals(properties, vals, ["background", processValuePart(classParts.at(-1))]);
  addValueToPropNVals(properties, vals, ["background-clip", "text"]);


  const classToBuild = getClassDefinition(properties, vals, className);
  return getCompleteClassDefinition(2, classToBuild, classParts);

}