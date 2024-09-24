import { addValueToPropNVals, getClassDefinition, getCompleteClassDefinition, processValuePart } from "./_generic.js";

// for display along with some basic properties
export const layoutClasses = (classParts = [], className = "") => {

  // d-[max/min]_{breakpoint}-[block/inline/inline-block/flex/grid/none]
  // d-[max/min]_[breakpoint]-(flex/grid)&[flexDir:val]&justify:val&align:val&gap:val
  const properties = [];
  const vals = [];
  const valPart = classParts.at(-1);
  let type = "";

  if (!valPart.includes("&")) {
    addValueToPropNVals(properties, vals, ["display", valPart]);
  } else {
    const valParts = valPart.split("&");
    valParts.forEach(el => {
      const elParts = el.split(":");
      const prop = elParts[0];
      const value = elParts.at(-1);

      if (prop === value) {
        addValueToPropNVals(properties, vals, ["display", processValuePart(el)]);
        type = el;
      } else if (prop === "flexDir") {
        addValueToPropNVals(properties, vals, ["flex-direction", processValuePart(value, null, true)]);
      } else if (prop === "justify") {
        addValueToPropNVals(properties, vals, [`justify-${type === "flex" ? "content" : "items"}`, processValuePart(value, null, true)]);
      } else if (prop === "align") {
        addValueToPropNVals(properties, vals, ["align-items", processValuePart(value, null, true)]);
      } else if (prop === "gap") {
        addValueToPropNVals(properties, vals, ["gap", processValuePart(value)]);
      }
    });
  }

  const classToBuild = getClassDefinition(properties, vals, className);
  return getCompleteClassDefinition(2, classToBuild, classParts);
}

// flex properties
export const flexClasses = (classParts = [], className) => {

  // flex_dir-[max/min]_{breakpoint}-[row/col/row_r/col_r]
  // flex_grow-[max/min]_{breakpoint}-[0/1]
  // flex_shrink-[max/min]_{breakpoint}-[0/1]
  // flex_wrap-[max/min]_{breakpoint}-[wrap/no_wrap/wrap_r]
  // flex-[max/min]_{breakpoint}-[grow_shrink_basis]


  // flex_child-[max/min]_{breakpoint}-even
  // flex_child-[max/min]_{breakpoint}-fixed_wd
  // flex_child-[max/min]_{breakpoint}-auto

  // if any one of the last Three add the following:
  // .flex > * {
  //   max-width: 100%;
  // }

  const properties = [];
  const vals = [];
  const valPart = classParts.at(-1);
  const class1stPart = classParts[0];

  if (/^flex_dir/.test(class1stPart)) {
    addValueToPropNVals(properties, vals, ["flex-direction", processValuePart(valPart)]);
  } else if (/^flex_grow/.test(class1stPart)) {
    addValueToPropNVals(properties, vals, ["flex-grow", processValuePart(valPart)]);
  } else if (/^flex_shrink/.test(class1stPart)) {
    addValueToPropNVals(properties, vals, ["flex-shrink", processValuePart(valPart)]);
  } else if (/^flex_wrap/.test(class1stPart)) {
    addValueToPropNVals(properties, vals, ["flex-wrap", processValuePart(valPart)]);
  } else if (/^flex_child/.test(class1stPart)) {
    addValueToPropNVals(properties, vals, ["max-width", "100%"]);
    if (valPart === "even") {
      addValueToPropNVals(properties, vals, ["flex", "1 0 0%"]);
    } else if (valPart === "fixed_wd") {
      addValueToPropNVals(properties, vals, ["flex", "0 0 auto"]);
    } else if (valPart === "auto") {
      addValueToPropNVals(properties, vals, ["flex", "0 0 auto"]);
      addValueToPropNVals(properties, vals, ["width", "auto"], true);
    }
  } else {
    addValueToPropNVals(properties, vals, ["flex", processValuePart(valPart.replace(/_/g, " "))]);
  }

  const classToBuild = getClassDefinition(properties, vals, className);
  return getCompleteClassDefinition(2, classToBuild, classParts);

}


// grid properties
export const gridClasses = (classParts = [], className) => {

  // grid-[max/min]_[breakpoint]-(col/row):Width_count&[gap/cGap/rGap]:value
  // grid-[max/min]_[breakpoint]-(col/row):width1,width2,....
  // grid-[max/min]_[breakpoint]-(col/row)Span:to_from

  // grid_col-[max/min]_[breakpoint]-(autoFill/autoFit)_10(vw/vh/px/rem)

  const properties = [];
  const vals = [];
  const valPart = classParts.at(-1);
  let valParts = valPart.split("&");

  if (valParts.length > 0) {
    valParts.forEach(el => {
      const elParts = el.split(":");
      const prop = elParts[0];
      const value = elParts.at(-1);

      if (/^(col|row)$/.test(prop)) {
        const valueParts = value.split("_");
        const width = processValuePart(valueParts[0]);
        const count = processValuePart(valueParts[1]);
        addValueToPropNVals(properties, vals, ["grid-template-" + prop === "col" ? "columns" : "rows", `repeat(${count}, ${width})`]);
      } else if (/gap$/.test(prop.toLowerCase())) {
        const gapType = prop === "gap" ? "gap" : (prop === "rGap" ? "row-gap" : "column-gap");
        addValueToPropNVals(properties, vals, [gapType, processValuePart(value)]);
      }
    })
  } else if (!valPart.includes("span")) {
    valParts = valPart.split(":");
    addValueToPropNVals(properties, vals, ["grid-template-" + valParts[0] === "col" ? "columns" : "rows", valParts[0].split(",").map(el => processValuePart(el)).join(" ")]);
  } else if (valPart.includes("span")) {
    valParts = valPart.split(":");
    addValueToPropNVals(properties, vals, ["grid-" + valParts[0] === "col" ? "column" : "row", valParts[0].split("_").map(el => processValuePart(el)).join("/")]);
  } else if (/^grid_col/.test(classParts)) {
    valParts = valPart.split("_");
    addValueToPropNVals(properties, vals, [`grid-template-columns`, `repeat(${processValuePart(valParts[0])}, minmax(${processValuePart(valParts[1])}, 1fr))`]);
  }

  const classToBuild = getClassDefinition(properties, vals, className);
  return getCompleteClassDefinition(2, classToBuild, classParts);
}

