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