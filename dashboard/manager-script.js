// Manager Dashboard JavaScript

// Global Variables & Data
let managerStaffData = [
  {
    id: "NV001",
    name: "Nguyễn Văn An",
    position: "Thu ngân",
    phone: "0123456789",
    email: "van.an@restaurant.com",
    status: "active",
    startDate: "2023-01-15",
    salary: 8000000,
  },
  {
    id: "NV002",
    name: "Trần Thị Bình",
    position: "Phục vụ",
    phone: "0987654321",
    email: "thi.binh@restaurant.com",
    status: "active",
    startDate: "2023-02-01",
    salary: 7000000,
  },
  {
    id: "NV003",
    name: "Lê Minh Cường",
    position: "Đầu bếp",
    phone: "0369852147",
    email: "minh.cuong@restaurant.com",
    status: "busy",
    startDate: "2022-12-01",
    salary: 12000000,
  },
  {
    id: "NV004",
    name: "Phạm Thị Dung",
    position: "Phục vụ",
    phone: "0147258369",
    email: "thi.dung@restaurant.com",
    status: "inactive",
    startDate: "2023-03-15",
    salary: 7000000,
  },
];

let managerMenuData = [
  {
    id: "MN001",
    name: "Phở bò tái",
    category: "Mì & Phở",
    price: 60000,
    ingredients: ["Bánh phở", "Thịt bò", "Hành lá", "Nước dúng"],
    image: "https://via.placeholder.com/200x150?text=Phở+Bò",
    status: "active",
    cost: 35000,
  },
  {
    id: "MN002",
    name: "Cơm rang thập cẩm",
    category: "Cơm",
    price: 45000,
    ingredients: ["Cơm", "Tôm", "Xúc xích", "Trứng", "Rau củ"],
    image: "https://via.placeholder.com/200x150?text=Cơm+Rang",
    status: "active",
    cost: 25000,
  },
  {
    id: "MN003",
    name: "Trà đá",
    category: "Đồ uống",
    price: 5000,
    ingredients: ["Trà", "Đá", "Đường"],
    image: "https://via.placeholder.com/200x150?text=Trà+Đá",
    status: "active",
    cost: 2000,
  },
  {
    id: "MN004",
    name: "Bánh flan",
    category: "Tráng miệng",
    price: 15000,
    ingredients: ["Trứng", "Sữa", "Đường", "Vani"],
    image: "https://via.placeholder.com/200x150?text=Bánh+Flan",
    status: "active",
    cost: 8000,
  },
];

let managerInventoryData = [
  {
    id: "NL001",
    name: "Thịt bò",
    unit: "kg",
    standardAmount: 20,
    currentStock: 15,
    usedToday: 8,
    threshold: 10,
    cost: 250000,
  },
  {
    id: "NL002",
    name: "Bánh phở",
    unit: "kg",
    standardAmount: 50,
    currentStock: 35,
    usedToday: 25,
    threshold: 20,
    cost: 15000,
  },
  {
    id: "NL003",
    name: "Cơm",
    unit: "kg",
    standardAmount: 30,
    currentStock: 12,
    usedToday: 18,
    threshold: 15,
    cost: 20000,
  },
  {
    id: "NL004",
    name: "Tôm",
    unit: "kg",
    standardAmount: 10,
    currentStock: 3,
    usedToday: 5,
    threshold: 5,
    cost: 300000,
  },
  {
    id: "NL005",
    name: "Rau xanh",
    unit: "kg",
    standardAmount: 20,
    currentStock: 25,
    usedToday: 21, // Độ lệch chính xác 5%: (21-20)/20 = 0.05 = 5%
    threshold: 8,
    cost: 40000,
  },
  {
    id: "NL006",
    name: "Gia vị",
    unit: "kg",
    standardAmount: 5,
    currentStock: 12,
    usedToday: 5.2, // Độ lệch 4%: (5.2-5)/5 = 0.04 = 4%
    threshold: 2,
    cost: 120000,
  },
];

let managerSalesData = {
  today: {
    revenue: 2450000,
    orders: 45,
    customers: 38,
    activeTables: 8,
  },
  weekly: [1800000, 2100000, 1950000, 2300000, 2650000, 2450000, 2200000],
  topDishes: [
    { name: "Phở bò tái", sold: 25, revenue: 1500000 },
    { name: "Cơm rang thập cẩm", sold: 18, revenue: 810000 },
    { name: "Bún chả", sold: 15, revenue: 675000 },
    { name: "Bánh mì", sold: 12, revenue: 300000 },
  ],
};

let managerFinanceData = [
  {
    id: "TC001",
    code: "PT2025001",
    date: "2025-10-15",
    type: "income",
    category: "sales",
    description: "Doanh thu bán hàng ngày 15/10/2025",
    amount: 12500000,
    paymentMethod: "cash",
    note: "Đã đối chiếu với sổ quỹ",
  },
  {
    id: "TC002",
    code: "PC2025001",
    date: "2025-10-16",
    type: "expense",
    category: "inventory",
    description: "Nhập nguyên liệu thực phẩm tươi",
    amount: 4500000,
    paymentMethod: "transfer",
    note: "Chuyển khoản cho nhà cung cấp ABC",
  },
  {
    id: "TC003",
    code: "PC2025002",
    date: "2025-10-20",
    type: "expense",
    category: "salary",
    description: "Lương nhân viên tháng 10/2025",
    amount: 35000000,
    paymentMethod: "transfer",
    note: "Đã chuyển khoản cho 10 nhân viên",
  },
  {
    id: "TC004",
    code: "PC2025003",
    date: "2025-10-25",
    type: "expense",
    category: "utilities",
    description: "Tiền điện nước tháng 10/2025",
    amount: 3200000,
    paymentMethod: "cash",
    note: "",
  },
  {
    id: "TC005",
    code: "PT2025002",
    date: "2025-10-30",
    type: "income",
    category: "sales",
    description: "Doanh thu bán hàng tuần cuối tháng 10/2025",
    amount: 18700000,
    paymentMethod: "cash",
    note: "",
  },
  {
    id: "TC006",
    code: "PC2025004",
    date: "2025-11-01",
    type: "expense",
    category: "rent",
    description: "Tiền thuê mặt bằng tháng 11/2025",
    amount: 15000000,
    paymentMethod: "transfer",
    note: "Đã thanh toán đúng hạn",
  },
  {
    id: "TC007",
    code: "PT2025003",
    date: "2025-11-05",
    type: "income",
    category: "sales",
    description: "Doanh thu bán hàng ngày 05/11/2025",
    amount: 9800000,
    paymentMethod: "cash",
    note: "",
  },
];

