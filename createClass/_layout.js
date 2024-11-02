import { addClassToTransformClassTag, addValueToPropNVals, getClassDefinition, getCompleteClassDefinition, getFormattedClassName, processValuePart } from "./_generic.js";


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


/**
 * Generates CSS layout-related class definitions.
 * These CSS class definition lets you declare two types of CSS rule:
 * 1. the most basic kind that is only the display property.
 * 2. with the second kind one can define the display property as flex or grid and along with three most important property of them.
 *    a. justify-[content/items] for flex and grid respectively.
 *    b. align-items.
 *    c. gap.
 *    
 * 
 * @param {Array} classParts - Splits the className by the delimiter "-"
 * @param {string} className - A string representing the base class name.
 * @param {boolean} returnOnlyPropNVal - If true, returns only the CSS property-value 
 *                                       mappings instead of the complete class definition.
 * @returns {string} - Returns a CSS class definition string or returns only the CSS property-value 
 *                                       mappings.
 */

export const layoutClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // d-[max/min]_{breakpoint}-[block/inline/inlineBlock/flex/grid/none]
  // d-[max/min]_[breakpoint]-(flex/grid)&[flexDir:val]&justify:val&align:val&gap:val

  // Initialize arrays to hold properties and their respective values
  const properties = [];
  const vals = [];

  // Extract the last part of the class (which contains layout details)
  const valPart = classParts.at(-1);

  // To track if the display type is set to "flex" or "grid"
  let type = "";

  // If the value part doesn't contain '&', it is a simple display property.
  if (!valPart.includes("&")) {
    addValueToPropNVals(properties, vals, ["display", processValuePart(valPart)]);
  } else {
    // If '&' is present, multiple layout properties are specified
    const valParts = valPart.split("&");

    // Process each part (e.g., "flexDir:column", "justify:center")
    valParts.forEach(el => {
      const elParts = el.split(":"); // Separate property and value
      const prop = elParts[0]; // The property name (e.g., 'flexDir')
      const value = elParts.at(-1); // The property value (e.g., 'column')

      // If the property and value are the same, it's a display type like "flex" or "grid"
      if (prop === value) {
        addValueToPropNVals(properties, vals, ["display", processValuePart(el)]);
        type = el; // Track whether the layout is "flex" or "grid"
      }
      // Handle specific layout-related properties
      else if (prop === "flexDir") {
        addValueToPropNVals(properties, vals, ["flex-direction", processValuePart(value)]);
      } else if (prop === "justify") {
        // Use 'justify-content' for flex, and 'justify-items' for grid layouts
        addValueToPropNVals(properties, vals, [`justify-${type === "flex" ? "content" : "items"}`, processValuePart(value)]);
      } else if (prop === "align") {
        addValueToPropNVals(properties, vals, ["align-items", processValuePart(value)]);
      } else if (prop === "gap") {
        addValueToPropNVals(properties, vals, ["gap", processValuePart(value)]);
      }
    });
  }

  // Generate the class definition using the accumulated properties and values
  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);

  // If only properties and values are requested, return them directly
  if (returnOnlyPropNVal) return classToBuild;

  // Otherwise, return the complete class definition, including all parts
  return getCompleteClassDefinition(2, classToBuild, classParts);
};


/**
 * Generates CSS class definitions for flex-related properties like direction, grow, shrink, wrap.
 * 
 * This class also provide for three most unique way of using flex to design your layout.
 * 1. flex_child-even : this class make sure that all the child element of the parent element have exactly the same width. 
 *                      Defining a custom width also not going to effect the widths.
 * 2. flex_child-fixed_wd : this make sure that each child element can have it's own custom width.
 * 3. flex_child-auto: this automatically provides the width that every child element requires.
 * 
  * @param {Array} classParts - Splits the className by the delimiter "-"
 * @param {string} className - A string representing the base class name.
 * @param {boolean} returnOnlyPropNVal - If true, returns only the CSS property-value 
 *                                       mappings instead of the complete class definition.
 * @returns {string} - Returns a CSS class definition string or returns only the CSS property-value 
 *                                       mappings.
 */

