import { flexDir, flexWrap, layoutAlignments, sides } from "../mappings/_layout.js";
import { addValueToPropNVals, getClassDefinition, getCompleteClassDefinition, processValuePart } from "./_generic.js";

// for display along with some basic properties
export const layoutClasses = (classParts = [], className = "") => {

  // d-[max/min]_{breakpoint}-[block/inline/inline-block/flex/grid/none]
  // d-[max/min]_{breakpoint}-flex_[row/col]_c_c_[1/10(vw/vh/rem/px)]
  // d-[max/min]_{breakpoint}-flex_[row/col]_c_c_[1/10(vw/vh/rem/px)]
  // d-[max/min]_{breakpoint}-grid_c_c
  const properties = [];
  const vals = [];
  const valPart = classParts.at(-1);
  const valParts = valPart.split("_");
  const len = valParts.length;
  const hasFlexDir = /^flex_(row|col)/.test(valPart);

  for (let i = 0; i < len; i++) {

    const valPart = valParts[i];

    if (i === 0) {
      addValueToPropNVals(properties, vals, ["display", processValuePart(valPart)]);
    } else if (len >= 4 && /^(row|col)/.test(valPart)) {
      addValueToPropNVals(properties, vals, ["flex-direction", processValuePart(valPart, flexDir)]);
    } else if ((hasFlexDir && i === 2) || (len <= 4 && i === 1)) {
      addValueToPropNVals(properties, vals, [`justify-${valParts[0] === "flex" ? "content" : "items"}`, processValuePart(valPart, layoutAlignments)]);
    } else if ((hasFlexDir && i === 3) || (len <= 4 && i === 2)) {
      addValueToPropNVals(properties, vals, ["align-items", processValuePart(valPart, layoutAlignments)]);
    } else
      addValueToPropNVals(properties, vals, ["gap", processValuePart(valPart)]);
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
  let classToBuild = "";
  const valPart = classParts.at(-1);
  const class1stPart = classParts[0];

  if (/^flex_dir/.test(class1stPart)) {
    addValueToPropNVals(properties, vals, ["flex-direction", processValuePart(valPart, flexDir)]);
  } else if (/^flex_grow/.test(class1stPart)) {
    addValueToPropNVals(properties, vals, ["flex_grow", processValuePart(valPart)]);
  } else if (/^flex_shrink/.test(class1stPart)) {
    addValueToPropNVals(properties, vals, ["flex_shrink", processValuePart(valPart)]);
  } else if (/^flex_wrap/.test(class1stPart)) {
    addValueToPropNVals(properties, vals, ["flex_wrap", processValuePart(valPart, flexWrap)]);
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

  classToBuild = getClassDefinition(properties, vals, className);

  return getCompleteClassDefinition(2, classToBuild, classParts);

}


// grid properties
export const gridClasses = (classParts = [], className) => {

  // grid-[max/min]_{breakpoint}-col_colCount_r_10/10vw/vh/px/rem/fr
  // grid-[max/min]_{breakpoint}-col_colCount_r_10/10vw/vh/px/rem/fr_g_10/10(vw/vh/px/rem/fr
  // grid-[max/min]_{breakpoint}-col_colCount_r_10/10vw/vh/px/rem/fr_cg_10/10(vw/vh/px/rem/fr
  // grid-[max/min]_{breakpoint}-col_10_20_30_(rem/vw/vh/px/fr)
  // grid-[max/min]_{breakpoint}-col_span _1_2 or _2

  // grid-col_(auto-fit/auto-fill)_10(vw/vh/px/rem)

  // grid-[max/min]_{breakpoint}-row_r_10/10vw/vh/px/rem/fr
  // grid-[max/min]_{breakpoint}-row_10_20_30_(rem/vw/vh/px)
  // grid-[max/min]_{breakpoint}-row_span _1_2 or _2

  const properties = [];
  const vals = [];
  const valPart = classParts.at(-1);
  const valParts = valPart.split("_");

  if (valParts[1] !== "span") {

    // regex to get the repeat dimension and gap value
    let regex = /r_(\w+)_(g|gc)_(\w+)/;
    let match = valPart.match(regex);

    if (match) {
      if (match[1]) {
        const formattedVal = processValuePart(match[1]);
        addValueToPropNVals(properties, vals, [`grid-template-${/^col/.test(valPart) ? "columns" : "rows"}`, `repeat(${processValuePart(valParts[1])}, ${formattedVal})`]);
      }
      if (match[3]) {
        const formattedVal = processValuePart(match[3]);
        addValueToPropNVals(properties, vals, [`${match[2] === "g" ? "gap" : "column-gap"}`, `${formattedVal}`]);
      }
    } else {

      regex = /col_auto_(fit|fill)_(\w+)/;
      match = valPart.match(regex);

      if (match && match[2]) {
        const formattedVal = processValuePart(match[2]);
        addValueToPropNVals(properties, vals, [`grid-template-columns`, `repeat(auto-${match[1]}, minmax(${formattedVal}, 1fr))`]);
      } else {

        // Extract values from the input string
        const numbers = valPart.replace(/^col_/, "").split("_");

        // Convert numbers to the desired format with the appropriate suffix
        const formattedVal = numbers.map(number => processValuePart(number)).join(' ');
        addValueToPropNVals(properties, vals, [`grid-template-${/^col/.test(valPart) ? "column" : "row"}s`, `${formattedVal}`]);
      }

    }
  } else {
    const row_col = valParts[0] === "col" ? "column" : "row";
    let spanVal = "";
    const part2 = valParts.at(-1), part1 = valParts.at(-2);
    if (valParts.length === 3) {
      if (/^v/.test(part2)) {
        spanVal = `${processValuePart(part2)}`;
      } else {
        spanVal = `span ${processValuePart(part2)}`;
      }
    } else {
      spanVal = `${processValuePart(part1)}/${processValuePart(part2)}`;
    }
    addValueToPropNVals(properties, vals, [`grid-${row_col}`, spanVal]);
  }

  const classToBuild = getClassDefinition(properties, vals, className);

  return getCompleteClassDefinition(2, classToBuild, classParts);
}

// justify_[Content/items/self]
export const justifyClasses = (classParts = [], className = "") => {

  // justify_[content/items/self]-[max/min]_{breakpoint}-value

  const classToBuild = getClassDefinition([classParts[0].replace("_", "-")], [processValuePart(classParts.at(-1), layoutAlignments)], className);
  return getCompleteClassDefinition(2, classToBuild, classParts);

}

// align_[Content/items/self]
export const alignClasses = (classParts = [], className = "") => {

  // align_[content/items/self]-[max/min]_{breakpoint}-value

  const classToBuild = getClassDefinition([classParts[0].replace("_", "-")], [processValuePart(classParts.at(-1), layoutAlignments)], className);
  return getCompleteClassDefinition(2, classToBuild, classParts);


}

// gap
export const gapCLasses = (classParts = [], className = "") => {

  // gap-[max/min]_{breakpoint}-value
  // col_gap-[max/min]_{breakpoint}-value
  // row_gap-[max/min]_{breakpoint}-value

  const classToBuild = getClassDefinition([classParts[0].replace("_", "-").replace("col", "column")], [processValuePart(classParts.at(-1), layoutAlignments)], className);
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