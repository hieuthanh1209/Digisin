// Manager Dashboard JavaScript

// Global Variables & Data
let isEditingFinanceTransaction = false; // Flag to track if we're editing a transaction

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
  showTab("overview");

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
    setupEventListeners(); // Initialize finance management
    await renderFinanceTable();
    setupFinanceEventListeners();

    // Setup auto-sync for orders
    setupAutoSyncOrders();

    // Auto sync new paid orders on startup
    try {
      console.log("Auto-syncing new paid orders...");
      const results = await autoSyncNewPaidOrders();
      if (results.processed > 0) {
        console.log(`Auto-synced ${results.processed} new orders to finance`);
        // Refresh finance table if any orders were processed
        await renderFinanceTable();
      }
    } catch (error) {
      console.error("Error auto-syncing orders:", error);
    }
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

  // Setup password input event listener for strength checking
  const passwordInput = document.getElementById("staffPassword");
  if (passwordInput) {
    passwordInput.addEventListener("input", function () {
      checkPasswordStrength(this.value);
    });
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
    overview: "Tổng quan hệ thống",
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
  } // Load data for specific tabs
  if (tabName === "overview") {
    loadOverviewData();
  } else if (tabName === "finance") {
    renderFinanceTable();
  } else if (tabName === "inventory") {
    renderInventoryTable();
    updateInventoryAlerts();
  } else if (tabName === "staff") {
    renderStaffTable();
  } else if (tabName === "menu") {
    renderMenuItems();
  } else if (tabName === "analytics") {
    loadAdvancedAnalytics();
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
            <td>${staff.uid || staff.id}</td>            <td>${
        staff.displayName || staff.name || ""
      }</td>
            <td>${displayPositionInVietnamese(staff)}</td>
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

// Helper function to display Vietnamese position name based on role
function displayPositionInVietnamese(staff) {
  // If positionDisplay is available, use that
  if (staff.positionDisplay) return staff.positionDisplay;

  // Otherwise map from English role to Vietnamese
  const roleMap = {
    waiter: "Phục vụ",
    cashier: "Thu ngân",
    manager: "Quản lý",
    chef: "Đầu bếp",
  };

  // Use the mapped value or fallback to original role/position
  return roleMap[staff.role] || staff.role || staff.position || "";
}

function showAddStaffModal() {
  const modal = new bootstrap.Modal(document.getElementById("staffModal"));
  const form = document.getElementById("staffForm");
  const title = document.getElementById("staffModalTitle");

  form.reset();
  document.getElementById("editStaffId").value = "";
  title.textContent = "Thêm nhân viên mới";

  // Setup password management for add mode
  if (typeof setupStaffModalMode === "function") {
    setupStaffModalMode(false); // false = add mode
  }

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

    // Map English role back to Vietnamese for the dropdown
    let positionDisplay = staff.positionDisplay;
    if (!positionDisplay) {
      // Convert English role to Vietnamese if positionDisplay is not set
      switch (staff.role) {
        case "waiter":
          positionDisplay = "Phục vụ";
          break;
        case "cashier":
          positionDisplay = "Thu ngân";
          break;
        case "manager":
          positionDisplay = "Quản lý";
          break;
        case "chef":
          positionDisplay = "Đầu bếp";
          break;
        default:
          positionDisplay = staff.role || staff.position || "";
      }
    }
    document.getElementById("staffPosition").value = positionDisplay;
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

    // Setup password management for edit mode
    if (typeof setupStaffModalMode === "function") {
      setupStaffModalMode(true); // true = edit mode
    }

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

    // Map Vietnamese position to English for Firestore
    const positionValue = document.getElementById("staffPosition").value;
    let roleForFirestore = positionValue;

    // Map Vietnamese position to English role value
    switch (positionValue) {
      case "Phục vụ":
        roleForFirestore = "waiter";
        break;
      case "Thu ngân":
        roleForFirestore = "cashier";
        break;
      case "Quản lý":
        roleForFirestore = "manager";
        break;
      case "Đầu bếp":
        roleForFirestore = "chef";
        break;
      default:
        roleForFirestore = positionValue;
    }

    const staffData = {
      displayName: document.getElementById("staffName").value,
      role: roleForFirestore, // Use the mapped English value
      positionDisplay: positionValue, // Keep original Vietnamese value for display
      phoneNumber: document.getElementById("staffPhone").value,
      email: document.getElementById("staffEmail").value,
      startDate: document.getElementById("staffStartDate").value,
      salary: parseInt(document.getElementById("staffSalary").value) || 0,
      status: "active",
    };
    if (editId) {
      // Edit existing staff
      const changePasswordCheckbox = document.getElementById(
        "changePasswordCheckbox"
      );
      const password = document.getElementById("staffPassword").value;

      // Check if password change is requested
      if (changePasswordCheckbox && changePasswordCheckbox.checked) {
        if (!password) {
          showToast("Vui lòng nhập mật khẩu mới", "error");
          return;
        }

        if (password.length < 6) {
          showToast("Mật khẩu phải có ít nhất 6 ký tự", "error");
          return;
        }

        try {
          // Update password in Firebase Authentication
          // Note: This would require admin SDK or re-authentication in a real implementation
          // For now, we'll just show a message about password change
          showToast(
            "Cập nhật nhân viên thành công! Lưu ý: Để đổi mật khẩu, nhân viên cần đăng nhập và đổi mật khẩu thông qua tính năng quên mật khẩu.",
            "warning"
          );
        } catch (error) {
          console.error("Error updating password:", error);
          showToast("Lỗi khi cập nhật mật khẩu: " + error.message, "error");
        }
      }

      await updateStaffMember(editId, staffData);
      showToast("Cập nhật nhân viên thành công!", "success");
    } else {
      // Add new staff
      const staffId = document.getElementById("staffId").value;
      const password = document.getElementById("staffPassword").value;

      // Validate password when creating a new staff
      if (!password) {
        showToast(
          "Vui lòng nhập mật khẩu để tạo tài khoản đăng nhập cho nhân viên mới",
          "error"
        );
        return;
      }

      try {
        // Step 1: Create Firebase Authentication account
        const firebaseUser = await createFirebaseUser(
          staffData.email,
          password
        );

        // Step 2: Use the Authentication UID for the Firestore document
        await addStaffMember({
          ...staffData,
          uid: firebaseUser.uid, // Use the UID from Firebase Auth
          profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            staffData.displayName
          )}&background=random`,
        });

        showToast(
          "Thêm nhân viên và tạo tài khoản đăng nhập thành công!",
          "success"
        );
      } catch (authError) {
        // Handle specific Firebase Authentication errors
        if (authError.code === "auth/email-already-in-use") {
          showToast(
            "Email này đã được sử dụng, vui lòng chọn email khác",
            "error"
          );
          return;
        } else if (authError.code === "auth/weak-password") {
          showToast(
            "Mật khẩu quá yếu, vui lòng sử dụng mật khẩu mạnh hơn",
            "error"
          );
          return;
        } else {
          showToast(`Lỗi tạo tài khoản: ${authError.message}`, "error");
          return;
        }
      }
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
async function loadAdvancedAnalytics() {
  try {
    // Show loading state
    showAnalyticsLoading();

    // Load all necessary data from Firestore
    const [orders, menuItems, financeTransactions] = await Promise.all([
      getAllOrders(),
      getAllMenuItems(),
      getAllFinanceTransactions(),
    ]);

    // Process and render analytics
    await renderAdvancedAnalytics(orders, menuItems, financeTransactions);
  } catch (error) {
    console.error("Error loading advanced analytics:", error);
    showAnalyticsError();
  }
}

function showAnalyticsLoading() {
  const containers = [
    "topSellingItems",
    "categoryRevenueChart",
    "dailyItemsTable",
  ];

  containers.forEach((containerId) => {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="text-center py-4">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
        </div>
      `;
    }
  });
}