export const flexClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // flex_dir-[max/min]_{breakpoint}-[row/col/row_r/col_r]
  // flex_grow-[max/min]_{breakpoint}-[0/1]
  // flex_shrink-[max/min]_{breakpoint}-[0/1]
  // flex_wrap-[max/min]_{breakpoint}-[wrap/no_wrap/wrap_r]
  // flex-[max/min]_{breakpoint}-[grow+shrink+basis]


  // flex_child-[max/min]_{breakpoint}-even
  // flex_child-[max/min]_{breakpoint}-fixed_wd
  // flex_child-[max/min]_{breakpoint}-auto

  // parent should have these class __d-flex>*@max_wd-100%
  // .flex > * {
  //   max-width: 100%;
  // }

  // Initialize arrays to hold CSS properties and their values
  const properties = [];
  const vals = [];

  // Extract the last part (value) and first part (type) of the class
  const valPart = classParts.at(-1);
  const class1stPart = classParts[0];

  // Variables for additional class output (if needed for flex child handling)
  let extraClass = "", extraClassPropVal = "";

  // Handle different types of flex-related properties based on the first part of the class
  if (/^flex_dir/.test(class1stPart)) {
    // Handle flex direction (e.g., row, column, row-reverse, column-reverse)
    addValueToPropNVals(properties, vals, ["flex-direction", processValuePart(valPart)]);
  } else if (/^flex_grow/.test(class1stPart)) {
    // Handle flex-grow property (values 0 or 1)
    addValueToPropNVals(properties, vals, ["flex-grow", processValuePart(valPart)]);
  } else if (/^flex_shrink/.test(class1stPart)) {
    // Handle flex-shrink property (values 0 or 1)
    addValueToPropNVals(properties, vals, ["flex-shrink", processValuePart(valPart)]);
  } else if (/^flex_wrap/.test(class1stPart)) {
    // Handle flex-wrap property (wrap, no-wrap, wrap-reverse)
    addValueToPropNVals(properties, vals, ["flex-wrap", processValuePart(valPart)]);
  } else if (/^flex_child/.test(class1stPart)) {
    // Handle flex child properties by setting display to 'flex' and defining child behavior
    addValueToPropNVals(properties, vals, ["display", "flex"]);

    // Apply specific styles based on the value part (e.g., even, fixed width, auto)
    if (valPart === "even") {
      extraClassPropVal = "\tflex: 1 0 0%;"; // Child gets equal space
    } else if (valPart === "fixed_wd") {
      extraClassPropVal = "\tflex: 0 0 auto;"; // Child keeps its width
    } else if (valPart === "auto") {
      extraClassPropVal = "\tflex: 0 0 auto;\n\twidth: auto !important;"; // Auto width with important flag
    }

    // Build additional CSS class definition for flex children
    extraClass = `.flex_child-${valPart} > * {\n${extraClassPropVal}\n\tmax-width:100%;\n}\n`;
  } else {
    // Handle general flex property (e.g., grow, shrink, and basis values together)
    addValueToPropNVals(properties, vals, ["flex", processValuePart(valPart)]);
  }

  // Generate the core class definition
  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal) + extraClass;

  // Return either property-value pairs or complete class definition based on the flag
  if (returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);
};

/**
 * Generates CSS class definitions for grid-related properties like row and column widths, span values, grid auto properties.
 * It has a special class definition that one can use to define a very specific type of grid-template-column i.e.
 *   grid-template-columns: repeat([auto-fit/auto-fill], minmax(min_el_width, 1fr));
 * which is every effective for certain situations.
 * 
 * @param {Array} classParts - Splits the className by the delimiter "-"
 * @param {string} className - A string representing the base class name.
 * @param {boolean} returnOnlyPropNVal - If true, returns only the CSS property-value 
 *                                       mappings instead of the complete class definition.
 * @returns {string} - Returns a CSS class definition string or returns only the CSS property-value 
 *                                       mappings.
 */

