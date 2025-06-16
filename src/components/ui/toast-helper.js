/**
 * Helper functions for using ToastManager
 * This file provides compatibility with older code that uses showToast
 */

import ToastManager from "./toastmanager.js";

// Create default instance
const toastManager = new ToastManager();

/**
 * Show a toast notification
 * @param {string} title - The toast title or message
 * @param {string} message - Optional message
 * @param {string} type - Type of toast: 'success', 'error', 'warning', 'info'
 * @param {number} duration - How long the toast displays in ms
 * @returns {string} Toast ID
 */
export function showToast(title, message = "", type = "info", duration = 4000) {
  // If only one parameter, treat it as the message
  if (!message) {
    message = title;
    title = "";
  }

  // Combine title and message if needed
  const displayMessage =
    title && message ? `${title}: ${message}` : title || message;

  // Show toast
  return toastManager.show(displayMessage, type, duration);
}

// Utility functions
export function showSuccessToast(message, duration = 4000) {
  return toastManager.success(message, duration);
}

export function showErrorToast(message, duration = 4000) {
  return toastManager.error(message, duration);
}

export function showWarningToast(message, duration = 4000) {
  return toastManager.warning(message, duration);
}

export function showInfoToast(message, duration = 4000) {
  return toastManager.info(message, duration);
}

// Export default instance
export const toast = toastManager;

// Default export for compatibility with other modules
export default showToast;
