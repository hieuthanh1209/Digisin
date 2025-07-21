// VAT Management Utility for Restaurant Management System
// This file provides centralized VAT rate management across all components

// Cache for VAT rate to avoid repeated localStorage reads
let vatRateCache = null;

/**
 * Get current VAT rate from system settings
 * @returns {number} VAT rate as decimal (e.g., 0.1 for 10%)
 */
function getCurrentVatRate() {
    try {
        // Return cached value if available
        if (vatRateCache !== null) {
            console.log('Using cached VAT rate:', vatRateCache);
            return vatRateCache;
        }
        
        // First try to get from new tax system (taxHistory)
        const taxHistory = JSON.parse(localStorage.getItem('taxHistory'));
        if (taxHistory && taxHistory.length > 0) {
            // Sort by date in descending order and get the most recent rate
            const sortedHistory = taxHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
            const currentRate = parseFloat(sortedHistory[0].rate) / 100; // Convert from % to decimal
            console.log('Using VAT rate from new tax system:', currentRate);
            vatRateCache = currentRate;
            return currentRate;
        }
        
        // Try to get from old system settings
        const settings = JSON.parse(localStorage.getItem('systemSettings'));
        if (settings?.business?.vatRate) {
            console.log('Using VAT rate from old system settings:', settings.business.vatRate);
            vatRateCache = settings.business.vatRate;
            return settings.business.vatRate;
        }
        
        // Fallback to app config
        if (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.business?.vatRate) {
            console.log('Using VAT rate from app config:', APP_CONFIG.business.vatRate);
            vatRateCache = APP_CONFIG.business.vatRate;
            return APP_CONFIG.business.vatRate;
        }
        
        // Default fallback
        console.log('Using default VAT rate: 0.08');
        vatRateCache = 0.08;
        return 0.08; // 8% VAT default
    } catch (error) {
        console.warn('Error getting VAT rate, using default:', error);
        vatRateCache = 0.08;
        return 0.08;
    }
}

/**
 * Get VAT rate for a specific order based on its timestamp
 * @param {string|Date} orderTimestamp - Order timestamp
 * @returns {number} VAT rate that was applicable at that time
 */
function getVatRateForOrder(orderTimestamp) {
    try {
        const orderDate = new Date(orderTimestamp);
        
        // First try to get from new tax system (taxHistory)
        const taxHistory = JSON.parse(localStorage.getItem('taxHistory'));
        if (taxHistory && taxHistory.length > 0) {
            // Sort by date in descending order
            const sortedHistory = taxHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Find the applicable tax rate for this order
            for (const entry of sortedHistory) {
                const entryDate = new Date(entry.date);
                if (orderDate >= entryDate) {
                    const applicableRate = parseFloat(entry.rate) / 100; // Convert from % to decimal
                    console.log(`Using VAT rate ${entry.rate}% (${applicableRate}) from new tax system for order from ${orderDate.toLocaleString()}`);
                    return applicableRate;
                }
            }
            
            // If no applicable entry found, use the oldest rate
            const oldestRate = parseFloat(sortedHistory[sortedHistory.length - 1].rate) / 100;
            console.log(`Using oldest VAT rate ${sortedHistory[sortedHistory.length - 1].rate}% from new tax system`);
            return oldestRate;
        }
        
        // Fallback to old VAT history system
        const vatHistory = getVatRateHistory();
        
        // Find the applicable VAT rate for this order
        for (let i = vatHistory.length - 1; i >= 0; i--) {
            const historyEntry = vatHistory[i];
            const changeDate = new Date(historyEntry.timestamp);
            
            if (orderDate >= changeDate) {
                console.log(`Using VAT rate ${historyEntry.rate * 100}% from old system for order from ${orderDate.toLocaleString()}`);
                return historyEntry.rate;
            }
        }
        
        // If no history found, use current rate
        return 0.08;
    } catch (error) {
        console.warn('Error getting historical VAT rate, using current:', error);
        return getCurrentVatRate();
    }
}

/**
 * Get VAT rate history from localStorage
 * @returns {Array} Array of VAT rate changes with timestamps
 */