export const gridClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // grid-[max/min]_[breakpoint]-re_(col/row):Width+count&[gap/cGap/rGap]:value
  // grid-[max/min]_[breakpoint]-(col/row):width1,width2,....
  // grid-[max/min]_[breakpoint]-(col/row)Span:to+from/span+2

  // grid_col-[max/min]_[breakpoint]-(autoFill/autoFit)+10(vw/vh/px/rem)

  // grid_auto-[max/min]_[breakpoint]-cols:val&flow:val&rows:val&[gap/cGap/rGap]:value
  // grid_auto_[columns/flow/rows]-[max/min]_[breakpoint]-value

  const properties = []; // Store CSS properties
  const vals = []; // Store CSS values
  const valPart = classParts.at(-1); // Get the last part of the class name
  let valParts = valPart.split("&"); // Split values based on '&'
  let addDisplayProp = true; // Flag to determine if 'display: grid' should be added

  if (/^grid_col/.test(classParts)) {
    valParts = valPart.split("+");
    addValueToPropNVals(properties, vals, [
      `grid-template-columns`,
      `repeat(${processValuePart(valParts[0])}, minmax(${processValuePart(valParts[1])}, 1fr))`
    ]);
  }
  else if (/^grid_auto/.test(classParts)) {
    const class1stParts = classParts[0].split("_");

    if (class1stParts.length === 2) {
      valParts.forEach(el => {
        const [prop, value] = el.split(":");
        const prop1st = classParts[0].replace("_", "-");

        if (prop === "cols") {
          addValueToPropNVals(properties, vals, [prop1st + "-columns", processValuePart(value)]);
        } else if (/gap$/.test(prop)) {
          const gapType = prop === "gap" ? "gap" : prop === "rGap" ? "row-gap" : "column-gap";
          addValueToPropNVals(properties, vals, [gapType, processValuePart(value)]);
        } else {
          addValueToPropNVals(properties, vals, [prop1st + "-" + prop, processValuePart(value)]);
        }
      });
    } else {
      const propName = classParts[0].replace(/_/g, "-");
      addValueToPropNVals(properties, vals, [propName, processValuePart(valPart)]);
    }
  }
  else if (valPart.includes("Span")) {
    valParts = valPart.split(":");
    const values = valParts[1].split("+");
    const delimiter = values[0] === "span" ? " " : "/";
    addValueToPropNVals(properties, vals, [
      `grid-${valParts[0] === "colSpan" ? "column" : "row"}`,
      values.map(el => processValuePart(el)).join(delimiter)
    ]);
    addDisplayProp = false;
  }
  else {
    valParts.forEach(el => {
      const [prop, value] = el.split(":");

      if (/^re_(?:col|row)$/.test(prop)) {
        const [width, count] = value.split("+").map(v => processValuePart(v));
        addValueToPropNVals(properties, vals, [
          `grid-template-${prop === "re_col" ? "columns" : "rows"}`,
          `repeat(${count}, ${width})`
        ]);
      } else if (/^(?:col|row)$/.test(prop)) {
        valParts = valPart.split(":");
        addValueToPropNVals(properties, vals, [
          `grid-template-${valParts[0] === "col" ? "columns" : "rows"}`,
          processValuePart(valParts[1])
        ]);
      } else if (/gap$/.test(prop.toLowerCase())) {
        const gapType = prop === "gap" ? "gap" : prop === "rGap" ? "row-gap" : "column-gap";
        addValueToPropNVals(properties, vals, [gapType, processValuePart(value)]);
      }
    });
  }

  // Add 'display: grid' unless specified otherwise
  if (addDisplayProp) {
    addValueToPropNVals(properties, vals, ["display", "grid"]);
  }

  // Generate the final class definition
  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);

  // Return either the CSS properties or the complete class definition
  if (returnOnlyPropNVal) return classToBuild;
  return getCompleteClassDefinition(2, classToBuild, classParts);
};


/**
 * Generates CSS classes related to justify properties like content, items, and self.
 * 
 * @param {Array} classParts - Splits the className by the delimiter "-"
 * @param {string} className - A string representing the base class name.
 * @param {boolean} returnOnlyPropNVal - If true, returns only the CSS property-value 
 *                                       mappings instead of the complete class definition.
 * @returns {string} - Returns a CSS class definition string or returns only the CSS property-value 
 *                                       mappings.
 * 
 */

export const justifyClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // justify_[content/items/self]-[max/min]_{breakpoint}-value
  // Handles justify content, items, and self with optional breakpoints and min/max constraints.

  const classToBuild = getClassDefinition(
    [classParts[0].replace("_", "-")], // Converts part like 'justify_content' to 'justify-content'.
    [processValuePart(classParts.at(-1))], // Processes the value part (e.g., 'center', 'flex-end').
    className,
    returnOnlyPropNVal
  );

  // If the flag is set to true, return only the property-value pairs.
  if (returnOnlyPropNVal) return classToBuild;

  // Otherwise, return the complete class definition, including all relevant parts.
  return getCompleteClassDefinition(2, classToBuild, classParts);
};


