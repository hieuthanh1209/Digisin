// Mock data for waiter dashboard
let tables = [
    { id: 1, status: 'empty', customers: 0, startTime: null, orderTotal: 0 },
    { id: 2, status: 'occupied', customers: 4, startTime: new Date(Date.now() - 45 * 60000), orderTotal: 285000 },
    { id: 3, status: 'empty', customers: 0, startTime: null, orderTotal: 0 },
    { id: 4, status: 'occupied', customers: 2, startTime: new Date(Date.now() - 25 * 60000), orderTotal: 150000 },
    { id: 5, status: 'cleaning', customers: 0, startTime: null, orderTotal: 0 },
    { id: 6, status: 'occupied', customers: 6, startTime: new Date(Date.now() - 65 * 60000), orderTotal: 420000 },
    { id: 7, status: 'empty', customers: 0, startTime: null, orderTotal: 0 },
    { id: 8, status: 'cleaning', customers: 0, startTime: null, orderTotal: 0 },
    { id: 9, status: 'occupied', customers: 3, startTime: new Date(Date.now() - 15 * 60000), orderTotal: 95000 },
    { id: 10, status: 'empty', customers: 0, startTime: null, orderTotal: 0 },
    { id: 11, status: 'empty', customers: 0, startTime: null, orderTotal: 0 },
    { id: 12, status: 'occupied', customers: 2, startTime: new Date(Date.now() - 30 * 60000), orderTotal: 180000 }
];

const menuItems = [
    // Mì & Phở
    { id: 1, name: 'Phở bò tái', price: 60000, category: 'noodles', image: 'https://via.placeholder.com/150x100/FFB6C1/000000?text=Phở+Bò+Tái' },
    { id: 2, name: 'Phở gà', price: 50000, category: 'noodles', image: 'https://via.placeholder.com/150x100/F0E68C/000000?text=Phở+Gà' },
    { id: 3, name: 'Bún chả Hà Nội', price: 45000, category: 'noodles', image: 'https://via.placeholder.com/150x100/DDA0DD/000000?text=Bún+Chả' },
    { id: 4, name: 'Bún bò Huế', price: 48000, category: 'noodles', image: 'https://via.placeholder.com/150x100/FF6347/000000?text=Bún+Bò+Huế' },
    { id: 5, name: 'Mì Quảng', price: 52000, category: 'noodles', image: 'https://via.placeholder.com/150x100/FFA500/000000?text=Mì+Quảng' },
    { id: 6, name: 'Mì siêu cay pro max', price: 55000, category: 'noodles', image: 'https://via.placeholder.com/150x100/FF4500/FFFFFF?text=Mì+Siêu+Cay' },
    { id: 7, name: 'Bún thịt nướng', price: 42000, category: 'noodles', image: 'https://via.placeholder.com/150x100/98FB98/000000?text=Bún+Thịt+Nướng' },
    
    // Cơm
    { id: 8, name: 'Cơm tấm sườn nướng', price: 40000, category: 'rice', image: 'https://via.placeholder.com/150x100/F4A460/000000?text=Cơm+Tấm' },
    { id: 9, name: 'Cơm rang thập cẩm', price: 35000, category: 'rice', image: 'https://via.placeholder.com/150x100/FFD700/000000?text=Cơm+Rang' },
    { id: 10, name: 'Cơm gà nướng', price: 45000, category: 'rice', image: 'https://via.placeholder.com/150x100/FFDAB9/000000?text=Cơm+Gà' },
    { id: 11, name: 'Cơm chiên dương châu', price: 38000, category: 'rice', image: 'https://via.placeholder.com/150x100/F0F8FF/000000?text=Cơm+Chiên' },
    { id: 12, name: 'Cơm bò lúc lắc', price: 55000, category: 'rice', image: 'https://via.placeholder.com/150x100/8B4513/FFFFFF?text=Cơm+Bò' },
    { id: 13, name: 'Cơm tôm rang me', price: 48000, category: 'rice', image: 'https://via.placeholder.com/150x100/FF1493/FFFFFF?text=Cơm+Tôm' },
    
    // Đồ uống
    { id: 14, name: 'Trà đá', price: 5000, category: 'drinks', image: 'https://via.placeholder.com/150x100/87CEEB/000000?text=Trà+Đá' },
    { id: 15, name: 'Coca Cola', price: 12000, category: 'drinks', image: 'https://via.placeholder.com/150x100/DC143C/FFFFFF?text=Coca+Cola' },
    { id: 16, name: 'Pepsi', price: 12000, category: 'drinks', image: 'https://via.placeholder.com/150x100/0000FF/FFFFFF?text=Pepsi' },
    { id: 17, name: 'Nước chanh', price: 8000, category: 'drinks', image: 'https://via.placeholder.com/150x100/FFFF00/000000?text=Nước+Chanh' },
    { id: 18, name: 'Sinh tố bơ', price: 25000, category: 'drinks', image: 'https://via.placeholder.com/150x100/90EE90/000000?text=Sinh+Tố+Bơ' },
    { id: 19, name: 'Cà phê đen', price: 15000, category: 'drinks', image: 'https://via.placeholder.com/150x100/8B4513/FFFFFF?text=Cà+Phê+Đen' },
    { id: 20, name: 'Cà phê sữa', price: 18000, category: 'drinks', image: 'https://via.placeholder.com/150x100/D2B48C/000000?text=Cà+Phê+Sữa' },
    { id: 21, name: 'Nước cam tươi', price: 20000, category: 'drinks', image: 'https://via.placeholder.com/150x100/FFA500/000000?text=Nước+Cam' },
    { id: 22, name: 'Trà sữa trân châu', price: 30000, category: 'drinks', image: 'https://via.placeholder.com/150x100/DEB887/000000?text=Trà+Sữa' },
    
    // Tráng miệng
    { id: 23, name: 'Chè ba màu', price: 15000, category: 'snacks', image: 'https://via.placeholder.com/150x100/FF69B4/FFFFFF?text=Chè+Ba+Màu' },
    { id: 24, name: 'Bánh flan', price: 12000, category: 'snacks', image: 'https://via.placeholder.com/150x100/FFFFE0/000000?text=Bánh+Flan' },
    { id: 25, name: 'Kem tươi', price: 18000, category: 'snacks', image: 'https://via.placeholder.com/150x100/F0FFFF/000000?text=Kem+Tươi' },
    { id: 26, name: 'Chè đậu xanh', price: 12000, category: 'snacks', image: 'https://via.placeholder.com/150x100/32CD32/000000?text=Chè+Đậu' },
    { id: 27, name: 'Bánh tiramisu', price: 25000, category: 'snacks', image: 'https://via.placeholder.com/150x100/8B4513/FFFFFF?text=Tiramisu' },
    { id: 28, name: 'Yaourt dâu', price: 15000, category: 'snacks', image: 'https://via.placeholder.com/150x100/FFB6C1/000000?text=Yaourt+Dâu' }
];

