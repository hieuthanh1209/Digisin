// Centralized application configuration
export const APP_CONFIG = {
  name: 'Restaurant Management System',
  version: '1.0.0',
  description: 'Hệ thống quản lý nhà hàng hoàn chỉnh',
  
  // User roles and permissions
  roles: ['waiter', 'chef', 'cashier', 'manager'],
  
  // Feature flags
  features: {
    realTimeUpdates: true,
    offlineSupport: false,
    multiLanguage: false,
    pushNotifications: true,
    analytics: true,
    exportReports: true
  },
  
  // UI configuration
  ui: {
    theme: 'light',
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    currency: 'VNĐ',
    locale: 'vi-VN',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm'
  },
  
  // Business rules
  business: {
    vatRate: 0.08, // 8% VAT
    maxTablesPerWaiter: 6,
    orderTimeout: 30, // minutes
    maxDiscountPercent: 50,
    inventoryVarianceThreshold: 10 // percent
  },
  
  // API endpoints (for Firebase integration)
  api: {
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://your-app.firebaseapp.com' 
      : 'http://localhost:8000',
    version: 'v1',
    timeout: 10000 // milliseconds
  },
  
  // Dashboard routes
  routes: {
    home: '/public/index.html',
    waiter: '/src/dashboards/waiter/index.html',
    chef: '/src/dashboards/chef/index.html', 
    cashier: '/src/dashboards/cashier/index.html',
    manager: '/src/dashboards/manager/index.html'
  },
  
  // Default data
  defaults: {
    tableCapacity: 4,
    orderStatusTimeout: {
      pending: 5,    // minutes before alert
      preparing: 15, // minutes before alert
      ready: 10      // minutes before alert
    }
  }
};

// Environment-specific configurations
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  const configs = {
    development: {
      debug: true,
      mockData: true,
      apiDelay: 1000
    },
    production: {
      debug: false,
      mockData: false,
      apiDelay: 0
    }
  };
  
  return configs[env] || configs.development;
}; 

// System settings utility functions
export const SystemSettings = {
  // Get current system settings from localStorage or defaults
  get() {
    const defaultSettings = {
      business: {
        vatRate: 0.08, // 8%
        maxTablesPerWaiter: 6,
        orderTimeout: 30,
        maxDiscountPercent: 50,
        inventoryVarianceThreshold: 10
      },
      ui: {
        currency: 'VNĐ',
        dateFormat: 'DD/MM/YYYY',
        theme: 'light',
        locale: 'vi-VN'
      }
    };
    
    const saved = localStorage.getItem('systemSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          business: { ...defaultSettings.business, ...parsed.business },
          ui: { ...defaultSettings.ui, ...parsed.ui }
        };
      } catch (error) {
        console.warn('Error parsing saved settings, using defaults:', error);
        return defaultSettings;
      }
    }
    return defaultSettings;
  },
  
  // Save system settings
  save(settings) {
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    
    // Dispatch event for other components to listen
    window.dispatchEvent(new CustomEvent('systemSettingsUpdated', { detail: settings }));
  },
  
  // Get current VAT rate
  getVatRate() {
    return this.get().business.vatRate;
  },
  
  // Calculate tax for a given amount
  calculateTax(amount) {
    return amount * this.getVatRate();
  },
  
  // Calculate total with tax
  calculateTotal(subtotal) {
    return subtotal + this.calculateTax(subtotal);
  },
  
  // Format currency based on current settings
  formatCurrency(amount) {
    const settings = this.get();
    return new Intl.NumberFormat(settings.ui.locale, {
      style: 'currency',
      currency: settings.ui.currency === 'VNĐ' ? 'VND' : settings.ui.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  },
  
  // Reset to defaults
  reset() {
    localStorage.removeItem('systemSettings');
    window.dispatchEvent(new CustomEvent('systemSettingsReset'));
  }
};