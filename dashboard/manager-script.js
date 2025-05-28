// Manager Dashboard JavaScript

// Global Variables & Data
let managerStaffData = [
    {
        id: 'NV001',
        name: 'Nguyễn Văn An',
        position: 'Thu ngân',
        phone: '0123456789',
        email: 'van.an@restaurant.com',
        status: 'active',
        startDate: '2023-01-15',
        salary: 8000000
    },
    {
        id: 'NV002',
        name: 'Trần Thị Bình',
        position: 'Phục vụ',
        phone: '0987654321',
        email: 'thi.binh@restaurant.com',
        status: 'active',
        startDate: '2023-02-01',
        salary: 7000000
    },
    {
        id: 'NV003',
        name: 'Lê Minh Cường',
        position: 'Đầu bếp',
        phone: '0369852147',
        email: 'minh.cuong@restaurant.com',
        status: 'busy',
        startDate: '2022-12-01',
        salary: 12000000
    },
    {
        id: 'NV004',
        name: 'Phạm Thị Dung',
        position: 'Phục vụ',
        phone: '0147258369',
        email: 'thi.dung@restaurant.com',
        status: 'inactive',
        startDate: '2023-03-15',
        salary: 7000000
    }
];

let managerMenuData = [
    {
        id: 'MN001',
        name: 'Phở bò tái',
        category: 'Mì & Phở',
        price: 60000,
        ingredients: ['Bánh phở', 'Thịt bò', 'Hành lá', 'Nước dúng'],
        image: 'https://via.placeholder.com/200x150?text=Phở+Bò',
        status: 'active',
        cost: 35000
    },
    {
        id: 'MN002',
        name: 'Cơm rang thập cẩm',
        category: 'Cơm',
        price: 45000,
        ingredients: ['Cơm', 'Tôm', 'Xúc xích', 'Trứng', 'Rau củ'],
        image: 'https://via.placeholder.com/200x150?text=Cơm+Rang',
        status: 'active',
        cost: 25000
    },
    {
        id: 'MN003',
        name: 'Trà đá',
        category: 'Đồ uống',
        price: 5000,
        ingredients: ['Trà', 'Đá', 'Đường'],
        image: 'https://via.placeholder.com/200x150?text=Trà+Đá',
        status: 'active',
        cost: 2000
    },
    {
        id: 'MN004',
        name: 'Bánh flan',
        category: 'Tráng miệng',
        price: 15000,
        ingredients: ['Trứng', 'Sữa', 'Đường', 'Vani'],
        image: 'https://via.placeholder.com/200x150?text=Bánh+Flan',
        status: 'active',
        cost: 8000
    }
];

let managerInventoryData = [
    {
        id: 'NL001',
        name: 'Thịt bò',
        unit: 'kg',
        standardAmount: 20,
        currentStock: 15,
        usedToday: 8,
        threshold: 10,
        cost: 250000
    },
    {
        id: 'NL002',
        name: 'Bánh phở',
        unit: 'kg',
        standardAmount: 50,
        currentStock: 35,
        usedToday: 25,
        threshold: 20,
        cost: 15000
    },
    {
        id: 'NL003',
        name: 'Cơm',
        unit: 'kg',
        standardAmount: 30,
        currentStock: 12,
        usedToday: 18,
        threshold: 15,
        cost: 20000
    },
    {
        id: 'NL004',
        name: 'Tôm',
        unit: 'kg',
        standardAmount: 10,
        currentStock: 3,
        usedToday: 5,
        threshold: 5,
        cost: 300000
    }
];

let managerSalesData = {
    today: {
        revenue: 2450000,
        orders: 45,
        customers: 38,
        activeTables: 8
    },
    weekly: [1800000, 2100000, 1950000, 2300000, 2650000, 2450000, 2200000],
    topDishes: [
        { name: 'Phở bò tái', sold: 25, revenue: 1500000 },
        { name: 'Cơm rang thập cẩm', sold: 18, revenue: 810000 },
        { name: 'Bún chả', sold: 15, revenue: 675000 },
        { name: 'Bánh mì', sold: 12, revenue: 300000 }
    ]
};

// Charts
let revenueChart, topDishesChart, categoryRevenueChart;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    showTab('dashboard');
    updateDashboardStats();
    initializeCharts();
    renderStaffTable();
    renderMenuItems();
    renderInventoryTable();
    updateAnalytics();
    updateInventoryAlerts();
    setupEventListeners();
});