// Mock data for orders
let orders = [
    {
        id: 'ORD-001',
        tableId: 2,
        tableName: 'Bàn 2',
        items: [
            { id: 1, name: 'Phở bò tái', price: 60000, quantity: 2 },
            { id: 14, name: 'Trà đá', price: 5000, quantity: 2 }
        ],
        notes: 'Không hành',
        status: 'cooking',
        createdAt: new Date(Date.now() - 30 * 60000),
        subtotal: 130000,
        vat: 13000,
        total: 143000
    },
    {
        id: 'ORD-002',
        tableId: 4,
        tableName: 'Bàn 4',
        items: [
            { id: 8, name: 'Cơm tấm sườn nướng', price: 40000, quantity: 1 },
            { id: 15, name: 'Coca Cola', price: 12000, quantity: 1 }
        ],
        notes: '',
        status: 'ready',
        createdAt: new Date(Date.now() - 45 * 60000),
        subtotal: 52000,
        vat: 5200,
        total: 57200
    },
    {
        id: 'ORD-003',
        tableId: 6,
        tableName: 'Bàn 6',
        items: [
            { id: 3, name: 'Bún chả Hà Nội', price: 45000, quantity: 3 },
            { id: 9, name: 'Cơm rang thập cẩm', price: 35000, quantity: 2 },
            { id: 16, name: 'Pepsi', price: 12000, quantity: 3 }
        ],
        notes: 'Ít cay, không rau mùi',
        status: 'pending',
        createdAt: new Date(Date.now() - 10 * 60000),
        subtotal: 241000,
        vat: 24100,
        total: 265100
    },
    {
        id: 'ORD-004',
        tableId: 9,
        tableName: 'Bàn 9',
        items: [
            { id: 12, name: 'Cơm bò lúc lắc', price: 55000, quantity: 1 },
            { id: 20, name: 'Cà phê sữa', price: 18000, quantity: 1 }
        ],
        notes: '',
        status: 'completed',
        createdAt: new Date(Date.now() - 75 * 60000),
        subtotal: 73000,
        vat: 7300,
        total: 80300
    },
    {
        id: 'ORD-005',
        tableId: 12,
        tableName: 'Bàn 12',
        items: [
            { id: 5, name: 'Mì Quảng', price: 52000, quantity: 2 },
            { id: 22, name: 'Trà sữa trân châu', price: 30000, quantity: 2 }
        ],
        notes: 'Ít đường',
        status: 'cooking',
        createdAt: new Date(Date.now() - 20 * 60000),
        subtotal: 164000,
        vat: 16400,
        total: 180400
    }
];