/**
 * Generates CSS classes for alignment-related properties, such as align-content, align-items, and align-self.
 * 
 * @param {Array} classParts - Splits the className by the delimiter "-"
 * @param {string} className - A string representing the base class name.
 * @param {boolean} returnOnlyPropNVal - If true, returns only the CSS property-value 
 *                                       mappings instead of the complete class definition.
 * @returns {string} - Returns a CSS class definition string or returns only the CSS property-value 
 *                                       mappings.
 * 
 */

export const alignClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // align_[content/items/self]-[max/min]_{breakpoint}-value
  // Handles alignment properties (content, items, self) with optional max/min breakpoints.

  const classToBuild = getClassDefinition(
    [classParts[0].replace("_", "-")], // Convert 'align_content' to 'align-content'.
    [processValuePart(classParts.at(-1))], // Process the value part (e.g., 'center', 'stretch').
    className,
    returnOnlyPropNVal
  );

  // If only property-value pairs are requested, return them immediately.
  if (returnOnlyPropNVal) return classToBuild;

  // Otherwise, return the complete class definition, integrating all parts.
  return getCompleteClassDefinition(2, classToBuild, classParts);
};



/**
 * Generates CSS classes for handling gap properties, including general gaps, 
 * column gaps, and row gaps.
 * 
 * @param {Array} classParts - Splits the className by the delimiter "-"
 * @param {string} className - A string representing the base class name.
 * @param {boolean} returnOnlyPropNVal - If true, returns only the CSS property-value 
 *                                       mappings instead of the complete class definition.
 * @returns {string} - Returns a CSS class definition string or returns only the CSS property-value 
 *                                       mappings.
 * 
 */

export const gapCLasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // gap-[max/min]_{breakpoint}-value
  // col_gap-[max/min]_{breakpoint}-value
  // row_gap-[max/min]_{breakpoint}-value
  // Handles general gaps, column gaps, and row gaps with optional max/min breakpoints.

  const classToBuild = getClassDefinition(
    [classParts[0].replace("_", "-").replace("col", "column")], // Converts 'col_gap' to 'column-gap'.
    [processValuePart(classParts.at(-1))], // Processes the value part (e.g., '10px', '1rem').
    className,
    returnOnlyPropNVal
  );

  // If only property-value pairs are needed, return them directly.
  if (returnOnlyPropNVal) return classToBuild;

  // Otherwise, return the complete class definition, integrating all relevant parts.
  return getCompleteClassDefinition(2, classToBuild, classParts);
};


/**
 * Generates CSS classes for setting the order of flex or grid items.
 * 
 * @param {Array} classParts - Splits the className by the delimiter "-"
 * @param {string} className - A string representing the base class name.
 * @param {boolean} returnOnlyPropNVal - If true, returns only the CSS property-value 
 *                                       mappings instead of the complete class definition.
 * @returns {string} - Returns a CSS class definition string or returns only the CSS property-value 
 *                                       mappings.
 * 
 */

export const orderClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // order-[max/min]_{breakpoint}-value

  const classToBuild = getClassDefinition(
    [classParts[0]], // Uses the first part as the property (e.g., 'order').
    [processValuePart(classParts.at(-1))], // Processes the value (e.g., '1', '2', or 'auto').
    className,
    returnOnlyPropNVal
  );

  // If only property-value pairs are requested, return them directly.
  if (returnOnlyPropNVal) return classToBuild;

  // Otherwise, return the complete class definition, including all relevant parts.
  return getCompleteClassDefinition(2, classToBuild, classParts);
};


/**
 * Generates CSS classes for the 'position' property. 
 * 
 * @param {Array} classParts - Splits the className by the delimiter "-"
 * @param {string} className - A string representing the base class name.
 * @param {boolean} returnOnlyPropNVal - If true, returns only the CSS property-value 
 *                                       mappings instead of the complete class definition.
 * @returns {string} - Returns a CSS class definition string or returns only the CSS property-value 
 *                                       mappings.
 * 
 */

export const positionClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // pos-[max/min]_{breakpoint}-value

  const classToBuild = getClassDefinition(
    ["position"], // Always sets the property name as 'position'.
    [processValuePart(classParts.at(-1))], // Processes the value (e.g., 'absolute', 'relative', 'fixed').
    className,
    returnOnlyPropNVal
  );

  // If only property-value pairs are requested, return them directly.
  if (returnOnlyPropNVal) return classToBuild;

  // Otherwise, return the complete class definition, integrating all relevant parts.
  return getCompleteClassDefinition(2, classToBuild, classParts);
};