// Charts
let revenueChart, topDishesChart, categoryRevenueChart;

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  lucide.createIcons();
  showTab("dashboard");
  updateDashboardStats();
  initializeCharts();
  renderStaffTable();
  renderMenuItems();
  renderInventoryTable();
  updateAnalytics();
  updateInventoryAlerts();
  setupEventListeners();

  // Initialize finance management
  renderFinanceTable();
  setupFinanceEventListeners();

  // Set current date as default for new finance transactions
  const financeForm = document.getElementById("financeForm");
  if (financeForm) {
    const today = new Date().toISOString().split("T")[0];
    const dateInput = document.getElementById("financeDate");
    if (dateInput) {
      dateInput.value = today;
    }
  }
});

// Tab Management
function showTab(tabName) {
  // Hide all tabs
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Remove active class from all nav buttons
  document.querySelectorAll(".nav-button").forEach((btn) => {
    btn.classList.remove("nav-button-active");
  });

  // Show selected tab
  const selectedTab = document.getElementById(`${tabName}-tab`);
  if (selectedTab) {
    selectedTab.classList.add("active");
  }

  // Set active nav button (find the button that called this function)
  const buttons = document.querySelectorAll(".nav-button");
  buttons.forEach((btn) => {
    if (
      btn.onclick &&
      btn.onclick.toString().includes(`showTab('${tabName}')`)
    ) {
      btn.classList.add("nav-button-active");
    }
  });

  // Update page title
  const titles = {
    dashboard: "Tổng quan hệ thống",
    staff: "Quản lý nhân viên",
    reports: "Báo cáo",
    analytics: "Thống kê nâng cao",
    menu: "Quản lý thực đơn",
    inventory: "Quản lý kho",
    finance: "Quản lý thu chi",
  };

  const titleElement = document.getElementById("pageTitle");
  if (titleElement) {
    titleElement.textContent = titles[tabName] || "Hệ thống quản lý";
  }
}

// Dashboard Functions
function updateDashboardStats() {
  const todayRevenue = document.getElementById("todayRevenue");
  const todayOrders = document.getElementById("todayOrders");
  const activeStaff = document.getElementById("activeStaff");
  const activeTables = document.getElementById("activeTables");

  if (todayRevenue) {
    todayRevenue.textContent = formatCurrency(managerSalesData.today.revenue);
  }
  if (todayOrders) {
    todayOrders.textContent = managerSalesData.today.orders.toString();
  }
  if (activeStaff) {
    const activeStaffCount = managerStaffData.filter(
      (staff) => staff.status === "active"
    ).length;
    activeStaff.textContent = activeStaffCount.toString();
  }
  if (activeTables) {
    activeTables.textContent = managerSalesData.today.activeTables.toString();
  }
}