let currentTable = null;
let currentOrder = [];
let selectedCategory = 'all';
let selectedTableId = null;
let selectedTableName = '';

let currentViewOrder = null;
let currentSection = 'tables'; // 'tables' or 'orders'

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    renderTables();
    renderMenuCategories();
    renderMenuItems();
    setupSearch();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Modal event listeners
    const orderModal = document.getElementById('orderModal');
    if (orderModal) {
        orderModal.addEventListener('hidden.bs.modal', function() {
            // Reset modal state when closed
            currentOrder = [];
            selectedCategory = 'all';
            updateOrderSummary();
            
            // Reset search
            const searchInput = document.getElementById('menuSearch');
            if (searchInput) {
                searchInput.value = '';
            }
            
            // Reset categories
            renderMenuCategories();
            renderMenuItems();
        });
        
        orderModal.addEventListener('shown.bs.modal', function() {
            // Focus on search input when modal opens
            const searchInput = document.getElementById('menuSearch');
            if (searchInput) {
                setTimeout(() => searchInput.focus(), 100);
            }
        });
    }
    
    // Submit order button
    const submitBtn = document.getElementById('submitOrder');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitOrder);
    }
    
    // Navigation event listeners
    const tablesBtn = document.getElementById('tablesManagementBtn');
    const ordersBtn = document.getElementById('ordersManagementBtn');
    
    if (tablesBtn) {
        tablesBtn.addEventListener('click', switchToTablesManagement);
    }
    
    if (ordersBtn) {
        ordersBtn.addEventListener('click', switchToOrdersManagement);
    }
    
    // Filter event listeners
    const statusFilter = document.getElementById('orderStatusFilter');
    const tableFilter = document.getElementById('orderTableFilter');
    const searchInput = document.getElementById('orderSearch');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', renderOrders);
    }
    
    if (tableFilter) {
        tableFilter.addEventListener('change', renderOrders);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', renderOrders);
    }
});

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
}

function getTimeElapsed(startTime) {
    if (!startTime) return '';
    
    const now = new Date();
    const elapsed = Math.floor((now - startTime) / (1000 * 60)); // minutes
    
    if (elapsed < 60) {
        return `${elapsed}p`;
    } else {
        const hours = Math.floor(elapsed / 60);
        const minutes = elapsed % 60;
        return minutes > 0 ? `${hours}h${minutes}p` : `${hours}h`;
    }
}

function updateStats() {
    const emptyTables = tables.filter(t => t.status === 'empty').length;
    const occupiedTables = tables.filter(t => t.status === 'occupied').length;
    const cleaningTables = tables.filter(t => t.status === 'cleaning').length;
    const totalTables = tables.length;
    
    document.getElementById('emptyTables').textContent = emptyTables;
    document.getElementById('occupiedTables').textContent = occupiedTables;
    document.getElementById('cleaningTables').textContent = cleaningTables;
    document.getElementById('totalTables').textContent = totalTables;
}

