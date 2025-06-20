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
document.addEventListener("DOMContentLoaded", async function () {
  lucide.createIcons();
  showTab("dashboard");

  // Wait for Firebase functions to be available
  const checkFirebaseFunctions = () => {
    const requiredFunctions = [
      "getAllStaff",
      "getActiveStaffCount",
      "getAllMenuItems",
      "getAllInventoryItems",
      "getLowStockItems",
      "getHighVarianceItems",
    ];

    const missingFunctions = requiredFunctions.filter(
      (fn) => typeof window[fn] !== "function"
    );

    if (missingFunctions.length > 0) {
      console.log(
        `Waiting for Firebase functions: ${missingFunctions.join(", ")}`
      );
      setTimeout(checkFirebaseFunctions, 100);
      return false;
    }

    return true;
  };

  // Wait for Firebase functions to be available before initializing
  const initApp = async () => {
    if (!checkFirebaseFunctions()) return;

    console.log("All Firebase functions are available, initializing app");

    // Initialize Firebase-connected components
    try {
      await renderStaffTable();
      await updateDashboardStats();
    } catch (error) {
      console.error("Error initializing Firebase components:", error);
    }

    // Initialize other components
    initializeCharts();
    renderMenuItems();
    renderInventoryTable(); // Uses Firestore
    updateAnalytics();
    updateInventoryAlerts(); // Uses Firestore
    setupEventListeners();

    // Initialize finance management
    renderFinanceTable();
    setupFinanceEventListeners();
  };

  // Start initialization
  initApp();

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
async function updateDashboardStats() {
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
    try {
      const activeStaffCount = await getActiveStaffCount();
      activeStaff.textContent = activeStaffCount.toString();
    } catch (error) {
      console.error("Error getting active staff count:", error);
      // Fallback to local data if Firebase call fails
      const activeStaffCount = managerStaffData.filter(
        (staff) => staff.status === "active"
      ).length;
      activeStaff.textContent = activeStaffCount.toString();
    }
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
async function renderStaffTable() {
  const tbody = document.getElementById("staffTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  try {
    // Show loading indicator
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
        </td>
      </tr>
    `;

    // Get staff data from Firestore
    const staffList = await getAllStaff();

    // Clear loading indicator
    tbody.innerHTML = "";

    if (staffList.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center">Không có dữ liệu nhân viên</td>
        </tr>
      `;
      return;
    }

    // Render staff data
    staffList.forEach((staff) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${staff.uid || staff.id}</td>
            <td>${staff.displayName || staff.name || ""}</td>
            <td>${staff.role || staff.position || ""}</td>
            <td>${staff.phoneNumber || staff.phone || ""}</td>
            <td>${staff.email || ""}</td>
            <td>
                <span class="badge ${getStatusClass(
                  staff.status || "inactive"
                )}">
                    ${getStatusText(staff.status || "inactive")}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editStaff('${
                  staff.uid || staff.id
                }')">
                    <i data-lucide="edit" style="width: 14px; height: 14px;"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteStaff('${
                  staff.uid || staff.id
                }')">
                    <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                </button>
            </td>
        `;
      tbody.appendChild(row);
    });

    // Update dashboard stats
    updateDashboardStats();
  } catch (error) {
    console.error("Error loading staff data:", error);
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-danger">
          Lỗi khi tải dữ liệu: ${error.message || "Không xác định"}
        </td>
      </tr>
    `;
  }

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

async function editStaff(staffId) {
  try {
    // Get staff data from Firestore
    const staff = await getStaffById(staffId);
    if (!staff) {
      showToast("Không tìm thấy thông tin nhân viên", "error");
      return;
    }

    const modal = new bootstrap.Modal(document.getElementById("staffModal"));
    const title = document.getElementById("staffModalTitle");

    title.textContent = "Chỉnh sửa nhân viên";
    document.getElementById("editStaffId").value = staff.uid || staff.id;
    document.getElementById("staffId").value = staff.uid || staff.id;
    document.getElementById("staffName").value =
      staff.displayName || staff.name || "";
    document.getElementById("staffPosition").value =
      staff.role || staff.position || "";
    document.getElementById("staffPhone").value =
      staff.phoneNumber || staff.phone || "";
    document.getElementById("staffEmail").value = staff.email || "";

    // Format date if it's a Date object or timestamp
    let startDate = "";
    if (staff.startDate instanceof Date) {
      startDate = staff.startDate.toISOString().split("T")[0];
    } else if (typeof staff.startDate === "string") {
      startDate = new Date(staff.startDate).toISOString().split("T")[0];
    }
    document.getElementById("staffStartDate").value = startDate;

    document.getElementById("staffSalary").value = staff.salary || 0;

    modal.show();
  } catch (error) {
    console.error("Error loading staff details:", error);
    showToast("Lỗi khi tải thông tin nhân viên: " + error.message, "error");
  }
}

async function deleteStaff(staffId) {
  if (confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
    try {
      await deleteStaffMember(staffId);
      renderStaffTable();
      updateDashboardStats();
      showToast("Đã xóa nhân viên thành công!", "success");
    } catch (error) {
      console.error("Error deleting staff member:", error);
      showToast("Lỗi khi xóa nhân viên: " + error.message, "error");
    }
  }
}

async function saveStaff() {
  try {
    const editId = document.getElementById("editStaffId").value;
    const staffData = {
      displayName: document.getElementById("staffName").value,
      role: document.getElementById("staffPosition").value,
      phoneNumber: document.getElementById("staffPhone").value,
      email: document.getElementById("staffEmail").value,
      startDate: document.getElementById("staffStartDate").value,
      salary: parseInt(document.getElementById("staffSalary").value) || 0,
      status: "active",
    };

    if (editId) {
      // Edit existing staff
      await updateStaffMember(editId, staffData);
      showToast("Cập nhật nhân viên thành công!", "success");
    } else {
      // Add new staff
      const staffId = document.getElementById("staffId").value;
      // Create a new user document with the specified ID
      await addStaffMember({
        ...staffData,
        uid: staffId,
      });
      showToast("Thêm nhân viên thành công!", "success");
    }

    await renderStaffTable();
    updateDashboardStats();
    bootstrap.Modal.getInstance(document.getElementById("staffModal")).hide();
  } catch (error) {
    console.error("Error saving staff member:", error);
    showToast("Lỗi khi lưu thông tin nhân viên: " + error.message, "error");
  }
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
async function renderMenuItems() {
  const container = document.getElementById("menuItemsGrid");
  if (!container) return;

  container.innerHTML =
    '<div class="text-center my-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Đang tải dữ liệu...</p></div>';

  try {
    // Get menu items from Firestore
    const menuItems = await getAllMenuItems();

    container.innerHTML = "";

    if (menuItems.length === 0) {
      container.innerHTML =
        '<div class="text-center my-5"><p>Không có món ăn nào. Hãy thêm món mới!</p></div>';
      return;
    }

    // Populate category filter if it exists
    const categoryFilter = document.getElementById("menuCategoryFilter");
    if (categoryFilter) {
      const categories = await getMenuCategories();
      categoryFilter.innerHTML = '<option value="all">Tất cả danh mục</option>';
      categories.forEach((category) => {
        categoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
      });
    }

    menuItems.forEach((item) => {
      const col = document.createElement("div");
      col.className = "col-lg-4 col-md-6";

      // Format ingredients list for display
      let ingredientsHtml = '<ul class="ps-3 mb-0 text-muted small">';
      if (item.ingredients && item.ingredients.length > 0) {
        item.ingredients.forEach((ing) => {
          if (typeof ing === "object" && ing.name) {
            ingredientsHtml += `<li>${ing.name}: ${ing.amount || ""} ${
              ing.unit || ""
            }</li>`;
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
                  item.image || "../assets/placeholder-food.jpg"
                }" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${
        item.name
      }">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0 fw-bold">${item.name}</h5>
                        <span class="badge bg-primary rounded-pill">${formatCurrency(
                          item.price
                        )}</span>
                    </div>
                    <p class="text-muted mb-1 small">Danh mục: ${
                      item.category || "Chưa phân loại"
                    }</p>
                    <div class="mb-3">
                        <p class="mb-1 fw-medium small">Nguyên liệu:</p>
                        ${ingredientsHtml}
                    </div>
                    <div class="mt-auto d-flex justify-content-between align-items-center">
                        <span class="badge ${
                          item.status === "active"
                            ? "bg-success"
                            : "bg-secondary"
                        }">${
        item.status === "active" ? "Đang bán" : "Ngưng bán"
      }</span>
                        <div>
                            <button class="btn btn-outline-primary btn-sm" onclick="editMenuItem('${
                              item.id
                            }')">
                                <i data-lucide="edit" class="icon-sm"></i>
                            </button>
                            <button class="btn btn-outline-danger btn-sm" onclick="deleteMenuItem('${
                              item.id
                            }')">
                                <i data-lucide="trash-2" class="icon-sm"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
      container.appendChild(col);
    });

    lucide.createIcons();
  } catch (error) {
    console.error("Error rendering menu items:", error);
    container.innerHTML =
      '<div class="text-center my-5"><p class="text-danger">Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p></div>';
    showToast("Lỗi khi tải dữ liệu thực đơn: " + error.message, "danger");
  }
}

async function filterMenuByCategory() {
  const category = document.getElementById("menuCategoryFilter").value;
  const searchTerm = document
    .getElementById("menuSearchInput")
    .value.toLowerCase();
  await filterMenuItems(searchTerm, category);
}

async function filterMenuItems(searchTerm = "", category = "") {
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

  container.innerHTML =
    '<div class="text-center my-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Đang lọc dữ liệu...</p></div>';

  try {
    // Get menu items filtered by category from Firestore
    let menuItems = await filterMenuItemsByCategory(
      category !== "all" ? category : null
    );

    // Client-side filtering by search term
    if (searchTerm) {
      menuItems = menuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm) ||
          (item.description &&
            item.description.toLowerCase().includes(searchTerm))
      );
    }

    container.innerHTML = "";

    if (menuItems.length === 0) {
      container.innerHTML =
        '<div class="text-center my-5"><p>Không tìm thấy món ăn phù hợp.</p></div>';
      return;
    }

    menuItems.forEach((item) => {
      const col = document.createElement("div");
      col.className = "col-lg-4 col-md-6";

      // Format ingredients list for display
      let ingredientsHtml = '<ul class="ps-3 mb-0 text-muted small">';
      if (item.ingredients && item.ingredients.length > 0) {
        item.ingredients.forEach((ing) => {
          if (typeof ing === "object" && ing.name) {
            ingredientsHtml += `<li>${ing.name}: ${ing.amount || ""} ${
              ing.unit || ""
            }</li>`;
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
                      item.image || "../assets/placeholder-food.jpg"
                    }" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${
        item.name
      }">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title mb-0 fw-bold">${
                              item.name
                            }</h5>
                            <span class="badge bg-primary rounded-pill">${formatCurrency(
                              item.price
                            )}</span>
                        </div>
                        <p class="text-muted mb-1 small">Danh mục: ${
                          item.category || "Chưa phân loại"
                        }</p>
                        <div class="mb-3">
                            <p class="mb-1 fw-medium small">Nguyên liệu:</p>
                            ${ingredientsHtml}
                        </div>
                        <div class="mt-auto d-flex justify-content-between align-items-center">
                            <span class="badge ${
                              item.status === "active"
                                ? "bg-success"
                                : "bg-secondary"
                            }">${
        item.status === "active" ? "Đang bán" : "Ngưng bán"
      }</span>
                            <div>
                                <button class="btn btn-outline-primary btn-sm" onclick="editMenuItem('${
                                  item.id
                                }')">
                                    <i data-lucide="edit" class="icon-sm"></i>
                                </button>
                                <button class="btn btn-outline-danger btn-sm" onclick="deleteMenuItem('${
                                  item.id
                                }')">
                                    <i data-lucide="trash-2" class="icon-sm"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
      container.appendChild(col);
    });

    lucide.createIcons();
  } catch (error) {
    console.error("Error filtering menu items:", error);
    container.innerHTML =
      '<div class="text-center my-5"><p class="text-danger">Đã xảy ra lỗi khi lọc dữ liệu. Vui lòng thử lại sau.</p></div>';
  }
}

