import { createClass } from './addDynamicClass.js';
import { createSelectorClasses } from './combinators/_child.js';
import { addCssVariables, addGlobalStyle } from './createClass/_generic.js';
import { generalTransformClass } from './createClass/_trans.js';

// Initialize a Set to store unique class names
const classNames = new Set();

// to track the start index for processing class names
let startIdx = 0;

/**
 * Recursively collects all class names from the specified element and its children.
 *
 * @param {HTMLElement} element - The element to start collecting class names from.
 * @param {Set<string>} [classNames=new Set()] - A Set to store unique class names.
 * 
 */
function getAllClassNames(element = document.body, classNames = new Set()) {

  // If the element has classList, add each class name to the Set
  if (element.classList) {
    element.classList.forEach(className => classNames.add(className));
  }
  // Recursively call the function for each child node
  (element.childNodes || []).forEach(child => getAllClassNames(child, classNames));

}

/**
 * Handles mutations observed in the DOM, updates the `classNames` Set,
 * and applies new styles by generating CSS rules for each class name.
 * This function ensures that newly added class names are tracked and styled efficiently.
 *
 * @param {MutationRecord[]} mutationsList - A list of MutationRecord objects describing 
 *                                           changes to the DOM (e.g., added/removed nodes or attributes).
 */
const handleMutations = (mutationsList = []) => {

  // Iterate through each mutation record in the list.
  mutationsList.forEach((el) => {
    // If the mutation affects the <body> or #root elements, gather class names recursively.
    if (el.target.localName === "body" || el.target.id === "root") {
      // Collect all class names from the body element and its children into the `classNames` Set.
      getAllClassNames(el.target, classNames);
    } 
    // If it's another element, add each class from its classList to the `classNames` Set.
    else {
      el.target.classList.forEach((className) => classNames.add(className));
    }
  });

  // Iterate over the `classNames` Set and generate new CSS rules as needed.
  let idx = 0;
  classNames.forEach((className) => {
    // Ensure only unprocessed class names (those added after the last update) are processed.
    if (idx++ >= startIdx) {
      // If the class name starts with "__", handle it as a special selector.
      if (/^__/.test(className)) {
        // console.log({ className });
        createSelectorClasses(className);
      } 
      // For regular class names, create standard CSS rules.
      else {
        createClass(className, false);
      }
    }
  });

  // Log the `classNames` Set for debugging purposes.
  // console.log(classNames);

  // Update `startIdx` to mark the current size of `classNames` 
  // to avoid reprocessing already handled class names.
  startIdx = classNames.size;
};


// Initialize a MutationObserver with the handleMutations callback
const observer = new MutationObserver(handleMutations);

/**
 * Starts observing changes in the body element's attributes, child nodes, and subtree.
 */
export function startObserving() {
  const targetNode = document.body;
  // Configure the observer to look for changes in attributes, child nodes, and the subtree
  observer.observe(targetNode, { attributes: true, childList: true, subtree: true });
  targetNode.classList.toggle("toggle-class");
}

// Set up an event listener to run the initial class name processing and start observing when the page loads
window.addEventListener('DOMContentLoaded', startObserving);

// call the global class
generalTransformClass();
addGlobalStyle();
addCssVariables();