function renderTables() {
    const container = document.getElementById('tablesGrid');
    
    container.innerHTML = tables.map(table => {
        const timeElapsed = getTimeElapsed(table.startTime);
        const statusText = {
            empty: 'Trống',
            occupied: 'Đang phục vụ',
            cleaning: 'Cần dọn'
        }[table.status];
        
        return `
            <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <div class="table-card ${table.status}" onclick="handleTableClick(${table.id})">
                    <div class="status-indicator ${table.status}"></div>
                    ${timeElapsed ? `<div class="table-time">${timeElapsed}</div>` : ''}
                    <div class="table-number">Bàn ${table.id}</div>
                    <div class="table-status ${table.status}">${statusText}</div>
                    ${table.status === 'occupied' ? `
                        <div class="text-center px-2 pb-2">
                            <small class="text-muted">${table.customers} khách</small>
                            <div class="fw-bold text-primary">${formatCurrency(table.orderTotal)}</div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    // Re-initialize Lucide icons
    lucide.createIcons();
}

function handleTableClick(tableId) {
    const table = tables.find(t => t.id === tableId);
    currentTable = table;
    
    if (table.status === 'empty') {
        // Open order modal for new order
        openOrderModal(table);
    } else if (table.status === 'occupied' || table.status === 'cleaning') {
        // Open table actions modal
        openTableActionsModal(table);
    }
}

function openOrderModal(table) {
    selectedTableId = table.id;
    selectedTableName = `Bàn ${table.id}`;
    currentOrder = [];
    selectedCategory = 'all';
    
    document.getElementById('modalTableName').textContent = selectedTableName;
    const notesEl = document.getElementById('orderNotes');
    if (notesEl) {
        notesEl.value = ''; // Clear notes
    }
    
    renderMenuCategories();
    renderMenuItems();
    updateOrderSummary();
    
    const modal = new bootstrap.Modal(document.getElementById('orderModal'));
    modal.show();
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function openTableActionsModal(table) {
    document.getElementById('actionsTableName').textContent = `Bàn ${table.id}`;
    
    const modal = new bootstrap.Modal(document.getElementById('tableActionsModal'));
    modal.show();
    
    // Re-initialize Lucide icons
    lucide.createIcons();
}

function renderMenuCategories() {
    const categories = [
        { id: 'all', name: 'Tất cả món', icon: 'utensils', count: menuItems.length },
        { id: 'noodles', name: 'Mì & Phở', icon: 'bowl', count: menuItems.filter(item => item.category === 'noodles').length },
        { id: 'rice', name: 'Cơm', icon: 'wheat', count: menuItems.filter(item => item.category === 'rice').length },
        { id: 'drinks', name: 'Đồ uống', icon: 'coffee', count: menuItems.filter(item => item.category === 'drinks').length },
        { id: 'snacks', name: 'Tráng miệng', icon: 'cookie', count: menuItems.filter(item => item.category === 'snacks').length }
    ];
    
    const categoriesContainer = document.getElementById('menuCategories');
    categoriesContainer.innerHTML = categories.map(category => `
        <button type="button" class="category-btn ${category.id === 'all' ? 'active' : ''}" data-category="${category.id}">
            <i data-lucide="${category.icon}" style="width: 16px; height: 16px;"></i>
            <span>${category.name}</span>
            <div class="category-count">${category.count}</div>
        </button>
    `).join('');
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Add event listeners
    categoriesContainer.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all buttons
            categoriesContainer.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            e.currentTarget.classList.add('active');
            
            const category = e.currentTarget.dataset.category;
            filterMenuItems(category);
        });
    });
}

function renderMenuItems() {
    const menuContainer = document.getElementById('menuItems');
    if (!menuContainer) return;
    
    let filteredItems = menuItems;
    
    // Filter by selected category
    if (selectedCategory && selectedCategory !== 'all') {
        filteredItems = menuItems.filter(item => item.category === selectedCategory);
    }
    
    renderFilteredMenuItems(filteredItems);
}

function getCategoryName(category) {
    const categoryNames = {
        noodles: 'Mì & Phở',
        rice: 'Cơm',
        drinks: 'Đồ uống',
        snacks: 'Tráng miệng'
    };
    return categoryNames[category] || category;
}

function addToOrder(itemId) {
    const existingItem = currentOrder.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        currentOrder.push({
            id: itemId,
            quantity: 1
        });
    }
    
    updateOrderSummary();
    
    // Add visual feedback
    const menuItem = document.querySelector(`[onclick="addToOrder(${itemId})"]`);
    if (menuItem) {
        menuItem.style.animation = 'none';
        menuItem.offsetHeight; // Trigger reflow
        menuItem.style.animation = 'pulse 0.3s ease';
    }
}

function increaseQuantity(itemId) {
    const orderItem = currentOrder.find(item => item.id === itemId);
    if (orderItem) {
        orderItem.quantity += 1;
        updateOrderSummary();
    }
}

function decreaseQuantity(itemId) {
    const orderItem = currentOrder.find(item => item.id === itemId);
    if (orderItem) {
        if (orderItem.quantity > 1) {
            orderItem.quantity -= 1;
        } else {
            // Remove item if quantity becomes 0
            const index = currentOrder.findIndex(item => item.id === itemId);
            if (index > -1) {
                currentOrder.splice(index, 1);
            }
        }
        updateOrderSummary();
    }
}

