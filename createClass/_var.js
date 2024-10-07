import { getCompleteClassDefinition } from "./_generic.js";

export const varClass = (classParts = [], className = "") => {

  // vars_e_html-[max/min]_[breakPoints]@var1:val,var2:val,.....

  const namePart = classParts[0].split("-");
  const nameParts = namePart[0].split("_");
  const type = nameParts[1];
  const selectorName = nameParts.at(-1);
  const valParts = classParts[1].split(",");

  const cssVars = valParts.map(el => {
    const elParts = splitStringByParts(el, 2, ":");
    const key = elParts[0];
    const val = elParts[1];

    return `\t--${key.replace(/[A-Z]/g, match => '-' + match.toLowerCase())}: ${val}`
  }).join(";\n") + ";";



  const classToAdd =
    `${type === "e" ? `` : `.`}${selectorName}{
${cssVars}
}\n`;

  // return classToAdd;
  return getCompleteClassDefinition(1, classToAdd, namePart);

}

function splitStringByParts(str, num, delimiter) {
  if (num <= 0) {
      return [];
  }
  
  // Split the string using the delimiter
  const parts = str.split(delimiter);
  
  // If the number of parts is less than or equal to the requested number
  if (parts.length <= num) {
      return parts;
  }
  
  const result = parts.slice(0, num - 1); // Take the first (num - 1) parts
  result.push(parts.slice(num - 1).join(delimiter)); // Join the remaining parts for the last chunk
  
  return result;
}