function getVatRateHistory() {
    try {
        // First try to get from new tax system (taxHistory)
        const taxHistory = JSON.parse(localStorage.getItem('taxHistory'));
        if (taxHistory && taxHistory.length > 0) {
            // Convert new tax history format to old VAT history format
            const convertedHistory = taxHistory.map(entry => ({
                rate: parseFloat(entry.rate) / 100, // Convert from % to decimal
                timestamp: entry.date,
                changedBy: entry.changedBy || 'Manager',
                reason: entry.reason || 'Tax rate update'
            }));
            
            console.log('Using VAT history from new tax system:', convertedHistory.length, 'entries');
            return convertedHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        }
        
        // Fallback to old VAT history system
        const history = localStorage.getItem('vatRateHistory');
        if (history) {
            console.log('Using VAT history from old system');
            return JSON.parse(history);
        }
        
        // Initialize with current rate if no history exists
        const currentRate = getCurrentVatRate();
        const initialHistory = [{
            rate: currentRate,
            timestamp: new Date().toISOString(),
            changedBy: 'System',
            reason: 'Initial setup'
        }];
        
        localStorage.setItem('vatRateHistory', JSON.stringify(initialHistory));
        console.log('Initialized new VAT history with current rate:', currentRate);
        return initialHistory;
    } catch (error) {
        console.error('Error loading VAT history:', error);
        return [{
            rate: 0.08,
            timestamp: new Date().toISOString(),
            changedBy: 'System',
            reason: 'Error fallback'
        }];
    }
}

/**
 * Record a VAT rate change in history
 * @param {number} newRate - New VAT rate
 * @param {string} changedBy - Who made the change
 * @param {string} reason - Reason for change
 */
function recordVatRateChange(newRate, changedBy = 'Manager', reason = 'Rate adjustment') {
    try {
        const history = getVatRateHistory();
        const newEntry = {
            rate: newRate,
            timestamp: new Date().toISOString(),
            changedBy,
            reason
        };
        
        history.push(newEntry);
        localStorage.setItem('vatRateHistory', JSON.stringify(history));
        
        console.log('VAT rate change recorded:', newEntry);
        return true;
    } catch (error) {
        console.error('Error recording VAT rate change:', error);
        return false;
    }
}

/**
 * Calculate tax amount for given subtotal with historical rate consideration
 * @param {number} subtotal - The subtotal amount
 * @param {string|Date} orderTimestamp - Optional timestamp for historical rate
 * @returns {number} Tax amount
 */
function calculateTax(subtotal, orderTimestamp = null) {
    let vatRate;
    
    if (orderTimestamp) {
        vatRate = getVatRateForOrder(orderTimestamp);
    } else {
        vatRate = getCurrentVatRate();
    }
    
    return Math.round(subtotal * vatRate);
}

/**
 * Calculate total including tax with historical rate consideration
 * @param {number} subtotal - The subtotal amount
 * @param {string|Date} orderTimestamp - Optional timestamp for historical rate
 * @returns {number} Total amount including tax
 */
function calculateTotalWithTax(subtotal, orderTimestamp = null) {
    return subtotal + calculateTax(subtotal, orderTimestamp);
}

/**
 * Recalculate order totals using historical VAT rate
 * @param {Object} order - Original order object
 * @returns {Object} Order with recalculated totals using historical rate
 */
function recalculateOrderWithHistoricalVat(order) {
    if (!order.timestamp) {
        console.warn('Order has no timestamp, using current VAT rate');
        return order;
    }
    
    const historicalVatRate = getVatRateForOrder(order.timestamp);
    const subtotal = order.subtotal || 0;
    const vatAmount = Math.round(subtotal * historicalVatRate);
    const beforeDiscount = subtotal + vatAmount;
    
    const discountPercent = order.discountPercent || 0;
    const discountAmount = Math.round(beforeDiscount * (discountPercent / 100));
    const finalTotal = beforeDiscount - discountAmount;
    
    return {
        ...order,
        vatRate: historicalVatRate,
        vatAmount,
        total: finalTotal,
        beforeDiscount,
        vatPercentage: (historicalVatRate * 100).toFixed(1) + '%',
        historicalCalculation: true
    };
}

/**
 * Get VAT percentage as string for display
 * @param {number} vatRate - Optional specific VAT rate, uses current if not provided
 * @returns {string} VAT percentage (e.g., "10.0%")
 */