/**
 * Generates CSS classes for the 'overflow' property, supporting optional breakpoints 
 * 
 * @param {Array} classParts - Splits the className by the delimiter "-"
 * @param {string} className - A string representing the base class name.
 * @param {boolean} returnOnlyPropNVal - If true, returns only the CSS property-value 
 *                                       mappings instead of the complete class definition.
 * @returns {string} - Returns a CSS class definition string or returns only the CSS property-value 
 *                                       mappings.
 * 
 */

export const overflowClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // overflow-[max/min]_{breakpoint}-value

  const classToBuild = getClassDefinition(
    [classParts[0].replace("_", "-")], // Uses the first part as the property (e.g., 'overflow').
    [processValuePart(classParts.at(-1))], // Processes the value (e.g., 'auto', 'hidden', 'scroll').
    className,
    returnOnlyPropNVal
  );

  // If only property-value pairs are requested, return them directly.
  if (returnOnlyPropNVal) return classToBuild;

  // Otherwise, return the complete class definition, including all relevant parts.
  return getCompleteClassDefinition(2, classToBuild, classParts);
};



/**
 * Generates CSS classes for the 'z-index' property.
 * 
 * @param {Array} classParts - Splits the className by the delimiter "-".
 * @param {string} className - A string representing the base class name for the z-index class.
 * @param {boolean} returnOnlyPropNVal - If true, returns only the CSS property-value mappings 
 *                                       instead of the complete class definition.
 * @returns {string} - Returns a CSS class definition string or only the CSS property-value mappings.
 */

export const zIndexClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // zIndex-[max/min]_{breakpoint}-value

  const classToBuild = getClassDefinition(
    ["z-index"], // Uses 'z-index' as the property name for CSS styling.
    [processValuePart(classParts.at(-1))], // Processes the last part to extract the z-index value (e.g., '1', '10', '100').
    className,
    returnOnlyPropNVal
  );

  // If only property-value pairs are requested, return them directly.
  if (returnOnlyPropNVal) return classToBuild;

  // Otherwise, return the complete class definition, incorporating all relevant parts.
  return getCompleteClassDefinition(2, classToBuild, classParts);
};



/**
 * Generates CSS classes for the top, right, bottom, and left properties.
 * 
 * @param {Array} classParts - Splits the className by the delimiter "-".
 * @param {string} className - A string representing the base class name for the TRBL (Top, Right, Bottom, Left) class.
 * @param {boolean} returnOnlyPropNVal - If true, returns only the CSS property-value mappings 
 *                                       instead of the complete class definition.
 * @returns {string} - Returns a CSS class definition string or only the CSS property-value mappings.
 */

export const trblClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // [top/right/bottom/left]-[max/min]_{breakpoint}-value

  const value = classParts.at(-1);

  if (!/[0-9]/.test(value) && !/^v/.test(value)) return "";

  const classToBuild = getClassDefinition(
    [classParts.at(0)], // Uses the first part (e.g., 'top', 'right', 'bottom', 'left') as the CSS property.
    [processValuePart(value)], // Processes the last part to extract the value for the property.
    className,
    returnOnlyPropNVal
  );

  // If only property-value pairs are requested, return them directly.
  if (returnOnlyPropNVal) return classToBuild;

  // Otherwise, return the complete class definition, including all relevant parts.
  return getCompleteClassDefinition(2, classToBuild, classParts);
};



/**
 * 
 * This CSS class definitions lets you center an element along any direction or in the middle or 
 * One can aline any element along any side at any distance in two ways
 * 1. Absolute way
 * 2. Fixed way
 * 
 * 
 * @param {Array} classParts - Splits the className by the delimiter "-"
 * @param {string} className - A string representing the base class name.
 * @param {boolean} returnOnlyPropNVal - If true, returns only the CSS property-value 
 *                                       mappings instead of the complete class definition.
 * @returns {string} - Returns a CSS class definition string or returns only the CSS property-value 
 *                                       mappings.
 */

