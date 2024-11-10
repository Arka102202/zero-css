import { getCompleteClassDefinition, splitStringByParts } from "./_generic.js";

export const varClass = (classParts = [], className = "") => {

  // vars__html--[max/min]_[breakPoints]@var1:val,var2:val,.....

  const namePart = classParts[0].split("--");
  const nameParts = namePart[0].split("__");
  const selectorName = nameParts.at(-1);
  const valParts = classParts[1].split("&");

  const cssVars = valParts.map(el => {
    const elParts = splitStringByParts(el, 2, ":");
    const key = elParts[0];
    const val = elParts[1];

    return `\t--${key.replace(/[A-Z]/g, match => '-' + match.toLowerCase())}: ${val}`
  }).join(";\n") + ";";

  const classToAdd =
    `${selectorName}{
${cssVars}
}\n`;

  // return classToAdd;
  return getCompleteClassDefinition(1, classToAdd, namePart);

}