function updateOrderSummary() {
    const orderContainer = document.getElementById('orderItems');
    const orderCount = document.getElementById('orderItemCount');
    const subtotalEl = document.getElementById('subtotal');
    const vatEl = document.getElementById('vatAmount');
    const totalEl = document.getElementById('orderTotal');
    const submitBtn = document.getElementById('submitOrder');
    
    if (!orderContainer) return;
    
    if (currentOrder.length === 0) {
        orderContainer.innerHTML = `
            <div class="empty-order">
                <div class="text-center py-5">
                    <div class="empty-cart-icon mb-3">
                        <i data-lucide="shopping-cart" style="width: 48px; height: 48px;"></i>
                    </div>
                    <p class="text-muted mb-0">Chưa có món nào</p>
                    <small class="text-muted">Chọn món từ thực đơn</small>
                </div>
            </div>
        `;
        
        if (orderCount) orderCount.textContent = '0';
        if (subtotalEl) subtotalEl.textContent = '0₫';
        if (vatEl) vatEl.textContent = '0₫';
        if (totalEl) totalEl.textContent = '0₫';
        if (submitBtn) submitBtn.disabled = true;
        
    } else {
        orderContainer.innerHTML = currentOrder.map(orderItem => {
            const menuItem = menuItems.find(item => item.id === orderItem.id);
            return `
                <div class="order-item-new">
                    <div class="order-item-image-new">
                        <img src="${menuItem.image}" alt="${menuItem.name}">
                    </div>
                    <div class="order-item-info-new">
                        <div class="order-item-name-new">${menuItem.name}</div>
                        <div class="order-item-price-new">${formatCurrency(menuItem.price)} x ${orderItem.quantity}</div>
                        <div class="order-item-total-new">${formatCurrency(menuItem.price * orderItem.quantity)}</div>
                    </div>
                    <div class="quantity-controls-new">
                        <button class="quantity-btn-new" onclick="decreaseQuantity(${orderItem.id})">-</button>
                        <span class="quantity-display-new">${orderItem.quantity}</span>
                        <button class="quantity-btn-new" onclick="increaseQuantity(${orderItem.id})">+</button>
                    </div>
                </div>
            `;
        }).join('');
        
        const subtotal = currentOrder.reduce((sum, orderItem) => {
            const menuItem = menuItems.find(item => item.id === orderItem.id);
            return sum + (menuItem.price * orderItem.quantity);
        }, 0);
        
        const vat = Math.round(subtotal * 0.1);
        const total = subtotal + vat;
        
        if (orderCount) {
            orderCount.textContent = currentOrder.reduce((sum, item) => sum + item.quantity, 0);
            orderCount.classList.add('updated');
            setTimeout(() => orderCount.classList.remove('updated'), 600);
        }
        
        if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
        if (vatEl) vatEl.textContent = formatCurrency(vat);
        if (totalEl) totalEl.textContent = formatCurrency(total);
        if (submitBtn) submitBtn.disabled = false;
    }
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function showSuccessMessage(title, message) {
    const successTitleEl = document.getElementById('successTitle');
    const successMessageEl = document.getElementById('successMessage');
    
    if (successTitleEl) successTitleEl.textContent = title;
    if (successMessageEl) successMessageEl.textContent = message;
    
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
    
    // Re-initialize Lucide icons
    setTimeout(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 100);
}

function submitOrder() {
    if (currentOrder.length === 0) return;
    
    const submitBtn = document.getElementById('submitOrder');
    const notes = document.getElementById('orderNotes').value.trim();
    
    // Show loading state
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;
    
    // Calculate totals
    const subtotal = currentOrder.reduce((sum, orderItem) => {
        const menuItem = menuItems.find(item => item.id === orderItem.id);
        return sum + (menuItem.price * orderItem.quantity);
    }, 0);
    
    const total = subtotal + Math.round(subtotal * 0.1); // Including VAT
    
    // Simulate API call
    setTimeout(() => {
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
        
        // Update table status
        const table = tables.find(t => t.id === selectedTableId);
        if (table) {
            table.status = 'occupied';
            table.customers = Math.max(table.customers || 0, 2); // Default to 2 customers
            table.startTime = new Date();
            table.orderTotal = total;
            table.hasOrder = true;
        }
        
        // Update table display
        renderTables();
        updateStats();
        
        // Show success modal
        showSuccessMessage(
            'Đơn hàng đã được tạo thành công!', 
            `${selectedTableName} - Tổng: ${formatCurrency(total)}${notes ? `\nGhi chú: ${notes}` : ''}`
        );
        
        // Close order modal
        const orderModal = bootstrap.Modal.getInstance(document.getElementById('orderModal'));
        if (orderModal) {
            orderModal.hide();
        }
        
        // Reset order
        currentOrder = [];
        selectedCategory = 'all';
        selectedTableId = null;
        selectedTableName = '';
        
    }, 1500);
}

// Table action functions
function cleanTable() {
    if (!currentTable) return;
    
    const tableIndex = tables.findIndex(t => t.id === currentTable.id);
    if (tableIndex > -1) {
        tables[tableIndex] = {
            ...tables[tableIndex],
            status: 'empty',
            startTime: null,
            orderTotal: 0,
            customers: 0
        };
    }
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('tableActionsModal'));
    modal.hide();
    
    // Show success
    showSuccess('Bàn đã được dọn!', `Bàn ${currentTable.id} đã sẵn sàng phục vụ khách mới.`);
    
    // Update UI
    updateStats();
    renderTables();
    currentTable = null;
}

