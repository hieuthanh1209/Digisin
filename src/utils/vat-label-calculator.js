/**
 * Calculate VAT percentage from VAT amount and subtotal
 * This is a fallback method to determine the correct VAT rate when vatLabel is missing or incorrect
 * 
 * @param {number} vatAmount - The VAT amount in VND
 * @param {number} subtotal - The subtotal (before VAT) in VND
 * @returns {string} VAT percentage as string (e.g., "10.0%")
 */
function calculateVatPercentageFromAmount(vatAmount, subtotal) {
    try {
        if (!vatAmount || !subtotal || subtotal <= 0) {
            return "0.0%";
        }
        
        // Calculate percentage: (vatAmount / subtotal) * 100
        const percentage = (vatAmount / subtotal) * 100;
        
        // Round to 1 decimal place
        return percentage.toFixed(1) + "%";
    } catch (error) {
        console.error('Error calculating VAT percentage from amount:', error);
        return "0.0%";
    }
}

/**
 * Get the correct VAT label for an invoice/order
 * This function tries multiple methods to get the most accurate VAT label
 * 
 * @param {Object} invoice - Invoice/order object
 * @param {string} language - Language code ('vi' or 'en')
 * @returns {string} Correct VAT label
 */
function getCorrectVatLabel(invoice, language = 'vi') {
    try {
        // Method 1: Use stored VAT label if available and seems correct
        const storedLabel = language === 'en' ? 
            (invoice.vatLabelEn || invoice.vatLabel) : 
            (invoice.vatLabel || invoice.vatLabelVi);
            
        if (storedLabel && typeof storedLabel === 'string') {
            // Extract percentage from stored label to verify it's correct
            const percentageMatch = storedLabel.match(/(\d+\.?\d*)%/);
            if (percentageMatch) {
                const storedPercentage = parseFloat(percentageMatch[1]);
                
                // Calculate actual percentage from amounts
                const actualPercentage = parseFloat(calculateVatPercentageFromAmount(
                    invoice.vat || invoice.tax || 0, 
                    invoice.subtotal || 0
                ).replace('%', ''));
                
                // If stored percentage matches actual percentage (within 0.1% tolerance), use stored label
                if (Math.abs(storedPercentage - actualPercentage) <= 0.1) {
                    console.log(`Using stored VAT label: "${storedLabel}" (verified correct)`);
                    return storedLabel;
                } else {
                    console.warn(`Stored VAT label "${storedLabel}" doesn't match calculated ${actualPercentage}%`);
                }
            }
        }
        
        // Method 2: Use stored VAT rate if available
        if (invoice.vatRate && typeof invoice.vatRate === 'number') {
            const percentage = (invoice.vatRate * 100).toFixed(1);
            const label = language === 'en' ? 
                `VAT (${percentage}%):` : 
                `Thuế VAT (${percentage}%):`;
            console.log(`Using stored VAT rate: ${invoice.vatRate} -> "${label}"`);
            return label;
        }
        
        // Method 3: Calculate from VAT amount and subtotal (fallback)
        const calculatedPercentage = calculateVatPercentageFromAmount(
            invoice.vat || invoice.tax || 0, 
            invoice.subtotal || 0
        );
        
        const fallbackLabel = language === 'en' ? 
            `VAT (${calculatedPercentage}):` : 
            `Thuế VAT (${calculatedPercentage}):`;
            
        console.log(`Calculated VAT label from amounts: "${fallbackLabel}"`);
        return fallbackLabel;
        
    } catch (error) {
        console.error('Error getting correct VAT label:', error);
        
        // Final fallback
        const defaultLabel = language === 'en' ? 'VAT:' : 'Thuế VAT:';
        return defaultLabel;
    }
}

/**
 * Test function to verify VAT label accuracy
 * @param {Object} testInvoice - Test invoice object
 */
function testVatLabelAccuracy(testInvoice) {
    console.log('=== VAT Label Accuracy Test ===');
    console.log('Invoice data:', testInvoice);
    
    const calculatedPercentage = calculateVatPercentageFromAmount(testInvoice.vat, testInvoice.subtotal);
    console.log(`Calculated VAT percentage: ${calculatedPercentage}`);
    
    const correctLabelVi = getCorrectVatLabel(testInvoice, 'vi');
    const correctLabelEn = getCorrectVatLabel(testInvoice, 'en');
    
    console.log(`Correct Vietnamese label: "${correctLabelVi}"`);
    console.log(`Correct English label: "${correctLabelEn}"`);
    
    return {
        calculatedPercentage,
        correctLabelVi,
        correctLabelEn
    };
}

// Make functions available globally
if (typeof window !== 'undefined') {
    window.calculateVatPercentageFromAmount = calculateVatPercentageFromAmount;
    window.getCorrectVatLabel = getCorrectVatLabel;
    window.testVatLabelAccuracy = testVatLabelAccuracy;
}

// For Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateVatPercentageFromAmount,
        getCorrectVatLabel,
        testVatLabelAccuracy
    };
}
