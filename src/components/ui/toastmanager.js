/**
 * Toast notification component
 * Reusable across all dashboards
 */

class ToastManager {
  constructor() {
    this.container = null;
    this.toastCounter = 0;
    this.init();
  }

  // Initialize toast container
  init() {
    if (!document.getElementById("toast-container")) {
      this.container = document.createElement("div");
      this.container.id = "toast-container";
      this.container.className =
        "toast-container position-fixed top-0 end-0 p-3";
      this.container.style.zIndex = "1055";
      document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById("toast-container");
    }
  }

  // Show toast notification
  show(message, type, duration) {
    if (!type) type = "info";
    if (!duration) duration = 4000;

    var toastId = "toast-" + ++this.toastCounter;

    var toast = document.createElement("div");
    toast.id = toastId;
    toast.className =
      "toast align-items-center text-white bg-" +
      this.getBootstrapColor(type) +
      " border-0";
    toast.setAttribute("role", "alert");
    toast.innerHTML =
      '<div class="d-flex">' +
      '<div class="toast-body">' +
      '<i class="' +
      this.getIcon(type) +
      ' me-2"></i>' +
      message +
      "</div>" +
      '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>' +
      "</div>";

    this.container.appendChild(toast);

    // Initialize Bootstrap toast
    if (typeof bootstrap !== "undefined") {
      var bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: duration,
      });

      // Show toast
      bsToast.show();
    } else {
      console.error("Bootstrap not found. Toast may not work properly.");
      // Fallback basic functionality
      toast.style.display = "block";
      setTimeout(function () {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, duration);
    }

    // Clean up after toast is hidden
    var self = this;
    toast.addEventListener("hidden.bs.toast", function () {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    });

    return toastId;
  }

  // Get Bootstrap color class based on type
  getBootstrapColor(type) {
    var colors = {
      success: "success",
      error: "danger",
      warning: "warning",
      info: "primary",
    };
    return colors[type] || "primary";
  }

  // Get icon based on type
  getIcon(type) {
    var icons = {
      success: "fas fa-check-circle",
      error: "fas fa-times-circle",
      warning: "fas fa-exclamation-triangle",
      info: "fas fa-info-circle",
    };
    return icons[type] || "fas fa-info-circle";
  }

  // Convenience methods
  success(message, duration) {
    return this.show(message, "success", duration);
  }

  error(message, duration) {
    return this.show(message, "error", duration);
  }

  warning(message, duration) {
    return this.show(message, "warning", duration);
  }

  info(message, duration) {
    return this.show(message, "info", duration);
  }

  // Hide specific toast
  hide(toastId) {
    var toast = document.getElementById(toastId);
    if (toast) {
      if (typeof bootstrap !== "undefined") {
        var bsToast = bootstrap.Toast.getInstance(toast);
        if (bsToast) {
          bsToast.hide();
        }
      } else if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }
  }

  // Hide all toasts
  hideAll() {
    var toasts = this.container.querySelectorAll(".toast");
    for (var i = 0; i < toasts.length; i++) {
      var toast = toasts[i];
      if (typeof bootstrap !== "undefined") {
        var bsToast = bootstrap.Toast.getInstance(toast);
        if (bsToast) {
          bsToast.hide();
        }
      } else if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }
  }
}

// Create global instance
window.Toast = new ToastManager();

// Export for modules
export default ToastManager;
