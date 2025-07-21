/**
 * Tax Settings Manager
 * Provides functionality for managing tax rates with historical versioning
 * 
 * Features:
 * - Store and retrieve tax rates with effective dates
 * - Get the correct tax rate for any point in time
 * - Display history of tax rate changes
 */

// Global variable to store tax history
let taxHistoryData = [];

/**
 * Initialize the tax settings manager
 */
function initTaxSettingsManager() {
    loadTaxHistoryFromStorage();
    
    // If no tax history exists, create initial entry
    if (taxHistoryData.length === 0) {
        const initialTaxEntry = {
            rate: 10.0, // Default 10% tax
            date: new Date().toISOString()
        };
        
        taxHistoryData.push(initialTaxEntry);
        saveTaxHistoryToStorage();
    }
}

/**
 * Load tax history from localStorage
 */
function loadTaxHistoryFromStorage() {
    try {
        const storedHistory = localStorage.getItem('taxHistory');
        if (storedHistory) {
            taxHistoryData = JSON.parse(storedHistory);
            // Sort by date in descending order
            taxHistoryData.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else {
            taxHistoryData = [];
        }
    } catch (error) {
        console.error('Error loading tax history from storage:', error);
        taxHistoryData = [];
    }
}

/**
 * Save tax history to localStorage
 */
function saveTaxHistoryToStorage() {
    try {
        localStorage.setItem('taxHistory', JSON.stringify(taxHistoryData));
    } catch (error) {
        console.error('Error saving tax history to storage:', error);
        showToast('Không thể lưu lịch sử thuế suất', 'error');
    }
}

/**
 * Add a new tax rate entry
 * @param {number} rate - Tax rate percentage (e.g. 10.0)
 * @param {Date|string} effectiveDate - Date when this tax rate becomes effective
 * @returns {boolean} Success status
 */
function addTaxRateEntry(rate, effectiveDate) {
    try {
        // Validate input
        const taxRate = parseFloat(rate);
        if (isNaN(taxRate) || taxRate < 0 || taxRate > 100) {
            console.error('Invalid tax rate:', rate);
            return false;
        }
        
        // Convert date to ISO string if it's a Date object
        const dateString = effectiveDate instanceof Date 
            ? effectiveDate.toISOString() 
            : new Date(effectiveDate).toISOString();
        
        // Create new entry
        const newEntry = {
            rate: taxRate,
            date: dateString
        };
        
        // Add to history
        taxHistoryData.push(newEntry);
        
        // Sort by date in descending order
        taxHistoryData.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Save to storage
        saveTaxHistoryToStorage();
        
        // Dispatch event to notify other components that tax rate has been updated
        document.dispatchEvent(new CustomEvent('taxRateUpdated', {
            detail: { 
                rate: taxRate, 
                effectiveDate: dateString,
                source: 'tax-manager'
            }
        }));
        
        return true;
    } catch (error) {
        console.error('Error adding tax rate entry:', error);
        return false;
    }
}

/**
 * Get tax rate applicable for a specific date
 * @param {Date|string} [date=new Date()] - The date for which to get the tax rate
 * @returns {number} The tax rate as a percentage (e.g. 10.0)
 */
function getTaxRateForDate(date = new Date()) {
    try {
        if (taxHistoryData.length === 0) {
            initTaxSettingsManager(); // Initialize with default if empty
        }
        
        const targetDate = date instanceof Date ? date : new Date(date);
        
        // Find first tax rate that is effective on or before the target date
        for (const entry of taxHistoryData) {
            const entryDate = new Date(entry.date);
            if (entryDate <= targetDate) {
                return parseFloat(entry.rate);
            }
        }
        
        // If no applicable entry found, return the oldest tax rate
        return parseFloat(taxHistoryData[taxHistoryData.length - 1].rate);
    } catch (error) {
        console.error('Error getting tax rate for date:', error);
        return 10.0; // Default 10% on error
    }
}

/**
 * Get the current tax rate
 * @returns {number} The current tax rate as a percentage (e.g. 10.0)
 */
function getCurrentTaxRate() {
    return getTaxRateForDate(new Date());
}

/**
 * Get the complete tax history
 * @returns {Array} Array of tax rate entries sorted by date (descending)
 */
function getTaxHistory() {
    // Return a copy to prevent direct modification
    return [...taxHistoryData];
}

/**
 * Apply a tax amount to a given subtotal based on order date
 * @param {number} subtotal - The amount to tax
 * @param {Date|string} [orderDate=new Date()] - The date of the order
 * @returns {number} The tax amount
 */
function calculateTax(subtotal, orderDate = new Date()) {
    try {
        const rate = getTaxRateForDate(orderDate);
        return (subtotal * rate) / 100;
    } catch (error) {
        console.error('Error calculating tax:', error);
        // Default to 10% on error
        return (subtotal * 10) / 100;
    }
}

/**
 * Format a date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatTaxDate(date) {
    try {
        const d = new Date(date);
        return d.toLocaleDateString('vi-VN', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
}

        // Initialize tax settings when script loads
document.addEventListener('DOMContentLoaded', function() {
    initTaxSettingsManager();
    
    // Add event listeners to save buttons
    const saveButtons = document.querySelectorAll('#saveTaxSettingsBtn, #saveVatRateBtn');
    saveButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Button clicked from tax-manager.js DOMContentLoaded event');
            if (typeof window.saveTaxSettings === 'function') {
                window.saveTaxSettings();
            } else {
                console.error('saveTaxSettings function not found in global scope');
            }
            return false;
        });
    });
});// Make functions globally available
window.taxManager = {
    addTaxRateEntry,
    getCurrentTaxRate,
    getTaxRateForDate,
    getTaxHistory,
    calculateTax,
    formatTaxDate
};