function initializeCharts() {
  // Revenue Chart
  const revenueCtx = document.getElementById("revenueChart");
  if (revenueCtx) {
    revenueChart = new Chart(revenueCtx, {
      type: "line",
      data: {
        labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
        datasets: [
          {
            label: "Doanh thu (VNĐ)",
            data: managerSalesData.weekly,
            borderColor: "#0d6efd",
            backgroundColor: "rgba(13, 110, 253, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return new Intl.NumberFormat("vi-VN").format(value) + "₫";
              },
            },
          },
        },
      },
    });
  }

  // Top Dishes Chart
  const topDishesCtx = document.getElementById("topDishesChart");
  if (topDishesCtx) {
    topDishesChart = new Chart(topDishesCtx, {
      type: "doughnut",
      data: {
        labels: managerSalesData.topDishes.map((dish) => dish.name),
        datasets: [
          {
            data: managerSalesData.topDishes.map((dish) => dish.sold),
            backgroundColor: ["#0d6efd", "#6f42c1", "#d63384", "#fd7e14"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });
  }
}

// Staff Management Functions
function renderStaffTable() {
  const tbody = document.getElementById("staffTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  managerStaffData.forEach((staff) => {
    const row = document.createElement("tr");
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
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editStaff('${
                  staff.id
                }')">
                    <i data-lucide="edit" style="width: 14px; height: 14px;"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteStaff('${
                  staff.id
                }')">
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
    active: "bg-success",
    busy: "bg-warning",
    inactive: "bg-secondary",
  };
  return classes[status] || "bg-secondary";
}

function getStatusText(status) {
  const texts = {
    active: "Đang làm",
    busy: "Bận",
    inactive: "Nghỉ",
  };
  return texts[status] || "Không xác định";
}

function showAddStaffModal() {
  const modal = new bootstrap.Modal(document.getElementById("staffModal"));
  const form = document.getElementById("staffForm");
  const title = document.getElementById("staffModalTitle");

  form.reset();
  document.getElementById("editStaffId").value = "";
  title.textContent = "Thêm nhân viên mới";
  modal.show();
}

function editStaff(staffId) {
  const staff = managerStaffData.find((s) => s.id === staffId);
  if (!staff) return;

  const modal = new bootstrap.Modal(document.getElementById("staffModal"));
  const title = document.getElementById("staffModalTitle");

  title.textContent = "Chỉnh sửa nhân viên";
  document.getElementById("editStaffId").value = staff.id;
  document.getElementById("staffId").value = staff.id;
  document.getElementById("staffName").value = staff.name;
  document.getElementById("staffPosition").value = staff.position;
  document.getElementById("staffPhone").value = staff.phone;
  document.getElementById("staffEmail").value = staff.email;
  document.getElementById("staffStartDate").value = staff.startDate;
  document.getElementById("staffSalary").value = staff.salary;

  modal.show();
}

function deleteStaff(staffId) {
  if (confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
    const index = managerStaffData.findIndex((s) => s.id === staffId);
    if (index > -1) {
      managerStaffData.splice(index, 1);
      renderStaffTable();
      updateDashboardStats();
      showToast("Đã xóa nhân viên thành công!", "success");
    }
  }
}

function saveStaff() {
  const editId = document.getElementById("editStaffId").value;
  const staffData = {
    id: document.getElementById("staffId").value,
    name: document.getElementById("staffName").value,
    position: document.getElementById("staffPosition").value,
    phone: document.getElementById("staffPhone").value,
    email: document.getElementById("staffEmail").value,
    startDate: document.getElementById("staffStartDate").value,
    salary: parseInt(document.getElementById("staffSalary").value),
    status: "active",
  };

  if (editId) {
    // Edit existing staff
    const index = managerStaffData.findIndex((s) => s.id === editId);
    if (index > -1) {
      managerStaffData[index] = { ...managerStaffData[index], ...staffData };
      showToast("Cập nhật nhân viên thành công!", "success");
    }
  } else {
    // Add new staff
    managerStaffData.push(staffData);
    showToast("Thêm nhân viên thành công!", "success");
  }

  renderStaffTable();
  updateDashboardStats();
  bootstrap.Modal.getInstance(document.getElementById("staffModal")).hide();
}

// Reports Functions
function generateReport() {
  const reportType = document.getElementById("reportType").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  if (!reportType || !startDate || !endDate) {
    showToast("Vui lòng điền đầy đủ thông tin báo cáo!", "warning");
    return;
  }

  const reportData = generateReportData(reportType, startDate, endDate);
  exportToExcel(reportData, `Bao_cao_${reportType}_${startDate}_${endDate}`);
  showToast("Đã tạo và tải báo cáo thành công!", "success");
}

function generateReportData(type, startDate, endDate) {
  // Mock report data generation
  const data = [
    ["Loại báo cáo", getReportTypeText(type)],
    ["Kỳ báo cáo", `${startDate} đến ${endDate}`],
    ["Ngày tạo", new Date().toLocaleDateString("vi-VN")],
    [""],
    ["THỐNG KÊ TỔNG QUAN"],
    ["Tổng doanh thu", formatCurrency(managerSalesData.today.revenue * 7)],
    ["Tổng đơn hàng", managerSalesData.today.orders * 7],
    ["Trung bình/ngày", formatCurrency(managerSalesData.today.revenue)],
    [""],
    ["TOP MÓN BÁN CHẠY"],
    ["Tên món", "Số lượng", "Doanh thu"],
  ];

  managerSalesData.topDishes.forEach((dish) => {
    data.push([dish.name, dish.sold, formatCurrency(dish.revenue)]);
  });

  return data;
}

function getReportTypeText(type) {
  const types = {
    daily: "Báo cáo ngày",
    weekly: "Báo cáo tuần",
    monthly: "Báo cáo tháng",
    custom: "Báo cáo tùy chỉnh",
  };
  return types[type] || "Không xác định";
}

function exportToExcel(data, filename) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Báo cáo");
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

// Analytics Functions
function updateAnalytics() {
  renderTopSellingItems();
  renderCategoryRevenueChart();
  renderDailyItemsTable();
}

function renderTopSellingItems() {
  const container = document.getElementById("topSellingItems");
  if (!container) return;

  container.innerHTML = "";

  managerSalesData.topDishes.forEach((dish, index) => {
    const item = document.createElement("div");
    item.className =
      "d-flex align-items-center justify-content-between p-3 border-bottom";
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
  const ctx = document.getElementById("categoryRevenueChart");
  if (!ctx) return;

  if (categoryRevenueChart) {
    categoryRevenueChart.destroy();
  }

  const categories = ["Mì & Phở", "Cơm", "Đồ uống", "Tráng miệng"];
  const revenues = [800000, 600000, 200000, 100000];

  categoryRevenueChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: categories,
      datasets: [
        {
          label: "Doanh thu (VNĐ)",
          data: revenues,
          backgroundColor: ["#0d6efd", "#198754", "#ffc107", "#dc3545"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return new Intl.NumberFormat("vi-VN").format(value) + "₫";
            },
          },
        },
      },
    },
  });
}

function renderDailyItemsTable() {
  const tbody = document.getElementById("dailyItemsTable");
  if (!tbody) return;

  tbody.innerHTML = "";

  managerMenuData.forEach((item) => {
    const sold = Math.floor(Math.random() * 20) + 5;
    const revenue = sold * item.price;
    const profit = revenue - sold * item.cost;
    const profitMargin = ((profit / revenue) * 100).toFixed(1);

    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${item.name}</td>
            <td><span class="badge bg-secondary">${item.category}</span></td>
            <td>${sold}</td>
            <td>${formatCurrency(revenue)}</td>
            <td class="${
              profit > 0 ? "text-success" : "text-danger"
            }">${formatCurrency(profit)}</td>
            <td>
                <span class="badge ${profit > 0 ? "bg-success" : "bg-danger"}">
                    ${profitMargin}%
                </span>
            </td>
        `;
    tbody.appendChild(row);
  });
}

// Menu Management Functions
function renderMenuItems() {
  const container = document.getElementById("menuItemsGrid");
  if (!container) return;

  container.innerHTML = "";

  managerMenuData.forEach((item) => {
    const col = document.createElement("div");
    col.className = "col-lg-4 col-md-6";

    // Format ingredients list for display
    let ingredientsHtml = '<ul class="ps-3 mb-0 text-muted small">';
    if (item.ingredients && item.ingredients.length > 0) {
      item.ingredients.forEach((ing) => {
        if (typeof ing === "object" && ing.name) {
          ingredientsHtml += `<li>${ing.name}: ${ing.amount} ${ing.unit}</li>`;
        } else if (typeof ing === "string") {
          ingredientsHtml += `<li>${ing}</li>`;
        }
      });
    } else {
      ingredientsHtml += "<li>Không có nguyên liệu</li>";
    }
    ingredientsHtml += "</ul>";

    col.innerHTML = `
            <div class="card border-0 shadow-sm h-100">
                <img src="${
                  item.image
                }" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${
      item.name
    }">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0">${item.name}</h5>
                        <span class="badge ${
                          item.status === "active"
                            ? "bg-success"
                            : "bg-secondary"
                        }">
                            ${
                              item.status === "active"
                                ? "Đang bán"
                                : "Ngừng bán"
                            }
                        </span>
                    </div>
                    <p class="text-muted small mb-2">${item.category}</p>
                    <p class="text-primary fw-bold fs-5 mb-2">${formatCurrency(
                      item.price
                    )}</p>
                    <p class="text-muted small mb-2">Giá vốn: ${formatCurrency(
                      item.cost
                    )}</p>
                    
                    <div class="small mb-3">
                      <p class="mb-1 fw-medium">Nguyên liệu:</p>
                      ${ingredientsHtml}
                    </div>
                    
                    <div class="mt-auto">
                        <div class="btn-group w-100">
                            <button class="btn btn-outline-primary btn-sm" onclick="editMenuItem('${
                              item.id
                            }')">
                                <i data-lucide="edit" style="width: 14px; height: 14px;"></i>
                            </button>
                            <button class="btn btn-outline-danger btn-sm" onclick="deleteMenuItem('${
                              item.id
                            }')">
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
  const category = document.getElementById("menuCategoryFilter").value;
  const searchTerm = document
    .getElementById("menuSearchInput")
    .value.toLowerCase();
  filterMenuItems(searchTerm, category);
}