function showAnalyticsError() {
  const containers = [
    "topSellingItems",
    "categoryRevenueChart",
    "dailyItemsTable",
  ];

  containers.forEach((containerId) => {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="text-center py-4">
          <div class="text-danger">
            <i class="fas fa-exclamation-circle fa-2x mb-2"></i>
            <p>Lỗi khi tải dữ liệu thống kê</p>
            <button class="btn btn-outline-primary btn-sm" onclick="loadAdvancedAnalytics()">
              Thử lại
            </button>
          </div>
        </div>
      `;
    }
  });
}

async function renderAdvancedAnalytics(orders, menuItems, financeTransactions) {
  // Process orders data for analytics
  const paidOrders = orders.filter((order) => order.paymentStatus === "paid");
  const today = new Date();
  const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Filter orders from last 30 days
  const recentOrders = paidOrders.filter((order) => {
    const orderDate = order.createdAt || new Date(order.timestamp);
    return orderDate >= last30Days;
  });

  // Calculate analytics data
  const analyticsData = processOrdersForAnalytics(recentOrders, menuItems);

  // Render components
  renderTopSellingItemsFromFirestore(analyticsData.topItems);
  renderCategoryRevenueChartFromFirestore(analyticsData.categoryRevenue);
  renderDailyItemsTableFromFirestore(analyticsData.itemsAnalysis);
  renderRevenueByTimeChart(recentOrders);
  renderProfitabilityAnalysis(analyticsData.profitability);
}

function processOrdersForAnalytics(orders, menuItems) {
  const itemSales = {};
  const categoryRevenue = {};
  let totalRevenue = 0;

  // Create menu item lookup
  const menuLookup = {};
  menuItems.forEach((item) => {
    menuLookup[item.id] = item;
  });

  // Process each order
  orders.forEach((order) => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((orderItem) => {
        const menuItem = menuLookup[orderItem.id];
        if (menuItem) {
          const itemId = orderItem.id;
          const quantity = orderItem.quantity || 1;
          const price = orderItem.price || menuItem.price;
          const revenue = price * quantity;

          // Track item sales
          if (!itemSales[itemId]) {
            itemSales[itemId] = {
              id: itemId,
              name: menuItem.name,
              category: menuItem.category,
              price: menuItem.price,
              cost: menuItem.cost || 0,
              sold: 0,
              revenue: 0,
            };
          }

          itemSales[itemId].sold += quantity;
          itemSales[itemId].revenue += revenue;

          // Track category revenue
          const category = menuItem.category || "Khác";
          categoryRevenue[category] =
            (categoryRevenue[category] || 0) + revenue;

          totalRevenue += revenue;
        }
      });
    }
  });

  // Convert to arrays and sort
  const topItems = Object.values(itemSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  const itemsAnalysis = Object.values(itemSales)
    .map((item) => ({
      ...item,
      profit: item.revenue - item.sold * item.cost,
      profitMargin:
        item.revenue > 0
          ? ((item.revenue - item.sold * item.cost) / item.revenue) * 100
          : 0,
    }))
    .sort((a, b) => b.sold - a.sold);

  return {
    topItems,
    categoryRevenue,
    itemsAnalysis,
    profitability: {
      totalRevenue,
      totalCost: itemsAnalysis.reduce(
        (sum, item) => sum + item.sold * item.cost,
        0
      ),
    },
  };
}

function renderTopSellingItemsFromFirestore(topItems) {
  const container = document.getElementById("topSellingItems");
  if (!container) return;

  container.innerHTML = "";

  if (topItems.length === 0) {
    container.innerHTML = `
      <div class="text-center py-4">
        <p class="text-muted">Chưa có dữ liệu bán hàng</p>
      </div>
    `;
    return;
  }

  topItems.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className =
      "d-flex align-items-center justify-content-between p-3 border-bottom";
    itemDiv.innerHTML = `
      <div class="d-flex align-items-center">
        <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
          <span class="fw-bold text-primary">${index + 1}</span>
        </div>
        <div>
          <h6 class="mb-1">${item.name}</h6>
          <small class="text-muted">${item.sold} phần</small>
        </div>
      </div>
      <div class="text-end">
        <div class="fw-bold">${formatCurrency(item.revenue)}</div>
        <small class="text-muted">${formatCurrency(item.price)}/phần</small>
      </div>
    `;
    container.appendChild(itemDiv);
  });
}

function renderCategoryRevenueChartFromFirestore(categoryRevenue) {
  const ctx = document.getElementById("categoryRevenueChart");
  if (!ctx) return;

  if (
    window.categoryRevenueChart &&
    typeof window.categoryRevenueChart.destroy === "function"
  ) {
    window.categoryRevenueChart.destroy();
  }

  const categories = Object.keys(categoryRevenue);
  const revenues = Object.values(categoryRevenue);

  if (categories.length === 0) {
    ctx.parentElement.innerHTML = `
      <div class="text-center py-4">
        <p class="text-muted">Chưa có dữ liệu doanh thu theo danh mục</p>
      </div>
    `;
    return;
  }
  const colors = [
    "#0d6efd",
    "#198754",
    "#ffc107",
    "#dc3545",
    "#6f42c1",
    "#fd7e14",
    "#20c997",
    "#e83e8c",
  ];

  try {
    window.categoryRevenueChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: categories,
        datasets: [
          {
            data: revenues,
            backgroundColor: colors.slice(0, categories.length),
            borderWidth: 2,
            borderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 20,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return `${context.label}: ${formatCurrency(
                  context.parsed
                )} (${percentage}%)`;
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error creating category revenue chart:", error);
    ctx.parentElement.innerHTML = `
      <div class="text-center py-4">
        <p class="text-danger">Lỗi khi tạo biểu đồ doanh thu theo danh mục</p>
      </div>
    `;
  }
}

function renderDailyItemsTableFromFirestore(itemsAnalysis) {
  const tbody = document.getElementById("dailyItemsTable");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (itemsAnalysis.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-4">
          <p class="text-muted mb-0">Chưa có dữ liệu món ăn</p>
        </td>
      </tr>
    `;
    return;
  }

  itemsAnalysis.slice(0, 20).forEach((item) => {
    const row = document.createElement("tr");
    const profitClass = item.profit > 0 ? "text-success" : "text-danger";
    const marginClass =
      item.profitMargin > 30
        ? "bg-success"
        : item.profitMargin > 15
        ? "bg-warning"
        : "bg-danger";

    row.innerHTML = `
      <td>
        <div class="fw-medium">${item.name}</div>
        <small class="text-muted">${formatCurrency(item.price)}</small>
      </td>
      <td><span class="badge bg-secondary">${
        item.category || "Khác"
      }</span></td>
      <td class="text-center">
        <span class="fw-bold">${item.sold}</span>
      </td>
      <td class="text-end">${formatCurrency(item.revenue)}</td>
      <td class="text-end ${profitClass}">
        ${formatCurrency(item.profit)}
      </td>
      <td class="text-center">
        <span class="badge ${marginClass}">
          ${item.profitMargin.toFixed(1)}%
        </span>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function renderRevenueByTimeChart(orders) {
  const ctx = document.getElementById("revenueByTimeChart");
  if (!ctx) return;

  // Group orders by day for the last 7 days
  const last7Days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    last7Days.push({
      date: date,
      label: date.toLocaleDateString("vi-VN", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
      }),
      revenue: 0,
    });
  }

  // Calculate revenue for each day
  orders.forEach((order) => {
    const orderDate = order.createdAt || new Date(order.timestamp);
    const dayIndex = last7Days.findIndex(
      (day) => day.date.toDateString() === orderDate.toDateString()
    );

    if (dayIndex !== -1) {
      last7Days[dayIndex].revenue += order.total || 0;
    }
  });

  if (
    window.revenueByTimeChart &&
    typeof window.revenueByTimeChart.destroy === "function"
  ) {
    window.revenueByTimeChart.destroy();
  }
  try {
    window.revenueByTimeChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: last7Days.map((day) => day.label),
        datasets: [
          {
            label: "Doanh thu (VNĐ)",
            data: last7Days.map((day) => day.revenue),
            borderColor: "#0d6efd",
            backgroundColor: "rgba(13, 110, 253, 0.1)",
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#0d6efd",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
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
                return formatCurrency(value);
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error creating revenue by time chart:", error);
    ctx.parentElement.innerHTML = `
      <div class="text-center py-4">
        <p class="text-danger">Lỗi khi tạo biểu đồ xu hướng doanh thu</p>
      </div>
    `;
  }
}

function renderProfitabilityAnalysis(profitability) {
  const container = document.getElementById("profitabilityAnalysis");
  if (!container) return;

  const netProfit = profitability.totalRevenue - profitability.totalCost;
  const profitMargin =
    profitability.totalRevenue > 0
      ? (netProfit / profitability.totalRevenue) * 100
      : 0;

  container.innerHTML = `
    <div class="row g-3">
      <div class="col-md-3">
        <div class="card bg-primary bg-opacity-10 border-0">
          <div class="card-body text-center">
            <h5 class="text-primary mb-1">${formatCurrency(
              profitability.totalRevenue
            )}</h5>
            <small class="text-muted">Tổng doanh thu</small>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-warning bg-opacity-10 border-0">
          <div class="card-body text-center">
            <h5 class="text-warning mb-1">${formatCurrency(
              profitability.totalCost
            )}</h5>
            <small class="text-muted">Tổng chi phí</small>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-${
          netProfit >= 0 ? "success" : "danger"
        } bg-opacity-10 border-0">
          <div class="card-body text-center">
            <h5 class="text-${
              netProfit >= 0 ? "success" : "danger"
            } mb-1">${formatCurrency(netProfit)}</h5>
            <small class="text-muted">Lợi nhuận ròng</small>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-info bg-opacity-10 border-0">
          <div class="card-body text-center">
            <h5 class="text-info mb-1">${profitMargin.toFixed(1)}%</h5>
            <small class="text-muted">Tỷ lệ lợi nhuận</small>
          </div>
        </div>
      </div>
    </div>
  `;
}

function updateAnalytics() {
  // This function is kept for backward compatibility
  // The new loadAdvancedAnalytics() function handles Firestore integration
  loadAdvancedAnalytics();
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

async function showAddMenuItemModal() {
  try {
    const modal = new bootstrap.Modal(document.getElementById("menuItemModal"));

    // Fix modal layout
    fixModalLayout();

    document.getElementById("menuModalTitle").textContent = "Thêm món mới";

    // Reset form with complete HTML structure
    const form = document.getElementById("menuItemForm");
    form.innerHTML = `
      <div class="row">
        <input type="hidden" id="menuItemId" value="">
        <div class="col-md-6 mb-3">
          <label for="menuItemName" class="form-label">Tên món</label>
          <input type="text" class="form-control" id="menuItemName" required>
        </div>
        <div class="col-md-6 mb-3">
          <label for="menuItemCategory" class="form-label">Danh mục</label>
          <input type="text" class="form-control" id="menuItemCategory" required>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="menuItemPrice" class="form-label">Giá bán (VNĐ)</label>
          <input type="number" class="form-control" id="menuItemPrice" required>
        </div>
        <div class="col-md-6 mb-3">
          <label for="menuItemCost" class="form-label">Giá vốn (VNĐ)</label>
          <input type="number" class="form-control" id="menuItemCost">
        </div>
      </div>
      <div class="mb-3">
        <label for="menuItemImage" class="form-label">URL Hình ảnh</label>
        <input type="url" class="form-control" id="menuItemImage" placeholder="https://example.com/image.jpg">
        <div id="menuItemImagePreview" class="mt-2">
          <small class="text-muted">Nhập URL hình ảnh để hiển thị xem trước</small>
        </div>
      </div>
      <div class="mb-3">
        <label for="menuItemDescription" class="form-label">Mô tả</label>
        <textarea class="form-control" id="menuItemDescription" rows="2"></textarea>
      </div>
      <div class="mb-3">
        <label for="menuItemStatus" class="form-label">Trạng thái</label>
        <select class="form-select" id="menuItemStatus">
          <option value="active" selected>Đang bán</option>
          <option value="inactive">Ngưng bán</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label d-flex justify-content-between">
          <span>Nguyên liệu</span>
          <button type="button" class="btn btn-sm btn-outline-primary" onclick="addIngredientRow()">
            <i data-lucide="plus" class="icon-sm"></i> Thêm nguyên liệu
          </button>
        </label>
        <div id="ingredientsList" class="border rounded p-3 bg-light">
          <div class="text-muted small mt-2">Chọn nguyên liệu và nhập định lượng cần thiết cho món ăn này</div>
        </div>
      </div>
    `;

    // Add one empty ingredient row by default
    await addIngredientRow();

    // Setup image preview
    setupImagePreview();

    lucide.createIcons();
    modal.show();
  } catch (error) {
    console.error("Error showing add menu item modal:", error);
    showToast("Lỗi khi mở form thêm món ăn: " + error.message, "danger");
  }
}

// Fix modal layout to ensure footer is always visible
function fixModalLayout() {
  const modal = document.getElementById("menuItemModal");
  const modalDialog = modal.querySelector(".modal-dialog");
  const modalContent = modal.querySelector(".modal-content");
  const modalBody = modal.querySelector(".modal-body");
  const modalFooter = modal.querySelector(".modal-footer");

  // Apply inline styles to ensure proper layout
  if (modalDialog) {
    modalDialog.style.maxHeight = "90vh";
    modalDialog.style.display = "flex";
    modalDialog.style.alignItems = "center";
    modalDialog.style.margin = "30px auto";
  }

  if (modalContent) {
    modalContent.style.maxHeight = "85vh";
    modalContent.style.display = "flex";
    modalContent.style.flexDirection = "column";
    modalContent.style.width = "100%";
  }

  if (modalBody) {
    modalBody.style.flex = "1 1 auto";
    modalBody.style.overflowY = "auto";
    modalBody.style.maxHeight = "calc(85vh - 160px)";
    modalBody.style.padding = "1.5rem";
  }

  if (modalFooter) {
    modalFooter.style.flexShrink = "0";
    modalFooter.style.position = "sticky";
    modalFooter.style.bottom = "0";
    modalFooter.style.background = "#fff";
    modalFooter.style.zIndex = "1000";
    modalFooter.style.borderTop = "1px solid #e9ecef";
    modalFooter.style.padding = "1.5rem";
  }
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

    // Fix modal layout
    fixModalLayout();

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
    document.getElementById("menuItemId").value = itemId; // Add ingredient rows
    const ingredientsList = document.getElementById("ingredientsList");
    if (menuItem.ingredients && menuItem.ingredients.length > 0) {
      for (const ingredient of menuItem.ingredients) {
        if (typeof ingredient === "object") {
          await addIngredientRow(
            ingredient.id,
            ingredient.amount,
            ingredient.unit,
            ingredient.name
          );
        } else {
          // For backward compatibility with string ingredients
          await addIngredientRow(null, 0, "", ingredient);
        }
      }
    } else {
      // Add one empty row
      await addIngredientRow();
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
      const ingredientSelect = row.querySelector(".ingredient-select");
      const amountInput = row.querySelector(".ingredient-amount");
      const unitSelect = row.querySelector(".ingredient-unit");

      if (
        ingredientSelect &&
        ingredientSelect.value &&
        amountInput.value &&
        unitSelect.value
      ) {
        const selectedOption =
          ingredientSelect.options[ingredientSelect.selectedIndex];
        const unitOption = unitSelect.options[unitSelect.selectedIndex];

        const ingredientId = ingredientSelect.value;
        const ingredientName = selectedOption.getAttribute("data-name");
        const amount = parseFloat(amountInput.value) || 0;
        const unit = unitSelect.value;
        const baseUnit = selectedOption.getAttribute("data-unit");
        const ratio = parseFloat(unitOption.getAttribute("data-ratio")) || 1;

        // Calculate base amount for inventory deduction
        const baseAmount = amount * ratio;

        ingredients.push({
          id: ingredientId,
          name: ingredientName,
          amount: amount,
          unit: unit,
          baseAmount: baseAmount, // Amount in inventory base unit
          baseUnit: baseUnit, // Base unit for inventory calculations
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
  }
}

// Function to add an ingredient row to the menu item form
async function addIngredientRow(id = null, amount = "", unit = "", name = "") {
  const ingredientsList = document.getElementById("ingredientsList");
  if (!ingredientsList) return;

  // Get all inventory items for the dropdown
  let inventoryItems = [];
  try {
    if (typeof getAllInventoryItems === "function") {
      inventoryItems = await getAllInventoryItems();
    }
  } catch (error) {
    console.error("Error loading inventory items:", error);
  }

  const rowId = "ingredient-" + Date.now();

  // Create ingredient options
  const ingredientOptions = inventoryItems
    .map(
      (item) =>
        `<option value="${item.id}" data-name="${item.name}" data-unit="${
          item.unit
        }" ${id === item.id ? "selected" : ""}>
      ${item.name} (${item.unit})
    </option>`
    )
    .join("");

  // Unit conversion options based on common cooking measurements
  const unitConversions = {
    kg: [
      { value: "kg", label: "Kilogram (kg)", ratio: 1 },
      { value: "gram", label: "Gram (g)", ratio: 0.001 },
      { value: "lạng", label: "Lạng", ratio: 0.1 },
    ],
    lít: [
      { value: "lít", label: "Lít (l)", ratio: 1 },
      { value: "ml", label: "Mililit (ml)", ratio: 0.001 },
      { value: "chén", label: "Chén (~250ml)", ratio: 0.25 },
    ],
    hộp: [
      { value: "hộp", label: "Hộp", ratio: 1 },
      { value: "cái", label: "Cái/Túi", ratio: 1 },
      { value: "gói", label: "Gói", ratio: 1 },
    ],
    quả: [
      { value: "quả", label: "Quả", ratio: 1 },
      { value: "cái", label: "Cái", ratio: 1 },
    ],
  };

  const rowHtml = `
    <div class="row mb-3 ingredient-row p-3 border rounded bg-white" id="${rowId}">
      <div class="col-md-5">
        <label class="form-label text-muted small">Nguyên liệu</label>
        <select class="form-select ingredient-select" data-row-id="${rowId}">
          <option value="">-- Chọn nguyên liệu --</option>
          ${ingredientOptions}
        </select>
      </div>
      <div class="col-md-2">
        <label class="form-label text-muted small">Số lượng</label>
        <input type="number" class="form-control ingredient-amount" 
          placeholder="0" value="${amount}" min="0" step="0.1" data-row-id="${rowId}">
      </div>
      <div class="col-md-3">
        <label class="form-label text-muted small">Đơn vị tính</label>
        <select class="form-select ingredient-unit" data-row-id="${rowId}">
          <option value="">Chọn đơn vị</option>
        </select>
      </div>
      <div class="col-md-2 d-flex align-items-end">
        <div class="w-100">
          <button type="button" class="btn btn-outline-danger btn-sm w-100" onclick="removeIngredientRow('${rowId}')" title="Xóa nguyên liệu">
            <i data-lucide="trash-2" class="icon-sm"></i>
          </button>
          <div class="mt-1">
            <small class="text-muted conversion-info" id="conversion-${rowId}"></small>
          </div>
        </div>
      </div>
    </div>
  `;

  ingredientsList.insertAdjacentHTML("beforeend", rowHtml);

  // Add event listeners for the new row
  setupIngredientRowEvents(rowId, unitConversions);

  // Pre-select if values are provided
  if (id) {
    const select = document.querySelector(`#${rowId} .ingredient-select`);
    select.value = id;
    await updateUnitOptions(rowId, unitConversions);

    if (unit) {
      const unitSelect = document.querySelector(`#${rowId} .ingredient-unit`);
      unitSelect.value = unit;
      updateConversionInfo(rowId);
    }
  }

  lucide.createIcons(); // Re-initialize icons
}

