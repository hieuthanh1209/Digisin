// Mock data matching React component
let pendingPaymentOrders = [
    {
        id: 'HD001',
        table: 'Bàn 5',
        orderTime: new Date(Date.now() - 20 * 60000), // 20 minutes ago
        items: [
            { name: 'Phở bò tái', quantity: 2, price: 60000 },
            { name: 'Cơm rang thập cẩm', quantity: 1, price: 35000 },
            { name: 'Trà đá', quantity: 2, price: 5000 }
        ],
        status: 'ready',
        total: 165000
    },
    {
        id: 'HD002',
        table: 'Bàn 3',
        orderTime: new Date(Date.now() - 35 * 60000), // 35 minutes ago
        items: [
            { name: 'Bún chả Hà Nội', quantity: 2, price: 45000 },
            { name: 'Bánh mì thịt nướng', quantity: 1, price: 25000 },
            { name: 'Nước chanh', quantity: 1, price: 8000 }
        ],
        status: 'ready',
        total: 123000
    },
    {
        id: 'HD003',
        table: 'Bàn 7',
        orderTime: new Date(Date.now() - 15 * 60000), // 15 minutes ago
        items: [
            { name: 'Mì siêu cay pro max', quantity: 1, price: 55000 },
            { name: 'Coca Cola', quantity: 1, price: 12000 }
        ],
        status: 'ready',
        total: 67000
    }
];

let completedOrders = [
    {
        id: 'HD004',
        table: 'Bàn 2',
        orderTime: new Date(Date.now() - 90 * 60000), // 1.5 hours ago
        paymentTime: new Date(Date.now() - 85 * 60000),
        items: [
            { name: 'Phở gà', quantity: 1, price: 50000 },
            { name: 'Chả cá', quantity: 1, price: 45000 }
        ],
        status: 'completed',
        total: 95000,
        paymentMethod: 'Tiền mặt',
        discount: 0,
        discountCode: null
    },
    {
        id: 'HD005',
        table: 'Bàn 8',
        orderTime: new Date(Date.now() - 120 * 60000), // 2 hours ago
        paymentTime: new Date(Date.now() - 115 * 60000),
        items: [
            { name: 'Cơm tấm', quantity: 2, price: 40000 },
            { name: 'Nước ngọt', quantity: 2, price: 10000 }
        ],
        status: 'completed',
        total: 100000,
        paymentMethod: 'Thẻ',
        discount: 10,
        discountCode: 'KHACHHANG10'
    }
];

// Discount codes data
const discountCodes = [
    {
        code: 'WELCOME15',
        title: 'Chào mừng khách mới',
        description: 'Giảm giá cho khách hàng lần đầu',
        discount: 15,
        minOrder: 100000,
        conditions: 'Áp dụng cho đơn hàng từ 100.000₫'
    },
    {
        code: 'HAPPY10',
        title: 'Giảm giá vui vẻ',
        description: 'Khuyến mãi cuối tuần',
        discount: 10,
        minOrder: 50000,
        conditions: 'Áp dụng cho đơn hàng từ 50.000₫'
    },
    {
        code: 'VIP20',
        title: 'Khách hàng VIP',
        description: 'Ưu đãi đặc biệt cho khách VIP',
        discount: 20,
        minOrder: 200000,
        conditions: 'Áp dụng cho đơn hàng từ 200.000₫'
    },
    {
        code: 'STUDENT5',
        title: 'Sinh viên',
        description: 'Giảm giá cho sinh viên',
        discount: 5,
        minOrder: 30000,
        conditions: 'Áp dụng cho đơn hàng từ 30.000₫'
    },
    {
        code: 'LUNCH20',
        title: 'Combo trưa',
        description: 'Ưu đãi giờ ăn trưa',
        discount: 20,
        minOrder: 80000,
        conditions: 'Áp dụng 11:00-14:00, đơn từ 80.000₫'
    }
];

let currentOrder = null;
let selectedDiscountCode = null;
const VAT_RATE = 0.08; // 8% VAT

// PayOS Configuration
let payOSInstance = null;
let payOSConfig = null;

// PayOS Demo Configuration (replace with real values)
const PAYOS_SETTINGS = {
    CLIENT_ID: '763142a9-9de4-49fd-90e0-7a69efb063e0', // Replace with your PayOS Client ID
    API_KEY: '3b19b80b-d3d8-4632-b9a8-48a45fbe9085',     // Replace with your PayOS API Key
    CHECKSUM_KEY: 'a7e6a0d36be0b35e9977fd5486896b50d2457d71b2f5fb8968a52a6fa4ea5527', // Replace with your Checksum Key
    RETURN_URL: window.location.origin + '/dashboard/cashier-dashboard.html',
    CANCEL_URL: window.location.origin + '/dashboard/cashier-dashboard.html'
};

// PayOS Size Configuration
const PayOSSizeConfig = {
    small: {
        minHeight: '350px',
        height: '50vh',
        maxHeight: '400px',
        modalWidth: '1000px'
    },
    medium: {
        minHeight: '500px',
        height: '65vh',
        maxHeight: '600px',
        modalWidth: '1200px'
    },
    large: {
        minHeight: '650px',
        height: '75vh',
        maxHeight: '800px',
        modalWidth: '1400px'
    },
    xl: {
        minHeight: '800px',
        height: '85vh',
        maxHeight: '1000px',
        modalWidth: '1600px'
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    updateStats();
    renderPendingOrders();
    renderRecentPayments();
    
    // Payment form event listeners
    setupPaymentForm();
    
    // Discount search event listener
    setupDiscountSearch();
    
    // Order search event listener
    setupOrderSearch();
    
    // Setup PayOS event listeners
    setupPayOSListeners();
    
    // Initialize PayOS iframe expansion
    initPayOSIframeExpansion();
    
    // Load PayOS size preference
    loadPayOSSize();
    
    // Setup resize listener
    window.addEventListener('resize', setResponsiveSize);
});

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
}

function getTimeAgo(orderTime) {
    const now = new Date();
    const diffInMinutes = Math.floor((now - orderTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours} giờ trước`;
}

function updateStats() {
    const searchInput = document.getElementById('orderSearch');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    // Filter pending orders based on search term
    const filteredPendingOrders = pendingPaymentOrders.filter(order => {
        if (!searchTerm) return true;
        return order.id.toLowerCase().includes(searchTerm) ||
               order.table.toLowerCase().includes(searchTerm) ||
               order.items.some(item => item.name.toLowerCase().includes(searchTerm));
    });
    
    const pendingCount = searchTerm ? filteredPendingOrders.length : pendingPaymentOrders.length;
    const completedToday = completedOrders.length;
    const totalRevenue = completedOrders.reduce((sum, order) => {
        const discountAmount = (order.total * order.discount) / 100;
        return sum + (order.total - discountAmount);
    }, 0);

    document.getElementById('pendingPayments').textContent = pendingCount;
    document.getElementById('completedPayments').textContent = completedToday;
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('pendingBadge').textContent = `${pendingCount} đơn`;
}

function renderPendingOrders() {
    const container = document.getElementById('pendingOrders');
    const searchInput = document.getElementById('orderSearch');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    // Filter orders based on search term
    const filteredOrders = pendingPaymentOrders.filter(order => {
        if (!searchTerm) return true;
        return order.id.toLowerCase().includes(searchTerm) ||
               order.table.toLowerCase().includes(searchTerm) ||
               order.items.some(item => item.name.toLowerCase().includes(searchTerm));
    });
    
    if (filteredOrders.length === 0) {
        if (searchTerm) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i data-lucide="search-x" style="width: 80px; height: 80px;"></i>
                    </div>
                    <h3 class="empty-title">Không tìm thấy đơn hàng</h3>
                    <p class="empty-description">Không có đơn hàng nào phù hợp với từ khóa "${searchTerm}"</p>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i data-lucide="credit-card" style="width: 80px; height: 80px;"></i>
                    </div>
                    <h3 class="empty-title">Không có đơn hàng chờ thanh toán</h3>
                    <p class="empty-description">Các đơn hàng sẵn sàng thanh toán sẽ xuất hiện ở đây</p>
                </div>
            `;
        }
        return;
    }

    // Create rows with 2 orders each
    let ordersHtml = '<div class="row g-3">';
    filteredOrders.forEach((order, index) => {
        if (index > 0 && index % 2 === 0) {
            ordersHtml += '</div><div class="row g-3 mt-3">';
        }
        
        ordersHtml += `
            <div class="col-lg-6 col-md-6">
                <div class="payment-order h-100">
                    <div class="payment-header ${order.status}">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="mb-1 fw-bold">${order.id}</h5>
                                <small class="payment-time">
                                    <i data-lucide="clock" style="width: 14px; height: 14px;"></i>
                                    <span class="ms-1">${getTimeAgo(order.orderTime)}</span>
                                </small>
                            </div>
                            <div class="d-flex align-items-center gap-3">
                                <span class="badge bg-dark fs-6">${order.table}</span>
                                <span class="badge bg-success fs-6">Sẵn sàng</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="payment-content">
                        <div class="payment-items mb-3">
                            ${order.items.map(item => `
                                <div class="payment-item">
                                    <div class="d-flex align-items-center">
                                        <span class="item-quantity">${item.quantity}</span>
                                        <span>${item.name}</span>
                                    </div>
                                    <span class="fw-medium">${formatCurrency(item.quantity * item.price)}</span>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="payment-total">
                            <span>Tổng cộng:</span>
                            <span class="total-amount">${formatCurrency(order.total)}</span>
                        </div>
                        
                        <div class="d-flex justify-content-between gap-2 mt-3">
                            <button class="btn btn-outline-secondary flex-fill" onclick="printPendingInvoice('${order.id}')">
                                <i data-lucide="printer" style="width: 16px; height: 16px;"></i>
                                In hóa đơn
                            </button>
                            <button class="btn btn-enhanced btn-success flex-fill" onclick="openPaymentModal('${order.id}')">
                                <i data-lucide="credit-card" style="width: 16px; height: 16px;"></i>
                                Thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    ordersHtml += '</div>';

    container.innerHTML = ordersHtml;

    // Re-initialize Lucide icons
    lucide.createIcons();
}

function renderRecentPayments() {
    const container = document.getElementById('recentPayments');
    
    if (completedOrders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i data-lucide="check-circle-2" style="width: 80px; height: 80px;"></i>
                </div>
                <h3 class="empty-title">Chưa có thanh toán nào</h3>
                <p class="empty-description">Lịch sử thanh toán sẽ xuất hiện ở đây</p>
            </div>
        `;
        return;
    }

    container.innerHTML = completedOrders.map(order => {
        const discountAmount = (order.total * order.discount) / 100;
        const finalAmount = order.total - discountAmount;
        const hasQRCode = order.qrCodeData && order.qrCodeData.dataUrl;
        const isPayOSPayment = order.paymentMethod && order.paymentMethod.includes('PayOS');
        
        return `
            <div class="recent-payment">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div>
                        <h6 class="mb-1 fw-bold">${order.id}</h6>
                        <small class="text-muted">${order.table} - ${getTimeAgo(order.paymentTime)}</small>
                        ${isPayOSPayment && order.payosOrderCode ? `
                            <small class="d-block text-info">
                                <i data-lucide="smartphone" style="width: 12px; height: 12px;"></i>
                                PayOS: ${order.payosOrderCode}
                            </small>
                        ` : ''}
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="payment-status completed">Hoàn thành</span>
                        <span class="fw-bold text-success">${formatCurrency(finalAmount)}</span>
                    </div>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="text-muted small">
                        <span>Phương thức: ${order.paymentMethod}</span>
                        ${order.discount > 0 ? `<span class="ms-3">Giảm giá: ${order.discount}%</span>` : ''}
                    </div>
                    <div class="d-flex gap-1">
                        ${hasQRCode ? `
                            <button class="btn btn-outline-info btn-sm" onclick="showQRCodePreview('${order.id}')" title="Xem QR Code">
                                <i data-lucide="qr-code" style="width: 14px; height: 14px;"></i>
                            </button>
                        ` : ''}
                        <button class="btn btn-outline-primary btn-sm" onclick="printCompletedOrder('${order.id}')">
                            <i data-lucide="printer" style="width: 14px; height: 14px;"></i>
                            In hóa đơn
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Re-initialize Lucide icons
    lucide.createIcons();
}

function setupDiscountSearch() {
    const searchInput = document.getElementById('discountSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            renderDiscountCodes();
        });
    }
}