function filterMenuItems(searchTerm = "", category = "") {
  if (!searchTerm) {
    searchTerm = document.getElementById("menuSearchInput")
      ? document.getElementById("menuSearchInput").value.toLowerCase()
      : "";
  }
  if (!category) {
    category = document.getElementById("menuCategoryFilter")
      ? document.getElementById("menuCategoryFilter").value
      : "";
  }

  const container = document.getElementById("menuItemsGrid");
  if (!container) return;

  const filteredItems = managerMenuData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm);
    const matchesCategory = !category || item.category === category;
    return matchesSearch && matchesCategory;
  });

  container.innerHTML = "";
  filteredItems.forEach((item) => {
    const col = document.createElement("div");
    col.className = "col-lg-4 col-md-6";

    // Format ingredients list for display
    let ingredientsHtml = '<ul class="ps-3 mb-0 text-muted small">';
    if (item.ingredients && item.ingredients.length > 0) {
      item.ingredients.forEach((ing) => {
        if (typeof ing === "object" && ing.name) {
          ingredientsHtml += `<li>${ing.name}: ${ing.amount} ${ing.unit}</li>`;
        } else if (typeof ing === "string") {
          ingredientsHtml += `<li>${ing}</li>`;
        }
      });
    } else {
      ingredientsHtml += "<li>Không có nguyên liệu</li>";
    }
    ingredientsHtml += "</ul>";

    col.innerHTML = `
            <div class="card border-0 shadow-sm h-100">
                <img src="${
                  item.image
                }" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${
      item.name
    }">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0">${item.name}</h5>
                        <span class="badge ${
                          item.status === "active"
                            ? "bg-success"
                            : "bg-secondary"
                        }">
                            ${
                              item.status === "active"
                                ? "Đang bán"
                                : "Ngừng bán"
                            }
                        </span>
                    </div>
                    <p class="text-muted small mb-2">${item.category}</p>
                    <p class="text-primary fw-bold fs-5 mb-2">${formatCurrency(
                      item.price
                    )}</p>
                    <p class="text-muted small mb-2">Giá vốn: ${formatCurrency(
                      item.cost
                    )}</p>
                    
                    <div class="small mb-3">
                      <p class="mb-1 fw-medium">Nguyên liệu:</p>
                      ${ingredientsHtml}
                    </div>
                    
                    <div class="mt-auto">
                        <div class="btn-group w-100">
                            <button class="btn btn-outline-primary btn-sm" onclick="editMenuItem('${
                              item.id
                            }')">
                                <i data-lucide="edit" style="width: 14px; height: 14px;"></i>
                            </button>
                            <button class="btn btn-outline-danger btn-sm" onclick="deleteMenuItem('${
                              item.id
                            }')">
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
  const modal = new bootstrap.Modal(document.getElementById("menuItemModal"));
  const form = document.getElementById("menuItemForm");
  const title = document.getElementById("menuModalTitle");

  form.reset();
  document.getElementById("editMenuId").value = "";
  title.textContent = "Thêm món mới";

  // Clear ingredients list and prepare for a new item
  const ingredientsList = document.getElementById("ingredientsList");
  if (ingredientsList) {
    ingredientsList.innerHTML = "";
  }

  modal.show();
}

function editMenuItem(itemId) {
  const item = managerMenuData.find((m) => m.id === itemId);
  if (!item) return;

  const modal = new bootstrap.Modal(document.getElementById("menuItemModal"));
  const title = document.getElementById("menuModalTitle");

  title.textContent = "Chỉnh sửa món ăn";
  document.getElementById("editMenuId").value = item.id;
  document.getElementById("menuId").value = item.id;
  document.getElementById("menuName").value = item.name;
  document.getElementById("menuCategory").value = item.category;
  document.getElementById("menuPrice").value = item.price;
  document.getElementById("menuCost").value = item.cost;
  document.getElementById("menuImage").value = item.image;

  // Clear and populate ingredients list
  const ingredientsList = document.getElementById("ingredientsList");
  if (ingredientsList) {
    ingredientsList.innerHTML = "";

    // Check if ingredients have quantities or are just names
    if (item.ingredients && Array.isArray(item.ingredients)) {
      if (typeof item.ingredients[0] === "object") {
        // Ingredients with quantities
        item.ingredients.forEach((ing) => {
          addIngredientRow(ing.id, ing.amount, ing.unit);
        });
      } else {
        // Legacy format - just names
        item.ingredients.forEach((name) => {
          // Find matching ingredient in inventory if possible
          const inventoryItem = managerInventoryData.find((inv) =>
            inv.name.toLowerCase().includes(name.toLowerCase())
          );
          if (inventoryItem) {
            addIngredientRow(inventoryItem.id, 0, inventoryItem.unit);
          } else {
            addIngredientRow(null, 0, "");
          }
        });
      }
    }
  }

  modal.show();
}

function deleteMenuItem(itemId) {
  if (confirm("Bạn có chắc chắn muốn xóa món này?")) {
    const index = managerMenuData.findIndex((m) => m.id === itemId);
    if (index > -1) {
      managerMenuData.splice(index, 1);
      renderMenuItems();
      showToast("Đã xóa món ăn thành công!", "success");
    }
  }
}

function saveMenuItem() {
  const editId = document.getElementById("editMenuId").value;

  // Collect ingredients data from the form
  const ingredientRows = document.querySelectorAll(".ingredient-row");
  const ingredients = Array.from(ingredientRows)
    .map((row) => {
      const select = row.querySelector(".ingredient-select");
      const amount = row.querySelector(".ingredient-amount");
      const unit = row.querySelector(".ingredient-unit");

      return {
        id: select.value,
        name: select.options[select.selectedIndex].text,
        amount: parseFloat(amount.value) || 0,
        unit: unit.value || "",
      };
    })
    .filter((ing) => ing.id); // Filter out empty selections

  const menuData = {
    id: document.getElementById("menuId").value,
    name: document.getElementById("menuName").value,
    category: document.getElementById("menuCategory").value,
    price: parseInt(document.getElementById("menuPrice").value),
    cost: parseInt(document.getElementById("menuCost").value),
    image:
      document.getElementById("menuImage").value ||
      "https://via.placeholder.com/200x150?text=No+Image",
    ingredients: ingredients,
    status: "active",
  };

  if (editId) {
    // Edit existing item
    const index = managerMenuData.findIndex((m) => m.id === editId);
    if (index > -1) {
      managerMenuData[index] = { ...managerMenuData[index], ...menuData };
      showToast("Cập nhật món ăn thành công!", "success");
    }
  } else {
    // Add new item
    managerMenuData.push(menuData);
    showToast("Thêm món ăn thành công!", "success");
  }

  renderMenuItems();
  bootstrap.Modal.getInstance(document.getElementById("menuItemModal")).hide();
}

// Inventory Management Functions
function renderInventoryTable() {
  const tbody = document.getElementById("inventoryTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  managerInventoryData.forEach((item) => {
    const variance =
      ((item.usedToday - item.standardAmount) / item.standardAmount) * 100;
    const status = getInventoryStatus(item);

    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.unit}</td>
            <td>${item.standardAmount}</td>
            <td class="${
              item.currentStock <= item.threshold ? "text-danger fw-bold" : ""
            }">${item.currentStock}</td>
            <td>${item.usedToday}</td>
            <td>
                <span class="badge ${status.class}">
                    ${status.text}
                </span>
            </td>
            <td class="${
              Math.abs(variance) > 10
                ? "text-danger fw-bold"
                : Math.abs(variance) > 5
                ? "text-warning fw-bold"
                : "text-success"
            }">
                ${variance > 0 ? "+" : ""}${variance.toFixed(1)}%
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editInventoryItem('${
                  item.id
                }')">
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
    return { class: "bg-danger", text: "Thiếu hàng" };
  }

  const variance = Math.abs(
    ((item.usedToday - item.standardAmount) / item.standardAmount) * 100
  );
  if (variance > 10) {
    return { class: "bg-warning", text: "Lệch chuẩn" };
  }

  return { class: "bg-success", text: "Bình thường" };
}

function updateInventoryAlerts() {
  const alertElement = document.getElementById("inventoryAlert");
  const alertMessage = document.getElementById("alertMessage");

  if (!alertElement || !alertMessage) return;

  const lowStockItems = managerInventoryData.filter(
    (item) => item.currentStock <= item.threshold
  );
  const highVarianceItems = managerInventoryData.filter((item) => {
    const variance = Math.abs(
      ((item.usedToday - item.standardAmount) / item.standardAmount) * 100
    );
    return variance > 10;
  });

  if (lowStockItems.length > 0 || highVarianceItems.length > 0) {
    let message = "";

    if (lowStockItems.length > 0) {
      message += `${lowStockItems.length} nguyên liệu sắp hết hàng. `;
    }

    if (highVarianceItems.length > 0) {
      message += `${highVarianceItems.length} nguyên liệu có độ lệch vượt mức cho phép.`;
    }

    alertMessage.textContent = message;
    alertElement.style.display = "block";
  } else {
    alertElement.style.display = "none";
  }
}

function showAddIngredientModal() {
  const modal = new bootstrap.Modal(document.getElementById("ingredientModal"));
  const form = document.getElementById("ingredientForm");
  const title = document.getElementById("ingredientModalTitle");

  form.reset();
  document.getElementById("editIngredientId").value = "";
  title.textContent = "Thêm nguyên liệu mới";
  modal.show();
}

function editInventoryItem(itemId) {
  const item = managerInventoryData.find((i) => i.id === itemId);
  if (!item) return;

  const modal = new bootstrap.Modal(document.getElementById("ingredientModal"));
  const title = document.getElementById("ingredientModalTitle");

  title.textContent = "Chỉnh sửa nguyên liệu";
  document.getElementById("editIngredientId").value = item.id;
  document.getElementById("ingredientId").value = item.id;
  document.getElementById("ingredientName").value = item.name;
  document.getElementById("ingredientUnit").value = item.unit;
  document.getElementById("ingredientStandard").value = item.standardAmount;
  document.getElementById("ingredientThreshold").value = item.threshold;
  document.getElementById("ingredientStock").value = item.currentStock;
  document.getElementById("ingredientCost").value = item.cost;

  modal.show();
}

function saveIngredient() {
  const editId = document.getElementById("editIngredientId").value;
  const ingredientData = {
    id: document.getElementById("ingredientId").value,
    name: document.getElementById("ingredientName").value,
    unit: document.getElementById("ingredientUnit").value,
    standardAmount: parseInt(
      document.getElementById("ingredientStandard").value
    ),
    threshold: parseInt(document.getElementById("ingredientThreshold").value),
    currentStock: parseInt(document.getElementById("ingredientStock").value),
    cost: parseInt(document.getElementById("ingredientCost").value),
    usedToday: 0, // Reset for new ingredients
  };

  if (editId) {
    // Edit existing ingredient
    const index = managerInventoryData.findIndex((i) => i.id === editId);
    if (index > -1) {
      managerInventoryData[index] = {
        ...managerInventoryData[index],
        ...ingredientData,
      };
      showToast("Cập nhật nguyên liệu thành công!", "success");
    }
  } else {
    // Add new ingredient
    managerInventoryData.push(ingredientData);
    showToast("Thêm nguyên liệu thành công!", "success");
  }

  renderInventoryTable();
  updateInventoryAlerts();
  bootstrap.Modal.getInstance(
    document.getElementById("ingredientModal")
  ).hide();
}

// Menu ingredient management functions
function addIngredientRow(selectedId = null, amount = 0, selectedUnit = "") {
  const ingredientsList = document.getElementById("ingredientsList");
  const rowId = "ing-row-" + Date.now();

  const row = document.createElement("div");
  row.className = "row mb-2 ingredient-row";
  row.id = rowId;

  // Create the row content with dropdown and quantity inputs
  row.innerHTML = `
    <div class="col-5">
      <select class="form-select form-select-sm ingredient-select" onchange="updateIngredientUnit(this)">
        <option value="">Chọn nguyên liệu</option>
        ${managerInventoryData
          .map(
            (ing) => `
          <option value="${ing.id}" ${
              selectedId === ing.id ? "selected" : ""
            }>${ing.name}</option>
        `
          )
          .join("")}
      </select>
    </div>
    <div class="col-3">
      <input type="number" class="form-control form-control-sm ingredient-amount" value="${amount}" placeholder="Lượng">
    </div>
    <div class="col-3">
      <input type="text" class="form-control form-control-sm ingredient-unit" value="${selectedUnit}" placeholder="Đơn vị">
    </div>
    <div class="col-1">
      <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeIngredientRow('${rowId}')">
        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
      </button>
    </div>
  `;

  ingredientsList.appendChild(row);

  // If a selected ID was provided, update the unit
  if (selectedId) {
    const select = row.querySelector(".ingredient-select");
    updateIngredientUnit(select);
  }

  // Initialize Lucide icons in the new row
  lucide.createIcons({
    icons: {
      "trash-2": true,
    },
    element: row,
  });
}

function removeIngredientRow(rowId) {
  const row = document.getElementById(rowId);
  if (row) {
    row.remove();
  }
}

function updateIngredientUnit(selectElement) {
  const row = selectElement.closest(".ingredient-row");
  const unitField = row.querySelector(".ingredient-unit");
  const selectedId = selectElement.value;

  if (selectedId) {
    const ingredient = managerInventoryData.find(
      (ing) => ing.id === selectedId
    );
    if (ingredient) {
      unitField.value = ingredient.unit;
    }
  } else {
    unitField.value = "";
  }
}

// Utility Functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function showToast(message, type = "info") {
  const toastContainer = document.getElementById("toastContainer");
  if (!toastContainer) return;

  const toastId = "toast-" + Date.now();
  const toastClass =
    {
      success: "bg-success",
      error: "bg-danger",
      warning: "bg-warning",
      info: "bg-info",
    }[type] || "bg-info";

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

  toastContainer.insertAdjacentHTML("beforeend", toastHtml);

  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, { delay: 4000 });
  toast.show();

  // Clean up after toast is hidden
  toastElement.addEventListener("hidden.bs.toast", function () {
    toastElement.remove();
  });
}

function setupEventListeners() {
  // Set default dates for report form
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");

  if (startDateInput) {
    startDateInput.value = lastWeek.toISOString().split("T")[0];
  }
  if (endDateInput) {
    endDateInput.value = today.toISOString().split("T")[0];
  }

  // Menu search input listener
  const menuSearchInput = document.getElementById("menuSearchInput");
  if (menuSearchInput) {
    menuSearchInput.addEventListener("input", function () {
      filterMenuItems();
    });
  }
}

// Finance Management Functions
function renderFinanceTable(data = null) {
  const tableBody = document.getElementById("financeTableBody");
  const emptyState = document.getElementById("financeEmptyState");

  if (!tableBody) return;

  // Clear table
  tableBody.innerHTML = "";

  // Get data to render
  const financeData = data || managerFinanceData;

  // Check if data is empty
  if (financeData.length === 0) {
    if (emptyState) {
      emptyState.classList.remove("d-none");
    }
    return;
  } else if (emptyState) {
    emptyState.classList.add("d-none");
  }

  // Render data
  financeData.forEach((transaction, index) => {
    const row = document.createElement("tr");

    // Format amount with appropriate style based on transaction type
    const amountFormatted = formatCurrency(transaction.amount);
    const amountStyle =
      transaction.type === "income"
        ? "text-success fw-bold"
        : "text-danger fw-bold";

    // Format type with appropriate badge
    const typeDisplay =
      transaction.type === "income"
        ? '<span class="badge bg-success">Thu</span>'
        : '<span class="badge bg-danger">Chi</span>';

    // Format category
    const categoryMap = {
      sales: "Doanh thu bán hàng",
      inventory: "Nhập hàng",
      salary: "Lương nhân viên",
      utilities: "Điện nước, tiện ích",
      rent: "Tiền thuê mặt bằng",
      other: "Khác",
    };

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${transaction.code}</td>
      <td>${formatDate(transaction.date)}</td>
      <td>${typeDisplay}</td>
      <td>${categoryMap[transaction.category] || transaction.category}</td>
      <td>${transaction.description}</td>
      <td class="${amountStyle}">${amountFormatted}</td>
      <td>${transaction.note || "-"}</td>
      <td>
        <div class="btn-group btn-group-sm">
          <button type="button" class="btn btn-outline-primary" onclick="editFinanceTransaction('${
            transaction.id
          }')">
            <i data-lucide="edit" style="width: 16px; height: 16px;"></i>
          </button>
          <button type="button" class="btn btn-outline-danger" onclick="deleteFinanceTransaction('${
            transaction.id
          }')">
            <i data-lucide="trash" style="width: 16px; height: 16px;"></i>
          </button>
        </div>
      </td>
    `;

    tableBody.appendChild(row);
  });

  // Initialize icons
  lucide.createIcons();

  // Update finance summary
  updateFinanceSummary(financeData);
}

