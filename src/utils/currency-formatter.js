/**
 * Currency formatting utilities for Vietnamese Dong
 */

// Format number to Vietnamese currency
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format number with thousand separators (no currency symbol)
export const formatNumber = (amount) => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  
  return new Intl.NumberFormat('vi-VN').format(amount);
};

// Parse currency string back to number
export const parseCurrency = (currencyString) => {
  if (typeof currencyString !== 'string') {
    return 0;
  }
  
  // Remove currency symbols and spaces, parse as float
  return parseFloat(currencyString.replace(/[^\d.-]/g, '')) || 0;
};

// Calculate VAT amount
export const calculateVAT = (amount, vatRate = 0.08) => {
  return amount * vatRate;
};

// Calculate total with VAT
export const calculateTotalWithVAT = (subtotal, vatRate = 0.08) => {
  return subtotal + calculateVAT(subtotal, vatRate);
};

// Calculate discount amount
export const calculateDiscount = (amount, discountPercent) => {
  return amount * (discountPercent / 100);
};

// Calculate final total (subtotal + VAT - discount)
export const calculateFinalTotal = (subtotal, vatRate = 0.08, discountPercent = 0) => {
  const totalWithVAT = calculateTotalWithVAT(subtotal, vatRate);
  const discount = calculateDiscount(totalWithVAT, discountPercent);
  return totalWithVAT - discount;
};

// Format currency for display in tables/cards
export const formatCurrencyCompact = (amount) => {
  if (amount >= 1000000) {
    return formatNumber(amount / 1000000) + 'M VNĐ';
  } else if (amount >= 1000) {
    return formatNumber(amount / 1000) + 'K VNĐ';
  }
  return formatNumber(amount) + ' VNĐ';
}; 