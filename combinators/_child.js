import { createClass } from "../addDynamicClass.js";
import { addMediaQuery} from "../createClass/_generic.js";

export const createSelectorClasses = (className = "", styleTag) => {


    // __div[>/ /+/~]p[>/ /+/~].className--[max/min]_[breakpoint]@value1,value2,value3,.....

    className = className.replace(/^__/, "");

    const classParts = className.split("@");

    const selectorNMediaQuery = classParts[0].split("--");

    const classNameToBe = selectorNMediaQuery[0].replace(/_/g, " ");

    const valueParts = classParts.at(-1).split(",");

    let classInside = "";
    console.log({ valueParts });

    for (let i = 0; i < valueParts.length; i++) {
        const propValName = valueParts[i];
        classInside += (createClass(propValName, styleTag, true) + (i !== valueParts.length - 1 ? "\n\t" : "\n"));
    }

    const classToBuild = `${classNameToBe} {\n${classInside}}`;

    const completeClassDef = selectorNMediaQuery.length === 2 ? addMediaQuery(classToBuild, selectorNMediaQuery) : classToBuild;

    styleTag.innerHTML += completeClassDef;

}