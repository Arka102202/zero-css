/**
 * ZERO CSS Configuration System
 *
 * Provides a flexible configuration system to customize ZERO CSS behavior.
 * Configuration can be set via JavaScript API or HTML data attributes.
 */

/**
 * Default configuration for ZERO CSS
 * @type {Object}
 */
export const ZeroCSSConfig = {
  // === Core Settings ===

  /** Enable debug mode with verbose logging */
  debug: false,

  /** Root element to observe for class changes (null = document.body) */
  observeRoot: null,

  /** Whether to start observing automatically on DOMContentLoaded */
  autoStart: true,

  // === Performance Settings ===

  /** Batch mutation processing delay in milliseconds */
  batchDelay: 10,

  /** Maximum number of classes to process per batch */
  maxBatchSize: 100,

  /** Enable class name caching for better performance */
  enableCache: true,

  /** Maximum cache size (older entries removed when exceeded) */
  maxCacheSize: 1000,

  /** Only process classes for visible elements (uses IntersectionObserver) */
  useIntersectionObserver: false,

  // === Error Handling ===

  /** Error handling mode: 'silent' (no errors), 'warn' (console warnings), 'throw' (throw errors) */
  errorMode: 'warn',

  /** Validate class names before processing */
  validateClasses: true,

  /** Enable strict mode (throw errors instead of warnings) */
  strictMode: false,

  /** Log all invalid class names to console */
  logInvalidClasses: false,

  /** Custom error handler callback function(className, error, context) */
  onError: null,

  // === Development Tools ===

  /** Expose debugging API on window.__ZERO_CSS__ */
  exposeDebugAPI: false,

  /** Track performance metrics */
  trackPerformance: false,

  /** Warn when cache size exceeds threshold */
  warnOnLargeCache: true,

  /** Cache size warning threshold */
  cacheSizeWarningThreshold: 800,

  // === CSS Generation ===

  /** Custom breakpoints (overrides defaults). Format: { name: 'value' } */
  breakpoints: null,

  /** Prefix for all generated CSS classes (e.g., 'zc-' makes 'zc-wd-500px') */
  classPrefix: '',

  /** ID for the runtime style tag */
  styleTagId: 'zero-css-runtime',

  /** ID for the font import style tag */
  fontStyleTagId: 'zero-css-fonts',

  /** ID for CSS variables style tag */
  variablesStyleTagId: 'zero-css-variables',

  /** Minify generated CSS (remove whitespace) */
  minifyCSS: false,

  // === Security ===

  /** Sanitize all selector inputs to prevent CSS injection */
  sanitizeSelectors: true,

  /** Sanitize all value inputs */
  sanitizeValues: true,

  /** Allowed URL protocols for images/fonts */
  allowedProtocols: ['https:', 'data:'],

  /** CSP nonce for inline styles */
  cspNonce: null,

  // === Advanced ===

  /** Custom class handlers for extending functionality */
  customHandlers: {},

  /** Callback when library is initialized */
  onInit: null,

  /** Callback before processing each class */
  onBeforeClassGeneration: null,

  /** Callback after processing each class */
  onAfterClassGeneration: null
};

/**
 * Store original default values for reset functionality
 * @private
 */
const defaultConfig = { ...ZeroCSSConfig };

/**
 * Configuration validators
 * @private
 */
const configValidators = {
  debug: (v) => typeof v === 'boolean',
  observeRoot: (v) => v === null || v instanceof HTMLElement,
  autoStart: (v) => typeof v === 'boolean',
  batchDelay: (v) => typeof v === 'number' && v >= 0,
  maxBatchSize: (v) => typeof v === 'number' && v > 0,
  enableCache: (v) => typeof v === 'boolean',
  maxCacheSize: (v) => typeof v === 'number' && v > 0,
  useIntersectionObserver: (v) => typeof v === 'boolean',
  errorMode: (v) => ['silent', 'warn', 'throw'].includes(v),
  validateClasses: (v) => typeof v === 'boolean',
  strictMode: (v) => typeof v === 'boolean',
  logInvalidClasses: (v) => typeof v === 'boolean',
  onError: (v) => v === null || typeof v === 'function',
  exposeDebugAPI: (v) => typeof v === 'boolean',
  trackPerformance: (v) => typeof v === 'boolean',
  warnOnLargeCache: (v) => typeof v === 'boolean',
  cacheSizeWarningThreshold: (v) => typeof v === 'number' && v > 0,
  breakpoints: (v) => v === null || (typeof v === 'object' && !Array.isArray(v)),
  classPrefix: (v) => typeof v === 'string',
  styleTagId: (v) => typeof v === 'string',
  fontStyleTagId: (v) => typeof v === 'string',
  variablesStyleTagId: (v) => typeof v === 'string',
  minifyCSS: (v) => typeof v === 'boolean',
  sanitizeSelectors: (v) => typeof v === 'boolean',
  sanitizeValues: (v) => typeof v === 'boolean',
  allowedProtocols: (v) => Array.isArray(v) && v.every(p => typeof p === 'string'),
  cspNonce: (v) => v === null || typeof v === 'string',
  customHandlers: (v) => typeof v === 'object' && !Array.isArray(v),
  onInit: (v) => v === null || typeof v === 'function',
  onBeforeClassGeneration: (v) => v === null || typeof v === 'function',
  onAfterClassGeneration: (v) => v === null || typeof v === 'function'
};