function setupOrderSearch() {
    const orderSearchInput = document.getElementById('orderSearch');
    const clearOrderSearchBtn = document.getElementById('clearOrderSearch');
    
    if (orderSearchInput) {
        orderSearchInput.addEventListener('input', function() {
            renderPendingOrders();
            updateStats();
        });
    }
    
    if (clearOrderSearchBtn) {
        clearOrderSearchBtn.addEventListener('click', function() {
            orderSearchInput.value = '';
            renderPendingOrders();
            updateStats();
            orderSearchInput.focus();
        });
    }
}

function openPaymentModal(orderId) {
    currentOrder = pendingPaymentOrders.find(order => order.id === orderId);
    if (!currentOrder) return;

    // Reset selected discount code
    selectedDiscountCode = null;

    // Populate payment details
    const paymentDetails = document.getElementById('paymentDetails');
    paymentDetails.innerHTML = `
        <div class="order-summary p-3 bg-light rounded">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold mb-0">Đơn hàng ${currentOrder.id}</h6>
                <span class="badge bg-primary">${currentOrder.table}</span>
            </div>
            <div class="items-list">
                ${currentOrder.items.map(item => `
                    <div class="d-flex justify-content-between mb-1">
                        <span>${item.quantity}x ${item.name}</span>
                        <span>${formatCurrency(item.quantity * item.price)}</span>
                    </div>
                `).join('')}
            </div>
            <hr>
            <div class="d-flex justify-content-between fw-bold">
                <span>Tổng cộng:</span>
                <span>${formatCurrency(currentOrder.total)}</span>
            </div>
        </div>
    `;

    // Render discount codes
    renderDiscountCodes();

    // Reset form
    document.getElementById('paymentMethod').value = 'cash';
    document.getElementById('customerPaid').value = '';
    document.getElementById('discountSearch').value = '';
    
    // Update payment summary
    updatePaymentSummary();
    updateCashAmountVisibility();
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('paymentModal'));
    modal.show();
    
    // Re-initialize Lucide icons
    lucide.createIcons();
}

function renderDiscountCodes() {
    const container = document.getElementById('discountCodes');
    const searchInput = document.getElementById('discountSearch');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    // Filter discount codes based on search term
    const filteredCodes = discountCodes.filter(code => {
        if (!searchTerm) return true;
        return code.title.toLowerCase().includes(searchTerm) ||
               code.description.toLowerCase().includes(searchTerm) ||
               code.code.toLowerCase().includes(searchTerm);
    });
    
    if (filteredCodes.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted py-4">
                <i data-lucide="search-x" style="width: 32px; height: 32px;"></i>
                <p class="mt-2 mb-0">Không tìm thấy mã giảm giá</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }
    
    container.innerHTML = filteredCodes.map(code => {
        const isEligible = currentOrder.total >= code.minOrder;
        const isSelected = selectedDiscountCode && selectedDiscountCode.code === code.code;
        
        return `
            <div class="discount-code-card ${isSelected ? 'selected' : ''} ${!isEligible ? 'disabled' : ''}" 
                 onclick="${isEligible ? `selectDiscountCode('${code.code}')` : ''}">
                <div class="discount-title">${code.title}</div>
                <div class="discount-description">${code.description}</div>
                <div class="discount-value">-${code.discount}%</div>
                <div class="discount-conditions">${code.conditions}</div>
                ${!isEligible ? '<div class="text-danger small mt-1">Không đủ điều kiện</div>' : ''}
            </div>
        `;
    }).join('');
}

function selectDiscountCode(codeId) {
    const code = discountCodes.find(c => c.code === codeId);
    if (!code || currentOrder.total < code.minOrder) return;
    
    selectedDiscountCode = selectedDiscountCode && selectedDiscountCode.code === codeId ? null : code;
    
    renderDiscountCodes();
    updatePaymentSummary();
}

function setupPaymentForm() {
    const customerPaidInput = document.getElementById('customerPaid');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const processButton = document.getElementById('processPayment');
    const processPayOSButton = document.getElementById('processPayOS');

    // Update summary when inputs change
    customerPaidInput.addEventListener('input', updatePaymentSummary);
    
    // Handle payment method change
    paymentMethodSelect.addEventListener('change', function() {
        updateCashAmountVisibility();
        updatePaymentSummary();
        updatePaymentButtons();
    });

    // Process payment
    processButton.addEventListener('click', processPayment);
    processPayOSButton.addEventListener('click', processPayOSPayment);
}

function setupPayOSListeners() {
    // Additional PayOS-specific event listeners can be added here
    console.log('PayOS listeners setup complete');
}

function updateCashAmountVisibility() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const cashAmountSection = document.getElementById('cashAmountSection');
    const payosContainer = document.getElementById('payosContainer');
    
    if (paymentMethod === 'cash') {
        cashAmountSection.classList.remove('hidden');
        cashAmountSection.style.display = 'block';
        payosContainer.style.display = 'none';
    } else {
        cashAmountSection.classList.add('hidden');
        cashAmountSection.style.display = 'none';
        
        // Show PayOS container for online payments
        if (paymentMethod.startsWith('payos_')) {
            payosContainer.style.display = 'block';
        } else {
            payosContainer.style.display = 'none';
        }
        
        document.getElementById('customerPaid').value = '';
    }
}

function updatePaymentButtons() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const cashButton = document.getElementById('processPayment');
    const payosButton = document.getElementById('processPayOS');
    
    if (paymentMethod === 'cash') {
        cashButton.style.display = 'inline-block';
        payosButton.style.display = 'none';
    } else if (paymentMethod.startsWith('payos_')) {
        cashButton.style.display = 'none';
        payosButton.style.display = 'inline-block';
    } else {
        cashButton.style.display = 'inline-block';
        payosButton.style.display = 'none';
    }
}

function updatePaymentSummary() {
    if (!currentOrder) return;

    const customerPaid = parseFloat(document.getElementById('customerPaid').value) || 0;
    const paymentMethod = document.getElementById('paymentMethod').value;

    const subtotal = currentOrder.total;
    const taxAmount = subtotal * VAT_RATE;
    const afterTax = subtotal + taxAmount;
    
    const discountPercent = selectedDiscountCode ? selectedDiscountCode.discount : 0;
    const discountAmount = afterTax * (discountPercent / 100);
    const finalTotal = afterTax - discountAmount;
    
    const change = paymentMethod === 'cash' ? Math.max(0, customerPaid - finalTotal) : 0;

    // Update display
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('taxAmount').textContent = `+${formatCurrency(taxAmount)}`;
    document.getElementById('discountLabel').textContent = `${discountPercent}%`;
    document.getElementById('discountAmount').textContent = `-${formatCurrency(discountAmount)}`;
    document.getElementById('finalTotal').textContent = formatCurrency(finalTotal);
    document.getElementById('changeAmount').textContent = formatCurrency(change);

    // Show/hide discount line
    const discountLine = document.getElementById('discountLine');
    if (selectedDiscountCode) {
        discountLine.style.display = 'flex';
    } else {
        discountLine.style.display = 'none';
    }

    // Show/hide change line
    const changeLine = document.getElementById('changeLine');
    if (paymentMethod === 'cash') {
        changeLine.style.display = 'flex';
    } else {
        changeLine.style.display = 'none';
    }

    // Enable/disable process button
    const processButton = document.getElementById('processPayment');
    
    if (paymentMethod === 'cash') {
        processButton.disabled = customerPaid < finalTotal;
    } else {
        processButton.disabled = false;
    }
}