function updateFinanceSummary(data = null) {
  const financeData = data || managerFinanceData;

  // Get current date
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Calculate totals
  let monthlyIncome = 0;
  let monthlyExpense = 0;
  let yearlyIncome = 0;
  let yearlyExpense = 0;

  financeData.forEach((transaction) => {
    const transDate = new Date(transaction.date);
    const amount = parseFloat(transaction.amount);

    if (transDate.getFullYear() === currentYear) {
      if (transaction.type === "income") {
        yearlyIncome += amount;
        if (transDate.getMonth() === currentMonth) {
          monthlyIncome += amount;
        }
      } else {
        yearlyExpense += amount;
        if (transDate.getMonth() === currentMonth) {
          monthlyExpense += amount;
        }
      }
    }
  });

  // Update UI
  const monthlyIncomeEl = document.getElementById("monthlyIncome");
  const monthlyExpenseEl = document.getElementById("monthlyExpense");
  const monthlyProfitEl = document.getElementById("monthlyProfit");
  const yearlyProfitEl = document.getElementById("yearlyProfit");

  if (monthlyIncomeEl)
    monthlyIncomeEl.textContent = formatCurrency(monthlyIncome);
  if (monthlyExpenseEl)
    monthlyExpenseEl.textContent = formatCurrency(monthlyExpense);

  const monthlyProfit = monthlyIncome - monthlyExpense;
  const yearlyProfit = yearlyIncome - yearlyExpense;

  if (monthlyProfitEl) {
    monthlyProfitEl.textContent = formatCurrency(monthlyProfit);
    monthlyProfitEl.classList.remove("text-success", "text-danger");
    monthlyProfitEl.classList.add(
      monthlyProfit >= 0 ? "text-success" : "text-danger"
    );
  }

  if (yearlyProfitEl) {
    yearlyProfitEl.textContent = formatCurrency(yearlyProfit);
    yearlyProfitEl.classList.remove("text-success", "text-danger");
    yearlyProfitEl.classList.add(
      yearlyProfit >= 0 ? "text-success" : "text-danger"
    );
  }
}

