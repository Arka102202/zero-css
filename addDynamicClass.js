import { abContentClass } from "./combinators/_child.js";
import { bgClasses } from "./createClass/_background.js";
import { borderCLasses, ringClasses } from "./createClass/_border.js";
import { backFaceClass, blendClasses, content_visibilityClass, filterClasses, opacityClasses, shadowClasses, textGradClasses } from "./createClass/_effects.js";
import { interactionClasses } from "./createClass/_interaction.js";
import { alignClasses, centerElemClasses, columnClasses, flexClasses, gapCLasses, gridClasses, justifyClasses, layoutClasses, orderClasses, overflowClasses, positionClasses, trblClasses, zIndexClasses } from "./createClass/_layout.js";
import { scrollClasses } from "./createClass/_scroll.js";
import { aspectClasses, sizeClasses } from "./createClass/_size.js";
import { spacingClasses } from "./createClass/_spacing.js";
import { perspectiveOrgClasses, transformClasses, transitionClasses } from "./createClass/_trans.js";
import { colorClass, fontClasses, fontImportClass, letterClass, lineClasses, textClasses } from "./createClass/_typography.js";
import { varClass } from "./createClass/_var.js";

/**
 * Creates and applies CSS class rules based on the provided class name and its structure.
 * Supports various utility classes like size, layout, position, interaction, etc.
 * If `returnOnlyPropNVal` is true, it returns the CSS properties and values without applying them.
 *
 * @param {string} className - The class name to be processed and transformed into CSS rules.
 * @param {HTMLElement} styleTag - The <style> tag where the generated CSS rules will be appended.
 * @param {boolean} [returnOnlyPropNVal=false] - If true, returns only the CSS properties and values without adding to the style tag.
 * @param {HTMLElement} styleImportTag - The <style> tag for importing external font styles (used for @import).
 * @returns {string | void} - Returns the CSS string if `returnOnlyPropNVal` is true, otherwise updates the style tag.
 */
export const createClass = (className = "", returnOnlyPropNVal = false) => {
    // Split the className into parts using "-" to identify its category.
    const classParts = className.split("-");
    const firstPart = classParts[0];  // Extract the first part to determine the class type.
    let returnedString = "", varString = "";  // Initialize variables for CSS rules and variable definitions.

    // Handle size-related classes like width, height, and general size.
    if (/^(?:max_|min_)?(?:wd|ht|size)/.test(firstPart)) {
        returnedString = sizeClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle aspect ratio classes.
    else if (firstPart === "aspect_ratio") {
        returnedString = aspectClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle layout-related classes (e.g., display).
    else if (firstPart === "d") {
        returnedString = layoutClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle flexbox-related classes.
    else if (/^flex/.test(firstPart)) {
        returnedString = flexClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle grid-related classes.
    else if (/^grid/.test(firstPart)) {
        returnedString = gridClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle justify-content-related classes.
    else if (/^justify/.test(firstPart)) {
        returnedString = justifyClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle element alignment (e.g., center, align-left/right).
    else if (/^(?:center_el|align_(right|left|bottom|top))/.test(firstPart)) {
        returnedString = centerElemClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle alignment-related classes.
    else if (/^align/.test(firstPart)) {
        returnedString = alignClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle gap-related classes.
    else if (/gap$/.test(firstPart)) {
        returnedString = gapCLasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle order-related classes.
    else if (firstPart === "order") {
        returnedString = orderClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle position-related classes.
    else if (firstPart === "pos") {
        returnedString = positionClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle overflow-related classes.
    else if (/^overflow/.test(firstPart)) {
        returnedString = overflowClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle z-index-related classes.
    else if (firstPart === "zIndex") {
        returnedString = zIndexClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle top, right, bottom, left (TRBL) positioning classes.
    else if (/^(right|left|bottom|top)/.test(firstPart)) {
        returnedString = trblClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle variable classes (e.g., CSS variables).
    else if (/^vars/.test(firstPart)) {
        varString = varClass(className.split("@"), className);
    } 
    // Handle padding and margin (spacing) classes.
    else if (/^(p[_-]|m[_-])/.test(className)) {
        returnedString = spacingClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle background-related classes.
    else if (/^(bg[_-])/.test(className)) {
        returnedString = bgClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle border and outline-related classes.
    else if (/^(border|outline)/.test(className)) {
        returnedString = borderCLasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle ring-related classes.
    else if (/^ring/.test(className)) {
        returnedString = ringClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle filter and backdrop filter classes.
    else if (/^(filter|bdFilter)/.test(className)) {
        returnedString = filterClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle blend mode-related classes.
    else if (/^(bg|mix)_blend/.test(className)) {
        returnedString = blendClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle opacity-related classes.
    else if (/^opacity/.test(className)) {
        returnedString = opacityClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle shadow-related classes.
    else if (/^(shadow|txt_shadow)/.test(className)) {
        returnedString = shadowClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle text gradient classes.
    else if (/^text_grad/.test(className)) {
        returnedString = textGradClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle font-related classes.
    else if (/^font/.test(className)) {
        returnedString = fontClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle color-related classes.
    else if (/^color/.test(className)) {
        returnedString = colorClass(classParts, className, returnOnlyPropNVal);
    } 
    // Handle letter-spacing-related classes.
    else if (/^letter/.test(className)) {
        returnedString = letterClass(classParts, className, returnOnlyPropNVal);
    } 
    // Handle text-related classes.
    else if (/^txt/.test(className)) {
        returnedString = textClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle line-related classes.
    else if (/^line/.test(className)) {
        returnedString = lineClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle font import (@import) rules.
    else if (/^@import/.test(className)) {
        fontImportClass(classParts);
    } 
    // Handle scroll and overscroll-related classes.
    else if (/^(scroll|overscroll)/.test(className)) {
        returnedString = scrollClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle transform-related classes.
    else if (/^transform/.test(className)) {
        returnedString = transformClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle transition-related classes.
    else if (/^transition/.test(className)) {
        returnedString = transitionClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle perspective origin classes.
    else if (/^perspective_origin/.test(className)) {
        returnedString = perspectiveOrgClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle column-related classes.
    else if (/^column/.test(className)) {
        returnedString = columnClasses(classParts, className, returnOnlyPropNVal);
    } 
    // Handle content visibility classes.
    else if (firstPart === "content_visibility") {
        returnedString = content_visibilityClass(classParts, className, returnOnlyPropNVal);
    } 
    // Handle backface visibility classes.
    else if (firstPart === "backface_visibility") {
        returnedString = backFaceClass(classParts, className, returnOnlyPropNVal);
    } 
    // Handle interaction-related classes (e.g., caret, accent, cursor).
    else if (["caret_color", "accent_color", "cursor", "pointer_events", "resize", "touch_act", "user_select"]
        .includes(firstPart)) {
        returnedString = interactionClasses(classParts, className, returnOnlyPropNVal);
    }
    // Handle content for ::after and ::before elements.
    else if (firstPart === "content") {
        returnedString = abContentClass(classParts, className, returnOnlyPropNVal);
    } 

    // If only CSS properties and values are requested, return them.
    if (returnOnlyPropNVal) return returnedString;

};



