import { bgClasses } from "./createClass/_background.js";
import { borderCLasses, ringClasses } from "./createClass/_border.js";
import { backFaceClass, blendClasses, content_visibilityClass, filterClasses, opacityClasses, shadowClasses, textGradClasses } from "./createClass/_effects.js";
import { interactionClasses } from "./createClass/_interaction.js";
import { alignClasses, centerElemClasses, columnClasses, flexClasses, gapCLasses, gridClasses, justifyClasses, layoutClasses, orderClasses, overflowClasses, positionClasses, trblClasses, zIndexClasses } from "./createClass/_layout.js";
import { scrollClasses } from "./createClass/_scroll.js";
import { aspectClasses, sizeClasses } from "./createClass/_size.js";
import { spacingClasses } from "./createClass/_spacing.js";
import { perspectiveOrgClasses, transformClasses, transitionClasses } from "./createClass/_trans.js";
import { colorClass, fontClasses, fontImportClass, letterClass, textClasses } from "./createClass/_typography.js";
import { varClass } from "./createClass/_var.js";

export const createClass = (className = "", styleTag, returnOnlyPropNVal = false) => {
    const classParts = className.split("-");
    const firstPart = classParts[0];
    let importStatement = "", returnedString = "";
    if (/^(wd|ht|size)$/.test(firstPart)) {
        returnedString = sizeClasses(classParts, className, returnOnlyPropNVal);
    } else if (firstPart === "aspect_ratio") {
        returnedString = aspectClasses(classParts, className, returnOnlyPropNVal);
    } else if (firstPart === "d") {
        returnedString = layoutClasses(classParts, className, returnOnlyPropNVal);
    } else if (/^flex/.test(firstPart)) {
        returnedString = flexClasses(classParts, className, returnOnlyPropNVal);
    } else if (/^grid/.test(firstPart)) {
        returnedString = gridClasses(classParts, className, returnOnlyPropNVal);
    } else if (/^justify/.test(firstPart)) {
        returnedString = justifyClasses(classParts, className, returnOnlyPropNVal);
    } else if (/^(center_el|align_(right|left|bottom|top))/.test(firstPart)) {
        returnedString = centerElemClasses(classParts, className, returnOnlyPropNVal);
    } else if (/^align/.test(firstPart)) {
        returnedString = alignClasses(classParts, className, returnOnlyPropNVal);
    } else if (/gap$/.test(firstPart)) {
        returnedString = gapCLasses(classParts, className, returnOnlyPropNVal);
    } else if (firstPart === "order") {
        returnedString = orderClasses(classParts, className, returnOnlyPropNVal);
    } else if (firstPart === "pos") {
        returnedString = positionClasses(classParts, className, returnOnlyPropNVal);
    } else if (firstPart === "overflow") {
        returnedString = overflowClasses(classParts, className, returnOnlyPropNVal);
    } else if (firstPart === "zIndex") {
        returnedString = zIndexClasses(classParts, className, returnOnlyPropNVal);
    } else if (/^(right|left|bottom|top)/.test(firstPart)) {
        returnedString = trblClasses(classParts, className, returnOnlyPropNVal);
    } else if (/^vars/.test(firstPart)) {
        styleTag.innerHTML = varClass(className.split("@"), className) + styleTag.innerHTML;
    } else if (/^(p[_-]|m[_-])/.test(className)) {
        returnedString = spacingClasses(classParts, className, returnOnlyPropNVal);
    } else if (/^(bg[_-])/.test(className)) {
        returnedString = bgClasses(classParts, className, returnOnlyPropNVal);
    } else if (/^(border|outline)/.test(className)) {
        returnedString = borderCLasses(classParts, className, returnOnlyPropNVal);
    } else if (/^ring/.test(className)) {
        returnedString = ringClasses(classParts, className, returnOnlyPropNVal);
    } else if (/^(filter|bdFilter)/.test(className)) {
        returnedString = filterClasses(classParts, className, returnOnlyPropNVal);
    } else if (/^(bg|mix)_blend/.test(className)) {
        returnedString = blendClasses(classParts, className, returnOnlyPropNVal);
    } else if (/^opacity/.test(className)) {
        returnedString = opacityClasses(classParts, className, returnOnlyPropNVal);
    } else if (/^(shadow|txt_shadow)/.test(className)) {
        returnedString = shadowClasses(classParts, className, returnOnlyPropNVal);
    } else if (/^text_grad/.test(className)) {
        returnedString = textGradClasses(classParts, className, returnOnlyPropNVal);
    } else if (/^font/.test(className)) {
        returnedString = fontClasses(classParts, className, returnOnlyPropNVal);
    } else if (/^color/.test(className)) {
        returnedString = colorClass(classParts, className, returnOnlyPropNVal);
    } else if (/^letter/.test(className)) {
        returnedString = letterClass(classParts, className, returnOnlyPropNVal);
    } else if (/^txt/.test(className)) {
        returnedString = textClasses(classParts, className, returnOnlyPropNVal);
    } else if (/^@import/.test(className)) {
        importStatement += fontImportClass(classParts, className, returnOnlyPropNVal);
    } else if (/^(scroll|overscroll)/.test(className)) {
        returnedString = scrollClasses(classParts, className, returnOnlyPropNVal);
    } else if (/^transform/.test(className)) {
        returnedString = transformClasses(classParts, className, returnOnlyPropNVal);
    } else if (/^transition/.test(className)) {
        returnedString = transitionClasses(classParts, className, returnOnlyPropNVal);
    } else if (/^perspective_origin/.test(className)) {
        returnedString = perspectiveOrgClasses(classParts, className, returnOnlyPropNVal);
    } else if (/^column/.test(className)) {
        returnedString = columnClasses(classParts, className, returnOnlyPropNVal);
    } else if (firstPart === "content_visibility") {
        returnedString = content_visibilityClass(classParts, className, returnOnlyPropNVal);
    } else if (firstPart === "backface_visibility") {
        returnedString = backFaceClass(classParts, className, returnOnlyPropNVal);
    } else if (firstPart === "caret_color") {
        returnedString = interactionClasses(classParts, className, returnOnlyPropNVal);
    } else if (firstPart === "accent_color") {
        returnedString = interactionClasses(classParts, className, returnOnlyPropNVal);
    } else if (firstPart === "cursor") {
        returnedString = interactionClasses(classParts, className, returnOnlyPropNVal);
    } else if (firstPart === "pointer_events") {
        returnedString = interactionClasses(classParts, className, returnOnlyPropNVal);
    } else if (firstPart === "resize") {
        returnedString = interactionClasses(classParts, className, returnOnlyPropNVal);
    } else if (firstPart === "touch_act") {
        returnedString = interactionClasses(classParts, className, returnOnlyPropNVal);
    } else if (firstPart === "user_select") {
        returnedString = interactionClasses(classParts, className, returnOnlyPropNVal);
    }

    if(returnOnlyPropNVal) return returnedString;

    styleTag.innerHTML += returnedString;

    styleTag.innerHTML = (importStatement + styleTag.innerHTML);
}