// Tab Management
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('nav-button-active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Set active nav button (find the button that called this function)
    const buttons = document.querySelectorAll('.nav-button');
    buttons.forEach(btn => {
        if (btn.onclick && btn.onclick.toString().includes(`showTab('${tabName}')`)) {
            btn.classList.add('nav-button-active');
        }
    });
    
    // Update page title
    const titles = {
        dashboard: 'Tổng quan hệ thống',
        staff: 'Quản lý nhân viên',
        reports: 'Báo cáo',
        analytics: 'Thống kê nâng cao',
        menu: 'Quản lý thực đơn',
        inventory: 'Kiểm soát định lượng'
    };
    
    const titleElement = document.getElementById('pageTitle');
    if (titleElement) {
        titleElement.textContent = titles[tabName] || 'Hệ thống quản lý';
    }
}

// Dashboard Functions
function updateDashboardStats() {
    const todayRevenue = document.getElementById('todayRevenue');
    const todayOrders = document.getElementById('todayOrders');
    const activeStaff = document.getElementById('activeStaff');
    const activeTables = document.getElementById('activeTables');
    
    if (todayRevenue) {
        todayRevenue.textContent = formatCurrency(managerSalesData.today.revenue);
    }
    if (todayOrders) {
        todayOrders.textContent = managerSalesData.today.orders.toString();
    }
    if (activeStaff) {
        const activeStaffCount = managerStaffData.filter(staff => staff.status === 'active').length;
        activeStaff.textContent = activeStaffCount.toString();
    }
    if (activeTables) {
        activeTables.textContent = managerSalesData.today.activeTables.toString();
    }
}

