import { createClass } from "../addDynamicClass.js";
import { addMediaQuery } from "../createClass/_generic.js";

/**
 * Function to dynamically create CSS class selectors and add them to a provided <style> tag.
 * The function parses a specially formatted class name string to generate CSS rules and media queries.
 * 
 * @param {string} className - The input string defining the CSS selector, media query, and CSS properties. 
 * @param {HTMLStyleElement} styleTag - The <style> tag where the generated CSS rules will be injected.
 */

export const createSelectorClasses = (className = "", styleTag) => {

    // __[selector,...]-[min/max]_[breakPoint]@utilityClassNames
    // __[::selection,div>p,div_p]@[bg_color-lightblue]

    // Remove the leading "__" from the class name, if present.
    className = className.replace(/^__/, "");

    // Split the class name into parts: before and after the "@" symbol.
    const classParts = className.split("@");

    // Extract the selector and optional media query section from the first part.
    const selectorNMediaQuery = classParts[0].split("--");

    // Replace underscores with spaces to form the final CSS selector.
    const classNameToBe = selectorNMediaQuery[0].replace(/_/g, " ");

    // Extract the CSS property-value pairs from the section after the "@" symbol.
    const valueParts = classParts.at(-1).split(",");

    let classInside = "", addToTransform = false;

    // Iterate over each property-value pair to generate CSS rules.
    for (let i = 0; i < valueParts.length; i++) {
        const propValName = valueParts[i];

        // Generate the CSS rule using a helper function, `createClass`.
        classInside += (createClass(propValName, styleTag, true) + "\n");

        if (/^transform(?!_(origin|style))/.test(propValName) && !addToTransform) {
            const transformStyleTag = document.getElementById("style-transform-class");
    
            transformStyleTag.innerHTML = classNameToBe + "," + transformStyleTag.innerHTML;

            addToTransform = true;
        }
    }

    // Build the final CSS class definition.
    const classToBuild = `${classNameToBe} {\n${classInside}}\n`;

    

    // If a media query is specified, wrap the CSS class within the media query.
    const completeClassDef = selectorNMediaQuery.length === 2
        ? addMediaQuery(classToBuild, selectorNMediaQuery)
        : classToBuild;

    // Append the generated CSS to the provided <style> tag.
    styleTag.innerHTML += completeClassDef;
};