function processPayment() {
    if (!currentOrder) return;

    const paymentMethod = document.getElementById('paymentMethod').value;
    const customerPaid = parseFloat(document.getElementById('customerPaid').value) || 0;
    
    const subtotal = currentOrder.total;
    const taxAmount = subtotal * VAT_RATE;
    const afterTax = subtotal + taxAmount;
    const discountPercent = selectedDiscountCode ? selectedDiscountCode.discount : 0;
    const discountAmount = afterTax * (discountPercent / 100);
    const finalTotal = afterTax - discountAmount;
    
    // Validate cash payment
    if (paymentMethod === 'cash' && customerPaid < finalTotal) {
        alert('Số tiền khách đưa không đủ!');
        return;
    }

    // Create completed order
    const completedOrder = {
        ...currentOrder,
        status: 'completed',
        paymentTime: new Date(),
        paymentMethod: getPaymentMethodText(paymentMethod),
        discount: discountPercent,
        discountCode: selectedDiscountCode ? selectedDiscountCode.code : null,
        customerPaid: customerPaid,
        change: paymentMethod === 'cash' ? Math.max(0, customerPaid - finalTotal) : 0,
        taxAmount: taxAmount,
        finalTotal: finalTotal,
        qrCodeData: null // Will be generated for cash payments too
    };

    // Generate QR code for all payments (order summary for cash, payment QR for others)
    if (paymentMethod === 'cash') {
        // Generate order summary QR code for cash payments
        generateOrderSummaryQRCode(completedOrder).then(qrCode => {
            if (qrCode) {
                completedOrder.qrCodeData = qrCode;
                // Update the stored completed order
                const orderIndex = completedOrders.findIndex(o => o.id === completedOrder.id);
                if (orderIndex >= 0) {
                    completedOrders[orderIndex].qrCodeData = qrCode;
                }
            }
        });
    }

    // Move to completed orders
    completedOrders.unshift(completedOrder);
    
    // Remove from pending orders
    const index = pendingPaymentOrders.findIndex(order => order.id === currentOrder.id);
    if (index > -1) {
        pendingPaymentOrders.splice(index, 1);
    }

    // Update UI
    updateStats();
    renderPendingOrders();
    renderRecentPayments();

    // Close payment modal
    const paymentModal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
    paymentModal.hide();

    // Show success modal
    document.getElementById('successMessage').textContent = 
        `Đơn hàng ${currentOrder.id} đã được thanh toán thành công. Tổng tiền: ${formatCurrency(finalTotal)}`;
    
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();

    // Store completed order for printing
    window.lastCompletedOrder = completedOrder;

    // Reset current order and discount
    currentOrder = null;
    selectedDiscountCode = null;
    
    // Re-initialize Lucide icons
    setTimeout(() => {
        lucide.createIcons();
    }, 100);
}

function getPaymentMethodText(method) {
    const methods = {
        cash: 'Tiền mặt',
        payos_card: 'Thẻ (PayOS)',
        payos_qr: 'QR Code (PayOS)', 
        payos_banking: 'Chuyển khoản (PayOS)',
        card: 'Thẻ',
        transfer: 'Chuyển khoản'
    };
    return methods[method] || 'Không xác định';
}