function getVatPercentageString(vatRate = null) {
    const rate = vatRate !== null ? vatRate : getCurrentVatRate();
    return (rate * 100).toFixed(1) + '%';
}

/**
 * Get VAT label for a specific order based on its timestamp
 * @param {string|Date} orderTimestamp - Order timestamp
 * @param {string} labelType - Type of label ('vi' for Vietnamese, 'en' for English)
 * @returns {string} VAT label with historical rate
 */
function getVatLabelForOrder(orderTimestamp, labelType = 'vi') {
    try {
        const historicalVatRate = getVatRateForOrder(orderTimestamp);
        const vatPercentage = (historicalVatRate * 100).toFixed(1);
        
        if (labelType === 'en') {
            return `VAT (${vatPercentage}%):`;
        } else {
            return `Thuế VAT (${vatPercentage}%):`;
        }
    } catch (error) {
        console.warn('Error getting historical VAT label:', error);
        return labelType === 'en' ? 'VAT:' : 'Thuế VAT:';
    }
}

/**
 * Get current VAT label
 * @param {string} labelType - Type of label ('vi' for Vietnamese, 'en' for English)
 * @returns {string} Current VAT label
 */
function getCurrentVatLabel(labelType = 'vi') {
    const vatPercentage = getVatPercentageString();
    
    if (labelType === 'en') {
        return `VAT (${vatPercentage}):`;
    } else {
        return `Thuế VAT (${vatPercentage}):`;
    }
}

/**
 * Update VAT labels throughout the current page
 */
function updateVatLabels() {
    const vatPercentage = (getCurrentVatRate() * 100).toFixed(1);
    
    // Find and update all VAT labels
    const spans = document.querySelectorAll('span');
    spans.forEach(span => {
        const text = span.textContent;
        if (text.includes('VAT (') && text.includes('%):')) {
            span.textContent = `VAT (${vatPercentage}%):`;
        }
        if (text.includes('Thuế VAT (') && text.includes('%):')) {
            span.textContent = `Thuế VAT (${vatPercentage}%):`;
        }
    });
    
    // Update elements with data attributes
    const vatElements = document.querySelectorAll('[data-vat-label]');
    vatElements.forEach(element => {
        const currentText = element.textContent;
        if (currentText.includes('VAT')) {
            if (currentText.includes('Thuế')) {
                element.textContent = `Thuế VAT (${vatPercentage}%):`;
            } else {
                element.textContent = `VAT (${vatPercentage}%):`;
            }
        }
    });
    
    console.log('VAT labels updated to:', vatPercentage + '%');
}

/**
 * Format currency according to system settings
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
    try {
        const settings = JSON.parse(localStorage.getItem('systemSettings'));
        const currency = settings?.ui?.currency || 'VNĐ';
        const locale = settings?.ui?.locale || 'vi-VN';
        
        if (currency === 'VNĐ') {
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        } else {
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        }
    } catch (error) {
        // Fallback formatting
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
}

/**
 * Migrate old order data to include VAT labels
 * @param {Object} order - Old order object
 * @returns {Object} Order with VAT labels added
 */
function migrateOrderVatLabels(order) {
    // If order already has VAT labels, return as is
    if (order.vatLabelVi && order.vatLabelEn) {
        return order;
    }
    
    // Get historical VAT rate
    const vatRate = order.vatRate || (order.timestamp ? getVatRateForOrder(order.timestamp) : getCurrentVatRate());
    const vatPercentage = (vatRate * 100).toFixed(1);
    
    // Add missing VAT labels
    const migratedOrder = {
        ...order,
        vatRate: vatRate,
        vatLabelVi: `Thuế VAT (${vatPercentage}%):`,
        vatLabelEn: `VAT (${vatPercentage}%):`,
        vatPercentage: `${vatPercentage}%`
    };
    
    console.log('Migrated order VAT labels:', {
        orderId: order.id || 'unknown',
        timestamp: order.timestamp,
        vatRate: vatRate,
        labels: {
            vi: migratedOrder.vatLabelVi,
            en: migratedOrder.vatLabelEn
        }
    });
    
    return migratedOrder;
}

/**
 * Get VAT label from order data (with fallback for old orders)
 * @param {Object} order - Order object
 * @param {string} language - Language ('vi' or 'en')
 * @returns {string} VAT label
 */
