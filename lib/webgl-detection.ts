/**
 * Detects if WebGL is available in the current browser
 * @returns boolean indicating if WebGL is available
 */
export function isWebGLAvailable(): boolean {
  try {
    // Create a canvas element
    const canvas = document.createElement("canvas")

    // Try to get WebGL context
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")

    // Return true if WebGL context is available
    return !!gl
  } catch (e) {
    // Return false if any error occurs
    return false
  }
}

/**
 * Checks if WebGL2 is available in the current browser
 * @returns boolean indicating if WebGL2 is available
 */
export function isWebGL2Available(): boolean {
  try {
    // Create a canvas element
    const canvas = document.createElement("canvas")

    // Try to get WebGL2 context
    const gl = canvas.getContext("webgl2")

    // Return true if WebGL2 context is available
    return !!gl
  } catch (e) {
    // Return false if any error occurs
    return false
  }
}

/**
 * Returns an error message for when WebGL is not supported
 * @returns string with a user-friendly error message
 */
export function getWebGLErrorMessage(): string {
  return `
    Your browser or device does not seem to support WebGL, which is required for 3D rendering.
    
    You may try:
    - Updating your browser to the latest version
    - Using a different browser like Chrome or Firefox
    - Enabling hardware acceleration in your browser settings
    - Updating your graphics drivers
  `
}