// Setup event listeners for ingredient row
function setupIngredientRowEvents(rowId, unitConversions) {
  const ingredientSelect = document.querySelector(
    `#${rowId} .ingredient-select`
  );
  const amountInput = document.querySelector(`#${rowId} .ingredient-amount`);
  const unitSelect = document.querySelector(`#${rowId} .ingredient-unit`);

  // When ingredient is selected, update unit options
  ingredientSelect.addEventListener("change", async function () {
    await updateUnitOptions(rowId, unitConversions);
    updateConversionInfo(rowId);
  });

  // When amount or unit changes, update conversion info
  amountInput.addEventListener("input", () => updateConversionInfo(rowId));
  unitSelect.addEventListener("change", () => updateConversionInfo(rowId));
}

// Update unit options based on selected ingredient
async function updateUnitOptions(rowId, unitConversions) {
  const ingredientSelect = document.querySelector(
    `#${rowId} .ingredient-select`
  );
  const unitSelect = document.querySelector(`#${rowId} .ingredient-unit`);

  if (!ingredientSelect.value) {
    unitSelect.innerHTML = '<option value="">Chọn đơn vị</option>';
    return;
  }

  const selectedOption =
    ingredientSelect.options[ingredientSelect.selectedIndex];
  const baseUnit = selectedOption.getAttribute("data-unit");

  // Get available conversions for this base unit
  const availableUnits = unitConversions[baseUnit] || [
    { value: baseUnit, label: baseUnit, ratio: 1 },
  ];

  const unitOptions = availableUnits
    .map(
      (unit) =>
        `<option value="${unit.value}" data-ratio="${unit.ratio}" data-base-unit="${baseUnit}">
      ${unit.label}
    </option>`
    )
    .join("");

  unitSelect.innerHTML = '<option value="">Chọn đơn vị</option>' + unitOptions;
}