function filterFinanceTransactions() {
  const startDate = document.getElementById("financeStartDate").value;
  const endDate = document.getElementById("financeEndDate").value;
  const type = document.getElementById("financeType").value;
  const category = document.getElementById("financeCategory").value;

  // Filter data
  let filteredData = [...managerFinanceData];

  // Filter by date range
  if (startDate) {
    filteredData = filteredData.filter(
      (transaction) => transaction.date >= startDate
    );
  }

  if (endDate) {
    filteredData = filteredData.filter(
      (transaction) => transaction.date <= endDate
    );
  }

  // Filter by type
  if (type && type !== "all") {
    filteredData = filteredData.filter(
      (transaction) => transaction.type === type
    );
  }

  // Filter by category
  if (category && category !== "all") {
    filteredData = filteredData.filter(
      (transaction) => transaction.category === category
    );
  }

  // Render filtered data
  renderFinanceTable(filteredData);
}

function exportFinanceToExcel() {
  // Filter data first (use current filter settings)
  filterFinanceTransactions();

  // Get filtered data
  const startDate = document.getElementById("financeStartDate").value;
  const endDate = document.getElementById("financeEndDate").value;
  const type = document.getElementById("financeType").value;
  const category = document.getElementById("financeCategory").value;

  // Filter data
  let filteredData = [...managerFinanceData];

  // Filter by date range
  if (startDate) {
    filteredData = filteredData.filter(
      (transaction) => transaction.date >= startDate
    );
  }

  if (endDate) {
    filteredData = filteredData.filter(
      (transaction) => transaction.date <= endDate
    );
  }

  // Filter by type
  if (type && type !== "all") {
    filteredData = filteredData.filter(
      (transaction) => transaction.type === type
    );
  }

  // Filter by category
  if (category && category !== "all") {
    filteredData = filteredData.filter(
      (transaction) => transaction.category === category
    );
  }

  // Transform data for Excel
  const categoryMap = {
    sales: "Doanh thu bán hàng",
    inventory: "Nhập hàng",
    salary: "Lương nhân viên",
    utilities: "Điện nước, tiện ích",
    rent: "Tiền thuê mặt bằng",
    other: "Khác",
  };

  const paymentMethodMap = {
    cash: "Tiền mặt",
    transfer: "Chuyển khoản",
    card: "Thẻ",
  };

  const excelData = filteredData.map((transaction) => ({
    "Mã phiếu": transaction.code,
    Ngày: formatDate(transaction.date),
    "Loại phiếu": transaction.type === "income" ? "Thu" : "Chi",
    "Danh mục": categoryMap[transaction.category] || transaction.category,
    "Mô tả": transaction.description,
    "Số tiền (VNĐ)": transaction.amount,
    "Phương thức":
      paymentMethodMap[transaction.paymentMethod] || transaction.paymentMethod,
    "Ghi chú": transaction.note || "",
  }));

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Format header
  const range = XLSX.utils.decode_range(ws["!ref"]);
  const headerStyle = {
    font: { bold: true },
    alignment: { horizontal: "center" },
  };

  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    ws[cellAddress].s = headerStyle;
  }

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Thu Chi");

  // Generate filename with date range
  let filename = "Bao_Cao_Thu_Chi";
  if (startDate && endDate) {
    filename += `_${startDate}_den_${endDate}`;
  } else if (startDate) {
    filename += `_Tu_${startDate}`;
  } else if (endDate) {
    filename += `_Den_${endDate}`;
  }
  filename += ".xlsx";

  // Export to Excel
  XLSX.writeFile(wb, filename);

  // Show success message
  showToast("Đã xuất báo cáo thu chi thành công", "success");
}