function addOrder() {
    if (!currentTable) return;
    
    // Close actions modal
    const actionsModal = bootstrap.Modal.getInstance(document.getElementById('tableActionsModal'));
    actionsModal.hide();
    
    // Open order modal
    setTimeout(() => {
        openOrderModal(currentTable);
    }, 300);
}

function callWaiter() {
    if (!currentTable) return;
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('tableActionsModal'));
    modal.hide();
    
    // Show notification
    showSuccess('Đã gọi phục vụ!', `Nhân viên sẽ đến Bàn ${currentTable.id} ngay lập tức.`);
    
    currentTable = null;
}

function switchToTablesManagement() {
    currentSection = 'tables';
    document.getElementById('tablesManagement').classList.remove('d-none');
    document.getElementById('ordersManagement').classList.add('d-none');
    document.getElementById('pageTitle').textContent = 'Quản lý bàn';
    
    // Update nav buttons
    document.getElementById('tablesManagementBtn').classList.add('nav-button-active');
    document.getElementById('ordersManagementBtn').classList.remove('nav-button-active');
}

function switchToOrdersManagement() {
    currentSection = 'orders';
    document.getElementById('tablesManagement').classList.add('d-none');
    document.getElementById('ordersManagement').classList.remove('d-none');
    document.getElementById('pageTitle').textContent = 'Quản lý Order';
    
    // Update nav buttons
    document.getElementById('tablesManagementBtn').classList.remove('nav-button-active');
    document.getElementById('ordersManagementBtn').classList.add('nav-button-active');
    
    // Initialize orders data
    updateOrdersStats();
    renderOrders();
    populateTableFilter();
}

function updateOrdersStats() {
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const cookingCount = orders.filter(o => o.status === 'cooking').length;
    const readyCount = orders.filter(o => o.status === 'ready').length;
    const completedCount = orders.filter(o => o.status === 'completed').length;
    
    document.getElementById('pendingOrders').textContent = pendingCount;
    document.getElementById('cookingOrders').textContent = cookingCount;
    document.getElementById('readyOrders').textContent = readyCount;
    document.getElementById('completedOrders').textContent = completedCount;
}