function showAddMenuItemModal() {
  const modal = new bootstrap.Modal(document.getElementById("menuItemModal"));
  // Reset form
  document.getElementById("menuItemForm").reset();
  document.getElementById("menuModalTitle").textContent = "Thêm món mới";

  // Clear hidden input
  const hiddenIdInput = document.getElementById("menuItemId");
  if (hiddenIdInput) hiddenIdInput.value = "";

  // Clear ingredients container
  const ingredientsList = document.getElementById("ingredientsList");
  if (ingredientsList) ingredientsList.innerHTML = "";

  // Add one empty ingredient row by default
  addIngredientRow();

  // Setup image preview
  setupImagePreview();

  modal.show();
}

// Add event listener for image URL preview
function setupImagePreview() {
  const imageInput = document.getElementById("menuItemImage");
  const imagePreview = document.getElementById("menuItemImagePreview");

  if (imageInput && imagePreview) {
    imageInput.addEventListener("input", function () {
      const imageUrl = this.value.trim();

      if (imageUrl && imageUrl.match(/^(http|https):\/\/[^ "]+$/)) {
        // Valid URL
        imagePreview.innerHTML = `
          <img src="${imageUrl}" class="img-thumbnail" style="height: 100px;" onerror="this.onerror=null; this.src='../assets/placeholder-food.jpg'; this.parentNode.innerHTML += '<div class=\"text-danger small mt-1\">Không thể tải hình ảnh</div>'">
        `;
      } else {
        // Invalid or empty URL
        imagePreview.innerHTML = `<small class="text-muted">Nhập URL hình ảnh hợp lệ để hiển thị xem trước</small>`;
      }
    });
  }
}

async function editMenuItem(itemId) {
  try {
    const modal = new bootstrap.Modal(document.getElementById("menuItemModal"));
    document.getElementById("menuModalTitle").textContent = "Chỉnh sửa món ăn";

    document.getElementById("menuItemForm").reset();

    // Show loading state
    const form = document.getElementById("menuItemForm");
    form.innerHTML =
      '<div class="text-center my-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Đang tải dữ liệu...</p></div>';

    // Get menu item from Firestore
    const menuItem = await getMenuItemById(itemId);

    // Reset form with actual form elements
    form.innerHTML = `
      <div class="row">
        <input type="hidden" id="menuItemId" value="${menuItem.id || ""}">
        <div class="col-md-6 mb-3">
          <label for="menuItemName" class="form-label">Tên món</label>
          <input type="text" class="form-control" id="menuItemName" required value="${
            menuItem.name || ""
          }">
        </div>
        <div class="col-md-6 mb-3">
          <label for="menuItemCategory" class="form-label">Danh mục</label>
          <input type="text" class="form-control" id="menuItemCategory" required value="${
            menuItem.category || ""
          }">
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="menuItemPrice" class="form-label">Giá bán (VNĐ)</label>
          <input type="number" class="form-control" id="menuItemPrice" required value="${
            menuItem.price || 0
          }">
        </div>
        <div class="col-md-6 mb-3">
          <label for="menuItemCost" class="form-label">Giá vốn (VNĐ)</label>
          <input type="number" class="form-control" id="menuItemCost" value="${
            menuItem.cost || 0
          }">
        </div>
      </div>      <div class="mb-3">
        <label for="menuItemImage" class="form-label">URL Hình ảnh</label>
        <input type="url" class="form-control" id="menuItemImage" value="${
          menuItem.image || ""
        }" placeholder="https://example.com/image.jpg">
        ${
          menuItem.image
            ? `<div id="menuItemImagePreview" class="mt-2">
                <img src="${menuItem.image}" class="img-thumbnail" style="height: 100px;">
              </div>`
            : `<div id="menuItemImagePreview" class="mt-2">
                <small class="text-muted">Nhập URL hình ảnh để hiển thị xem trước</small>
              </div>`
        }
      </div>
      <div class="mb-3">
        <label for="menuItemDescription" class="form-label">Mô tả</label>
        <textarea class="form-control" id="menuItemDescription" rows="2">${
          menuItem.description || ""
        }</textarea>
      </div>
      <div class="mb-3">
        <label for="menuItemStatus" class="form-label">Trạng thái</label>
        <select class="form-select" id="menuItemStatus">
          <option value="active" ${
            menuItem.status === "active" ? "selected" : ""
          }>Đang bán</option>
          <option value="inactive" ${
            menuItem.status === "inactive" ? "selected" : ""
          }>Ngưng bán</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label d-flex justify-content-between">
          <span>Nguyên liệu</span>
          <button type="button" class="btn btn-sm btn-outline-primary" onclick="addIngredientRow()">
            <i data-lucide="plus" class="icon-sm"></i> Thêm nguyên liệu
          </button>
        </label>        <div id="ingredientsList" class="border rounded p-3 bg-light">
          <!-- Ingredient rows will be added here -->
        </div>
      </div>
    `; // Set the ID in the hidden field
    document.getElementById("menuItemId").value = itemId;

    // Add ingredient rows
    const ingredientsList = document.getElementById("ingredientsList");
    if (menuItem.ingredients && menuItem.ingredients.length > 0) {
      menuItem.ingredients.forEach((ingredient) => {
        if (typeof ingredient === "object") {
          addIngredientRow(
            ingredient.id,
            ingredient.amount,
            ingredient.unit,
            ingredient.name
          );
        } else {
          // For backward compatibility with string ingredients
          addIngredientRow(null, 0, "", ingredient);
        }
      });
    } else {
      // Add one empty row
      addIngredientRow();
    }

    // Setup image preview functionality
    setupImagePreview();

    lucide.createIcons();
    modal.show();
  } catch (error) {
    console.error("Error editing menu item:", error);
    showToast("Lỗi khi tải thông tin món ăn: " + error.message, "danger");
  }
}

async function deleteMenuItem(itemId) {
  if (!confirm("Bạn có chắc chắn muốn xóa món ăn này?")) return;

  try {
    await deleteMenuItem(itemId);

    showToast("Đã xóa món ăn thành công", "success");

    // Refresh the menu items list
    renderMenuItems();
  } catch (error) {
    console.error("Error deleting menu item:", error);
    showToast("Lỗi khi xóa món ăn: " + error.message, "danger");
  }
}

async function saveMenuItem() {
  try {
    const form = document.getElementById("menuItemForm");

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Show loading state on save button
    const saveButton = document.querySelector("#menuItemModal .btn-primary");
    const originalText = saveButton.innerHTML;
    saveButton.disabled = true;
    saveButton.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang lưu...';

    const itemId = document.getElementById("menuItemId").value;
    const name = document.getElementById("menuItemName").value;
    const category = document.getElementById("menuItemCategory").value;
    const price = Number(document.getElementById("menuItemPrice").value);
    const cost = Number(document.getElementById("menuItemCost").value);
    const description = document.getElementById("menuItemDescription").value;
    const status = document.getElementById("menuItemStatus").value;
    const imageUrl = document.getElementById("menuItemImage").value;

    // Validate the image URL if provided
    if (imageUrl && !imageUrl.match(/^(http|https):\/\/[^ "]+$/)) {
      showToast("URL hình ảnh không hợp lệ. Vui lòng kiểm tra lại", "warning");
      return;
    } // Gather ingredients
    const ingredients = [];
    const ingredientRows = document.querySelectorAll(".ingredient-row");

    ingredientRows.forEach((row) => {
      const nameInput = row.querySelector(".ingredient-name");
      const ingredientId = nameInput.dataset.id || null;
      const ingredientName = nameInput.value;
      const ingredientAmount =
        parseFloat(row.querySelector(".ingredient-amount").value) || 0;
      const ingredientUnit = row.querySelector(".ingredient-unit").value;

      if (ingredientName) {
        ingredients.push({
          id: ingredientId,
          name: ingredientName,
          amount: ingredientAmount,
          unit: ingredientUnit,
        });
      }
    });

    // Prepare menu item data
    const menuItemData = {
      name,
      category,
      price,
      cost,
      description,
      status,
      image: imageUrl,
      ingredients,
    };

    // Save to Firestore
    if (itemId) {
      // Update existing item
      await updateMenuItem(itemId, menuItemData);
      showToast("Cập nhật món ăn thành công", "success");
    } else {
      // Add new item
      await addMenuItem(menuItemData);
      showToast("Thêm món ăn mới thành công", "success");
    }

    // Close modal and refresh list
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("menuItemModal")
    );
    modal.hide();

    renderMenuItems();
  } catch (error) {
    console.error("Error saving menu item:", error);
    showToast("Lỗi khi lưu món ăn: " + error.message, "danger");
  } finally {
    // Reset save button
    const saveButton = document.querySelector("#menuItemModal .btn-primary");
    saveButton.disabled = false;
    saveButton.innerHTML = "Lưu";
  }
}

// Function to add an ingredient row to the menu item form
function addIngredientRow(id = null, amount = "", unit = "", name = "") {
  const ingredientsList = document.getElementById("ingredientsList");
  if (!ingredientsList) return;

  const rowId = "ingredient-" + Date.now();
  const rowHtml = `
    <div class="row mb-2 ingredient-row" id="${rowId}">
      <div class="col-3">
        <input type="number" class="form-control form-control-sm ingredient-amount" 
          placeholder="Số lượng" value="${amount}" min="0" step="0.1">
      </div>
      <div class="col-2">
        <input type="text" class="form-control form-control-sm ingredient-unit" 
          placeholder="Đơn vị" value="${unit}">
      </div>
      <div class="col-6">
        <input type="text" class="form-control form-control-sm ingredient-name" 
          placeholder="Tên nguyên liệu" value="${name}" ${
    id ? 'data-id="' + id + '"' : ""
  }>
      </div>
      <div class="col-1">
        <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeIngredientRow('${rowId}')">
          <i data-lucide="x" class="icon-sm"></i>
        </button>
      </div>
    </div>
  `;

  ingredientsList.insertAdjacentHTML("beforeend", rowHtml);
  lucide.createIcons(); // Re-initialize icons
}

// Function to remove an ingredient row
function removeIngredientRow(rowId) {
  const row = document.getElementById(rowId);
  if (row) row.remove();
}

// Inventory Management Functions
async function renderInventoryTable() {
  const tbody = document.getElementById("inventoryTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  try {
    // Get inventory items from Firestore
    const inventoryItems = await getAllInventoryItems();

    inventoryItems.forEach((item) => {
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
                  <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editInventoryItem('${
                      item.id
                    }')">
                        <i data-lucide="edit" style="width: 14px; height: 14px;"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="confirmDeleteInventoryItem('${
                      item.id
                    }')">
                        <i data-lucide="trash" style="width: 14px; height: 14px;"></i>
                    </button>
                  </div>
              </td>
          `;
      tbody.appendChild(row);
    });

    lucide.createIcons();
  } catch (error) {
    console.error("Error rendering inventory table:", error);
    showToast("Lỗi khi tải dữ liệu kho", "error");
  }
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

async function updateInventoryAlerts() {
  const alertElement = document.getElementById("inventoryAlert");
  const alertMessage = document.getElementById("alertMessage");

  if (!alertElement || !alertMessage) return;

  try {
    // Get low stock items and high variance items from Firestore
    const lowStockItems = await getLowStockItems();
    const highVarianceItems = await getHighVarianceItems(0.1); // 10% variance threshold

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
  } catch (error) {
    console.error("Error updating inventory alerts:", error);
    showToast("Lỗi khi tải thông báo kho", "error");
  }
}

function showAddIngredientModal() {
  const modal = new bootstrap.Modal(document.getElementById("ingredientModal"));
  const form = document.getElementById("ingredientForm");
  const title = document.getElementById("ingredientModalTitle");

  if (!form) {
    // Create the form if it doesn't exist
    const modalBody = document.querySelector("#ingredientModal .modal-body");
    modalBody.innerHTML = `
      <form id="ingredientForm">
        <input type="hidden" id="editIngredientId">
        <div class="mb-3">
          <label for="ingredientId" class="form-label">Mã nguyên liệu</label>
          <input type="text" class="form-control" id="ingredientId" required>
        </div>
        <div class="mb-3">
          <label for="ingredientName" class="form-label">Tên nguyên liệu</label>
          <input type="text" class="form-control" id="ingredientName" required>
        </div>
        <div class="mb-3">
          <label for="ingredientUnit" class="form-label">Đơn vị tính</label>
          <input type="text" class="form-control" id="ingredientUnit" required>
        </div>
        <div class="mb-3">
          <label for="ingredientStandard" class="form-label">Lượng tiêu chuẩn</label>
          <input type="number" class="form-control" id="ingredientStandard" required>
        </div>
        <div class="mb-3">
          <label for="ingredientThreshold" class="form-label">Ngưỡng cảnh báo</label>
          <input type="number" class="form-control" id="ingredientThreshold" required>
        </div>
        <div class="mb-3">
          <label for="ingredientStock" class="form-label">Tồn kho hiện tại</label>
          <input type="number" class="form-control" id="ingredientStock" required>
        </div>
        <div class="mb-3">
          <label for="ingredientCost" class="form-label">Giá (VNĐ)</label>
          <input type="number" class="form-control" id="ingredientCost" required>
        </div>
      </form>
    `;

    // Create the modal header content
    const modalHeader = document.querySelector(
      "#ingredientModal .modal-header"
    );
    modalHeader.innerHTML = `
      <h5 class="modal-title" id="ingredientModalTitle">Thêm nguyên liệu mới</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    `;

    // Create the modal footer content
    const modalFooter = document.querySelector(
      "#ingredientModal .modal-footer"
    );
    modalFooter.innerHTML = `
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
      <button type="button" class="btn btn-primary" onclick="saveIngredient()">Lưu</button>
    `;
  }

  const formElement = document.getElementById("ingredientForm");
  if (formElement) {
    formElement.reset();
  }

  document.getElementById("editIngredientId").value = "";
  title.textContent = "Thêm nguyên liệu mới";
  modal.show();
}

async function editInventoryItem(itemId) {
  try {
    const item = await getInventoryItemById(itemId);
    if (!item) {
      showToast("Không tìm thấy nguyên liệu", "error");
      return;
    }

    const modal = new bootstrap.Modal(
      document.getElementById("ingredientModal")
    );
    const title = document.getElementById("ingredientModalTitle");

    // Make sure the form exists
    showAddIngredientModal();

    title.textContent = "Chỉnh sửa nguyên liệu";
    document.getElementById("editIngredientId").value = item.id;
    document.getElementById("ingredientId").value = item.id;
    document.getElementById("ingredientName").value = item.name;
    document.getElementById("ingredientUnit").value = item.unit;
    document.getElementById("ingredientStandard").value = item.standardAmount;
    document.getElementById("ingredientThreshold").value = item.threshold;
    document.getElementById("ingredientStock").value = item.currentStock;
    document.getElementById("ingredientCost").value = item.cost;

    // Hide the existing modal first
    const existingModal = bootstrap.Modal.getInstance(
      document.getElementById("ingredientModal")
    );
    if (existingModal) {
      existingModal.hide();
    }

    // Show the modal with updated data
    modal.show();
  } catch (error) {
    console.error("Error editing inventory item:", error);
    showToast("Lỗi khi chỉnh sửa nguyên liệu", "error");
  }
}

async function saveIngredient() {
  try {
    const editId = document.getElementById("editIngredientId").value;
    const ingredientData = {
      id: document.getElementById("ingredientId").value,
      name: document.getElementById("ingredientName").value,
      unit: document.getElementById("ingredientUnit").value,
      standardAmount: parseInt(
        document.getElementById("ingredientStandard").value || 0
      ),
      threshold: parseInt(
        document.getElementById("ingredientThreshold").value || 0
      ),
      currentStock: parseInt(
        document.getElementById("ingredientStock").value || 0
      ),
      cost: parseInt(document.getElementById("ingredientCost").value || 0),
      usedToday: editId ? undefined : 0, // Only reset for new ingredients
      variance: 0, // Default variance
    };

    if (editId) {
      // Edit existing ingredient
      await updateInventoryItem(editId, ingredientData);
      showToast("Cập nhật nguyên liệu thành công!", "success");
    } else {
      // Add new ingredient
      await addInventoryItem(ingredientData);
      showToast("Thêm nguyên liệu thành công!", "success");
    }

    // Refresh the table and alerts
    await renderInventoryTable();
    await updateInventoryAlerts();

    // Close the modal
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("ingredientModal")
    );
    if (modal) {
      modal.hide();
    }
  } catch (error) {
    console.error("Error saving inventory item:", error);
    showToast("Lỗi khi lưu nguyên liệu", "error");
  }
}

// Function to confirm deletion of an inventory item
function confirmDeleteInventoryItem(itemId) {
  if (confirm("Bạn có chắc chắn muốn xóa nguyên liệu này?")) {
    removeInventoryItem(itemId);
  }
}

// Function to delete an inventory item
async function removeInventoryItem(itemId) {
  try {
    await deleteInventoryItem(itemId);
    showToast("Xóa nguyên liệu thành công!", "success");
    await renderInventoryTable();
    await updateInventoryAlerts();
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    showToast("Lỗi khi xóa nguyên liệu", "error");
  }
}

// Function to export inventory data to Excel
function exportInventoryToExcel() {
  getAllInventoryItems()
    .then((items) => {
      // Format data for Excel
      const exportData = items.map((item) => ({
        Mã: item.id,
        "Tên nguyên liệu": item.name,
        "Đơn vị": item.unit,
        "Lượng tiêu chuẩn": item.standardAmount,
        "Tồn kho": item.currentStock,
        "Sử dụng hôm nay": item.usedToday,
        "Ngưỡng cảnh báo": item.threshold,
        "Giá (VNĐ)": item.cost,
        "Độ lệch (%)": (
          ((item.usedToday - item.standardAmount) / item.standardAmount) *
          100
        ).toFixed(1),
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Kho");

      // Generate file name with date
      const date = new Date();
      const fileName = `kho_hang_${date.getDate()}_${
        date.getMonth() + 1
      }_${date.getFullYear()}.xlsx`;

      // Export to Excel
      XLSX.writeFile(workbook, fileName);
      showToast("Xuất dữ liệu kho thành công!", "success");
    })
    .catch((error) => {
      console.error("Error exporting inventory:", error);
      showToast("Lỗi khi xuất dữ liệu kho", "error");
    });
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

  // Format header  // Nếu không có dữ liệu, tránh xử lý style
  if (ws["!ref"]) {
    const range = XLSX.utils.decode_range(ws["!ref"]);

    // SheetJS style cần plugin thêm để hoạt động đầy đủ, tạm bỏ qua style
    // Nhưng cố gắng format header với dữ liệu hiện có
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      // Kiểm tra đối tượng tồn tại trước khi gán style
      if (ws[cellAddress]) {
        // Gán một đối tượng trống để không gặp lỗi
        // Style sẽ không hoạt động trong phiên bản cơ bản của SheetJS
        if (!ws[cellAddress].s) ws[cellAddress].s = {};
      }
    }
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

// Set up real-time inventory monitoring
function setupInventoryRealTimeUpdates() {
  if (!firebase || !firebase.firestore) {
    console.warn("Firebase is not available for real-time updates");
    return;
  }

  // Listen for changes in the orders collection
  const orderQuery = firebase
    .firestore()
    .collection("orders")
    .where("status", "==", "ready");

  const unsubscribeOrders = orderQuery.onSnapshot(
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        // Only care about newly "ready" orders
        if (change.type === "added" || change.type === "modified") {
          const orderData = change.doc.data();
          const orderId = change.doc.id;

          // If the order status is now "ready", update inventory
          if (orderData.status === "ready") {
            console.log("Order marked as ready, updating inventory:", orderId);

            if (window.updateInventoryFromReadyOrder) {
              window
                .updateInventoryFromReadyOrder(orderId)
                .then(() => {
                  console.log("Inventory updated for order:", orderId);

                  // Refresh inventory views if we're on the inventory tab
                  const inventoryTab = document.getElementById("inventory-tab");
                  if (
                    inventoryTab &&
                    inventoryTab.classList.contains("active")
                  ) {
                    renderInventoryTable();
                    updateInventoryAlerts();
                  }
                })
                .catch((error) => {
                  console.error("Failed to update inventory:", error);
                });
            }
          }
        }
      });
    },
    (error) => {
      console.error("Error setting up real-time order listener:", error);
    }
  );

  // Listen for changes in inventory directly
  const inventoryQuery = firebase.firestore().collection("inventory");

  const unsubscribeInventory = inventoryQuery.onSnapshot(
    (snapshot) => {
      const inventoryTab = document.getElementById("inventory-tab");
      if (inventoryTab && inventoryTab.classList.contains("active")) {
        renderInventoryTable();
        updateInventoryAlerts();
      }
    },
    (error) => {
      console.error("Error setting up real-time inventory listener:", error);
    }
  );

  // Store unsubscribe functions for cleanup when needed
  window.unsubscribeFirestoreListeners = [
    unsubscribeOrders,
    unsubscribeInventory,
  ];
}

// Call this function during initialization
document.addEventListener("DOMContentLoaded", function () {
  // ...existing code...

  // Setup real-time inventory monitoring if Firebase is available
  setTimeout(() => {
    if (window.firebase && window.firebase.firestore) {
      setupInventoryRealTimeUpdates();
    }
  }, 2000); // Give Firebase time to initialize
});
