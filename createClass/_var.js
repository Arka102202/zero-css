export const varClass = (classParts = [], className = "") => {

  const nameParts = classParts[0].split("_");
  const type = nameParts[1];
  const selectorName = nameParts.at(-1);
  const vars = JSON.parse(classParts[1]);

  const cssVars = Object.entries(vars).map(([key, val]) => `\t--${key.replace(/[A-Z]/g, match => '-' + match.toLowerCase())}: ${val}`).join(";\n");

  const classToAdd =
    `${type === "e" ? `` : `.`}${selectorName}{
${cssVars}
}\n`;

  return classToAdd;

}