function getStatusBadge(status) {
    const statusConfig = {
        pending: { class: 'bg-warning', text: 'Chờ xác nhận' },
        cooking: { class: 'bg-info', text: 'Đang nấu' },
        ready: { class: 'bg-success', text: 'Sẵn sàng' },
        completed: { class: 'bg-primary', text: 'Hoàn thành' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', text: 'Không xác định' };
    return `<span class="badge ${config.class}">${config.text}</span>`;
}

function renderOrders() {
    const tbody = document.getElementById('ordersTableBody');
    const noOrdersMessage = document.getElementById('noOrdersMessage');
    
    // Apply filters
    let filteredOrders = [...orders];
    
    const statusFilter = document.getElementById('orderStatusFilter')?.value;
    const tableFilter = document.getElementById('orderTableFilter')?.value;
    const searchTerm = document.getElementById('orderSearch')?.value?.toLowerCase();
    
    if (statusFilter && statusFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }
    
    if (tableFilter && tableFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.tableId.toString() === tableFilter);
    }
    
    if (searchTerm) {
        filteredOrders = filteredOrders.filter(order => 
            order.id.toLowerCase().includes(searchTerm) ||
            order.tableName.toLowerCase().includes(searchTerm) ||
            order.items.some(item => item.name.toLowerCase().includes(searchTerm))
        );
    }
    
    if (filteredOrders.length === 0) {
        tbody.innerHTML = '';
        noOrdersMessage.classList.remove('d-none');
        return;
    }
    
    noOrdersMessage.classList.add('d-none');
    
    tbody.innerHTML = filteredOrders.map(order => {
        const itemsPreview = order.items.slice(0, 2).map(item => 
            `${item.name} (${item.quantity})`
        ).join(', ');
        const remainingItems = order.items.length > 2 ? ` và ${order.items.length - 2} món khác` : '';
        
        return `
            <tr>
                <td class="px-4 py-3">
                    <div class="fw-bold text-primary">${order.id}</div>
                </td>
                <td class="py-3">
                    <div class="fw-medium">${order.tableName}</div>
                </td>
                <td class="py-3">
                    <div>${order.createdAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                    <small class="text-muted">${order.createdAt.toLocaleDateString('vi-VN')}</small>
                </td>
                <td class="py-3">
                    <div class="small">${itemsPreview}${remainingItems}</div>
                    <small class="text-muted">${order.items.length} món</small>
                </td>
                <td class="py-3">
                    <div class="fw-bold">${formatCurrency(order.total)}</div>
                </td>
                <td class="py-3">
                    ${getStatusBadge(order.status)}
                </td>
                <td class="py-3">
                    <div class="d-flex gap-1">
                        <button class="btn btn-outline-primary btn-sm" onclick="viewOrderDetail('${order.id}')" title="Xem chi tiết">
                            <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
                        </button>
                        ${order.status !== 'completed' ? `
                            <button class="btn btn-outline-warning btn-sm" onclick="editOrderInline('${order.id}')" title="Chỉnh sửa">
                                <i data-lucide="edit" style="width: 14px; height: 14px;"></i>
                            </button>
                        ` : ''}
                        ${order.status === 'ready' ? `
                            <button class="btn btn-outline-success btn-sm" onclick="markOrderCompleted('${order.id}')" title="Hoàn thành">
                                <i data-lucide="check" style="width: 14px; height: 14px;"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function populateTableFilter() {
    const tableFilter = document.getElementById('orderTableFilter');
    if (!tableFilter) return;
    
    // Clear existing options except "Tất cả bàn"
    tableFilter.innerHTML = '<option value="all">Tất cả bàn</option>';
    
    // Add table options
    tables.forEach(table => {
        const option = document.createElement('option');
        option.value = table.id;
        option.textContent = `Bàn ${table.id}`;
        tableFilter.appendChild(option);
    });
}

function viewOrderDetail(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    currentViewOrder = order;
    
    // Populate modal with order details
    document.getElementById('detailOrderId').textContent = order.id;
    document.getElementById('detailTableNumber').textContent = order.tableName;
    document.getElementById('detailOrderTime').textContent = order.createdAt.toLocaleString('vi-VN');
    document.getElementById('detailOrderStatus').innerHTML = getStatusBadge(order.status);
    document.getElementById('detailOrderNotes').textContent = order.notes || 'Không có ghi chú';
    document.getElementById('detailSubtotal').textContent = formatCurrency(order.subtotal);
    document.getElementById('detailVat').textContent = formatCurrency(order.vat);
    document.getElementById('detailTotal').textContent = formatCurrency(order.total);
    
    // Render order items
    const itemsContainer = document.getElementById('detailOrderItems');
    itemsContainer.innerHTML = order.items.map(item => `
        <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
            <div>
                <div class="fw-medium">${item.name}</div>
                <small class="text-muted">${formatCurrency(item.price)} x ${item.quantity}</small>
            </div>
            <div class="fw-bold">${formatCurrency(item.price * item.quantity)}</div>
        </div>
    `).join('');
    
    // Update modal buttons based on status
    const editBtn = document.getElementById('editOrderBtn');
    const updateStatusBtn = document.getElementById('updateOrderStatusBtn');
    
    if (order.status === 'completed') {
        editBtn.style.display = 'none';
        updateStatusBtn.style.display = 'none';
    } else {
        editBtn.style.display = 'inline-flex';
        updateStatusBtn.style.display = 'inline-flex';
        
        // Update status button text based on current status
        if (order.status === 'pending') {
            updateStatusBtn.innerHTML = '<i data-lucide="check" style="width: 16px; height: 16px;"></i> Xác nhận';
        } else if (order.status === 'cooking') {
            updateStatusBtn.innerHTML = '<i data-lucide="check" style="width: 16px; height: 16px;"></i> Sẵn sàng';
        } else if (order.status === 'ready') {
            updateStatusBtn.innerHTML = '<i data-lucide="check" style="width: 16px; height: 16px;"></i> Hoàn thành';
        }
    }
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('orderDetailModal'));
    modal.show();
}

function editOrder() {
    if (!currentViewOrder) return;
    
    // Close detail modal
    const detailModal = bootstrap.Modal.getInstance(document.getElementById('orderDetailModal'));
    detailModal.hide();
    
    // Set up order modal for editing
    selectedTableId = currentViewOrder.tableId;
    selectedTableName = currentViewOrder.tableName;
    currentOrder = [...currentViewOrder.items];
    
    // Update modal title
    document.getElementById('modalTableName').textContent = selectedTableName;
    
    // Update order summary
    updateOrderSummary();
    
    // Show order modal
    const orderModal = new bootstrap.Modal(document.getElementById('orderModal'));
    orderModal.show();
}

function updateOrderStatus() {
    if (!currentViewOrder) return;
    
    const order = orders.find(o => o.id === currentViewOrder.id);
    if (!order) return;
    
    // Progress status
    const statusFlow = ['pending', 'cooking', 'ready', 'completed'];
    const currentIndex = statusFlow.indexOf(order.status);
    
    if (currentIndex < statusFlow.length - 1) {
        order.status = statusFlow[currentIndex + 1];
          // Update table status if order is completed
        if (order.status === 'completed') {
            const table = tables.find(t => t.id === order.tableId);
            if (table) {
                table.status = 'cleaning';
            }
        }
        
        // Refresh data
        updateOrdersStats();
        renderOrders();
        updateStats();
        renderTables();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('orderDetailModal'));
        modal.hide();
        
        // Show success message
        showSuccess('Trạng thái đã được cập nhật!', `Order ${order.id} đã chuyển sang trạng thái mới.`);
    }
}

function editOrderInline(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    viewOrderDetail(orderId);
}

function markOrderCompleted(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    order.status = 'completed';
    
    // Update table status
    const table = tables.find(t => t.id === order.tableId);
    if (table) {
        table.status = 'cleaning';
    }
    
    // Refresh data
    updateOrdersStats();
    renderOrders();
    updateStats();
    renderTables();
    
    showSuccess('Order đã hoàn thành!', `Order ${order.id} đã được đánh dấu hoàn thành.`);
}

function showCreateOrderModal() {
    // Populate table select with available tables
    const tableSelect = document.getElementById('selectTableForOrder');
    tableSelect.innerHTML = '<option value="">-- Chọn bàn --</option>';
    
    tables.forEach(table => {
        const option = document.createElement('option');
        option.value = table.id;
        option.textContent = `Bàn ${table.id} (${table.status === 'empty' ? 'Trống' : table.status === 'occupied' ? 'Đang phục vụ' : 'Cần dọn'})`;
        tableSelect.appendChild(option);
    });
    
    const modal = new bootstrap.Modal(document.getElementById('createOrderModal'));
    modal.show();
}

function proceedToCreateOrder() {
    const tableSelect = document.getElementById('selectTableForOrder');
    const selectedTableId = parseInt(tableSelect.value);
    
    if (!selectedTableId) {
        alert('Vui lòng chọn bàn');
        return;
    }
    
    // Close create order modal
    const createModal = bootstrap.Modal.getInstance(document.getElementById('createOrderModal'));
    createModal.hide();
    
    // Switch to table management and open order modal
    switchToTablesManagement();
    
    setTimeout(() => {
        openOrderModal(selectedTableId);
    }, 300);
}

function refreshOrders() {
    updateOrdersStats();
    renderOrders();
    showSuccess('Đã làm mới!', 'Danh sách order đã được cập nhật.');
}

function showSuccess(title, message) {
    document.getElementById('successTitle').textContent = title;
    document.getElementById('successMessage').textContent = message;
    
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('menuSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterMenuItemsBySearch(searchTerm);
        });
    }
}