function editFinanceTransaction(id) {
  const transaction = managerFinanceData.find((t) => t.id === id);
  if (!transaction) return;

  // Populate form fields
  document.getElementById("editFinanceId").value = transaction.id;
  document.getElementById("financeCode").value = transaction.code;
  document.getElementById("financeDate").value = transaction.date;
  document.getElementById("financeTypeInput").value = transaction.type;
  document.getElementById("financeCategoryInput").value = transaction.category;
  document.getElementById("financeDescription").value = transaction.description;
  document.getElementById("financeAmount").value = transaction.amount;
  document.getElementById("financePaymentMethod").value =
    transaction.paymentMethod;
  document.getElementById("financeNote").value = transaction.note || "";

  // Update modal title
  document.getElementById("financeModalTitle").textContent =
    "Sửa phiếu thu/chi";

  // Show modal
  const modal = new bootstrap.Modal(
    document.getElementById("financeTransactionModal")
  );
  modal.show();
}

function saveFinanceTransaction() {
  // Get form values
  const id = document.getElementById("editFinanceId").value;
  const code = document.getElementById("financeCode").value.trim();
  const date = document.getElementById("financeDate").value;
  const type = document.getElementById("financeTypeInput").value;
  const category = document.getElementById("financeCategoryInput").value;
  const description = document
    .getElementById("financeDescription")
    .value.trim();
  const amount = parseFloat(document.getElementById("financeAmount").value);
  const paymentMethod = document.getElementById("financePaymentMethod").value;
  const note = document.getElementById("financeNote").value.trim();

  // Validate form
  if (
    !code ||
    !date ||
    !type ||
    !category ||
    !description ||
    isNaN(amount) ||
    amount <= 0
  ) {
    showToast("Vui lòng điền đầy đủ thông tin bắt buộc", "error");
    return;
  }

  // Create transaction object
  const transaction = {
    id: id || `TC${String(managerFinanceData.length + 1).padStart(3, "0")}`,
    code,
    date,
    type,
    category,
    description,
    amount,
    paymentMethod,
    note,
  };

  // Add or update transaction
  if (id) {
    // Update existing transaction
    const index = managerFinanceData.findIndex((t) => t.id === id);
    if (index !== -1) {
      managerFinanceData[index] = transaction;
      showToast("Đã cập nhật phiếu thu/chi thành công", "success");
    }
  } else {
    // Add new transaction
    managerFinanceData.push(transaction);
    showToast("Đã thêm phiếu thu/chi mới thành công", "success");
  }

  // Sort by date (newest first)
  managerFinanceData.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Hide modal
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("financeTransactionModal")
  );
  modal.hide();

  // Reset form
  document.getElementById("financeForm").reset();
  document.getElementById("editFinanceId").value = "";
  document.getElementById("financeModalTitle").textContent =
    "Thêm phiếu thu/chi mới";

  // Render updated table
  renderFinanceTable();
}