function printInvoice(isCompleted = false) {
    const orderToPrint = isCompleted ? window.lastCompletedOrder : currentOrder;
    if (!orderToPrint) return;

    const subtotal = orderToPrint.total;
    const taxAmount = isCompleted ? orderToPrint.taxAmount : (subtotal * VAT_RATE);
    const afterTax = subtotal + taxAmount;
    
    let discountPercent = 0;
    let discountCode = '';
    let discountAmount = 0;
    let finalTotal = afterTax;
    
    if (isCompleted) {
        discountPercent = orderToPrint.discount || 0;
        discountCode = orderToPrint.discountCode || '';
        discountAmount = (afterTax * discountPercent) / 100;
        finalTotal = orderToPrint.finalTotal;
    } else if (selectedDiscountCode) {
        discountPercent = selectedDiscountCode.discount;
        discountCode = selectedDiscountCode.code;
        discountAmount = (afterTax * discountPercent) / 100;
        finalTotal = afterTax - discountAmount;
    }

    // Check if this is a PayOS payment with QR code
    const hasQRCode = isCompleted && orderToPrint.qrCodeData && orderToPrint.qrCodeData.dataUrl;
    const isPayOSPayment = isCompleted && orderToPrint.paymentMethod && orderToPrint.paymentMethod.includes('PayOS');

    const invoiceHtml = `
        <div style="max-width: 400px; margin: 0 auto; font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.4;">
            <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px;">
                <h2 style="margin: 0; font-size: 18px; font-weight: bold;">NHÀ HÀNG ABC</h2>
                <p style="margin: 5px 0 0 0; font-size: 12px;">123 Đường XYZ, Quận 1, TP.HCM</p>
                <p style="margin: 2px 0 0 0; font-size: 12px;">Tel: 028.1234.5678</p>
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>Hóa đơn:</strong></span>
                    <span>${orderToPrint.id}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>Bàn:</strong></span>
                    <span>${orderToPrint.table}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>Ngày:</strong></span>
                    <span>${new Date().toLocaleDateString('vi-VN')}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>Giờ:</strong></span>
                    <span>${new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}</span>
                </div>
                ${isCompleted ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span><strong>Thu ngân:</strong></span>
                        <span>Thu ngân</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span><strong>Phương thức:</strong></span>
                        <span>${orderToPrint.paymentMethod}</span>
                    </div>
                    ${isPayOSPayment && orderToPrint.payosOrderCode ? `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span><strong>Mã giao dịch:</strong></span>
                            <span>${orderToPrint.payosOrderCode}</span>
                        </div>
                    ` : ''}
                ` : ''}
            </div>
            
            <div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 10px 0; margin-bottom: 15px;">
                ${orderToPrint.items.map(item => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                        <span>${item.quantity}x ${item.name}</span>
                        <span>${formatCurrency(item.quantity * item.price)}</span>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                    <span>Tổng tiền hàng:</span>
                    <span>${formatCurrency(subtotal)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                    <span>Thuế VAT (8%):</span>
                    <span>${formatCurrency(taxAmount)}</span>
                </div>
                ${discountPercent > 0 ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                        <span>Giảm giá (${discountCode}):</span>
                        <span>-${formatCurrency(discountAmount)}</span>
                    </div>
                ` : ''}
            </div>
            
            <div style="border-top: 2px solid #000; padding-top: 10px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold;">
                    <span>THÀNH TIỀN:</span>
                    <span>${formatCurrency(finalTotal)}</span>
                </div>
                ${isCompleted && orderToPrint.paymentMethod === 'Tiền mặt' ? `
                    <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                        <span>Tiền khách đưa:</span>
                        <span>${formatCurrency(orderToPrint.customerPaid)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Tiền thối:</span>
                        <span>${formatCurrency(orderToPrint.change)}</span>
                    </div>
                ` : ''}
            </div>
            
            ${hasQRCode ? `
                <div style="text-align: center; border-top: 1px dashed #000; padding-top: 15px; margin-bottom: 15px;">
                    <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold;">
                        ${orderToPrint.qrCodeData.isVietQR ? 'MÃ QR CHUYỂN KHOẢN' : 'MÃ QR THANH TOÁN'}
                    </p>
                    <img src="${orderToPrint.qrCodeData.dataUrl}" style="width: 120px; height: 120px; margin: 10px auto; display: block;" alt="QR Code thanh toán">
                    <p style="margin: 10px 0 5px 0; font-size: 10px; color: #666;">
                        ${orderToPrint.qrCodeData.isVietQR ? 
                            'Quét mã QR để chuyển khoản thanh toán' : 
                            'Quét mã QR để xem chi tiết giao dịch'
                        }
                    </p>
                    ${orderToPrint.payosOrderCode ? `
                        <p style="margin: 0; font-size: 10px; color: #666;">Mã GD: ${orderToPrint.payosOrderCode}</p>
                    ` : ''}
                    ${orderToPrint.qrCodeData.isVietQR && orderToPrint.qrCodeData.accountNumber ? `
                        <p style="margin: 5px 0 0 0; font-size: 9px; color: #888;">
                            STK: ${orderToPrint.qrCodeData.accountNumber}
                        </p>
                    ` : ''}
                </div>
            ` : ''}
            
            <div style="text-align: center; font-size: 12px; border-top: 1px dashed #000; padding-top: 10px;">
                ${isCompleted ? `
                    <p style="margin: 0 0 5px 0;"><strong>CẢM ƠN QUÝ KHÁCH!</strong></p>
                    <p style="margin: 0;">Hẹn gặp lại!</p>
                    ${isPayOSPayment ? `
                        <p style="margin: 5px 0 0 0; font-size: 10px; color: #666;">
                            Thanh toán điện tử an toàn với PayOS
                        </p>
                    ` : ''}
                ` : `
                    <p style="margin: 0 0 5px 0; color: #ff6b35;"><strong>HÓA ĐƠN TẠM</strong></p>
                    <p style="margin: 0; color: #666;">CHƯA THANH TOÁN</p>
                    <p style="margin: 5px 0 0 0; font-size: 10px; color: #666;">
                        Vui lòng thanh toán để hoàn tất đơn hàng
                    </p>
                `}
            </div>
        </div>
    `;

    // Open invoice in new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Hóa đơn ${orderToPrint.id}${isCompleted ? '' : ' (Tạm)'}</title>
            <style>
                @page { 
                    size: A5; 
                    margin: 10mm; 
                }
                body { 
                    margin: 0; 
                    padding: 0; 
                    font-family: 'Courier New', monospace; 
                }
                @media print {
                    body { 
                        print-color-adjust: exact; 
                        -webkit-print-color-adjust: exact; 
                    }
                    img {
                        max-width: 100% !important;
                        height: auto !important;
                    }
                }
            </style>
        </head>
        <body>
            ${invoiceHtml}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
}

// New function to print invoices for pending orders
function printPendingInvoice(orderId) {
    console.log('🖨️ Starting printPendingInvoice for order:', orderId);
    
    const order = pendingPaymentOrders.find(o => o.id === orderId);
    if (!order) {
        console.error('❌ Order not found:', orderId);
        alert('Không tìm thấy đơn hàng: ' + orderId);
        return;
    }
    
    console.log('📋 Found order:', order);
    
    // Calculate final total for PayOS QR
    const subtotal = order.total;
    const taxAmount = subtotal * VAT_RATE;
    const finalTotal = Math.round(subtotal + taxAmount);
    
    // Generate PayOS QR URL for payment
    const payosQRUrl = getPayOSQRUrl(order.id, order.table, finalTotal);
    console.log('💳 PayOS QR URL generated:', payosQRUrl);
    
    // Add PayOS QR data to order for printing
    order.paymentQRData = {
        dataUrl: payosQRUrl,
        isVietQR: true,
        isPaymentQR: true,
        amount: finalTotal,
        qrType: 'PAYOS_PAYMENT'
    };
    
    console.log('✅ PayOS QR data added to order');
    
    // Print the pending invoice with PayOS QR
    console.log('🖨️ Calling printPendingInvoiceWithPayOSQR');
    printPendingInvoiceWithPayOSQR(order);
}

// Function to print pending invoice with optional QR code
function printPendingInvoiceWithQR(order) {
    console.log('🖨️ printPendingInvoiceWithQR called with order:', order.id);
    
    const subtotal = order.total;
    const taxAmount = subtotal * VAT_RATE;
    const afterTax = subtotal + taxAmount;
    
    // For pending invoices, we don't apply discounts yet
    const finalTotal = afterTax;
    
    // Check if QR code is available
    const hasQRCode = order.qrCodeData && order.qrCodeData.dataUrl;
    console.log('🔗 Has QR Code:', hasQRCode, order.qrCodeData);

    const invoiceHtml = `
        <div style="max-width: 400px; margin: 0 auto; font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.4;">
            <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px;">
                <h2 style="margin: 0; font-size: 18px; font-weight: bold;">NHÀ HÀNG ABC</h2>
                <p style="margin: 5px 0 0 0; font-size: 12px;">123 Đường XYZ, Quận 1, TP.HCM</p>
                <p style="margin: 2px 0 0 0; font-size: 12px;">Tel: 028.1234.5678</p>
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>Hóa đơn:</strong></span>
                    <span>${order.id}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>Bàn:</strong></span>
                    <span>${order.table}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>Ngày:</strong></span>
                    <span>${new Date().toLocaleDateString('vi-VN')}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>Giờ:</strong></span>
                    <span>${new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>Trạng thái:</strong></span>
                    <span style="color: #ff6b35;">CHƯA THANH TOÁN</span>
                </div>
            </div>
            
            <div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 10px 0; margin-bottom: 15px;">
                ${order.items.map(item => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                        <span>${item.quantity}x ${item.name}</span>
                        <span>${formatCurrency(item.quantity * item.price)}</span>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                    <span>Tổng tiền hàng:</span>
                    <span>${formatCurrency(subtotal)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                    <span>Thuế VAT (8%):</span>
                    <span>${formatCurrency(taxAmount)}</span>
                </div>
            </div>
            
            <div style="border-top: 2px solid #000; padding-top: 10px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold;">
                    <span>THÀNH TIỀN:</span>
                    <span>${formatCurrency(finalTotal)}</span>
                </div>
                <div style="margin-top: 10px; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #666;">
                        * Chưa bao gồm giảm giá (nếu có)
                    </p>
                </div>
            </div>
            
            ${hasQRCode ? `
                <div style="text-align: center; border-top: 1px dashed #000; padding-top: 15px; margin-bottom: 15px;">
                    <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold;">MÃ QR ĐỌC THÔNG TIN</p>
                    <img src="${order.qrCodeData.dataUrl}" style="width: 120px; height: 120px; margin: 10px auto; display: block;" 
                         alt="QR Code thông tin đơn hàng"
                         onload="console.log('✅ QR Image loaded in print preview')"
                         onerror="console.error('❌ QR Image failed to load in print preview')">
                    <p style="margin: 10px 0 5px 0; font-size: 10px; color: #666;">Quét mã QR để xem chi tiết đơn hàng</p>
                </div>
            ` : `
                <div style="text-align: center; border-top: 1px dashed #000; padding-top: 15px; margin-bottom: 15px;">
                    <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; color: #999;">MÃ QR KHÔNG KHẢ DỤNG</p>
                    <div style="width: 120px; height: 120px; margin: 10px auto; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; background: #f8f9fa;">
                        <span style="color: #999; font-size: 10px;">Không có QR</span>
                    </div>
                    <p style="margin: 10px 0 5px 0; font-size: 10px; color: #999;">QR Code không thể tạo</p>
                </div>
            `}
            
            <div style="text-align: center; font-size: 12px; border-top: 1px dashed #000; padding-top: 10px;">
                <p style="margin: 0 0 5px 0; color: #ff6b35;"><strong>HÓA ĐƠN TẠM</strong></p>
                <p style="margin: 0; color: #666;">Vui lòng thanh toán để hoàn tất đơn hàng</p>
                <p style="margin: 10px 0 0 0; font-size: 10px; color: #999;">
                    Hóa đơn này chỉ mang tính chất tham khảo
                </p>
            </div>
        </div>
    `;

    console.log('📄 Invoice HTML generated, has QR:', hasQRCode);

    // Open invoice in new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Hóa đơn tạm ${order.id}</title>
            <style>
                @page { 
                    size: A5; 
                    margin: 10mm; 
                }
                body { 
                    margin: 0; 
                    padding: 0; 
                    font-family: 'Courier New', monospace; 
                }
                @media print {
                    body { 
                        print-color-adjust: exact; 
                        -webkit-print-color-adjust: exact; 
                    }
                    img {
                        max-width: 100% !important;
                        height: auto !important;
                    }
                }
            </style>
        </head>
        <body>
            ${invoiceHtml}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
    
    // Clean up temporary QR code data
    if (order.qrCodeData && !order.paymentTime) {
        delete order.qrCodeData;
    }
    
    console.log('✅ Print window opened for order:', order.id);
}

// Simulate real-time order updates
setInterval(() => {
    // Simulate new orders coming in (5% chance every 30 seconds)
    if (Math.random() < 0.05) {
        const newOrder = {
            id: `HD${String(Date.now()).slice(-3)}`,
            table: `Bàn ${Math.floor(Math.random() * 10) + 1}`,
            orderTime: new Date(),
            items: [
                { name: 'Phở bò', quantity: 1, price: 60000 },
                { name: 'Trà đá', quantity: 1, price: 5000 }
            ],
            status: 'ready',
            total: 65000
        };

        pendingPaymentOrders.push(newOrder);
        updateStats();
        renderPendingOrders();
    }
}, 30000);

// PayOS Payment Processing
async function processPayOSPayment() {
    if (!currentOrder) return;

    const paymentMethod = document.getElementById('paymentMethod').value;
    
    // Calculate final amount
    const subtotal = currentOrder.total;
    const taxAmount = subtotal * VAT_RATE;
    const afterTax = subtotal + taxAmount;
    const discountPercent = selectedDiscountCode ? selectedDiscountCode.discount : 0;
    const discountAmount = afterTax * (discountPercent / 100);
    const finalTotal = Math.round(afterTax - discountAmount);

    console.log('PayOS Payment Data:', {
        orderId: currentOrder.id,
        paymentMethod,
        finalTotal,
        originalTotal: currentOrder.total
    });

    try {
        // Show loading status
        showPayOSStatus('loading', 'Đang tạo link thanh toán PayOS...');
        
        // Validate PayOS settings
        if (!PAYOS_SETTINGS.CLIENT_ID || !PAYOS_SETTINGS.API_KEY || !PAYOS_SETTINGS.CHECKSUM_KEY) {
            throw new Error('Thiếu thông tin cấu hình PayOS. Vui lòng kiểm tra CLIENT_ID, API_KEY và CHECKSUM_KEY.');
        }
        
        // Create PayOS payment link
        const checkoutUrl = await createPayOSPaymentLink(finalTotal, paymentMethod);
        
        if (!checkoutUrl) {
            throw new Error('Không thể tạo link thanh toán PayOS');
        }
        
        console.log('PayOS Checkout URL created:', checkoutUrl);
        
        // Initialize PayOS
        initializePayOS(checkoutUrl, finalTotal);
        
    } catch (error) {
        console.error('PayOS Processing Error:', error);
        let errorMessage = 'Lỗi khi tạo thanh toán PayOS';
        
        if (error.message.includes('fetch')) {
            errorMessage = 'Không thể kết nối đến PayOS. Vui lòng kiểm tra kết nối mạng.';
        } else if (error.message.includes('CLIENT_ID')) {
            errorMessage = 'Lỗi cấu hình PayOS. Vui lòng liên hệ quản trị viên.';
        } else {
            errorMessage = error.message;
        }
        
        showPayOSStatus('error', errorMessage);
        
        // Hide error after 5 seconds
        setTimeout(() => {
            hidePayOSStatus();
        }, 5000);
    }
}

async function createPayOSPaymentLink(amount, paymentMethod) {
    try {
        // Create unique order code (must be unique and positive integer)
        const orderCode = Math.floor(Date.now() / 1000); // Unix timestamp for uniqueness
        
        console.log('Creating PayOS payment with:', {
            orderCode,
            amount,
            description: `Thanh toán đơn hàng ${currentOrder.id} - ${currentOrder.table}`,
            clientId: PAYOS_SETTINGS.CLIENT_ID
        });
        
        const orderData = {
            orderCode: orderCode,
            amount: amount,
            description: `TT ${currentOrder.id} - ${currentOrder.table}`,
            items: currentOrder.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            returnUrl: PAYOS_SETTINGS.RETURN_URL,
            cancelUrl: PAYOS_SETTINGS.CANCEL_URL
        };

        // Generate signature for PayOS
        console.log('Generating PayOS signature...');
        const signature = await generatePayOSSignature(orderCode, amount, orderData.description);
        
        if (!signature) {
            throw new Error('Không thể tạo chữ ký PayOS');
        }
        
        const paymentData = {
            ...orderData,
            signature: signature
        };

        console.log('Calling PayOS API with data:', {
            orderCode: paymentData.orderCode,
            amount: paymentData.amount,
            hasSignature: !!paymentData.signature
        });

        const response = await fetch('https://api-merchant.payos.vn/v2/payment-requests', {
            method: 'POST',
            headers: {
                'x-client-id': PAYOS_SETTINGS.CLIENT_ID,
                'x-api-key': PAYOS_SETTINGS.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });

        const result = await response.json();
        
        console.log('PayOS API Response:', {
            status: response.status,
            code: result.code,
            desc: result.desc,
            hasCheckoutUrl: !!(result.data && result.data.checkoutUrl),
            hasQrCode: !!(result.data && result.data.qrCode)
        });
        
        if (response.ok && result.code === '00' && result.data) {
            // Store PayOS payment data including QR code URL
            currentOrder.payosData = {
                orderCode: orderCode,
                checkoutUrl: result.data.checkoutUrl,
                qrCode: result.data.qrCode || null, // VietQR URL from PayOS
                paymentLinkId: result.data.paymentLinkId || null,
                amount: amount,
                description: orderData.description,
                createdAt: new Date().toISOString(),
                // Additional VietQR info if available
                accountNumber: result.data.accountNumber || null,
                accountName: result.data.accountName || null,
                bin: result.data.bin || null
            };
            
            console.log('PayOS QR Code URL:', result.data.qrCode);
            
            return result.data.checkoutUrl;
        } else {
            // Better error messages based on PayOS response codes
            let errorMessage = 'Lỗi PayOS không xác định';
            
            if (result.code === '01') {
                errorMessage = 'Dữ liệu không hợp lệ. Vui lòng thử lại.';
            } else if (result.code === '02') {
                errorMessage = 'Chữ ký không hợp lệ. Vui lòng liên hệ quản trị viên.';
            } else if (result.code === '03') {
                errorMessage = 'Merchant không tồn tại hoặc bị khóa.';
            } else if (result.desc) {
                errorMessage = result.desc;
            }
            
            throw new Error(errorMessage);
        }

    } catch (error) {
        console.error('Create PayOS Payment Link Error:', error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Không thể kết nối đến PayOS. Vui lòng kiểm tra kết nối mạng.');
        } else if (error.message.includes('JSON')) {
            throw new Error('Lỗi xử lý dữ liệu từ PayOS. Vui lòng thử lại.');
        } else {
            throw error;
        }
    }
}

// Helper function to generate PayOS signature
async function generatePayOSSignature(orderCode, amount, description) {
    try {
        // PayOS signature format: amount={amount}&cancelUrl={cancelUrl}&description={description}&orderCode={orderCode}&returnUrl={returnUrl}
        const data = `amount=${amount}&cancelUrl=${PAYOS_SETTINGS.CANCEL_URL}&description=${description}&orderCode=${orderCode}&returnUrl=${PAYOS_SETTINGS.RETURN_URL}`;
        
        // For browser environment, we'll use Web Crypto API
        const encoder = new TextEncoder();
        const keyData = encoder.encode(PAYOS_SETTINGS.CHECKSUM_KEY);
        const messageData = encoder.encode(data);
        
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        
        const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
        const hashArray = Array.from(new Uint8Array(signature));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        return hashHex;
    } catch (error) {
        console.error('Signature generation error:', error);
        // Fallback: return empty signature (will cause PayOS to reject, but at least won't crash)
        return '';
    }
}

function initializePayOS(checkoutUrl, amount) {
    // PayOS Configuration
    payOSConfig = {
        RETURN_URL: PAYOS_SETTINGS.RETURN_URL,
        ELEMENT_ID: "payos-checkout-iframe",
        CHECKOUT_URL: checkoutUrl,
        embedded: true,
        onSuccess: (event) => {
            console.log('PayOS Success:', event);
            handlePayOSSuccess(event, amount);
        },
        onCancel: (event) => {
            console.log('PayOS Cancel:', event);
            handlePayOSCancel(event);
        },
        onExit: (event) => {
            console.log('PayOS Exit:', event);
            handlePayOSExit(event);
        }
    };

    // Initialize PayOS
    try {
        const { open, exit } = PayOSCheckout.usePayOS(payOSConfig);
        payOSInstance = { open, exit };
        
        // Show PayOS status
        showPayOSStatus('waiting', 'Đang chờ thanh toán qua PayOS...');
        
        // Open PayOS checkout
        open();
        
    } catch (error) {
        console.error('PayOS Initialization Error:', error);
        showPayOSStatus('error', 'Lỗi khởi tạo PayOS: ' + error.message);
    }
}

function handlePayOSSuccess(event, amount) {
    console.log('Payment successful:', event);
    
    // Hide PayOS status
    hidePayOSStatus();
    
    // Complete the order
    completePayOSOrder(event, amount);
    
    // Show success message
    showPayOSStatus('success', 'Thanh toán thành công qua PayOS!');
    
    setTimeout(() => {
        hidePayOSStatus();
    }, 3000);
}

function handlePayOSCancel(event) {
    console.log('Payment cancelled:', event);
    showPayOSStatus('cancelled', 'Thanh toán đã bị hủy');
    
    setTimeout(() => {
        hidePayOSStatus();
    }, 3000);
}

function handlePayOSExit(event) {
    console.log('Payment exited:', event);
    hidePayOSStatus();
}

function completePayOSOrder(payosEvent, amount) {
    if (!currentOrder) return;

    const paymentMethod = document.getElementById('paymentMethod').value;
    
    // Create completed order with QR code data
    const completedOrder = {
        ...currentOrder,
        status: 'completed',
        paymentTime: new Date(),
        paymentMethod: getPaymentMethodText(paymentMethod),
        discount: selectedDiscountCode ? selectedDiscountCode.discount : 0,
        discountCode: selectedDiscountCode ? selectedDiscountCode.code : null,
        payosTransactionId: payosEvent.id || payosEvent.orderCode,
        payosOrderCode: payosEvent.orderCode,
        payosStatus: payosEvent.status,
        finalTotal: amount,
        // Store PayOS and QR code data
        payosData: currentOrder.payosData || null,
        qrCodeData: null // Will be generated below
    };

    // Generate and store QR code if PayOS data exists
    if (currentOrder.payosData) {
        generatePaymentQRCode(currentOrder.payosData).then(qrCode => {
            if (qrCode) {
                completedOrder.qrCodeData = qrCode;
                // Update the stored completed order
                const orderIndex = completedOrders.findIndex(o => o.id === completedOrder.id);
                if (orderIndex >= 0) {
                    completedOrders[orderIndex].qrCodeData = qrCode;
                }
            }
        });
    }

    // Move to completed orders
    completedOrders.unshift(completedOrder);
    
    // Remove from pending orders
    const index = pendingPaymentOrders.findIndex(order => order.id === currentOrder.id);
    if (index > -1) {
        pendingPaymentOrders.splice(index, 1);
    }

    // Update UI
    updateStats();
    renderPendingOrders();
    renderRecentPayments();

    // Close payment modal
    const paymentModal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
    paymentModal.hide();

    // Show success modal
    document.getElementById('successMessage').textContent = 
        `Đơn hàng ${currentOrder.id} đã được thanh toán thành công qua PayOS. Tổng tiền: ${formatCurrency(amount)}`;
    
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();

    // Store completed order for printing
    window.lastCompletedOrder = completedOrder;

    // Reset current order and discount
    currentOrder = null;
    selectedDiscountCode = null;
    
    // Re-initialize Lucide icons
    setTimeout(() => {
        lucide.createIcons();
    }, 100);
}

function showPayOSStatus(type, message) {
    const statusContainer = document.getElementById('payosStatus');
    const alertClass = {
        'loading': 'alert-info',
        'waiting': 'alert-warning', 
        'success': 'alert-success',
        'error': 'alert-danger',
        'cancelled': 'alert-secondary'
    };
    
    const iconClass = {
        'loading': 'loader',
        'waiting': 'clock',
        'success': 'check-circle-2',
        'error': 'x-circle',
        'cancelled': 'x-circle'
    };
    
    statusContainer.innerHTML = `
        <div class="alert ${alertClass[type]} mt-3">
            <div class="d-flex align-items-center">
                ${type === 'loading' || type === 'waiting' ? 
                    '<div class="spinner-border spinner-border-sm me-2" role="status"></div>' :
                    `<i data-lucide="${iconClass[type]}" style="width: 16px; height: 16px;" class="me-2"></i>`
                }
                <span>${message}</span>
            </div>
        </div>
    `;
    
    statusContainer.style.display = 'block';
    lucide.createIcons();
}

function hidePayOSStatus() {
    const statusContainer = document.getElementById('payosStatus');
    statusContainer.style.display = 'none';
}

// PayOS Full Screen Toggle
function togglePayOSFullscreen() {
    const modal = document.getElementById('paymentModal');
    const iframe = document.getElementById('payos-checkout-iframe');
    const fullscreenBtn = document.querySelector('.payos-fullscreen-btn');
    
    if (!modal || !iframe || !fullscreenBtn) return;
    
    if (modal.classList.contains('payos-modal')) {
        // Exit full screen
        modal.classList.remove('payos-modal');
        fullscreenBtn.innerHTML = `
            <i data-lucide="maximize" style="width: 16px; height: 16px;"></i>
            <span class="ms-1">Full Screen</span>
        `;
    } else {
        // Enter full screen
        modal.classList.add('payos-modal');
        fullscreenBtn.innerHTML = `
            <i data-lucide="minimize" style="width: 16px; height: 16px;"></i>
            <span class="ms-1">Exit Full Screen</span>
        `;
    }
    
    // Re-initialize icons
    lucide.createIcons();
}

// Auto-expand PayOS iframe when it loads content
function expandPayOSIframe() {
    const iframe = document.getElementById('payos-checkout-iframe');
    const container = document.getElementById('payosContainer');
    
    if (iframe && container) {
        // Add resize observer to detect when iframe content loads
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.contentRect.height > 0) {
                    // Content has loaded, make iframe taller
                    iframe.style.minHeight = '650px';
                    iframe.style.height = '75vh';
                }
            }
        });
        
        observer.observe(iframe);
    }
}

// Initialize PayOS iframe expansion when container becomes visible
function initPayOSIframeExpansion() {
    const container = document.getElementById('payosContainer');
    if (container) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (container.style.display !== 'none') {
                        expandPayOSIframe();
                    }
                }
            });
        });
        
        observer.observe(container, { attributes: true });
    }
}

