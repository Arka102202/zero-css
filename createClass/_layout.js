import { addValueToPropNVals, getClassDefinition, getCompleteClassDefinition, processValuePart } from "./_generic.js";


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

// for display along with some basic properties
export const layoutClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

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
         
        addValueToPropNVals(properties, vals, ["flex-direction", processValuePart(value)]);
      } else if (prop === "justify") {
         
        addValueToPropNVals(properties, vals, [`justify-${type === "flex" ? "content" : "items"}`, processValuePart(value)]);
      } else if (prop === "align") {
         
        addValueToPropNVals(properties, vals, ["align-items", processValuePart(value)]);
      } else if (prop === "gap") {
        addValueToPropNVals(properties, vals, ["gap", processValuePart(value)]);
      }
    });
  }

  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);
  if(returnOnlyPropNVal) return classToBuild;
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

  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);
  if(returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);

}


// grid properties
export const gridClasses = (classParts = [], className) => {

  // grid-[max/min]_[breakpoint]-(col/row):Width_count&[gap/cGap/rGap]:value
  // grid-[max/min]_[breakpoint]-(col/row):width1,width2,....
  // grid-[max/min]_[breakpoint]-(col/row)Span:to_from

  // grid_col-[max/min]_[breakpoint]-(autoFill/autoFit)_10(vw/vh/px/rem)

  // grid_auto-[max/min]_[breakpoint]-cols:val&flow:val&rows:val
  // grid_auto_[columns/flow/rows]-[max/min]_[breakpoint]-value

  const properties = [];
  const vals = [];
  const valPart = classParts.at(-1);
  let valParts = valPart.split("&");

  if (/^grid_col/.test(classParts)) {
    valParts = valPart.split("_");
    addValueToPropNVals(properties, vals, [`grid-template-columns`, `repeat(${processValuePart(valParts[0])}, minmax(${processValuePart(valParts[1])}, 1fr))`]);
  } else if (/^grid_auto/.test(classParts)) {
    const class1stParts = classParts[0].split("_");

    if (class1stParts.length === 2) {
      valParts.forEach(el => {
        const elParts = el.split(":");
        const prop = elParts[0];
        const value = elParts.at(-1);

        if (prop === "cols") {
          addValueToPropNVals(properties, vals, [classParts[0] + "-columns", processValuePart(value)]);
        } else {
          addValueToPropNVals(properties, vals, [classParts[0] + "-" + prop, processValuePart(value)]);
        }
      })
    } else {
      const propName = classParts[0].replace(/_/g, "-");
      addValueToPropNVals(properties, vals, [propName, processValuePart(valPart)]);
    }
  } else if (!valPart.includes("span")) {
    valParts = valPart.split(":");
    addValueToPropNVals(properties, vals, ["grid-template-" + valParts[0] === "col" ? "columns" : "rows", valParts[0].split(",").map(el => processValuePart(el)).join(" ")]);
  } else if (valPart.includes("span")) {
    valParts = valPart.split(":");
    addValueToPropNVals(properties, vals, ["grid-" + valParts[0] === "col" ? "column" : "row", valParts[0].split("_").map(el => processValuePart(el)).join("/")]);
  } else {
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
  }

  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);
  if(returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);
}

// justify_[Content/items/self]
export const justifyClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // justify_[content/items/self]-[max/min]_{breakpoint}-value

  const classToBuild = getClassDefinition([classParts[0].replace("_", "-")], [processValuePart(classParts.at(-1))], className, returnOnlyPropNVal);
  if(returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);

}

// align_[Content/items/self]
export const alignClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // align_[content/items/self]-[max/min]_{breakpoint}-value

  const classToBuild = getClassDefinition([classParts[0].replace("_", "-")], [processValuePart(classParts.at(-1))], className, returnOnlyPropNVal);
  if(returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);


}

// gap
export const gapCLasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // gap-[max/min]_{breakpoint}-value
  // col_gap-[max/min]_{breakpoint}-value
  // row_gap-[max/min]_{breakpoint}-value

  const classToBuild = getClassDefinition([classParts[0].replace("_", "-").replace("col", "column")], [processValuePart(classParts.at(-1))], className, returnOnlyPropNVal);
  if(returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);

}