// justify_[Content/items/self]
export const justifyClasses = (classParts = [], className = "") => {

  // justify_[content/items/self]-[max/min]_{breakpoint}-value

  const classToBuild = getClassDefinition([classParts[0].replace("_", "-")], [processValuePart(classParts.at(-1))], className);
  return getCompleteClassDefinition(2, classToBuild, classParts);

}

// align_[Content/items/self]
export const alignClasses = (classParts = [], className = "") => {

  // align_[content/items/self]-[max/min]_{breakpoint}-value

  const classToBuild = getClassDefinition([classParts[0].replace("_", "-")], [processValuePart(classParts.at(-1))], className);
  return getCompleteClassDefinition(2, classToBuild, classParts);


}

// gap
export const gapCLasses = (classParts = [], className = "") => {

  // gap-[max/min]_{breakpoint}-value
  // col_gap-[max/min]_{breakpoint}-value
  // row_gap-[max/min]_{breakpoint}-value

  const classToBuild = getClassDefinition([classParts[0].replace("_", "-").replace("col", "column")], [processValuePart(classParts.at(-1))], className);
  return getCompleteClassDefinition(2, classToBuild, classParts);

}


// order
export const orderClasses = (classParts = [], className = "") => {

  // order-[max/min]_{breakpoint}-value

  const classToBuild = getClassDefinition([classParts[0]], [processValuePart(classParts.at(-1))], className);
  return getCompleteClassDefinition(2, classToBuild, classParts);


}

// position
export const positionClasses = (classParts = [], className = "") => {

  // pos-[max/min]_{breakpoint}-value

  const classToBuild = getClassDefinition(["position"], [processValuePart(classParts.at(-1))], className);
  return getCompleteClassDefinition(2, classToBuild, classParts);

}


// overflow
export const overflowClasses = (classParts = [], className = "") => {

  // overflow-[max/min]_{breakpoint}-value
  const classToBuild = getClassDefinition([classParts[0]], [processValuePart(classParts.at(-1))], className);
  return getCompleteClassDefinition(2, classToBuild, classParts);


}

// zIndex
export const zIndexClasses = (classParts = [], className = "") => {

  // zIndex-[max/min]_{breakpoint}-value

  const classToBuild = getClassDefinition(["z-index"], [processValuePart(classParts.at(-1))], className);
  return getCompleteClassDefinition(2, classToBuild, classParts);

}

// trbl
export const trblClasses = (classParts = [], className = "") => {

  // [top/right/bottom/left]-[max/min]_{breakpoint}-value

  const classToBuild = getClassDefinition([classParts.at(0)], [processValuePart(classParts.at(-1))], className);
  return getCompleteClassDefinition(2, classToBuild, classParts);

}


export const centerElemClasses = (classParts = [], className = "") => {

  // center_el-[max/min]_{breakpoint}-[c/t/r/b/l]_[abs/fix]
  // align_[left/right/top/bottom]-[max/min]_{breakpoint}-[abs/fix]_value

  const properties = [];
  const vals = [];
  const valPart = classParts.at(-1);
  const value = /^center/.test(classParts[0]) ? "50%" : processValuePart(valPart.split("_")[1]);
  const positionTypeABS = /^center/.test(classParts[0]) ? /abs$/.test(valPart) : /^abs/.test(valPart)
  let transformStr = "";

  addValueToPropNVals(properties, vals, ["position", positionTypeABS ? "absolute" : "fixed"]);

  if (/^(c|l|r)/.test(valPart) || /(right|left)$/.test(classParts[0])) {
    addValueToPropNVals(properties, vals, ["top", value]);
    transformStr += "translateY(-50%) ";
  }
  if (/^(c|t|b)/.test(valPart) || /(top|bottom)$/.test(classParts[0])) {
    addValueToPropNVals(properties, vals, ["left", value]);
    transformStr += "translateX(-50%)";
  }
  if (/^(l|r|t|b)/.test(valPart) || /(top|right|bottom|left)$/.test(classParts[0])) {
    const tempSide = /^center/.test(classParts[0]) ? valPart.split("_")[0] : classParts[0].split("_")[1];
    addValueToPropNVals(properties, vals, [sides[tempSide], "0"]);
  }

  addValueToPropNVals(properties, vals, ["transform", transformStr]);

  const classToBuild = getClassDefinition(properties, vals, className);
  return getCompleteClassDefinition(2, classToBuild, classParts);

}

const sides = {
  t: "top",
  r: "right",
  b: "bottom",
  l: "left",
  top: "top",
  right: "right",
  bottom: "bottom",
  left: "left"
}