// Apply PayOS Size
function applyPayOSSize(sizeName) {
    const config = PayOSSizeConfig[sizeName];
    if (!config) return;
    
    const iframe = document.getElementById('payos-checkout-iframe');
    const modal = document.querySelector('#paymentModal .modal-dialog');
    
    if (iframe) {
        // Apply iframe size
        iframe.style.minHeight = config.minHeight;
        iframe.style.height = config.height;
        iframe.style.maxHeight = config.maxHeight;
    }
    
    if (modal) {
        // Apply modal width
        modal.style.maxWidth = config.modalWidth;
    }
    
    console.log(`PayOS size applied: ${sizeName}`, config);
}

// Save user preference
function savePayOSSize(size) {
    localStorage.setItem('payos-size-preference', size);
    applyPayOSSize(size);
    updateSizeButtons(size);
}

// Load user preference
function loadPayOSSize() {
    const savedSize = localStorage.getItem('payos-size-preference') || 'medium';
    applyPayOSSize(savedSize);
    updateSizeButtons(savedSize);
}

// Update size button states
function updateSizeButtons(activeSize) {
    const buttons = document.querySelectorAll('.payos-size-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.size === activeSize) {
            btn.classList.add('active');
        }
    });
}

// Responsive sizing based on viewport
function setResponsiveSize() {
    const iframe = document.getElementById('payos-checkout-iframe');
    if (!iframe) return;
    
    const viewportWidth = window.innerWidth;
    const savedSize = localStorage.getItem('payos-size-preference');
    
    // Only apply responsive sizing if no custom size is set
    if (!savedSize) {
        if (viewportWidth < 576) {
            applyPayOSSize('small');
        } else if (viewportWidth < 768) {
            applyPayOSSize('medium');
        } else if (viewportWidth < 1200) {
            applyPayOSSize('large');
        } else {
            applyPayOSSize('xl');
        }
    }
}

