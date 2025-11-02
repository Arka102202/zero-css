import { createClass } from './addDynamicClass.js';
import { createSelectorClasses } from './combinators/_child.js';
import { addCssVariables, addGlobalStyle } from './createClass/_generic.js';
import { generalTransformClass } from './createClass/_trans.js';
import { ZeroCSSConfig, configure, resetConfiguration, getConfiguration, applyPreset } from './config.js';

// Initialize a Set to store unique class names
const classNames = new Set();

// to track the start index for processing class names
let startIdx = 0;

// Memory management: Maximum number of class names to store before cleanup
const MAX_CLASS_NAMES = 10000;

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
 * Load configuration from script tag data attributes
 * Parses data-zero-css-* attributes and applies them to configuration
 *
 * @example
 * <script src="./main.js" data-zero-css-debug="true" data-zero-css-batch-delay="20"></script>
 */
function loadConfigFromScriptTag() {
  const scriptTag = document.currentScript || document.querySelector('script[src*="main.js"]');
  if (!scriptTag) return;

  const config = {};

  // Parse data attributes
  Array.from(scriptTag.attributes).forEach(attr => {
    if (attr.name.startsWith('data-zero-css-')) {
      // Convert kebab-case to camelCase: data-zero-css-batch-delay -> batchDelay
      const key = attr.name
        .replace('data-zero-css-', '')
        .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

      let value = attr.value;

      // Parse boolean values
      if (value === 'true') value = true;
      if (value === 'false') value = false;

      // Parse numbers
      if (/^\d+$/.test(value)) value = parseInt(value);
      if (/^\d+\.\d+$/.test(value)) value = parseFloat(value);

      config[key] = value;
    }
  });

  if (Object.keys(config).length > 0) {
    configure(config);
    if (ZeroCSSConfig.debug) {
      console.log('ZERO CSS: Loaded configuration from script tag', config);
    }
  }
}

/**
 * Detect environment and apply appropriate configuration preset
 * - Development: localhost, 127.0.0.1, or file:// protocol
 * - Production: all other environments
 */
function detectEnvironment() {
  const isDevelopment =
    !window.location.host ||
    window.location.host.includes('localhost') ||
    window.location.host.includes('127.0.0.1') ||
    window.location.protocol === 'file:';

  if (isDevelopment) {
    if (ZeroCSSConfig.debug) {
      console.log('ZERO CSS: Development environment detected');
    }
    applyPreset('development');
  } else {
    if (ZeroCSSConfig.debug) {
      console.log('ZERO CSS: Production environment detected');
    }
    applyPreset('production');
  }
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
      if (className.startsWith('__')) {
        createSelectorClasses(className);
      }
      // For regular class names, create standard CSS rules.
      else {
        if (ZeroCSSConfig.debug) {
          console.log('ZERO CSS: Processing class:', className);
        }
        createClass(className, false);
      }
    }
  });

  if (ZeroCSSConfig.debug) {
    console.log('ZERO CSS: Total classes processed:', classNames.size);
  }
  // Update `startIdx` to mark the current size of `classNames`
  // to avoid reprocessing already handled class names.
  startIdx = classNames.size;

  // Memory management: Prevent unbounded growth of classNames Set
  // In most real-world scenarios, reaching 10k unique classes is extremely rare
  if (classNames.size > MAX_CLASS_NAMES) {
    console.warn(`ZERO CSS: Class name cache exceeded ${MAX_CLASS_NAMES} entries. This is unusual and may indicate an issue.`);
  }
};


// Initialize a MutationObserver with the handleMutations callback
const observer = new MutationObserver(handleMutations);

/**
 * Starts observing changes in the configured root element's attributes, child nodes, and subtree.
 * Uses ZeroCSSConfig.observeRoot or defaults to document.body
 */
export function startObserving() {
  const targetNode = ZeroCSSConfig.observeRoot || document.body;

  if (ZeroCSSConfig.debug) {
    console.log('ZERO CSS: Starting observation on', targetNode);
  }

  // Configure the observer to look for changes in attributes, child nodes, and the subtree
  observer.observe(targetNode, { attributes: true, childList: true, subtree: true });
  // Note: Removed toggle-class mutation to avoid triggering the observer unnecessarily
}

/**
 * Stops observing changes in the DOM.
 * New classes added after this will not be automatically processed.
 */
export function stopObserving() {
  observer.disconnect();

  if (ZeroCSSConfig.debug) {
    console.log('ZERO CSS: Stopped observation');
  }
}

// Load configuration from script tag data attributes (before environment detection)
loadConfigFromScriptTag();

// Auto-detect environment and apply appropriate preset
if (ZeroCSSConfig.autoStart) {
  detectEnvironment();
}

// Set up an event listener to run the initial class name processing and start observing when the page loads
if (ZeroCSSConfig.autoStart) {
  window.addEventListener('DOMContentLoaded', startObserving);
}

// Call the global initialization functions
generalTransformClass();
addGlobalStyle();
addCssVariables();

// Call onInit callback if provided
if (ZeroCSSConfig.onInit) {
  ZeroCSSConfig.onInit();
}

/**
 * Global ZERO CSS API exposed on window object
 * Provides runtime access to configuration and control methods
 */
window.ZERO_CSS = {
  // Configuration methods
  configure,
  resetConfiguration,
  getConfiguration,
  applyPreset,

  // Observer control
  startObserving,
  stopObserving,

  // Convenience methods
  enableDebug() {
    configure({ debug: true });
    console.log('ZERO CSS: Debug mode enabled');
  },

  disableDebug() {
    configure({ debug: false });
    console.log('ZERO CSS: Debug mode disabled');
  },

  setErrorMode(mode) {
    if (!['silent', 'warn', 'throw'].includes(mode)) {
      console.error('ZERO CSS: Invalid error mode. Use: silent, warn, or throw');
      return;
    }
    configure({ errorMode: mode });
    console.log(`ZERO CSS: Error mode set to "${mode}"`);
  },

  // Utility methods
  getClassCount() {
    return classNames.size;
  },

  clearClasses() {
    classNames.clear();
    startIdx = 0;
    if (ZeroCSSConfig.debug) {
      console.log('ZERO CSS: Class cache cleared');
    }
  },

  // Version info
  version: '1.0.0'
};

if (ZeroCSSConfig.debug) {
  console.log('ZERO CSS: Initialized', {
    version: window.ZERO_CSS.version,
    config: getConfiguration()
  });
}