// Update conversion information display
function updateConversionInfo(rowId) {
  const ingredientSelect = document.querySelector(
    `#${rowId} .ingredient-select`
  );
  const amountInput = document.querySelector(`#${rowId} .ingredient-amount`);
  const unitSelect = document.querySelector(`#${rowId} .ingredient-unit`);
  const conversionInfo = document.getElementById(`conversion-${rowId}`);

  if (!ingredientSelect.value || !unitSelect.value || !amountInput.value) {
    conversionInfo.textContent = "";
    return;
  }

  const selectedOption =
    ingredientSelect.options[ingredientSelect.selectedIndex];
  const unitOption = unitSelect.options[unitSelect.selectedIndex];
  const baseUnit = selectedOption.getAttribute("data-unit");
  const ratio = parseFloat(unitOption.getAttribute("data-ratio")) || 1;
  const amount = parseFloat(amountInput.value) || 0;

  // Calculate the amount in base unit (for inventory deduction)
  const baseAmount = amount * ratio;

  if (unitSelect.value !== baseUnit) {
    conversionInfo.innerHTML = `≈ ${baseAmount} ${baseUnit}`;
    conversionInfo.className = "text-primary small conversion-info";
  } else {
    conversionInfo.textContent = "";
  }
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
      variance: 0, // Default variance
    };

    // Only set usedToday for new ingredients, not when editing
    if (!editId) {
      ingredientData.usedToday = 0;
    }

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