export const centerElemClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // center_el-[max/min]_{breakpoint}-[c/t/r/b/l]+[abs/fix]
  // align_[left/right/top/bottom]-[max/min]_{breakpoint}-[abs/fix]+value

  const properties = [];
  const vals = [];
  const valPart = classParts.at(-1);
  const value = /^center/.test(classParts[0]) ? "50%" : processValuePart(valPart.split("+")[1]);
  const positionTypeABS = /^center/.test(classParts[0]) ? /abs$/.test(valPart) : /^abs/.test(valPart)

  addValueToPropNVals(properties, vals, ["position", positionTypeABS ? "absolute" : "fixed"]);

  const addPositioning = (position) => {
    addValueToPropNVals(properties, vals, [position, processValuePart(value)]);
    if (position === "left") {
      addValueToPropNVals(properties, vals, ["--translateX", "-50%"]);
    }
    if (position === "top") {
      addValueToPropNVals(properties, vals, ["--translateY", "-50%"]);
    }
  };

  if (/^(?:c|l|r)/.test(valPart) || /(?:right|left)$/.test(classParts[0])) {
    addPositioning("top");
  }
  if (/^(?:c|t|b)/.test(valPart) || /(?:top|bottom)$/.test(classParts[0])) {
    addPositioning("left")
  }
  if (/^(?:l|r|t|b)/.test(valPart) || /(?:top|right|bottom|left)$/.test(classParts[0])) {
    const tempSide = /^center/.test(classParts[0]) ? valPart.split("+")[0] : classParts[0].split("_")[1];
    addValueToPropNVals(properties, vals, [sides[tempSide], "0"]);
  }

  if (!/^(?:c|l|r|t|b)/.test(valPart)) {
    addPositioning("top");
    addPositioning("left");
  }

  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);
  if (returnOnlyPropNVal) return classToBuild;

  addClassToTransformClassTag(className);

  return getCompleteClassDefinition(2, classToBuild, classParts);

}


/**
 * 
 * This CSS class definitions lets you handle column related properties like count, fill, gap, width or rule style, width, color.
 * It also lets you to handle the columns related property.
 * 
 * @param {Array} classParts - Splits the className by the delimiter "-"
 * @param {string} className - A string representing the base class name.
 * @param {boolean} returnOnlyPropNVal - If true, returns only the CSS property-value 
 *                                       mappings instead of the complete class definition.
 * @returns {string} - Returns a CSS class definition string or returns only the CSS property-value 
 *                                       mappings.
 */

export const columnClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // column-[max/min]_{breakpoint}-count:val&fill:val&gap:val&span:val&wd:val
  // column_[count/fill/gap/span/width]-[max/min]_{breakpoint}-value

  // column_rule-[max/min]_{breakpoint}-value
  // column_rule_[color/style/width]-[max/min]_{breakpoint}-value

  // columns-[max/min]_{breakpoint}-value

  const properties = []; // Array to hold CSS properties to be set.
  const vals = []; // Array to hold corresponding values for the CSS properties.
  const valPart = classParts.at(-1); // Extracts the last part of classParts for value processing.
  const class1stParts = classParts[0].split("_"); // Splits the first part of classParts to identify sub-properties.

  if (classParts[0] === "columns") {
    // Handle 'columns' class: split the value part and process each value.
    const valParts = valPart.split("_");
    addValueToPropNVals(properties, vals, [classParts[0], valParts.map(el => processValuePart(el)).join(" ")]);

  } else if (!/^column_rule/.test(classParts[0])) {
    // Handle cases where the class is related to 'column' only
    const prop1stPart = classParts[0]; // Get the first part of the class name.

    if (class1stParts.length === 1) {
      // When only one part is present in the class name, split the value part by '&' for multiple properties.
      const valParts = valPart.split("&");

      valParts.forEach(el => {
        const elParts = el.split(":"); // Split each value part by ':' to separate property and value.
        const prop = elParts[0]; // The property name.
        const value = elParts[1]; // The property value.

        if (prop === "wd") {
          // Special handling for 'wd' to map to width.
          addValueToPropNVals(properties, vals, [prop1stPart + "-width", processValuePart(value)]);
        } else {
          // For other properties, construct the property name and process the value.
          addValueToPropNVals(properties, vals, [prop1stPart + "-" + prop, processValuePart(value)]);
        }
      });
    } else {
      // For cases with multiple parts in the class name, simply map the last value part.
      const propName = classParts[0].replace(/_/g, "-"); // Replace underscores with hyphens in the property name.
      addValueToPropNVals(properties, vals, [propName, processValuePart(valPart)]);
    }
  } else {
    // Handle 'column_rule' classes
    const propName = classParts[0].replace(/_/g, "-"); // Convert underscores to hyphens in the property name.

    if (class1stParts.length === 2) {
      // When there are two parts, split the last value part by '+' for multiple values.
      const valParts = valPart.split("+");
      addValueToPropNVals(properties, vals, [propName, valParts.map(el => processValuePart(el)).join(" ")]);
    } else {
      // For a single value, process it directly.
      addValueToPropNVals(properties, vals, [propName, processValuePart(valPart)]);
    }
  }

  // Build the class definition from the collected properties and values.
  const classToBuild = getClassDefinition(properties, vals, className, returnOnlyPropNVal);

  // If only property-value pairs are requested, return them directly.
  if (returnOnlyPropNVal) return classToBuild;

  // Otherwise, return the complete class definition, including all relevant parts.
  return getCompleteClassDefinition(2, classToBuild, classParts);
}