// order
export const orderClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // order-[max/min]_{breakpoint}-value

  const classToBuild = getClassDefinition([classParts[0]], [processValuePart(classParts.at(-1))], className, returnOnlyPropNVal);
  if(returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);


}

// position
export const positionClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // pos-[max/min]_{breakpoint}-value

  const classToBuild = getClassDefinition(["position"], [processValuePart(classParts.at(-1))], className, returnOnlyPropNVal);
  if(returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);

}


// overflow
export const overflowClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // overflow-[max/min]_{breakpoint}-value
  const classToBuild = getClassDefinition([classParts[0]], [processValuePart(classParts.at(-1))], className, returnOnlyPropNVal);
  if(returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);


}

// zIndex
export const zIndexClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // zIndex-[max/min]_{breakpoint}-value

  const classToBuild = getClassDefinition(["z-index"], [processValuePart(classParts.at(-1))], className, returnOnlyPropNVal);
  if(returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);

}

// trbl
export const trblClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // [top/right/bottom/left]-[max/min]_{breakpoint}-value

  const classToBuild = getClassDefinition([classParts.at(0)], [processValuePart(classParts.at(-1))], className, returnOnlyPropNVal);
  if(returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);

}


export const centerElemClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

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
     
    addValueToPropNVals(properties, vals, ["top", processValuePart(value)]);
    transformStr += "translateY(-50%) ";
  }
  if (/^(c|t|b)/.test(valPart) || /(top|bottom)$/.test(classParts[0])) {
     
    addValueToPropNVals(properties, vals, ["left", processValuePart(value)]);
    transformStr += "translateX(-50%)";
  }
  if (/^(l|r|t|b)/.test(valPart) || /(top|right|bottom|left)$/.test(classParts[0])) {
    const tempSide = /^center/.test(classParts[0]) ? valPart.split("_")[0] : classParts[0].split("_")[1];
    addValueToPropNVals(properties, vals, [sides[tempSide], "0"]);
  }

  addValueToPropNVals(properties, vals, ["transform", transformStr]);

  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);
  if(returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);

}

export const columnClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // column-[max/min]_{breakpoint}-count:val&fill:val&gap:val&span:val&wd:val
  // column_[count/fill/gap/span/width]-[max/min]_{breakpoint}-value
  // column_rule-[max/min]_{breakpoint}-value
  // column_rule_[color/style/width]-[max/min]_{breakpoint}-value

   // columns-[max/min]_{breakpoint}-value

  const properties = [];
  const vals = [];
  const valPart = classParts.at(-1);
  const class1stParts = classParts[0].split("_");

  if (classParts[0] === "columns") {

    const valParts = valPart.split("_");
    addValueToPropNVals(properties, vals, [classParts[0], valParts.map(el => processValuePart(el)).join(" ")]);

  } else if (!/^column_rule/.test(classParts[0])) {

    const prop1stPart = classParts[0];

    if (class1stParts.length === 1) {
      const valParts = valPart.split("&");

      valParts.forEach(el => {
        const elParts = el.split(":");
        const prop = elParts[0];
        const value = elParts[1];
        if (prop === "wd") {
          addValueToPropNVals(properties, vals, [prop1stPart + "-width", processValuePart(value)]);
        } else {
          addValueToPropNVals(properties, vals, [prop1stPart + "-" + prop, processValuePart(value)]);
        }
      })
    } else {
      const propName = classParts[0].replace("_", "-");
      addValueToPropNVals(properties, vals, [propName, processValuePart(valPart)]);
    }
  } else {
    const propName = classParts[0].replace("_", "-");
    if (class1stParts.length === 2) {
      const valParts = valPart.split("_");
      addValueToPropNVals(properties, vals, [propName, valParts.map(el => processValuePart(el)).join(" ")]);
    } else {
      addValueToPropNVals(properties, vals, [propName, processValuePart(valPart)]);
    }
  }

  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);
  if(returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);
}

// object-position and object-fit
export const objClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // obj_[fit/pos]-[max/min]_{breakpoint}-value

  const propType = classParts[0].split("_");

  const classToBuild = getClassDefinition(["object" + propType === "pos" ? "position" : "fit"], [processValuePart(classParts.at(-1))], className, returnOnlyPropNVal);
  if(returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);

}