function showToast(message, type = "info", duration = 4000) {
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
  const toast = new bootstrap.Toast(toastElement, { delay: duration });
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
async function renderFinanceTable(data = null) {
  const tableBody = document.getElementById("financeTableBody");
  const emptyState = document.getElementById("financeEmptyState");

  if (!tableBody) return;

  // Clear table
  tableBody.innerHTML = "";

  // Get data to render
  let financeData;
  if (data) {
    financeData = data;
  } else {
    try {
      financeData = await getAllFinanceTransactions();
    } catch (error) {
      console.error("Error loading finance transactions:", error);
      showToast("Không thể tải dữ liệu thu chi!", "error");
      return;
    }
  }

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

    // Format date
    const transactionDate =
      transaction.date instanceof Date
        ? transaction.date
        : new Date(transaction.date); // Add invoice button if transaction has orderId
    let invoiceButton = "";
    if (transaction.orderId) {
      invoiceButton = `
        <button type="button" class="btn btn-outline-info btn-sm me-1" onclick="viewInvoiceDetails('${transaction.id}')" title="Xem hóa đơn">
          <i data-lucide="receipt" style="width: 14px; height: 14px;"></i>
        </button>
      `;
    }

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${transaction.code}</td>
      <td>${formatDate(transactionDate)}</td>
      <td>${typeDisplay}</td>
      <td>${categoryMap[transaction.category] || transaction.category}</td>
      <td>${transaction.description}</td>
      <td class="${amountStyle}">${amountFormatted}</td>
      <td>${transaction.note || "-"}</td>
      <td>
        <div class="btn-group btn-group-sm">
          ${invoiceButton}
          <button type="button" class="btn btn-outline-primary" onclick="editFinanceTransaction('${
            transaction.id
          }')">
            <i data-lucide="edit" style="width: 16px; height: 16px;"></i>
          </button>
          <button type="button" class="btn btn-outline-danger" onclick="confirmDeleteFinanceTransaction('${
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

async function updateFinanceSummary(data = null) {
  let financeData;
  if (data) {
    financeData = data;
  } else {
    try {
      financeData = await getAllFinanceTransactions();
    } catch (error) {
      console.error("Error loading finance data for summary:", error);
      return;
    }
  }

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
    const transDate =
      transaction.date instanceof Date
        ? transaction.date
        : new Date(transaction.date);
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

async function filterFinanceTransactions() {
  const startDate = document.getElementById("financeStartDate").value;
  const endDate = document.getElementById("financeEndDate").value;
  const type = document.getElementById("financeType").value;
  const category = document.getElementById("financeCategory").value;

  try {
    let filteredData;

    // Get data based on filters
    if (startDate && endDate) {
      filteredData = await getFinanceTransactionsByDateRange(
        startDate,
        endDate
      );
    } else {
      filteredData = await getAllFinanceTransactions();
    }

    // Apply additional filters
    if (type && type !== "all") {
      filteredData = filteredData.filter(
        (transaction) => transaction.type === type
      );
    }

    if (category && category !== "all") {
      filteredData = filteredData.filter(
        (transaction) => transaction.category === category
      );
    }

    // Apply date range filter if only one date is provided
    if (startDate && !endDate) {
      filteredData = filteredData.filter((transaction) => {
        const transDate =
          transaction.date instanceof Date
            ? transaction.date
            : new Date(transaction.date);
        return transDate >= new Date(startDate);
      });
    }

    if (endDate && !startDate) {
      filteredData = filteredData.filter((transaction) => {
        const transDate =
          transaction.date instanceof Date
            ? transaction.date
            : new Date(transaction.date);
        return transDate <= new Date(endDate);
      });
    }

    // Render filtered data
    renderFinanceTable(filteredData);
  } catch (error) {
    console.error("Error filtering finance transactions:", error);
    showToast("Không thể lọc dữ liệu thu chi!", "error");
  }
}

async function exportFinanceToExcel() {
  try {
    // Get filtered data
    const startDate = document.getElementById("financeStartDate").value;
    const endDate = document.getElementById("financeEndDate").value;
    const type = document.getElementById("financeType").value;
    const category = document.getElementById("financeCategory").value;

    let filteredData;

    // Get data based on filters
    if (startDate && endDate) {
      filteredData = await getFinanceTransactionsByDateRange(
        startDate,
        endDate
      );
    } else {
      filteredData = await getAllFinanceTransactions();
    }

    // Apply additional filters
    if (type && type !== "all") {
      filteredData = filteredData.filter(
        (transaction) => transaction.type === type
      );
    }

    if (category && category !== "all") {
      filteredData = filteredData.filter(
        (transaction) => transaction.category === category
      );
    }

    // Apply date range filter if only one date is provided
    if (startDate && !endDate) {
      filteredData = filteredData.filter((transaction) => {
        const transDate =
          transaction.date instanceof Date
            ? transaction.date
            : new Date(transaction.date);
        return transDate >= new Date(startDate);
      });
    }

    if (endDate && !startDate) {
      filteredData = filteredData.filter((transaction) => {
        const transDate =
          transaction.date instanceof Date
            ? transaction.date
            : new Date(transaction.date);
        return transDate <= new Date(endDate);
      });
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
      Ngày: formatDate(
        transaction.date instanceof Date
          ? transaction.date
          : new Date(transaction.date)
      ),
      "Loại phiếu": transaction.type === "income" ? "Thu" : "Chi",
      "Danh mục": categoryMap[transaction.category] || transaction.category,
      "Mô tả": transaction.description,
      "Số tiền (VNĐ)": transaction.amount,
      "Phương thức":
        paymentMethodMap[transaction.paymentMethod] ||
        transaction.paymentMethod,
      "Ghi chú": transaction.note || "",
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Format header
    if (ws["!ref"]) {
      const range = XLSX.utils.decode_range(ws["!ref"]);

      // Format header row
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (ws[cellAddress]) {
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
  } catch (error) {
    console.error("Error exporting finance data to Excel:", error);
    showToast("Không thể xuất báo cáo thu chi!", "error");
  }
}

async function editFinanceTransaction(id) {
  try {
    // Set editing flag
    isEditingFinanceTransaction = true;

    const transaction = await getFinanceTransactionById(id);
    if (!transaction) {
      showToast("Không tìm thấy phiếu thu/chi!", "error");
      isEditingFinanceTransaction = false;
      return;
    }

    // Populate basic form fields
    document.getElementById("editFinanceId").value = transaction.id;
    document.getElementById("financeCode").value = transaction.code;

    // Format date for input field
    const transactionDate =
      transaction.date instanceof Date
        ? transaction.date
        : new Date(transaction.date);
    document.getElementById("financeDate").value = transactionDate
      .toISOString()
      .split("T")[0];

    document.getElementById("financeTypeInput").value = transaction.type;
    document.getElementById("financeCategoryInput").value =
      transaction.category;
    document.getElementById("financeDescription").value =
      transaction.description;
    document.getElementById("financeAmount").value = transaction.amount;
    document.getElementById("financePaymentMethod").value =
      transaction.paymentMethod;
    document.getElementById("financeNote").value = transaction.note || "";

    // Display additional information in a dedicated section
    const additionalInfoDiv = document.getElementById("financeAdditionalInfo");
    if (additionalInfoDiv) {
      let additionalInfoHtml = `
        <div class="row mb-3">
          <div class="col-12">
            <h6 class="border-bottom pb-2">Thông tin bổ sung</h6>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-2">
              <strong>ID Phiếu:</strong> <span class="text-muted">${
                transaction.id
              }</span>
            </div>
            ${
              transaction.orderId
                ? `
              <div class="mb-2">
                <strong>Mã đơn hàng:</strong> <span class="text-primary">#${transaction.orderId}</span>
              </div>
            `
                : ""
            }
            ${
              transaction.tableId
                ? `
              <div class="mb-2">
                <strong>Bàn số:</strong> <span class="text-info">${transaction.tableId}</span>
              </div>
            `
                : ""
            }
            ${
              transaction.createdBy
                ? `
              <div class="mb-2">
                <strong>Người tạo:</strong> <span class="text-secondary">${transaction.createdBy}</span>
              </div>
            `
                : ""
            }
          </div>
          <div class="col-md-6">            ${
            transaction.createdAt
              ? `
              <div class="mb-2">
                <strong>Ngày tạo:</strong> <span class="text-muted">${formatDate(
                  transaction.createdAt
                )} ${new Date(transaction.createdAt).toLocaleTimeString(
                  "vi-VN"
                )}</span>
              </div>
            `
              : ""
          }
            ${
              transaction.updatedAt
                ? `
              <div class="mb-2">
                <strong>Cập nhật lần cuối:</strong> <span class="text-muted">${formatDate(
                  transaction.updatedAt
                )} ${new Date(transaction.updatedAt).toLocaleTimeString(
                    "vi-VN"
                  )}</span>
              </div>
            `
                : ""
            }
            ${
              transaction.notes
                ? `
              <div class="mb-2">
                <strong>Ghi chú hệ thống:</strong> <span class="text-secondary">${transaction.notes}</span>
              </div>
            `
                : ""
            }
          </div>
        </div>
      `;

      // Add invoice details if available
      if (transaction.invoice) {
        const invoice = transaction.invoice;
        additionalInfoHtml += `
          <div class="row mt-3">
            <div class="col-12">
              <h6 class="border-bottom pb-2">Chi tiết hóa đơn</h6>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              ${
                invoice.cashierName
                  ? `
                <div class="mb-2">
                  <strong>Thu ngân:</strong> <span class="text-success">${invoice.cashierName}</span>
                </div>
              `
                  : invoice.cashierId
                  ? `
                <div class="mb-2">
                  <strong>ID Thu ngân:</strong> <span class="text-secondary">${invoice.cashierId}</span>
                </div>
              `
                  : ""
              }
              ${
                invoice.tableId || invoice.tableNumber
                  ? `
                <div class="mb-2">
                  <strong>Bàn:</strong> <span class="text-info">${
                    invoice.tableId || invoice.tableNumber
                  }</span>
                </div>
              `
                  : ""
              }
              ${
                invoice.customerInfo?.name
                  ? `
                <div class="mb-2">
                  <strong>Khách hàng:</strong> <span class="text-primary">${invoice.customerInfo.name}</span>
                </div>
              `
                  : ""
              }
            </div>
            <div class="col-md-6">
              <div class="mb-2">
                <strong>Tạm tính:</strong> <span class="text-muted">${formatCurrency(
                  invoice.subtotal || 0
                )}</span>
              </div>
              <div class="mb-2">
                <strong>${typeof getCorrectVatLabel === 'function' ? getCorrectVatLabel(invoice, 'vi') : (invoice.vatLabel || invoice.vatLabelVi || `Thuế VAT (${invoice.vatPercentage || '10.0%'}):`)}:</strong> <span class="text-warning">${formatCurrency(
                  invoice.vat || invoice.tax || 0
                )}</span>
              </div>
              <div class="mb-2">
                <strong>Giảm giá:</strong> <span class="text-danger">${formatCurrency(
                  invoice.discount || 0
                )}</span>
              </div>
              <div class="mb-2">
                <strong>Tổng tiền:</strong> <span class="text-success fw-bold">${formatCurrency(
                  invoice.total || 0
                )}</span>
              </div>
            </div>
          </div>
        `;

        // Add items details if available
        if (invoice.items && invoice.items.length > 0) {
          additionalInfoHtml += `
            <div class="row mt-2">
              <div class="col-12">
                <strong>Món ăn đã order:</strong>
                <div class="table-responsive mt-2">
                  <table class="table table-sm table-bordered">
                    <thead class="table-light">
                      <tr>
                        <th>Món ăn</th>
                        <th>SL</th>
                        <th>Đơn giá</th>
                        <th>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${invoice.items
                        .map(
                          (item) => `
                        <tr>
                          <td>${item.name}</td>
                          <td>${item.quantity}</td>
                          <td>${formatCurrency(item.price)}</td>
                          <td>${formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                      `
                        )
                        .join("")}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          `;
        }
      }

      additionalInfoDiv.innerHTML = additionalInfoHtml;
      additionalInfoDiv.style.display = "block";
    } // Update modal title
    document.getElementById(
      "financeModalTitle"
    ).textContent = `Sửa phiếu thu/chi - ${transaction.code}`;

    // Show modal
    const modal = new bootstrap.Modal(
      document.getElementById("financeTransactionModal")
    );
    modal.show();
  } catch (error) {
    console.error("Error loading finance transaction for edit:", error);
    showToast("Không thể tải thông tin phiếu thu/chi!", "error");
    isEditingFinanceTransaction = false;
  }
}

async function saveFinanceTransaction() {
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

  try {
    // Create transaction object
    const transactionData = {
      code,
      date,
      type,
      category,
      description,
      amount,
      paymentMethod,
      note,
    };
    if (id) {
      // For editing: Get original transaction to preserve createdAt
      const originalTransaction = await getFinanceTransactionById(id);
      if (originalTransaction) {
        // Add createdAt from original transaction to preserve it
        transactionData.createdAt = originalTransaction.createdAt;
      }

      // Delete old transaction and create new one with same code and createdAt
      await deleteFinanceTransaction(id);
      await addFinanceTransaction(transactionData);
      showToast("Đã cập nhật phiếu thu/chi thành công", "success");
    } else {
      // Add new transaction
      await addFinanceTransaction(transactionData);
      showToast("Đã thêm phiếu thu/chi mới thành công", "success");
    } // Hide modal
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("financeTransactionModal")
    );
    modal.hide();

    // Reset editing flag
    isEditingFinanceTransaction = false;

    // Reset form
    document.getElementById("financeForm").reset();
    document.getElementById("editFinanceId").value = "";
    document.getElementById("financeModalTitle").textContent =
      "Thêm phiếu thu/chi mới";

    // Hide additional info section when resetting
    const additionalInfoDiv = document.getElementById("financeAdditionalInfo");
    if (additionalInfoDiv) {
      additionalInfoDiv.style.display = "none";
      additionalInfoDiv.innerHTML = "";
    }

    // Render updated table
    await renderFinanceTable();
  } catch (error) {
    console.error("Error saving finance transaction:", error);
    showToast("Không thể lưu phiếu thu/chi!", "error");
    // Reset editing flag on error
    isEditingFinanceTransaction = false;
  }
}

// Function to confirm and delete finance transaction
async function confirmDeleteFinanceTransaction(id) {
  if (confirm("Bạn có chắc chắn muốn xóa phiếu thu/chi này?")) {
    try {
      await deleteFinanceTransaction(id);
      showToast("Đã xóa phiếu thu/chi thành công", "success");
      await renderFinanceTable();
    } catch (error) {
      console.error("Error deleting finance transaction:", error);
      showToast("Không thể xóa phiếu thu/chi!", "error");
    }
  }
}

// Password Management Functions
function generateRandomPassword() {
  const length = 12;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";

  // Ensure at least one character from each category
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";

  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  // Shuffle the password
  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  document.getElementById("staffPassword").value = password;
  checkPasswordStrength(password);

  // Show a toast notification
  if (typeof showToast === "function") {
    showToast("Mật khẩu đã được tạo tự động!", "success");
  }
}

function togglePasswordChange() {
  const checkbox = document.getElementById("changePasswordCheckbox");
  const passwordInput = document.getElementById("staffPassword");
  const generateBtn = document.getElementById("generatePasswordBtn");
  const passwordHelp = document.getElementById("passwordHelp");

  if (checkbox.checked) {
    passwordInput.disabled = false;
    passwordInput.required = true;
    generateBtn.disabled = false;
    passwordHelp.textContent =
      "Nhập mật khẩu mới cho nhân viên này. Mật khẩu nên có ít nhất 6 ký tự.";
    passwordInput.focus();
  } else {
    passwordInput.disabled = true;
    passwordInput.required = false;
    passwordInput.value = "";
    generateBtn.disabled = true;
    passwordHelp.textContent =
      'Chọn "Đổi mật khẩu" để cập nhật mật khẩu cho nhân viên này.';
    document.getElementById("passwordStrength").style.display = "none";
  }
}

function checkPasswordStrength(password) {
  const strengthDiv = document.getElementById("passwordStrength");
  const strengthBar = document.getElementById("passwordStrengthBar");
  const strengthText = document.getElementById("passwordStrengthText");

  if (!password || password.length === 0) {
    strengthDiv.style.display = "none";
    return;
  }

  strengthDiv.style.display = "block";

  let score = 0;
  let feedback = [];

  // Length check
  if (password.length >= 8) score += 25;
  else if (password.length >= 6) score += 15;
  else feedback.push("ít nhất 6 ký tự");

  // Character variety checks
  if (/[a-z]/.test(password)) score += 15;
  else feedback.push("chữ thường");

  if (/[A-Z]/.test(password)) score += 15;
  else feedback.push("chữ hoa");

  if (/[0-9]/.test(password)) score += 15;
  else feedback.push("số");

  if (/[^A-Za-z0-9]/.test(password)) score += 30;
  else feedback.push("ký tự đặc biệt");

  // Update progress bar
  strengthBar.style.width = score + "%";

  // Update color and text
  if (score >= 80) {
    strengthBar.className = "progress-bar bg-success";
    strengthText.textContent = "Mật khẩu mạnh";
    strengthText.className = "text-success small";
  } else if (score >= 60) {
    strengthBar.className = "progress-bar bg-warning";
    strengthText.textContent = "Mật khẩu trung bình";
    strengthText.className = "text-warning small";
  } else {
    strengthBar.className = "progress-bar bg-danger";
    strengthText.textContent = "Mật khẩu yếu - Cần: " + feedback.join(", ");
    strengthText.className = "text-danger small";
  }
}

// Function to setup staff modal for add/edit mode
function setupStaffModalMode(isEdit = false) {
  const changePasswordCheck = document.getElementById("changePasswordCheck");
  const changePasswordCheckbox = document.getElementById(
    "changePasswordCheckbox"
  );
  const passwordInput = document.getElementById("staffPassword");
  const generateBtn = document.getElementById("generatePasswordBtn");
  const passwordHelp = document.getElementById("passwordHelp");

  if (isEdit) {
    // Edit mode - show change password option
    changePasswordCheck.style.display = "block";
    changePasswordCheckbox.checked = false;
    passwordInput.disabled = true;
    passwordInput.required = false;
    passwordInput.value = "";
    generateBtn.disabled = true;
    passwordHelp.textContent =
      'Chọn "Đổi mật khẩu" để cập nhật mật khẩu cho nhân viên này.';
    document.getElementById("passwordStrength").style.display = "none";
  } else {
    // Add mode - password is required
    changePasswordCheck.style.display = "none";
    passwordInput.disabled = false;
    passwordInput.required = true;
    passwordInput.value = "";
    generateBtn.disabled = false;
    passwordHelp.textContent =
      "Khi thêm nhân viên mới, mật khẩu là bắt buộc để tạo tài khoản đăng nhập. Mật khẩu nên có ít nhất 6 ký tự.";
    document.getElementById("passwordStrength").style.display = "none";
  }
}

// Function to setup finance event listeners
function setupFinanceEventListeners() {
  // Refresh finance data button
  const refreshFinanceBtn = document.getElementById("refreshFinanceBtn");
  if (refreshFinanceBtn) {
    refreshFinanceBtn.addEventListener("click", async () => {
      try {
        await renderFinanceTable();
        showToast("Đã cập nhật dữ liệu thu chi", "success");
      } catch (error) {
        showToast("Không thể cập nhật dữ liệu thu chi", "error");
      }
    });
  }
  // Sync orders button
  const syncOrdersBtn = document.getElementById("syncOrdersBtn");
  if (syncOrdersBtn) {
    syncOrdersBtn.addEventListener("click", async () => {
      try {
        // Show loading state
        syncOrdersBtn.disabled = true;
        syncOrdersBtn.innerHTML =
          '<i data-lucide="loader" class="spinner-border spinner-border-sm me-2"></i>Đang đồng bộ...';

        // Sync orders using manual function
        await manualSyncAllOrders();
      } catch (error) {
        console.error("Error syncing orders:", error);
        showToast("Lỗi khi đồng bộ đơn hàng", "error");
      } finally {
        // Reset button state
        syncOrdersBtn.disabled = false;
        syncOrdersBtn.innerHTML =
          '<i data-lucide="database" style="width: 16px; height: 16px;"></i> Đồng bộ orders';
        lucide.createIcons();
      }
    });
  }

  // Filter form event listeners
  const financeStartDate = document.getElementById("financeStartDate");
  const financeEndDate = document.getElementById("financeEndDate");
  const financeType = document.getElementById("financeType");
  const financeCategory = document.getElementById("financeCategory");

  if (financeStartDate) {
    financeStartDate.addEventListener("change", filterFinanceTransactions);
  }
  if (financeEndDate) {
    financeEndDate.addEventListener("change", filterFinanceTransactions);
  }
  if (financeType) {
    financeType.addEventListener("change", filterFinanceTransactions);
  }
  if (financeCategory) {
    financeCategory.addEventListener("change", filterFinanceTransactions);
  }

  // Export button
  const exportFinanceBtn = document.getElementById("exportFinanceBtn");
  if (exportFinanceBtn) {
    exportFinanceBtn.addEventListener("click", exportFinanceToExcel);
  }
  // Modal event - reset form when modal is opened for new transaction
  const financeModal = document.getElementById("financeTransactionModal");
  if (financeModal) {
    financeModal.addEventListener("show.bs.modal", function (event) {
      // Check if it's for adding new transaction (not editing)
      if (!isEditingFinanceTransaction) {
        // Reset form for new transaction
        document.getElementById("financeForm").reset();
        document.getElementById("editFinanceId").value = "";
        document.getElementById("financeModalTitle").textContent =
          "Thêm phiếu thu/chi mới";

        // Hide additional info section for new transaction
        const additionalInfoDiv = document.getElementById(
          "financeAdditionalInfo"
        );
        if (additionalInfoDiv) {
          additionalInfoDiv.style.display = "none";
          additionalInfoDiv.innerHTML = "";
        }

        // Set current date as default
        const today = new Date().toISOString().split("T")[0];
        document.getElementById("financeDate").value = today;
      }
    });

    // Reset the editing flag when modal is hidden
    financeModal.addEventListener("hidden.bs.modal", function (event) {
      isEditingFinanceTransaction = false;
    });
  }
}

// Auto-sync functionality
function setupAutoSyncOrders() {
  // Auto sync every 10 minutes
  setInterval(async () => {
    try {
      console.log("Auto-syncing orders...");
      const results = await autoSyncNewPaidOrders();

      if (results.processed > 0) {
        console.log(`Auto-synced ${results.processed} new orders`);

        // Check if finance tab is active and refresh if needed
        const financeTab = document.getElementById("finance-tab");
        if (financeTab && financeTab.classList.contains("active")) {
          await renderFinanceTable();
        }

        // Show a subtle notification
        showToast(
          `Đã tự động đồng bộ ${results.processed} đơn hàng mới`,
          "info",
          3000
        );
      }
    } catch (error) {
      console.error("Error in auto-sync:", error);
    }
  }, 10 * 60 * 1000); // 10 minutes in milliseconds
}

// Function to manually trigger full sync
async function manualSyncAllOrders() {
  try {
    const results = await syncPaidOrdersToFinance();

    let message = "";
    if (results.processed > 0) {
      message += `Đã đồng bộ ${results.processed} đơn hàng mới`;
    }
    if (results.skipped > 0) {
      message +=
        (message ? ", " : "") + `${results.skipped} đơn hàng đã có sẵn`;
    }
    if (results.errors > 0) {
      message += (message ? ", " : "") + `${results.errors} lỗi`;
    }

    if (!message) {
      message = "Không có đơn hàng nào cần đồng bộ";
    }

    showToast(message, results.errors > 0 ? "warning" : "success");

    // Refresh finance table
    await renderFinanceTable();

    return results;
  } catch (error) {
    console.error("Error in manual sync:", error);
    showToast("Lỗi khi đồng bộ đơn hàng", "error");
    throw error;
  }
}

// Function to view invoice details
async function viewInvoiceDetails(transactionId) {
  try {
    const transaction = await getFinanceTransactionById(transactionId);

    if (!transaction || !transaction.invoice) {
      showToast("Không tìm thấy thông tin hóa đơn", "error");
      return;
    }

    const invoice = transaction.invoice;

    // Create modal content
    const modalContent = `
      <div class="modal fade" id="invoiceModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Chi tiết hóa đơn - ${
                transaction.code
              }</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="row">                <div class="col-md-6">
                  <h6>Thông tin đơn hàng</h6>
                  <p><strong>Mã đơn:</strong> ${transaction.orderId}</p>
                  <p><strong>Bàn số:</strong> ${
                    transaction.tableId ||
                    invoice.tableId ||
                    invoice.tableNumber ||
                    "N/A"
                  }</p>
                  <p><strong>Thu ngân:</strong> ${
                    invoice.cashierName || invoice.cashierId || "N/A"
                  }</p>
                  <p><strong>Khách hàng:</strong> ${
                    invoice.customerInfo?.name || "Khách lẻ"
                  }</p>
                  <p><strong>Ngày:</strong> ${formatDate(transaction.date)}</p>
                </div>
                <div class="col-md-6">
                  <h6>Thông tin thanh toán</h6>
                  <p><strong>Tạm tính:</strong> ${formatCurrency(
                    invoice.subtotal
                  )}</p>
                  <p><strong>${typeof getCorrectVatLabel === 'function' ? getCorrectVatLabel(invoice, 'vi') : (invoice.vatLabel || invoice.vatLabelVi || `Thuế VAT (${invoice.vatPercentage || '10.0%'}):`)}:</strong> ${formatCurrency(
                    invoice.vat || invoice.tax || 0
                  )}</p>
                  <p><strong>Giảm giá:</strong> ${formatCurrency(
                    invoice.discount
                  )}</p>
                  <p><strong>Tổng cộng:</strong> <span class="fw-bold text-success">${formatCurrency(
                    invoice.total
                  )}</span></p>
                  <p><strong>Phương thức:</strong> ${invoice.paymentMethod}</p>
                </div>
              </div>
              
              <h6>Chi tiết món ăn</h6>
              <div class="table-responsive">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>Món ăn</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${invoice.items
                      .map(
                        (item) => `
                      <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>${formatCurrency(item.price)}</td>
                        <td>${formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    `
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
              <button type="button" class="btn btn-primary" onclick="printInvoice('${transactionId}')">
                <i data-lucide="printer" style="width: 16px; height: 16px;"></i>
                In hóa đơn
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById("invoiceModal");
    if (existingModal) {
      existingModal.remove();
    }

    // Add modal to DOM
    document.body.insertAdjacentHTML("beforeend", modalContent);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById("invoiceModal"));
    modal.show();

    // Initialize icons
    lucide.createIcons();

    // Clean up modal after hiding
    document
      .getElementById("invoiceModal")
      .addEventListener("hidden.bs.modal", function () {
        this.remove();
      });
  } catch (error) {
    console.error("Error viewing invoice details:", error);
    showToast("Lỗi khi xem chi tiết hóa đơn", "error");
  }
}

// Function to print invoice
async function printInvoice(transactionId) {
  try {
    const transaction = await getFinanceTransactionById(transactionId);

    if (!transaction || !transaction.invoice) {
      showToast("Không tìm thấy thông tin hóa đơn", "error");
      return;
    }

    const invoice = transaction.invoice;

    // Create print content
    const printContent = `
      <html>
        <head>
          <title>Hóa đơn - ${transaction.code}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .info { margin-bottom: 15px; }
            .info div { margin-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { font-weight: bold; }
            .text-right { text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>HÓA ĐƠN BÁN HÀNG</h2>
            <p>Mã phiếu: ${transaction.code} | Đơn hàng: ${
      transaction.orderId
    }</p>
            <p>Ngày: ${formatDate(transaction.date)}</p>
          </div>
            <div class="info">
            <div><strong>Bàn số:</strong> ${
              transaction.tableId ||
              invoice.tableId ||
              invoice.tableNumber ||
              "N/A"
            }</div>
            <div><strong>Thu ngân:</strong> ${
              invoice.cashierName || invoice.cashierId || "N/A"
            }</div>
            <div><strong>Khách hàng:</strong> ${
              invoice.customerInfo?.name || "Khách lẻ"
            }</div>
            <div><strong>Phương thức thanh toán:</strong> ${
              invoice.paymentMethod
            }</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Món ăn</th>
                <th>SL</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td class="text-right">${formatCurrency(item.price)}</td>
                  <td class="text-right">${formatCurrency(
                    item.price * item.quantity
                  )}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
            <div style="margin-top: 20px;">
            <div>Tạm tính: <span style="float: right;">${formatCurrency(
              invoice.subtotal
            )}</span></div>
            <div>${typeof getCorrectVatLabel === 'function' ? getCorrectVatLabel(invoice, 'vi') : (invoice.vatLabel || invoice.vatLabelVi || `Thuế VAT (${invoice.vatPercentage || '10.0%'}):`)} <span style="float: right;">${formatCurrency(
              invoice.vat || invoice.tax || 0
            )}</span></div>
            <div>Giảm giá: <span style="float: right;">${formatCurrency(
              invoice.discount
            )}</span></div>
            <hr>
            <div class="total">Tổng cộng: <span style="float: right;">${formatCurrency(
              invoice.total
            )}</span></div>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <p>Cảm ơn quý khách!</p>
          </div>
        </body>
      </html>
    `;

    // Open print window
    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  } catch (error) {
    console.error("Error printing invoice:", error);
    showToast("Lỗi khi in hóa đơn", "error");
  }
}