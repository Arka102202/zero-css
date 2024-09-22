import { createClass } from './addDynamicClass.js';


// Get the <style> tag where new styles will be added
const styleTag = document.getElementById("style");

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
 * Handles mutations observed in the DOM, updates the classNames Set,
 * and applies new styles for each class name.
 *
 * @param {MutationRecord[]} mutationsList - A list of MutationRecord objects describing each change.
 */
const handleMutations = (mutationsList = []) => {

  mutationsList.forEach(el => {
    if (el.target.localName === "body" || el.target.id === "root") {
      // Get all class names from the body and its children
      getAllClassNames(el.target, classNames);
    }
    // If not the first time, add class names from the target element's classList
    else el.target.classList.forEach(el => classNames.add(el));

  });

  // Iterate over the Set of class names and create new CSS rules for each
  let idx = 0;
  classNames.forEach((el) => {
    if (idx++ >= startIdx) createClass(el, styleTag);
  });

  console.log(classNames);

  // Update startIdx to avoid reprocessing class names
  startIdx = classNames.size;
}

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