function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        revenueChart = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
                datasets: [{
                    label: 'Doanh thu (VNĐ)',
                    data: managerSalesData.weekly,
                    borderColor: '#0d6efd',
                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return new Intl.NumberFormat('vi-VN').format(value) + '₫';
                            }
                        }
                    }
                }
            }
        });
    }

    // Top Dishes Chart
    const topDishesCtx = document.getElementById('topDishesChart');
    if (topDishesCtx) {
        topDishesChart = new Chart(topDishesCtx, {
            type: 'doughnut',
            data: {
                labels: managerSalesData.topDishes.map(dish => dish.name),
                datasets: [{
                    data: managerSalesData.topDishes.map(dish => dish.sold),
                    backgroundColor: [
                        '#0d6efd',
                        '#6f42c1',
                        '#d63384',
                        '#fd7e14'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Staff Management Functions
function renderStaffTable() {
    const tbody = document.getElementById('staffTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    managerStaffData.forEach(staff => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${staff.id}</td>
            <td>${staff.name}</td>
            <td>${staff.position}</td>
            <td>${staff.phone}</td>
            <td>${staff.email}</td>
            <td>
                <span class="badge ${getStatusClass(staff.status)}">
                    ${getStatusText(staff.status)}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editStaff('${staff.id}')">
                    <i data-lucide="edit" style="width: 14px; height: 14px;"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteStaff('${staff.id}')">
                    <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    lucide.createIcons();
}

function getStatusClass(status) {
    const classes = {
        active: 'bg-success',
        busy: 'bg-warning',
        inactive: 'bg-secondary'
    };
    return classes[status] || 'bg-secondary';
}

function getStatusText(status) {
    const texts = {
        active: 'Đang làm',
        busy: 'Bận',
        inactive: 'Nghỉ'
    };
    return texts[status] || 'Không xác định';
}

function showAddStaffModal() {
    const modal = new bootstrap.Modal(document.getElementById('staffModal'));
    const form = document.getElementById('staffForm');
    const title = document.getElementById('staffModalTitle');
    
    form.reset();
    document.getElementById('editStaffId').value = '';
    title.textContent = 'Thêm nhân viên mới';
    modal.show();
}

function editStaff(staffId) {
    const staff = managerStaffData.find(s => s.id === staffId);
    if (!staff) return;
    
    const modal = new bootstrap.Modal(document.getElementById('staffModal'));
    const title = document.getElementById('staffModalTitle');
    
    title.textContent = 'Chỉnh sửa nhân viên';
    document.getElementById('editStaffId').value = staff.id;
    document.getElementById('staffId').value = staff.id;
    document.getElementById('staffName').value = staff.name;
    document.getElementById('staffPosition').value = staff.position;
    document.getElementById('staffPhone').value = staff.phone;
    document.getElementById('staffEmail').value = staff.email;
    document.getElementById('staffStartDate').value = staff.startDate;
    document.getElementById('staffSalary').value = staff.salary;
    
    modal.show();
}

function deleteStaff(staffId) {
    if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
        const index = managerStaffData.findIndex(s => s.id === staffId);
        if (index > -1) {
            managerStaffData.splice(index, 1);
            renderStaffTable();
            updateDashboardStats();
            showToast('Đã xóa nhân viên thành công!', 'success');
        }
    }
}

function saveStaff() {
    const editId = document.getElementById('editStaffId').value;
    const staffData = {
        id: document.getElementById('staffId').value,
        name: document.getElementById('staffName').value,
        position: document.getElementById('staffPosition').value,
        phone: document.getElementById('staffPhone').value,
        email: document.getElementById('staffEmail').value,
        startDate: document.getElementById('staffStartDate').value,
        salary: parseInt(document.getElementById('staffSalary').value),
        status: 'active'
    };
    
    if (editId) {
        // Edit existing staff
        const index = managerStaffData.findIndex(s => s.id === editId);
        if (index > -1) {
            managerStaffData[index] = { ...managerStaffData[index], ...staffData };
            showToast('Cập nhật nhân viên thành công!', 'success');
        }
    } else {
        // Add new staff
        managerStaffData.push(staffData);
        showToast('Thêm nhân viên thành công!', 'success');
    }
    
    renderStaffTable();
    updateDashboardStats();
    bootstrap.Modal.getInstance(document.getElementById('staffModal')).hide();
}

// Reports Functions
function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (!reportType || !startDate || !endDate) {
        showToast('Vui lòng điền đầy đủ thông tin báo cáo!', 'warning');
        return;
    }
    
    const reportData = generateReportData(reportType, startDate, endDate);
    exportToExcel(reportData, `Bao_cao_${reportType}_${startDate}_${endDate}`);
    showToast('Đã tạo và tải báo cáo thành công!', 'success');
}

function generateReportData(type, startDate, endDate) {
    // Mock report data generation
    const data = [
        ['Loại báo cáo', getReportTypeText(type)],
        ['Kỳ báo cáo', `${startDate} đến ${endDate}`],
        ['Ngày tạo', new Date().toLocaleDateString('vi-VN')],
        [''],
        ['THỐNG KÊ TỔNG QUAN'],
        ['Tổng doanh thu', formatCurrency(managerSalesData.today.revenue * 7)],
        ['Tổng đơn hàng', managerSalesData.today.orders * 7],
        ['Trung bình/ngày', formatCurrency(managerSalesData.today.revenue)],
        [''],
        ['TOP MÓN BÁN CHẠY'],
        ['Tên món', 'Số lượng', 'Doanh thu']
    ];
    
    managerSalesData.topDishes.forEach(dish => {
        data.push([dish.name, dish.sold, formatCurrency(dish.revenue)]);
    });
    
    return data;
}

function getReportTypeText(type) {
    const types = {
        daily: 'Báo cáo ngày',
        weekly: 'Báo cáo tuần', 
        monthly: 'Báo cáo tháng',
        custom: 'Báo cáo tùy chỉnh'
    };
    return types[type] || 'Không xác định';
}

function exportToExcel(data, filename) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Báo cáo');
    XLSX.writeFile(wb, `${filename}.xlsx`);
}

// Analytics Functions
function updateAnalytics() {
    renderTopSellingItems();
    renderCategoryRevenueChart();
    renderDailyItemsTable();
}

function renderTopSellingItems() {
    const container = document.getElementById('topSellingItems');
    if (!container) return;
    
    container.innerHTML = '';
    
    managerSalesData.topDishes.forEach((dish, index) => {
        const item = document.createElement('div');
        item.className = 'd-flex align-items-center justify-content-between p-3 border-bottom';
        item.innerHTML = `
            <div class="d-flex align-items-center">
                <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <span class="fw-bold text-primary">${index + 1}</span>
                </div>
                <div>
                    <h6 class="mb-1">${dish.name}</h6>
                    <small class="text-muted">${dish.sold} phần</small>
                </div>
            </div>
            <div class="text-end">
                <div class="fw-bold">${formatCurrency(dish.revenue)}</div>
            </div>
        `;
        container.appendChild(item);
    });
}

function renderCategoryRevenueChart() {
    const ctx = document.getElementById('categoryRevenueChart');
    if (!ctx) return;
    
    if (categoryRevenueChart) {
        categoryRevenueChart.destroy();
    }
    
    const categories = ['Mì & Phở', 'Cơm', 'Đồ uống', 'Tráng miệng'];
    const revenues = [800000, 600000, 200000, 100000];
    
    categoryRevenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Doanh thu (VNĐ)',
                data: revenues,
                backgroundColor: [
                    '#0d6efd',
                    '#198754',
                    '#ffc107',
                    '#dc3545'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat('vi-VN').format(value) + '₫';
                        }
                    }
                }
            }
        }
    });
}