function filterMenuItemsBySearch(searchTerm) {
    const menuContainer = document.getElementById('menuItems');
    if (!menuContainer) return;
    
    let filteredItems = menuItems;
    
    // Filter by category first
    if (selectedCategory && selectedCategory !== 'all') {
        filteredItems = filteredItems.filter(item => item.category === selectedCategory);
    }
    
    // Then filter by search term
    if (searchTerm) {
        filteredItems = filteredItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm)
        );
    }
    
    renderFilteredMenuItems(filteredItems);
}

function renderFilteredMenuItems(items) {
    const menuContainer = document.getElementById('menuItems');
    if (!menuContainer) return;
    
    if (items.length === 0) {
        menuContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="text-muted">
                    <i data-lucide="search-x" style="width: 48px; height: 48px;" class="mb-3 opacity-50"></i>
                    <p class="mb-0">Không tìm thấy món ăn</p>
                    <small>Thử từ khóa khác</small>
                </div>
            </div>
        `;
    } else {
        menuContainer.innerHTML = items.map(item => `
            <div class="menu-item" data-category="${item.category}" onclick="addToOrder(${item.id})">
                <div class="menu-item-image-wrapper">
                    <img src="${item.image}" alt="${item.name}" class="menu-item-image">
                    <div class="menu-item-category-badge">${getCategoryName(item.category)}</div>
                    <div class="menu-item-overlay">
                        <i data-lucide="plus" class="menu-add-icon"></i>
                    </div>
                </div>
                <div class="menu-item-content">
                    <div class="menu-item-name">${item.name}</div>
                    <div class="menu-item-price">${formatCurrency(item.price)}</div>
                </div>
            </div>
        `).join('');
    }
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}