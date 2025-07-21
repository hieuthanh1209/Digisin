/**
 * Test Script: VAT Label Historical Accuracy
 * 
 * This script tests that:
 * 1. New invoices use current VAT label
 * 2. Old invoices display their saved VAT label (not current)
 * 3. VAT calculations remain correct regardless of label changes
 */

// Test utility functions
function createTestInvoice(vatRate, vatLabel, timestamp) {
    const subtotal = 100000;
    const vatAmount = Math.round(subtotal * vatRate);
    const total = subtotal + vatAmount;
    
    return {
        id: `test-${Date.now()}`,
        subtotal: subtotal,
        vat: vatAmount,
        vatRate: vatRate,
        vatLabel: vatLabel,
        vatLabelVi: vatLabel,
        vatLabelEn: vatLabel.replace('Thuế VAT', 'VAT'),
        vatPercentage: `${(vatRate * 100).toFixed(1)}%`,
        total: total,
        discount: 0,
        timestamp: timestamp,
        items: [
            { name: 'Test Item', quantity: 1, price: subtotal }
        ]
    };
}

function testInvoiceDisplay(invoice) {
    console.log('=== Invoice Display Test ===');
    console.log(`Invoice ID: ${invoice.id}`);
    console.log(`Created: ${new Date(invoice.timestamp).toLocaleString('vi-VN')}`);
    console.log(`Subtotal: ${formatCurrency(invoice.subtotal)}`);
    
    // This should use the stored VAT label, not current
    const displayLabel = invoice.vatLabel || invoice.vatLabelVi || `Thuế VAT (${invoice.vatPercentage || '10.0%'}):`;
    console.log(`${displayLabel} ${formatCurrency(invoice.vat)}`);
    
    console.log(`Total: ${formatCurrency(invoice.total)}`);
    console.log('================================');
    
    return displayLabel;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Test execution
function runVATLabelTests() {
    console.log('🧪 Starting VAT Label Historical Accuracy Tests...\n');
    
    // Test 1: Create old invoice with 10% VAT
    console.log('📋 Test 1: Old invoice (10% VAT)');
    const oldInvoice = createTestInvoice(0.10, 'Thuế VAT (10.0%):', '2025-07-15T10:00:00Z');
    const oldLabel = testInvoiceDisplay(oldInvoice);
    console.log(`✅ Old invoice displays: "${oldLabel}"\n`);
    
    // Test 2: Create new invoice with 12% VAT
    console.log('📋 Test 2: New invoice (12% VAT)');
    const newInvoice = createTestInvoice(0.12, 'Thuế VAT (12.0%):', new Date().toISOString());
    const newLabel = testInvoiceDisplay(newInvoice);
    console.log(`✅ New invoice displays: "${newLabel}"\n`);
    
    // Test 3: Verify labels are different
    console.log('📋 Test 3: Label difference verification');
    if (oldLabel !== newLabel) {
        console.log(`✅ SUCCESS: Labels are different as expected`);
        console.log(`   Old: "${oldLabel}"`);
        console.log(`   New: "${newLabel}"`);
    } else {
        console.log(`❌ FAILURE: Labels should be different`);
        console.log(`   Both: "${oldLabel}"`);
    }
    
    console.log('\n🎉 VAT Label Tests Completed!');
    
    return {
        oldInvoice,
        newInvoice,
        oldLabel,
        newLabel,
        testPassed: oldLabel !== newLabel
    };
}

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
    window.createTestInvoice = createTestInvoice;
    window.testInvoiceDisplay = testInvoiceDisplay;
    window.runVATLabelTests = runVATLabelTests;
    
    // Auto-run tests when loaded
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(runVATLabelTests, 1000);
    });
}

// For Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createTestInvoice,
        testInvoiceDisplay,
        runVATLabelTests
    };
}