// Generate QR Code for payment information using PayOS VietQR
async function generatePaymentQRCode(paymentData) {
    try {
        // Use PayOS VietQR URL if available
        if (paymentData.qrCode) {
            console.log('Using PayOS VietQR URL:', paymentData.qrCode);
            
            return {
                dataUrl: paymentData.qrCode, // This is the VietQR image URL from PayOS
                data: JSON.stringify({
                    type: 'PAYOS_VIETQR',
                    orderId: currentOrder.id,
                    table: currentOrder.table,
                    amount: paymentData.amount,
                    orderCode: paymentData.orderCode,
                    qrCodeUrl: paymentData.qrCode,
                    paymentUrl: paymentData.checkoutUrl,
                    timestamp: paymentData.createdAt,
                    restaurant: 'Nhà hàng ABC',
                    accountNumber: paymentData.accountNumber,
                    accountName: paymentData.accountName,
                    bin: paymentData.bin
                }),
                isVietQR: true,
                qrUrl: paymentData.qrCode
            };
        }
        
        // Fallback: Generate our own QR code if PayOS doesn't provide one
        const qrData = JSON.stringify({
            type: 'PAYMENT',
            orderId: currentOrder.id,
            table: currentOrder.table,
            amount: paymentData.amount,
            orderCode: paymentData.orderCode,
            paymentUrl: paymentData.checkoutUrl,
            timestamp: paymentData.createdAt,
            restaurant: 'Nhà hàng ABC'
        });
        
        // Generate QR code as base64 image
        const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
            width: 200,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        
        return {
            dataUrl: qrCodeDataUrl,
            data: qrData,
            isVietQR: false
        };
    } catch (error) {
        console.error('Error generating QR code:', error);
        return null;
    }
}