function renderDailyItemsTable() {
    const tbody = document.getElementById('dailyItemsTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    managerMenuData.forEach(item => {
        const sold = Math.floor(Math.random() * 20) + 5;
        const revenue = sold * item.price;
        const profit = revenue - (sold * item.cost);
        const profitMargin = ((profit / revenue) * 100).toFixed(1);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td><span class="badge bg-secondary">${item.category}</span></td>
            <td>${sold}</td>
            <td>${formatCurrency(revenue)}</td>
            <td class="${profit > 0 ? 'text-success' : 'text-danger'}">${formatCurrency(profit)}</td>
            <td>
                <span class="badge ${profit > 0 ? 'bg-success' : 'bg-danger'}">
                    ${profitMargin}%
                </span>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Menu Management Functions
function renderMenuItems() {
    const container = document.getElementById('menuItemsGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    managerMenuData.forEach(item => {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6';
        col.innerHTML = `
            <div class="card border-0 shadow-sm h-100">
                <img src="${item.image}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${item.name}">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0">${item.name}</h5>
                        <span class="badge ${item.status === 'active' ? 'bg-success' : 'bg-secondary'}">
                            ${item.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                        </span>
                    </div>
                    <p class="text-muted small mb-2">${item.category}</p>
                    <p class="text-primary fw-bold fs-5 mb-2">${formatCurrency(item.price)}</p>
                    <p class="text-muted small mb-3">Giá vốn: ${formatCurrency(item.cost)}</p>
                    <div class="mt-auto">
                        <div class="btn-group w-100">
                            <button class="btn btn-outline-primary btn-sm" onclick="editMenuItem('${item.id}')">
                                <i data-lucide="edit" style="width: 14px; height: 14px;"></i>
                            </button>
                            <button class="btn btn-outline-danger btn-sm" onclick="deleteMenuItem('${item.id}')">
                                <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
    
    lucide.createIcons();
}

function filterMenuByCategory() {
    const category = document.getElementById('menuCategoryFilter').value;
    const searchTerm = document.getElementById('menuSearchInput').value.toLowerCase();
    filterMenuItems(searchTerm, category);
}

function filterMenuItems(searchTerm = '', category = '') {
    if (!searchTerm) {
        searchTerm = document.getElementById('menuSearchInput') ? 
            document.getElementById('menuSearchInput').value.toLowerCase() : '';
    }
    if (!category) {
        category = document.getElementById('menuCategoryFilter') ? 
            document.getElementById('menuCategoryFilter').value : '';
    }
    
    const container = document.getElementById('menuItemsGrid');
    if (!container) return;
    
    const filteredItems = managerMenuData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || item.category === category;
        return matchesSearch && matchesCategory;
    });
    
    container.innerHTML = '';
    
    filteredItems.forEach(item => {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6';
        col.innerHTML = `
            <div class="card border-0 shadow-sm h-100">
                <img src="${item.image}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${item.name}">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0">${item.name}</h5>
                        <span class="badge ${item.status === 'active' ? 'bg-success' : 'bg-secondary'}">
                            ${item.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                        </span>
                    </div>
                    <p class="text-muted small mb-2">${item.category}</p>
                    <p class="text-primary fw-bold fs-5 mb-2">${formatCurrency(item.price)}</p>
                    <p class="text-muted small mb-3">Giá vốn: ${formatCurrency(item.cost)}</p>
                    <div class="mt-auto">
                        <div class="btn-group w-100">
                            <button class="btn btn-outline-primary btn-sm" onclick="editMenuItem('${item.id}')">
                                <i data-lucide="edit" style="width: 14px; height: 14px;"></i>
                            </button>
                            <button class="btn btn-outline-danger btn-sm" onclick="deleteMenuItem('${item.id}')">
                                <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
    
    lucide.createIcons();
}

function showAddMenuItemModal() {
    const modal = new bootstrap.Modal(document.getElementById('menuItemModal'));
    const form = document.getElementById('menuItemForm');
    const title = document.getElementById('menuModalTitle');
    
    form.reset();
    document.getElementById('editMenuId').value = '';
    title.textContent = 'Thêm món mới';
    modal.show();
}

function editMenuItem(itemId) {
    const item = managerMenuData.find(m => m.id === itemId);
    if (!item) return;
    
    const modal = new bootstrap.Modal(document.getElementById('menuItemModal'));
    const title = document.getElementById('menuModalTitle');
    
    title.textContent = 'Chỉnh sửa món ăn';
    document.getElementById('editMenuId').value = item.id;
    document.getElementById('menuId').value = item.id;
    document.getElementById('menuName').value = item.name;
    document.getElementById('menuCategory').value = item.category;
    document.getElementById('menuPrice').value = item.price;
    document.getElementById('menuCost').value = item.cost;
    document.getElementById('menuImage').value = item.image;
    document.getElementById('menuIngredients').value = item.ingredients.join(', ');
    
    modal.show();
}

function deleteMenuItem(itemId) {
    if (confirm('Bạn có chắc chắn muốn xóa món này?')) {
        const index = managerMenuData.findIndex(m => m.id === itemId);
        if (index > -1) {
            managerMenuData.splice(index, 1);
            renderMenuItems();
            showToast('Đã xóa món ăn thành công!', 'success');
        }
    }
}

function saveMenuItem() {
    const editId = document.getElementById('editMenuId').value;
    const menuData = {
        id: document.getElementById('menuId').value,
        name: document.getElementById('menuName').value,
        category: document.getElementById('menuCategory').value,
        price: parseInt(document.getElementById('menuPrice').value),
        cost: parseInt(document.getElementById('menuCost').value),
        image: document.getElementById('menuImage').value || 'https://via.placeholder.com/200x150?text=No+Image',
        ingredients: document.getElementById('menuIngredients').value.split(',').map(i => i.trim()),
        status: 'active'
    };
    
    if (editId) {
        // Edit existing item
        const index = managerMenuData.findIndex(m => m.id === editId);
        if (index > -1) {
            managerMenuData[index] = { ...managerMenuData[index], ...menuData };
            showToast('Cập nhật món ăn thành công!', 'success');
        }
    } else {
        // Add new item
        managerMenuData.push(menuData);
        showToast('Thêm món ăn thành công!', 'success');
    }
    
    renderMenuItems();
    bootstrap.Modal.getInstance(document.getElementById('menuItemModal')).hide();
}

// Inventory Management Functions
function renderInventoryTable() {
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    managerInventoryData.forEach(item => {
        const variance = ((item.usedToday - item.standardAmount) / item.standardAmount * 100);
        const status = getInventoryStatus(item);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.unit}</td>
            <td>${item.standardAmount}</td>
            <td class="${item.currentStock <= item.threshold ? 'text-danger fw-bold' : ''}">${item.currentStock}</td>
            <td>${item.usedToday}</td>
            <td>
                <span class="badge ${status.class}">
                    ${status.text}
                </span>
            </td>
            <td class="${Math.abs(variance) > 10 ? 'text-danger fw-bold' : Math.abs(variance) > 5 ? 'text-warning fw-bold' : 'text-success'}">
                ${variance > 0 ? '+' : ''}${variance.toFixed(1)}%
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editInventoryItem('${item.id}')">
                    <i data-lucide="edit" style="width: 14px; height: 14px;"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    lucide.createIcons();
}

function getInventoryStatus(item) {
    if (item.currentStock <= item.threshold) {
        return { class: 'bg-danger', text: 'Thiếu hàng' };
    }
    
    const variance = Math.abs((item.usedToday - item.standardAmount) / item.standardAmount * 100);
    if (variance > 10) {
        return { class: 'bg-warning', text: 'Lệch chuẩn' };
    }
    
    return { class: 'bg-success', text: 'Bình thường' };
}

function updateInventoryAlerts() {
    const alertElement = document.getElementById('inventoryAlert');
    const alertMessage = document.getElementById('alertMessage');
    
    if (!alertElement || !alertMessage) return;
    
    const lowStockItems = managerInventoryData.filter(item => item.currentStock <= item.threshold);
    const highVarianceItems = managerInventoryData.filter(item => {
        const variance = Math.abs((item.usedToday - item.standardAmount) / item.standardAmount * 100);
        return variance > 10;
    });
    
    if (lowStockItems.length > 0 || highVarianceItems.length > 0) {
        let message = '';
        
        if (lowStockItems.length > 0) {
            message += `${lowStockItems.length} nguyên liệu sắp hết hàng. `;
        }
        
        if (highVarianceItems.length > 0) {
            message += `${highVarianceItems.length} nguyên liệu có độ lệch vượt mức cho phép.`;
        }
        
        alertMessage.textContent = message;
        alertElement.style.display = 'block';
    } else {
        alertElement.style.display = 'none';
    }
}

function showAddIngredientModal() {
    const modal = new bootstrap.Modal(document.getElementById('ingredientModal'));
    const form = document.getElementById('ingredientForm');
    const title = document.getElementById('ingredientModalTitle');
    
    form.reset();
    document.getElementById('editIngredientId').value = '';
    title.textContent = 'Thêm nguyên liệu mới';
    modal.show();
}

function editInventoryItem(itemId) {
    const item = managerInventoryData.find(i => i.id === itemId);
    if (!item) return;
    
    const modal = new bootstrap.Modal(document.getElementById('ingredientModal'));
    const title = document.getElementById('ingredientModalTitle');
    
    title.textContent = 'Chỉnh sửa nguyên liệu';
    document.getElementById('editIngredientId').value = item.id;
    document.getElementById('ingredientId').value = item.id;
    document.getElementById('ingredientName').value = item.name;
    document.getElementById('ingredientUnit').value = item.unit;
    document.getElementById('ingredientStandard').value = item.standardAmount;
    document.getElementById('ingredientThreshold').value = item.threshold;
    document.getElementById('ingredientStock').value = item.currentStock;
    document.getElementById('ingredientCost').value = item.cost;
    
    modal.show();
}

function saveIngredient() {
    const editId = document.getElementById('editIngredientId').value;
    const ingredientData = {
        id: document.getElementById('ingredientId').value,
        name: document.getElementById('ingredientName').value,
        unit: document.getElementById('ingredientUnit').value,
        standardAmount: parseInt(document.getElementById('ingredientStandard').value),
        threshold: parseInt(document.getElementById('ingredientThreshold').value),
        currentStock: parseInt(document.getElementById('ingredientStock').value),
        cost: parseInt(document.getElementById('ingredientCost').value),
        usedToday: 0 // Reset for new ingredients
    };
    
    if (editId) {
        // Edit existing ingredient
        const index = managerInventoryData.findIndex(i => i.id === editId);
        if (index > -1) {
            managerInventoryData[index] = { ...managerInventoryData[index], ...ingredientData };
            showToast('Cập nhật nguyên liệu thành công!', 'success');
        }
    } else {
        // Add new ingredient
        managerInventoryData.push(ingredientData);
        showToast('Thêm nguyên liệu thành công!', 'success');
    }
    
    renderInventoryTable();
    updateInventoryAlerts();
    bootstrap.Modal.getInstance(document.getElementById('ingredientModal')).hide();
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toastId = 'toast-' + Date.now();
    const toastClass = {
        success: 'bg-success',
        error: 'bg-danger', 
        warning: 'bg-warning',
        info: 'bg-info'
    }[type] || 'bg-info';
    
    const toastHtml = `
        <div id="${toastId}" class="toast align-items-center text-white ${toastClass} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 4000 });
    toast.show();
    
    // Clean up after toast is hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
    });
}

function setupEventListeners() {
    // Set default dates for report form
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    if (startDateInput) {
        startDateInput.value = lastWeek.toISOString().split('T')[0];
    }
    if (endDateInput) {
        endDateInput.value = today.toISOString().split('T')[0];
    }
    
    // Menu search input listener
    const menuSearchInput = document.getElementById('menuSearchInput');
    if (menuSearchInput) {
        menuSearchInput.addEventListener('input', function() {
            filterMenuItems();
        });
    }
} 