import { colors } from "../mappings/_clr.js";
import { addValueToPropNVals, getClassDefinition, getCompleteClassDefinition, processValuePart } from "./_generic.js";

// background
export const bgClasses = (classParts = [], className = "") => {

  // when to use a variable:
  // 1. image as url
  // 2. complex image
  // bg-[max/min]_{breakpoint}-[clr:val&img:val&pos:val&s:val&re:val&org:val&clip:val&att:val]
  // bg_[color_image_position_size_repeat_origin_clip_attachment]-[max/min]_{breakpoint}-value

  const properties = [];
  const vals = [];
  const valPart = classParts.at(-1);
  const prop1stPart = "background-"
  const isOnlyBg = classParts[0] === "bg";

  if (isOnlyBg) {

    const valParts = valPart.split("&");

    valParts.forEach(el => {
      const elParts = el.split(":");
      const prop = elParts[0];
      const value = elParts[1];

      if (prop === "clr") {
        addValueToPropNVals(properties, vals, [prop1stPart + "color", processValuePart(value, colors)]);
      } if (prop === "img") {
        addValueToPropNVals(properties, vals, [prop1stPart + "image", processValuePart(value)]);
      } if (prop === "pos") {
        const eachPart = value.split("_");
        const tempVal = eachPart.map(el => processValuePart(el)).join(" ");
        addValueToPropNVals(properties, vals, [prop1stPart + "position", tempVal]);
      } if (prop === "s") {
        const eachPart = value.split("_");
        const tempVal = eachPart.map(el => processValuePart(el)).join(" ");
        addValueToPropNVals(properties, vals, [prop1stPart + "size", tempVal]);
      } if (prop === "re") {
        addValueToPropNVals(properties, vals, [prop1stPart + "repeat", processValuePart(value)]);
      } if (prop === "org") {
        addValueToPropNVals(properties, vals, [prop1stPart + "origin", processValuePart(value)]);
      } if (prop === "clip") {
        addValueToPropNVals(properties, vals, [prop1stPart + "clip", processValuePart(value)]);
      } if (prop === "att") {
        addValueToPropNVals(properties, vals, [prop1stPart + "attachment", processValuePart(value)]);
      }
    })

  } else {

    const propLastPart = classParts[0].split("_").at(-1);
    let value = "";

    if (propLastPart === "color") {
      value = processValuePart(valPart, colors);
    } else if (propLastPart === "image") {
      value = processValuePart(valPart);
    } else if (propLastPart === "position") {
      const eachPart = valPart.split("_");
      value = eachPart.map(el => processValuePart(el)).join(" ");
    } else if (propLastPart === "size") {
      const eachPart = valPart.split("_");
      value = eachPart.map(el => processValuePart(el)).join(" ");
    } else if (propLastPart === "repeat") {
      value = processValuePart(valPart);
    } else if (propLastPart === "origin") {
      value = processValuePart(valPart);
    } else if (propLastPart === "clip") {
      value = processValuePart(valPart);
    } else if (propLastPart === "attachment") {
      value = processValuePart(valPart);
    }

    addValueToPropNVals(properties, vals, [prop1stPart + propLastPart, value]);

  }

  const classToBuild = getClassDefinition(properties, vals, className);
  return getCompleteClassDefinition(2, classToBuild, classParts);

}