function getOrderVatLabel(order, language = 'vi') {
    // Try to get saved label first
    if (language === 'vi' && order.vatLabelVi) {
        return order.vatLabelVi;
    }
    if (language === 'en' && order.vatLabelEn) {
        return order.vatLabelEn;
    }
    
    // Fallback: generate label from historical data
    if (order.timestamp) {
        return getVatLabelForOrder(order.timestamp, language);
    }
    
    // Last resort: use order's VAT rate if available
    if (order.vatRate) {
        const vatPercentage = (order.vatRate * 100).toFixed(1);
        return language === 'vi' 
            ? `Thuế VAT (${vatPercentage}%):` 
            : `VAT (${vatPercentage}%):`;
    }
    
    // Ultimate fallback
    return language === 'vi' ? 'Thuế VAT:' : 'VAT:';
}
function initializeVatManagement() {
    // Update VAT labels on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(updateVatLabels, 100);
        });
    } else {
        setTimeout(updateVatLabels, 100);
    }
    
    // Listen for system settings updates
    window.addEventListener('systemSettingsUpdated', function(event) {
        console.log('System settings updated, refreshing VAT labels');
        updateVatLabels();
        
        // Trigger any page-specific VAT updates
        if (typeof onVatRateChanged === 'function') {
            onVatRateChanged(event.detail);
        }
    });
    
    // Listen for storage changes (if settings updated in another tab)
    window.addEventListener('storage', function(e) {
        if (e.key === 'systemSettings') {
            updateVatLabels();
        }
    });
}

/**
 * Create order object with correct VAT calculation and labels
 * @param {Array} items - Order items
 * @param {Object} options - Additional options (discount, etc.)
 * @returns {Object} Order object with calculated totals and VAT labels
 */
function createOrderWithVat(items, options = {}) {
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const vatRate = getCurrentVatRate();
    const vatAmount = calculateTax(subtotal);
    const beforeDiscount = subtotal + vatAmount;
    
    const discountPercent = options.discount?.percent || 0;
    const discountAmount = Math.round(beforeDiscount * (discountPercent / 100));
    const finalTotal = beforeDiscount - discountAmount;
    
    const timestamp = new Date().toISOString();
    
    return {
        items,
        subtotal,
        vatRate,
        vatAmount,
        discountPercent,
        discountAmount,
        total: finalTotal,
        beforeDiscount,
        vatPercentage: getVatPercentageString(vatRate),
        vatLabelVi: getCurrentVatLabel('vi'),
        vatLabelEn: getCurrentVatLabel('en'),
        timestamp
    };
}

// Make functions globally available
if (typeof window !== 'undefined') {
    window.getCurrentVatRate = getCurrentVatRate;
    window.getVatRateForOrder = getVatRateForOrder;
    window.getVatRateHistory = getVatRateHistory;
    window.recordVatRateChange = recordVatRateChange;
    window.calculateTax = calculateTax;
    window.calculateTotalWithTax = calculateTotalWithTax;
    window.recalculateOrderWithHistoricalVat = recalculateOrderWithHistoricalVat;
    window.getVatPercentageString = getVatPercentageString;
    window.getVatLabelForOrder = getVatLabelForOrder;
    window.getCurrentVatLabel = getCurrentVatLabel;
    window.migrateOrderVatLabels = migrateOrderVatLabels;
    window.getOrderVatLabel = getOrderVatLabel;
    window.updateVatLabels = updateVatLabels;
    window.createOrderWithVat = createOrderWithVat;
    window.initializeVatManagement = initializeVatManagement;
    
    // Event listener for tax rate updates
    document.addEventListener('taxRateUpdated', () => {
        console.log('[VAT Manager] Tax rate updated event received, clearing cache');
        vatRateCache = null;
    });
    
    // Auto-initialize on script load
    initializeVatManagement();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCurrentVatRate,
        getVatRateForOrder,
        getVatRateHistory,
        recordVatRateChange,
        calculateTax,
        calculateTotalWithTax,
        recalculateOrderWithHistoricalVat,
        getVatPercentageString,
        getVatLabelForOrder,
        getCurrentVatLabel,
        migrateOrderVatLabels,
        getOrderVatLabel,
        updateVatLabels,
        createOrderWithVat,
        initializeVatManagement,
        formatCurrency
    };
}