/**
 * 
 * This css class definitions lets you handle object-fit and object-position.
 * 
 * @param {Array} classParts - Splits the className by the delimiter "-"
 * @param {string} className - A string representing the base class name.
 * @param {boolean} returnOnlyPropNVal - If true, returns only the CSS property-value 
 *                                       mappings instead of the complete class definition.
 * @returns {string} - Returns a CSS class definition string or returns only the CSS property-value 
 *                                       mappings.
 */

export const objClasses = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // obj_[fit/pos]-[max/min]_{breakpoint}-value
  // Handles the CSS 'object-fit' or 'object-position' properties based on the class name.

  const propType = classParts[0].split("_"); // Splits the first part of classParts to determine property type.

  // Constructs the class definition by determining whether to use 'object-fit' or 'object-position'.
  const classToBuild = getClassDefinition(
    ["object" + (propType[1] === "pos" ? "-position" : "-fit")], // Determines property based on fit/pos.
    [processValuePart(classParts.at(-1))], // Processes the value part.
    className,
    returnOnlyPropNVal
  );

  // If only property-value pairs are requested, return them directly.
  if (returnOnlyPropNVal) return classToBuild;

  // Otherwise, return the complete class definition, including all relevant parts.
  return getCompleteClassDefinition(2, classToBuild, classParts);
}

/**
 * 
 * Float related property.
 * 
 * @param {Array} classParts - splitting the className by the delimiter "-"
 * @param {string} className - A string representing the base class name.
 * @param {boolean} returnOnlyPropNVal - If true, returns only the CSS property-value 
 *                                       mappings instead of the complete class definition.
 * @returns {string} - Returns a CSS class definition string or returns only the CSS property-value 
 *                                       mappings.
 */

export const floatClass = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // float-[max/min]_{breakpoint}-value
  // Handles the CSS 'float' property based on the provided class definition.

  const classToBuild = getClassDefinition(
    ["float"], // Sets the property to 'float'.
    [processValuePart(classParts.at(-1))], // Processes the value part.
    className,
    returnOnlyPropNVal
  );

  // If only property-value pairs are requested, return them directly.
  if (returnOnlyPropNVal) return classToBuild;

  // Otherwise, return the complete class definition, including all relevant parts.
  return getCompleteClassDefinition(2, classToBuild, classParts);
}

/**
 * 
 * Clear related property.
 * 
 * @param {Array} classParts - splitting the className by the delimiter "-"
 * @param {string} className - A string representing the base class name.
 * @param {boolean} returnOnlyPropNVal - If true, returns only the CSS property-value 
 *                                       mappings instead of the complete class definition.
 * @returns {string} - Returns a CSS class definition string or returns only the CSS property-value 
 *                                       mappings.
 */

export const clearClass = (classParts = [], className = "", returnOnlyPropNVal = false) => {

  // clear-[max/min]_{breakpoint}-value
  // Handles the CSS 'clear' property based on the provided class definition.

  const classToBuild = getClassDefinition(
    ["clear"], // Sets the property to 'clear'.
    [processValuePart(classParts.at(-1))], // Processes the value part.
    className,
    returnOnlyPropNVal
  );

  // If only property-value pairs are requested, return them directly.
  if (returnOnlyPropNVal) return classToBuild;

  // Otherwise, return the complete class definition, including all relevant parts.
  return getCompleteClassDefinition(2, classToBuild, classParts);
}