function deleteFinanceTransaction(id) {
  // Confirm deletion
  if (!confirm("Bạn có chắc chắn muốn xóa phiếu thu/chi này không?")) {
    return;
  }

  // Find transaction index
  const index = managerFinanceData.findIndex((t) => t.id === id);
  if (index === -1) return;

  // Delete transaction
  managerFinanceData.splice(index, 1);

  // Show success message
  showToast("Đã xóa phiếu thu/chi thành công", "success");

  // Render updated table
  renderFinanceTable();
}

function resetFinanceForm() {
  // Reset form fields
  document.getElementById("financeForm").reset();
  document.getElementById("editFinanceId").value = "";
  document.getElementById("financeModalTitle").textContent =
    "Thêm phiếu thu/chi mới";

  // Set current date as default
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("financeDate").value = today;
}

function setupFinanceEventListeners() {
  // Set default dates for finance filter form
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const startDateInput = document.getElementById("financeStartDate");
  const endDateInput = document.getElementById("financeEndDate");

  if (startDateInput) {
    startDateInput.value = firstDayOfMonth.toISOString().split("T")[0];
  }
  if (endDateInput) {
    endDateInput.value = today.toISOString().split("T")[0];
  }

  // Add filter button event listener
  const filterBtn = document.getElementById("filterFinanceBtn");
  if (filterBtn) {
    filterBtn.addEventListener("click", filterFinanceTransactions);
  }

  // Add export button event listener
  const exportBtn = document.getElementById("exportFinanceBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", exportFinanceToExcel);
  }

  // Add refresh button event listener
  const refreshBtn = document.getElementById("refreshFinanceBtn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", function () {
      // Reset filters to default values (current month)
      if (startDateInput) {
        startDateInput.value = firstDayOfMonth.toISOString().split("T")[0];
      }
      if (endDateInput) {
        endDateInput.value = today.toISOString().split("T")[0];
      }
      document.getElementById("financeType").value = "all";
      document.getElementById("financeCategory").value = "all";

      // Render table with all data
      renderFinanceTable();
      showToast("Đã làm mới dữ liệu thu chi", "info");
    });
  }
}