/**
 * Validate a configuration value
 * @param {string} key - Configuration key
 * @param {any} value - Value to validate
 * @returns {boolean} Whether the value is valid
 * @private
 */
function validateConfigValue(key, value) {
  if (configValidators[key]) {
    const isValid = configValidators[key](value);
    if (!isValid) {
      console.error(`ZERO CSS: Invalid value for config option "${key}":`, value);
      return false;
    }
  }
  return true;
}

/**
 * Configure ZERO CSS with custom options
 *
 * @param {Partial<typeof ZeroCSSConfig>} userConfig - Custom configuration object
 *
 * @example
 * configure({
 *   debug: true,
 *   errorMode: 'warn',
 *   batchDelay: 20
 * });
 */
export function configure(userConfig) {
  if (typeof userConfig !== 'object' || userConfig === null) {
    console.error('ZERO CSS: configure() requires an object argument');
    return;
  }

  // Validate and warn about unknown keys
  const validKeys = Object.keys(ZeroCSSConfig);
  Object.keys(userConfig).forEach(key => {
    if (!validKeys.includes(key)) {
      console.warn(`ZERO CSS: Unknown config option "${key}"`);
    }
  });

  // Validate and apply each config value
  Object.entries(userConfig).forEach(([key, value]) => {
    if (validKeys.includes(key) && validateConfigValue(key, value)) {
      ZeroCSSConfig[key] = value;
    }
  });

  if (ZeroCSSConfig.debug) {
    console.log('ZERO CSS: Configuration updated', ZeroCSSConfig);
  }
}

/**
 * Get current configuration
 *
 * @returns {typeof ZeroCSSConfig} Copy of current configuration
 *
 * @example
 * const config = getConfiguration();
 * console.log(config.debug); // false
 */
export function getConfiguration() {
  return { ...ZeroCSSConfig };
}

/**
 * Reset configuration to default values
 *
 * @example
 * resetConfiguration();
 */
export function resetConfiguration() {
  Object.keys(ZeroCSSConfig).forEach(key => {
    ZeroCSSConfig[key] = defaultConfig[key];
  });

  if (ZeroCSSConfig.debug) {
    console.log('ZERO CSS: Configuration reset to defaults');
  }
}

/**
 * Configuration presets for common use cases
 */
export const ConfigPresets = {
  /**
   * Development preset with debugging enabled
   * - Verbose logging
   * - Warnings enabled
   * - Class validation
   * - Performance tracking
   */
  development: {
    debug: true,
    errorMode: 'warn',
    validateClasses: true,
    exposeDebugAPI: true,
    trackPerformance: true,
    logInvalidClasses: true,
    warnOnLargeCache: true,
    strictMode: false
  },

  /**
   * Production preset optimized for performance
   * - No logging
   * - Silent errors
   * - Caching enabled
   * - CSS minification
   * - Larger cache size
   */
  production: {
    debug: false,
    errorMode: 'silent',
    minifyCSS: true,
    enableCache: true,
    useIntersectionObserver: true,
    batchDelay: 5,
    maxCacheSize: 2000,
    validateClasses: false,
    exposeDebugAPI: false,
    trackPerformance: false
  },

  /**
   * Testing preset for unit/integration tests
   * - Strict mode (throw errors)
   * - No auto-start
   * - Class validation
   * - No caching
   */
  testing: {
    debug: false,
    errorMode: 'throw',
    strictMode: true,
    validateClasses: true,
    autoStart: false,
    enableCache: false,
    trackPerformance: false,
    exposeDebugAPI: false
  },

  /**
   * Minimal preset with all features disabled
   * - No debugging
   * - Silent errors
   * - No validation
   * - No caching
   * - Minimal overhead
   */
  minimal: {
    debug: false,
    errorMode: 'silent',
    validateClasses: false,
    enableCache: false,
    trackPerformance: false,
    exposeDebugAPI: false,
    warnOnLargeCache: false,
    useIntersectionObserver: false
  }
};

/**
 * Apply a configuration preset
 *
 * @param {keyof ConfigPresets} presetName - Name of preset to apply
 *
 * @example
 * applyPreset('production');
 */
export function applyPreset(presetName) {
  if (!ConfigPresets[presetName]) {
    console.error(`ZERO CSS: Unknown preset "${presetName}". Available presets: ${Object.keys(ConfigPresets).join(', ')}`);
    return;
  }

  configure(ConfigPresets[presetName]);

  if (ZeroCSSConfig.debug) {
    console.log(`ZERO CSS: Applied "${presetName}" preset`);
  }
}