// Alternative: Generate simple payment URL QR code
async function generateSimplePaymentQRCode(checkoutUrl) {
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(checkoutUrl, {
            width: 150,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        
        return qrCodeDataUrl;
    } catch (error) {
        console.error('Error generating simple QR code:', error);
        return null;
    }
}

// Show QR Code Preview Modal
function showQRCodePreview(orderId) {
    const order = completedOrders.find(o => o.id === orderId);
    if (!order || !order.qrCodeData) {
        alert('Không tìm thấy mã QR cho đơn hàng này');
        return;
    }
    
    const isVietQR = order.qrCodeData.isVietQR;
    const qrTitle = isVietQR ? 'Mã QR Chuyển khoản PayOS' : 'Mã QR Thanh toán';
    const qrDescription = isVietQR ? 
        'Quét mã này bằng app ngân hàng để chuyển khoản' : 
        'Quét mã này để xem thông tin giao dịch';
    
    // Parse QR data to show details
    let qrDataDetails = '';
    try {
        const qrData = JSON.parse(order.qrCodeData.data);
        if (isVietQR) {
            qrDataDetails = `
                <div class="row g-2">
                    <div class="col-6"><strong>Loại QR:</strong> VietQR Banking</div>
                    <div class="col-6"><strong>Số tiền:</strong> ${formatCurrency(qrData.amount)}</div>
                    ${qrData.accountNumber ? `<div class="col-6"><strong>STK:</strong> ${qrData.accountNumber}</div>` : ''}
                    ${qrData.accountName ? `<div class="col-6"><strong>Tên TK:</strong> ${qrData.accountName}</div>` : ''}
                    ${qrData.bin ? `<div class="col-6"><strong>Ngân hàng:</strong> ${qrData.bin}</div>` : ''}
                    <div class="col-12"><strong>Nội dung:</strong> TT ${order.id} - ${order.table}</div>
                </div>
            `;
        } else {
            qrDataDetails = `
                <div class="row g-2">
                    <div class="col-6"><strong>Loại QR:</strong> Thông tin đơn hàng</div>
                    <div class="col-6"><strong>Số tiền:</strong> ${formatCurrency(qrData.amount)}</div>
                </div>
            `;
        }
    } catch (e) {
        qrDataDetails = '<p class="text-muted">Không thể đọc chi tiết QR code</p>';
    }
    
    const qrPreviewHtml = `
        <div class="text-center">
            <h5 class="mb-3">${qrTitle} - ${order.id}</h5>
            <div class="mb-3">
                <img src="${order.qrCodeData.dataUrl}" class="img-fluid" style="max-width: 250px;" alt="QR Code">
            </div>
            <div class="alert ${isVietQR ? 'alert-success' : 'alert-info'}">
                <strong>Thông tin giao dịch:</strong><br>
                Đơn hàng: ${order.id}<br>
                Bàn: ${order.table}<br>
                Số tiền: ${formatCurrency(order.finalTotal)}<br>
                ${order.payosOrderCode ? `Mã GD: ${order.payosOrderCode}<br>` : ''}
                Thời gian: ${order.paymentTime.toLocaleString('vi-VN')}<br>
                <small class="text-muted">${qrDescription}</small>
            </div>
            <div class="mt-3">
                ${qrDataDetails}
            </div>
            ${isVietQR ? `
                <div class="alert alert-warning mt-3">
                    <small>
                        <i data-lucide="info" style="width: 16px; height: 16px;"></i>
                        Đây là mã QR VietQR thực tế từ PayOS có thể dùng để chuyển khoản
                    </small>
                </div>
            ` : ''}
        </div>
    `;
    
    // Create and show modal
    const modalHtml = `
        <div class="modal fade" id="qrPreviewModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Xem QR Code</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${qrPreviewHtml}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        ${isVietQR ? `
                            <a href="${order.qrCodeData.dataUrl}" target="_blank" class="btn btn-info">
                                <i data-lucide="external-link" style="width: 16px; height: 16px;"></i>
                                Mở QR trong tab mới
                            </a>
                        ` : ''}
                        <button type="button" class="btn btn-primary" onclick="printCompletedOrder('${orderId}')">
                            <i data-lucide="printer" style="width: 16px; height: 16px;"></i>
                            In hóa đơn
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('qrPreviewModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('qrPreviewModal'));
    modal.show();
    
    // Initialize Lucide icons
    lucide.createIcons();
}

// Generate QR code for cash payments (order summary QR)
async function generateOrderSummaryQRCode(order) {
    try {
        console.log('🔍 Generating QR code for order:', order.id);
        
        // Check if QRCode library is available
        if (typeof QRCode === 'undefined') {
            console.error('❌ QRCode library not loaded');
            alert('QRCode library không được tải. Vui lòng kiểm tra kết nối mạng.');
            return null;
        }
        
        // Calculate final total for pending orders
        const subtotal = order.total;
        const taxAmount = subtotal * VAT_RATE;
        const finalTotal = subtotal + taxAmount;
        
        const qrData = JSON.stringify({
            type: 'ORDER_SUMMARY',
            orderId: order.id,
            table: order.table,
            amount: finalTotal, // Use calculated final total
            subtotal: subtotal,
            taxAmount: taxAmount,
            items: order.items.length,
            itemDetails: order.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            paymentMethod: order.paymentMethod || 'CHƯA THANH TOÁN',
            timestamp: order.paymentTime ? order.paymentTime.toISOString() : new Date().toISOString(),
            restaurant: 'Nhà hàng ABC',
            status: order.status || 'pending'
        });
        
        console.log('📄 QR Data:', qrData);
        
        const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
            width: 200,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        
        console.log('✅ QR Code generated successfully, length:', qrCodeDataUrl.length);
        
        return {
            dataUrl: qrCodeDataUrl,
            data: qrData,
            isVietQR: false
        };
    } catch (error) {
        console.error('❌ Error generating order summary QR code:', error);
        alert('Lỗi tạo mã QR: ' + error.message);
        return null;
    }
}

function printCompletedOrder(orderId) {
    const order = completedOrders.find(o => o.id === orderId);
    if (!order) return;
    
    // Set the order as the last completed order for printing
    window.lastCompletedOrder = order;
    printInvoice(true);
}

// =============== ENHANCED INVOICE PRINTING FEATURES ===============
// Imported and enhanced from qr-demo-simple

// Generate PayOS QR URL for payment
function getPayOSQRUrl(orderId, table, amount) {
    const addInfo = `TT ${orderId} ${table}`.replace(/\s+/g, '+');
    const qrUrl = `https://img.vietqr.io/image/970452-10142505304746708-payos.jpg?addInfo=${addInfo}&amount=${amount}`;
    console.log('Generated PayOS QR URL:', qrUrl);
    return qrUrl;
}

// Generate invoice with PayOS QR Code for pending orders
function generateInvoiceWithPayOSQR(order) {
    if (!order) return;
    
    const subtotal = order.total;
    const taxAmount = Math.round(subtotal * VAT_RATE);
    const finalTotal = subtotal + taxAmount;
    
    const qrUrl = getPayOSQRUrl(order.id, order.table, finalTotal);
    
    let invoiceHtml = '';
    
    // Header
    invoiceHtml += '<div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px;">';
    invoiceHtml += '<h2 style="margin: 0; font-size: 18px; font-weight: bold;">NHÀ HÀNG ABC</h2>';
    invoiceHtml += '<p style="margin: 5px 0 0 0; font-size: 12px;">123 Đường XYZ, Quận 1, TP.HCM</p>';
    invoiceHtml += '<p style="margin: 2px 0 0 0; font-size: 12px;">Tel: 028.1234.5678</p>';
    invoiceHtml += '</div>';
    
    // Order info
    invoiceHtml += '<div style="margin-bottom: 15px;">';
    invoiceHtml += '<div style="display: flex; justify-content: space-between; margin-bottom: 5px;">';
    invoiceHtml += '<span><strong>Hóa đơn:</strong></span><span>' + order.id + '</span>';
    invoiceHtml += '</div>';
    invoiceHtml += '<div style="display: flex; justify-content: space-between; margin-bottom: 5px;">';
    invoiceHtml += '<span><strong>Bàn:</strong></span><span>' + order.table + '</span>';
    invoiceHtml += '</div>';
    invoiceHtml += '<div style="display: flex; justify-content: space-between; margin-bottom: 5px;">';
    invoiceHtml += '<span><strong>Ngày:</strong></span><span>' + new Date().toLocaleDateString('vi-VN') + '</span>';
    invoiceHtml += '</div>';
    invoiceHtml += '<div style="display: flex; justify-content: space-between; margin-bottom: 5px;">';
    invoiceHtml += '<span><strong>Giờ:</strong></span><span>' + new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'}) + '</span>';
    invoiceHtml += '</div>';
    invoiceHtml += '<div style="display: flex; justify-content: space-between; margin-bottom: 5px;">';
    invoiceHtml += '<span><strong>Trạng thái:</strong></span><span style="color: #ff6b35; font-weight: bold;">CHƯA THANH TOÁN</span>';
    invoiceHtml += '</div>';
    invoiceHtml += '</div>';
    
    // Items
    invoiceHtml += '<div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 10px 0; margin-bottom: 15px;">';
    order.items.forEach(item => {
        invoiceHtml += '<div style="display: flex; justify-content: space-between; margin-bottom: 3px;">';
        invoiceHtml += '<span>' + item.quantity + 'x ' + item.name + '</span><span>' + formatCurrency(item.quantity * item.price) + '</span>';
        invoiceHtml += '</div>';
    });
    invoiceHtml += '</div>';
    
    // Totals
    invoiceHtml += '<div style="margin-bottom: 15px;">';
    invoiceHtml += '<div style="display: flex; justify-content: space-between; margin-bottom: 3px;">';
    invoiceHtml += '<span>Tổng tiền hàng:</span><span>' + formatCurrency(subtotal) + '</span>';
    invoiceHtml += '</div>';
    invoiceHtml += '<div style="display: flex; justify-content: space-between; margin-bottom: 3px;">';
    invoiceHtml += '<span>Thuế VAT (8%):</span><span>' + formatCurrency(taxAmount) + '</span>';
    invoiceHtml += '</div>';
    invoiceHtml += '</div>';
    
    // Final total
    invoiceHtml += '<div style="border-top: 2px solid #000; padding-top: 10px; margin-bottom: 15px;">';
    invoiceHtml += '<div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold;">';
    invoiceHtml += '<span>THÀNH TIỀN:</span><span>' + formatCurrency(finalTotal) + '</span>';
    invoiceHtml += '</div>';
    invoiceHtml += '</div>';
    
    // PayOS QR Code section
    invoiceHtml += '<div style="text-align: center; border-top: 1px dashed #000; padding-top: 15px; margin-bottom: 15px;">';
    invoiceHtml += '<p style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold;">MÃ QR THANH TOÁN PAYOS</p>';
    invoiceHtml += '<img src="' + qrUrl + '" ';
    invoiceHtml += 'style="width: 140px; height: 140px; margin: 10px auto; display: block; border: 1px solid #ddd; border-radius: 8px;" ';
    invoiceHtml += 'alt="PayOS QR Code thanh toán" ';
    invoiceHtml += 'onload="console.log(\'✅ PayOS QR Image loaded successfully\')" ';
    invoiceHtml += 'onerror="console.log(\'❌ PayOS QR Image failed to load: \' + this.src); this.style.backgroundColor=\'#f8f9fa\'; this.style.border=\'2px dashed #ccc\'; this.alt=\'QR Load Error\';">';
    invoiceHtml += '<p style="margin: 10px 0 5px 0; font-size: 10px; color: #666;">Quét mã QR để thanh toán qua VietQR</p>';
    invoiceHtml += '<p style="margin: 0; font-size: 9px; color: #999;">Ngân hàng: KIENLONGBANK | TK: 0969864739</p>';
    invoiceHtml += '</div>';
    
    // Footer
    invoiceHtml += '<div style="text-align: center; font-size: 12px; border-top: 1px dashed #000; padding-top: 10px;">';
    invoiceHtml += '<p style="margin: 0 0 5px 0;"><strong>CẢM ƠN QUÝ KHÁCH!</strong></p>';
    invoiceHtml += '<p style="margin: 0;">Hẹn gặp lại!</p>';
    invoiceHtml += '<p style="margin: 10px 0 0 0; font-size: 10px; color: #ff6b35;">* Đây là hóa đơn tạm. Vui lòng thanh toán để hoàn tất.</p>';
    invoiceHtml += '</div>';
    invoiceHtml += '</div>';
    
    return invoiceHtml;
}

// Enhanced print function with PayOS QR support
function printInvoiceWithPayOSQR(order) {
    if (!order) return;
    
    console.log('Starting invoice generation with PayOS QR for order:', order.id);
    
    try {
        const invoiceHtml = generateInvoiceWithPayOSQR(order);
        
        // Open invoice in new window for printing
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <title>Hóa đơn PayOS ${order.id}</title>
                <style>
                    @page { 
                        size: A5; 
                        margin: 10mm; 
                    }
                    body { 
                        margin: 0; 
                        padding: 0; 
                        font-family: 'Courier New', monospace; 
                    }
                    @media print {
                        body { 
                            print-color-adjust: exact; 
                            -webkit-print-color-adjust: exact; 
                        }
                        img {
                            max-width: 100% !important;
                            height: auto !important;
                        }
                    }
                </style>
            </head>
            <body>
                ${invoiceHtml}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
        
        console.log('✅ PayOS QR Invoice generated and print dialog opened');
        
    } catch (error) {
        console.error('❌ Error generating PayOS QR invoice:', error.message);
        alert('Lỗi tạo hóa đơn PayOS: ' + error.message);
    }
}

// Function to add PayOS QR print button to order cards
function addPayOSQRPrintButton(orderCard, order) {
    const existingButton = orderCard.querySelector('.payos-qr-print-btn');
    if (existingButton) return; // Button already exists
    
    const buttonContainer = orderCard.querySelector('.d-flex.gap-2') || orderCard.querySelector('.order-actions');
    if (!buttonContainer) return;
    
    const payosQRButton = document.createElement('button');
    payosQRButton.className = 'btn btn-outline-success btn-sm payos-qr-print-btn';
    payosQRButton.innerHTML = `
        <i data-lucide="qr-code" style="width: 14px; height: 14px;"></i>
        <span class="ms-1 d-none d-sm-inline">In QR PayOS</span>
    `;
    payosQRButton.title = 'In hóa đơn với mã QR PayOS';
    payosQRButton.onclick = (e) => {
        e.stopPropagation();
        printInvoiceWithPayOSQR(order);
    };
    
    buttonContainer.appendChild(payosQRButton);
    
    // Re-initialize Lucide icons for the new button
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Function to print pending invoice with PayOS QR payment code
function printPendingInvoiceWithPayOSQR(order) {
    console.log('🖨️ printPendingInvoiceWithPayOSQR called with order:', order.id);
    
    const subtotal = order.total;
    const taxAmount = subtotal * VAT_RATE;
    const finalTotal = Math.round(subtotal + taxAmount);
    
    // Check if PayOS QR code is available
    const hasPayOSQR = order.paymentQRData && order.paymentQRData.dataUrl;
    console.log('💳 Has PayOS QR:', hasPayOSQR, order.paymentQRData);

    const invoiceHtml = `
        <div style="max-width: 400px; margin: 0 auto; font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.4;">
            <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px;">
                <h2 style="margin: 0; font-size: 18px; font-weight: bold;">NHÀ HÀNG ABC</h2>
                <p style="margin: 5px 0 0 0; font-size: 12px;">123 Đường XYZ, Quận 1, TP.HCM</p>
                <p style="margin: 2px 0 0 0; font-size: 12px;">Tel: 028.1234.5678</p>
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>Hóa đơn:</strong></span>
                    <span>${order.id}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>Bàn:</strong></span>
                    <span>${order.table}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>Ngày:</strong></span>
                    <span>${new Date().toLocaleDateString('vi-VN')}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>Giờ:</strong></span>
                    <span>${new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>Trạng thái:</strong></span>
                    <span style="color: #ff6b35; font-weight: bold;">CHƯA THANH TOÁN</span>
                </div>
            </div>
            
            <div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 10px 0; margin-bottom: 15px;">
                ${order.items.map(item => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                        <span>${item.quantity}x ${item.name}</span>
                        <span>${formatCurrency(item.quantity * item.price)}</span>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                    <span>Tổng tiền hàng:</span>
                    <span>${formatCurrency(subtotal)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                    <span>Thuế VAT (8%):</span>
                    <span>${formatCurrency(taxAmount)}</span>
                </div>
            </div>
            
            <div style="border-top: 2px solid #000; padding-top: 10px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold;">
                    <span>THÀNH TIỀN:</span>
                    <span>${formatCurrency(finalTotal)}</span>
                </div>
            </div>
            
            ${hasPayOSQR ? `
                <div style="text-align: center; border-top: 1px dashed #000; padding-top: 15px; margin-bottom: 15px;">
                    <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; color: #28a745;">🏦 MÃ QR THANH TOÁN PAYOS</p>
                    <img src="${order.paymentQRData.dataUrl}" 
                         style="width: 140px; height: 140px; margin: 10px auto; display: block; border: 1px solid #ddd; border-radius: 8px;" 
                         alt="PayOS QR Code thanh toán"
                         onload="console.log('✅ PayOS QR Image loaded in print preview')"
                         onerror="console.error('❌ PayOS QR Image failed to load in print preview')">
                    <p style="margin: 10px 0 5px 0; font-size: 10px; color: #666; font-weight: bold;">
                        📱 Quét mã QR bằng app ngân hàng để thanh toán
                    </p>
                    <p style="margin: 0; font-size: 9px; color: #28a745;">
                        💰 Số tiền: ${formatCurrency(finalTotal)} | 🏪 PayOS VietQR
                    </p>
                    <p style="margin: 5px 0 0 0; font-size: 9px; color: #999;">
                        🏦 KIENLONGBANK | TK: 0969864739
                    </p>
                </div>
            ` : `
                <div style="text-align: center; border-top: 1px dashed #000; padding-top: 15px; margin-bottom: 15px;">
                    <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; color: #999;">❌ MÃ QR THANH TOÁN KHÔNG KHẢ DỤNG</p>
                    <div style="width: 140px; height: 140px; margin: 10px auto; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; background: #f8f9fa;">
                        <span style="color: #999; font-size: 10px;">QR Error</span>
                    </div>
                    <p style="margin: 10px 0 5px 0; font-size: 10px; color: #999;">Vui lòng thanh toán tại quầy</p>
                </div>
            `}
            
            <div style="text-align: center; font-size: 12px; border-top: 1px dashed #000; padding-top: 10px;">
                <p style="margin: 0 0 5px 0; color: #ff6b35;"><strong>⏳ HÓA ĐƠN TẠM - CHƯA THANH TOÁN</strong></p>
                <p style="margin: 0; color: #666;">
                    ${hasPayOSQR ? 
                        '📱 Quét mã QR trên để thanh toán ngay' : 
                        '💰 Vui lòng thanh toán tại quầy để hoàn tất đơn hàng'
                    }
                </p>
                <p style="margin: 10px 0 0 0; font-size: 10px; color: #999;">
                    * Hóa đơn này chỉ mang tính chất tham khảo. Thanh toán để nhận hóa đơn chính thức.
                </p>
            </div>
        </div>
    `;

    console.log('📄 PayOS Invoice HTML generated, has QR:', hasPayOSQR);

    // Open invoice in new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Hóa đơn thanh toán ${order.id}</title>
            <style>
                @page { 
                    size: A5; 
                    margin: 10mm; 
                }
                body { 
                    margin: 0; 
                    padding: 0; 
                    font-family: 'Courier New', monospace; 
                }
                @media print {
                    body { 
                        print-color-adjust: exact; 
                        -webkit-print-color-adjust: exact; 
                    }
                    img {
                        max-width: 100% !important;
                        height: auto !important;
                    }
                }
            </style>
        </head>
        <body>
            ${invoiceHtml}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
    
    // Clean up temporary QR data
    if (order.paymentQRData) {
        delete order.paymentQRData;
    }
    
    console.log('✅ PayOS Payment Invoice print window opened for order:', order.id);
}

// Function to print pending invoice with optional QR code
function printPendingInvoiceWithQR(order) {
    console.log('🖨️ printPendingInvoiceWithQR called with order:', order.id);
    
    const subtotal = order.total;
    const taxAmount = subtotal * VAT_RATE;
    const afterTax = subtotal + taxAmount;
    
    // For pending invoices, we don't apply discounts yet
    const finalTotal = afterTax;
    
    // Check if QR code is available
    const hasQRCode = order.qrCodeData && order.qrCodeData.dataUrl;
    console.log('🔗 Has QR Code:', hasQRCode, order.qrCodeData);

    const invoiceHtml = `
        <div style="max-width: 400px; margin: 0 auto; font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.4;">
            <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px;">
                <h2 style="margin: 0; font-size: 18px; font-weight: bold;">NHÀ HÀNG ABC</h2>
                <p style="margin: 5px 0 0 0; font-size: 12px;">123 Đường XYZ, Quận 1, TP.HCM</p>
                <p style="margin: 2px 0 0 0; font-size: 12px;">Tel: 028.1234.5678</p>
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>Hóa đơn:</strong></span>
                    <span>${order.id}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>Bàn:</strong></span>
                    <span>${order.table}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>Ngày:</strong></span>
                    <span>${new Date().toLocaleDateString('vi-VN')}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>Giờ:</strong></span>
                    <span>${new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>Trạng thái:</strong></span>
                    <span style="color: #ff6b35;">CHƯA THANH TOÁN</span>
                </div>
            </div>
            
            <div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 10px 0; margin-bottom: 15px;">
                ${order.items.map(item => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                        <span>${item.quantity}x ${item.name}</span>
                        <span>${formatCurrency(item.quantity * item.price)}</span>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                    <span>Tổng tiền hàng:</span>
                    <span>${formatCurrency(subtotal)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                    <span>Thuế VAT (8%):</span>
                    <span>${formatCurrency(taxAmount)}</span>
                </div>
            </div>
            
            <div style="border-top: 2px solid #000; padding-top: 10px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold;">
                    <span>THÀNH TIỀN:</span>
                    <span>${formatCurrency(finalTotal)}</span>
                </div>
                <div style="margin-top: 10px; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #666;">
                        * Chưa bao gồm giảm giá (nếu có)
                    </p>
                </div>
            </div>
            
            ${hasQRCode ? `
                <div style="text-align: center; border-top: 1px dashed #000; padding-top: 15px; margin-bottom: 15px;">
                    <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold;">MÃ QR ĐỌC THÔNG TIN</p>
                    <img src="${order.qrCodeData.dataUrl}" style="width: 120px; height: 120px; margin: 10px auto; display: block;" 
                         alt="QR Code thông tin đơn hàng"
                         onload="console.log('✅ QR Image loaded in print preview')"
                         onerror="console.error('❌ QR Image failed to load in print preview')">
                    <p style="margin: 10px 0 5px 0; font-size: 10px; color: #666;">Quét mã QR để xem chi tiết đơn hàng</p>
                </div>
            ` : `
                <div style="text-align: center; border-top: 1px dashed #000; padding-top: 15px; margin-bottom: 15px;">
                    <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; color: #999;">MÃ QR KHÔNG KHẢ DỤNG</p>
                    <div style="width: 120px; height: 120px; margin: 10px auto; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; background: #f8f9fa;">
                        <span style="color: #999; font-size: 10px;">Không có QR</span>
                    </div>
                    <p style="margin: 10px 0 5px 0; font-size: 10px; color: #999;">QR Code không thể tạo</p>
                </div>
            `}
            
            <div style="text-align: center; font-size: 12px; border-top: 1px dashed #000; padding-top: 10px;">
                <p style="margin: 0 0 5px 0; color: #ff6b35;"><strong>HÓA ĐƠN TẠM</strong></p>
                <p style="margin: 0; color: #666;">Vui lòng thanh toán để hoàn tất đơn hàng</p>
                <p style="margin: 10px 0 0 0; font-size: 10px; color: #999;">
                    Hóa đơn này chỉ mang tính chất tham khảo
                </p>
            </div>
        </div>
    `;

    console.log('📄 Invoice HTML generated, has QR:', hasQRCode);

    // Open invoice in new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Hóa đơn tạm ${order.id}</title>
            <style>
                @page { 
                    size: A5; 
                    margin: 10mm; 
                }
                body { 
                    margin: 0; 
                    padding: 0; 
                    font-family: 'Courier New', monospace; 
                }
                @media print {
                    body { 
                        print-color-adjust: exact; 
                        -webkit-print-color-adjust: exact; 
                    }
                    img {
                        max-width: 100% !important;
                        height: auto !important;
                    }
                }
            </style>
        </head>
        <body>
            ${invoiceHtml}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
    
    // Clean up temporary QR code data
    if (order.qrCodeData && !order.paymentTime) {
        delete order.qrCodeData;
    }
    
    console.log('✅ Print window opened for order:', order.id);
}

// Helper function to print PayOS QR invoice by order ID
function printInvoiceWithPayOSQRById(orderId) {
    const order = pendingPaymentOrders.find(o => o.id === orderId);
    if (order) {
        printInvoiceWithPayOSQR(order);
    } else {
        console.error('Order not found:', orderId);
        alert('Không tìm thấy đơn hàng: ' + orderId);
    }
}

// Helper function to print pending invoice from payment modal
function printPendingInvoiceFromModal() {
    if (!currentOrder) {
        console.error('❌ No current order in modal');
        alert('Không có đơn hàng nào được chọn để in');
        return;
    }
    
    console.log('🖨️ Printing pending invoice from modal for order:', currentOrder.id);
    printPendingInvoice(currentOrder.id);
}