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
                        
                        <div class="d-flex justify-content-end mt-3">
                            <button class="btn btn-enhanced btn-success" onclick="openPaymentModal('${order.id}')">
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
        
        return `
            <div class="recent-payment">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div>
                        <h6 class="mb-1 fw-bold">${order.id}</h6>
                        <small class="text-muted">${order.table} - ${getTimeAgo(order.paymentTime)}</small>
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
                    <button class="btn btn-outline-primary btn-sm" onclick="printCompletedOrder('${order.id}')">
                        <i data-lucide="printer" style="width: 14px; height: 14px;"></i>
                        In hóa đơn
                    </button>
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

    // Update summary when inputs change
    customerPaidInput.addEventListener('input', updatePaymentSummary);
    
    // Handle payment method change
    paymentMethodSelect.addEventListener('change', function() {
        updateCashAmountVisibility();
        updatePaymentSummary();
    });

    // Process payment
    processButton.addEventListener('click', processPayment);
}

function updateCashAmountVisibility() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const cashAmountSection = document.getElementById('cashAmountSection');
    
    if (paymentMethod === 'cash') {
        cashAmountSection.classList.remove('hidden');
    } else {
        cashAmountSection.classList.add('hidden');
        document.getElementById('customerPaid').value = '';
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
        finalTotal: finalTotal
    };

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
            
            <div style="text-align: center; font-size: 12px; border-top: 1px dashed #000; padding-top: 10px;">
                ${isCompleted ? `
                    <p style="margin: 0 0 5px 0;"><strong>CẢM ƠN QUÝ KHÁCH!</strong></p>
                    <p style="margin: 0;">Hẹn gặp lại!</p>
                ` : `
                    <p style="margin: 0 0 5px 0;"><strong>HÓA ĐƠN TẠM</strong></p>
                    <p style="margin: 0;">Chưa thanh toán</p>
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
            <title>Hóa đơn ${orderToPrint.id}</title>
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

function printCompletedOrder(orderId) {
    const order = completedOrders.find(o => o.id === orderId);
    if (!order) return;
    
    // Set the order as the last completed order for printing
    window.lastCompletedOrder = order;
    printInvoice(true);
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