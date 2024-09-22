import { bgClasses } from "./createClass/_background.js";
import { borderCLasses, ringClasses } from "./createClass/_border.js";
import { blendClasses, filterClasses, opacityClasses, shadowClasses, textGradClasses } from "./createClass/_effects.js";
import { alignClasses, centerElemClasses, flexClasses, gapCLasses, gridClasses, justifyClasses, layoutClasses, orderClasses, overflowClasses, positionClasses, trblClasses, zIndexClasses } from "./createClass/_layout.js";
import { scrollClasses } from "./createClass/_scroll.js";
import { aspectClasses, sizeClasses } from "./createClass/_size.js";
import { spacingClasses } from "./createClass/_spacing.js";
import { perspectiveOrgClasses, transformClasses, transitionClasses } from "./createClass/_trans.js";
import { colorClass, fontClasses, fontImportClass, letterClass, textClasses } from "./createClass/_typography.js";
import { varClass } from "./createClass/_var.js";

export const createClass = (className = "", styleTag) => {
    const classParts = className.split("-");
    const firstPart = classParts[0];
    let importStatement = "";
    if (/^(wd|ht|size)$/.test(firstPart)) {
        styleTag.innerHTML += sizeClasses(className, classParts);
    } else if (firstPart === "aspect_ratio") {
        styleTag.innerHTML += aspectClasses(classParts, className);
    } else if (firstPart === "d") {
        styleTag.innerHTML += layoutClasses(classParts, className);
    } else if (/^flex/.test(firstPart)) {
        styleTag.innerHTML += flexClasses(classParts, className);
    } else if (/^grid/.test(firstPart)) {
        styleTag.innerHTML += gridClasses(classParts, className);
    } else if (/^justify/.test(firstPart)) {
        styleTag.innerHTML += justifyClasses(classParts, className);
    } else if (/^(center_el|align_(right|left|bottom|top))/.test(firstPart)) {
        styleTag.innerHTML += centerElemClasses(classParts, className);
    } else if (/^align/.test(firstPart)) {
        styleTag.innerHTML += alignClasses(classParts, className);
    } else if (/gap$/.test(firstPart)) {
        styleTag.innerHTML += gapCLasses(classParts, className);
    } else if (firstPart === "order") {
        styleTag.innerHTML += orderClasses(classParts, className);
    } else if (firstPart === "pos") {
        styleTag.innerHTML += positionClasses(classParts, className);
    } else if (firstPart === "overflow") {
        styleTag.innerHTML += overflowClasses(classParts, className);
    } else if (firstPart === "zIndex") {
        styleTag.innerHTML += zIndexClasses(classParts, className);
    } else if (/^(right|left|bottom|top)/.test(firstPart)) {
        styleTag.innerHTML += trblClasses(classParts, className);
    } else if (/^vars/.test(firstPart)) {
        styleTag.innerHTML = varClass(className.split("::"), className) + styleTag.innerHTML;
    } else if (/^(p[_-]|m[_-])/.test(className)) {
        styleTag.innerHTML += spacingClasses(classParts, className);
    } else if (/^(bg[_-])/.test(className)) {
        styleTag.innerHTML += bgClasses(classParts, className);
    } else if (/^(border|outline)/.test(className)) {
        styleTag.innerHTML += borderCLasses(classParts, className);
    } else if (/^ring/.test(className)) {
        styleTag.innerHTML += ringClasses(classParts, className);
    } else if (/^(filter|bdFilter)/.test(className)) {
        styleTag.innerHTML += filterClasses(classParts, className);
    } else if (/^(bg|mix)_blend/.test(className)) {
        styleTag.innerHTML += blendClasses(classParts, className);
    } else if (/^opacity/.test(className)) {
        styleTag.innerHTML += opacityClasses(classParts, className);
    } else if (/^shadow/.test(className)) {
        styleTag.innerHTML += shadowClasses(classParts, className);
    } else if (/^text_grad/.test(className)) {
        styleTag.innerHTML += textGradClasses(classParts, className);
    } else if (/^font/.test(className)) {
        styleTag.innerHTML += fontClasses(classParts, className);
    } else if (/^color/.test(className)) {
        styleTag.innerHTML += colorClass(classParts, className);
    } else if (/^letter/.test(className)) {
        styleTag.innerHTML += letterClass(classParts, className);
    } else if (/^txt/.test(className)) {
        styleTag.innerHTML += textClasses(classParts, className);
    } else if (/^@import/.test(className)) {
        importStatement += fontImportClass(classParts, className);
    } else if (/^scroll/.test(className)) {
        styleTag.innerHTML += scrollClasses(classParts, className);
    } else if (/^transform/.test(className)) {
        styleTag.innerHTML += transformClasses(classParts, className);
    } else if (/^transition/.test(className)) {
        styleTag.innerHTML += transitionClasses(classParts, className);
    } else if (/^perspective_origin/.test(className)) {
        styleTag.innerHTML += perspectiveOrgClasses(classParts, className);
    }

    styleTag.innerHTML = (importStatement + styleTag.innerHTML);
}




