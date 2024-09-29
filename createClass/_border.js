import { colors } from "../mappings/_clr.js";
import { addValueToPropNVals, getClassDefinition, getCompleteClassDefinition, processValuePart } from "./_generic.js";

export const borderCLasses = (classParts = [], className = "") => {

  //  border_[t/r/b/l]-[max/min]_{breakpoint}-{wd:val&st:va&clr:val}
  //  border_[t/r/b/l]_[wd/st/clr/off]-[max/min]_{breakpoint}-value
  //  border_rad_[tr/br/bl/tl]_[max/min]_{breakpoint}-value

  //  outline_[t/r/b/l]-[max/min]_{breakpoint}-{wd:val&st:va&clr:val&off:val}
  //  outline_[t/r/b/l]_[wd/st/clr/off]-[max/min]_{breakpoint}-value

  const properties = [];
  const vals = [];

  const class1stParts = classParts[0].split("_");

  const propName1st = classParts[0].split("_")[0];

  const propDirPos = class1stParts.length === 2 ? -1 : (class1stParts.length === 3 ? 1 : null);
  const propDir = propDirPos ? class1stParts.at(propDirPos) : "";

  const propTypePos = class1stParts.length === 2 ? -1 : (class1stParts.length === 3 ? 2 : null);
  const propType = propTypePos ? class1stParts.at(propTypePos) : "";

  const valPart = classParts.at(-1);

  if (/^(wd|st|clr|off)$/.test(propType)) {
    if (propType === "clr") {
      addValueToPropNVals(properties, vals, [propName1st + directions[propDir] + "-color", processValuePart(valPart, colors)]);
    } else if (propType === "wd") {
      addValueToPropNVals(properties, vals, [propName1st + directions[propDir] + "-width", processValuePart(valPart)]);
    } else if (propType === "st") {
      addValueToPropNVals(properties, vals, [propName1st + directions[propDir] + "-style", processValuePart(valPart)]);
    } else if (propType === "off") {
      addValueToPropNVals(properties, vals, [propName1st + directions[propDir] + "-offset", processValuePart(valPart)]);
    }
  } else if (/^border_rad/.test(classParts[0])) {
    const radDir = class1stParts.length === 3 ? class1stParts.at(2) : "";

    if (radDir === "tr") {
      addValueToPropNVals(properties, vals, ["border-top-right-radius", processValuePart(valPart)]);
    } else if (radDir === "br") {
      addValueToPropNVals(properties, vals, ["border-bottom-right-radius", processValuePart(valPart)]);
    } else if (radDir === "bl") {
      addValueToPropNVals(properties, vals, ["border-bottom-left-radius", processValuePart(valPart)]);
    } else if (radDir === "tl") {
      addValueToPropNVals(properties, vals, ["border-top-left-radius", processValuePart(valPart)]);
    } else {
      const values = valPart.split("_");
      addValueToPropNVals(properties, vals, ["border-radius", values.map(el => processValuePart(el)).join(" ")]);
    }
  } else {

    let clr = "#fff", wd = "1px", st = "solid", off;

    const valParts = valPart.split("&");

    valParts.forEach(el => {
      const elParts = el.split(":");
      const prop = elParts[0];
      const value = elParts[1];

      if (prop === "clr") {
        clr = processValuePart(value, colors);
      } else if (prop === "wd") {
        wd = processValuePart(value);
      } else if (prop === "st") {
        st = processValuePart(value);
      } else if (prop === "off") {
        off = processValuePart(value);
      }
    })


    addValueToPropNVals(properties, vals, [propName1st + directions[propDir], `${wd} ${st} ${clr}`]);
    off && addValueToPropNVals(properties, vals, [propName1st + "-offset", off]);
  }



  const classToBuild = getClassDefinition(properties, vals, className);
  return getCompleteClassDefinition(2, classToBuild, classParts);

}

export const ringClasses = (classParts = [], className = "") => {

  //  ring_[t/r/b/l]-[max/min]_{breakpoint}-[wd:val&clr:val] ==> using shadow

  const properties = [];
  const vals = [];

  const class1stParts = classParts[0].split("_");

  const propDirPos = class1stParts.length === 2 ? -1 : (class1stParts.length === 3 ? 1 : null);
  const propDir = propDirPos ? class1stParts.at(propDirPos) : "";

  const valPart = classParts.at(-1);

  let clr = "#fff", wd = "1px";

  const valParts = valPart.split("&");

  valParts.forEach(el => {
    const elParts = el.split(":");
    const prop = elParts[0];
    const value = elParts[1];

    if (prop === "clr") {
      clr = processValuePart(value, colors);
    } else if (prop === "wd") {
      wd = processValuePart(value);
    }
  })

  if (propDir === "t") {
    addValueToPropNVals(properties, vals, ["box-shadow", `inset 0 ${processValuePart(wd)} 0 ${processValuePart(clr, colors)}`]);
  } else if (propDir === "r") {
    addValueToPropNVals(properties, vals, ["box-shadow", `inset -${processValuePart(wd)} 0 0 ${processValuePart(clr, colors)}`]);
  } else if (propDir === "b") {
    addValueToPropNVals(properties, vals, ["box-shadow", `inset 0 -${processValuePart(wd)} 0 ${processValuePart(clr, colors)}`]);
  } else if (propDir === "l") {
    addValueToPropNVals(properties, vals, ["box-shadow", `inset ${processValuePart(wd)} 0 0 ${processValuePart(clr, colors)}`]);
  } else {
    addValueToPropNVals(properties, vals, ["box-shadow", `inset 0 0 0 ${processValuePart(wd)} ${processValuePart(clr, colors)}`]);
  }

  const classToBuild = getClassDefinition(properties, vals, className);
  return getCompleteClassDefinition(2, classToBuild, classParts);
}

// ring offset using extra element

const directions = {
  t: "-top",
  r: "-right",
  b: "-bottom",
  l: "-left",
  "": ""
}