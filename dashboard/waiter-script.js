// Firebase imports and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Import Firebase config
import { firebaseConfig } from "../config/firebase-config.js";

console.log("waiter-script.js loaded successfully");

// Initialize global functions early to prevent "not defined" errors
window.addToOrder =
  window.addToOrder ||
  function (itemId) {
    console.log("addToOrder called early, item:", itemId);
    // Will be replaced by actual function later
  };

window.handleTableClick =
  window.handleTableClick ||
  function () {
    console.log("handleTableClick called early");
  };
window.showCreateOrderModal =
  window.showCreateOrderModal ||
  function () {
    console.log("showCreateOrderModal called early");
  };
window.proceedToCreateOrder =
  window.proceedToCreateOrder ||
  function () {
    console.log("proceedToCreateOrder called early");
  };
window.switchToTablesManagement =
  window.switchToTablesManagement ||
  function () {
    console.log("switchToTablesManagement called early");
  };
window.switchToOrdersManagement =
  window.switchToOrdersManagement ||
  function () {
    console.log("switchToOrdersManagement called early");
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to generate custom order ID with format DS-XXXXXX
function generateOrderId() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return `DS-${randomString}`;
}

// Check authentication state and load user data
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        document.getElementById("staffName").textContent =
          userData.displayName || "Nhân viên";
        document.getElementById("staffEmail").textContent =
          userData.email || user.email;

        // Set role display
        const roleText =
          userData.role === "waiter"
            ? "Nhân viên phục vụ"
            : userData.role === "chef"
            ? "Đầu bếp"
            : userData.role === "cashier"
            ? "Thu ngân"
            : userData.role === "manager"
            ? "Quản lý"
            : "Nhân viên";
        document.getElementById("staffRole").textContent = roleText; // Check if user has waiter role
        if (userData.role !== "waiter") {
          alert("Bạn không có quyền truy cập trang này!");
          window.location.href = "../index.html";
          return;
        }

        // Load tables data after successful authentication
        loadTablesFromFirestore();
      } else {
        document.getElementById("staffName").textContent =
          user.displayName || "Nhân viên";
        document.getElementById("staffEmail").textContent = user.email;
        document.getElementById("staffRole").textContent = "Nhân viên phục vụ";

        // Load tables data for users without userData
        loadTablesFromFirestore();
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      document.getElementById("staffName").textContent =
        user.displayName || "Nhân viên";
      document.getElementById("staffEmail").textContent = user.email;
      document.getElementById("staffRole").textContent = "Nhân viên phục vụ";

      // Load tables data even if there's an error with user data
      loadTablesFromFirestore();
    }
  } else {
    // User is signed out, redirect to login
    window.location.href = "../index.html";
  }
});

// Handle logout function
async function handleLogout() {
  if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
    try {
      await signOut(auth);
      // Redirect will be handled by onAuthStateChanged
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Có lỗi xảy ra khi đăng xuất: " + error.message);
    }
  }
}

// Make function available globally
window.handleLogout = handleLogout;

// Global variables
let tables = [];
let currentTable = null;
let currentOrder = [];
// Global variable to store menu items loaded from Firestore
let menuItems = [];
// Global variable to track if we're editing an existing order
let editingOrderId = null;

// Function to load menu items from Firestore
async function loadMenuFromFirestore() {
  try {
    // Show loading state
    const menuContainer = document.getElementById("menuItems");
    if (menuContainer) {
      menuContainer.innerHTML = `
        <div class="menu-loading">
          <i data-lucide="loader-2" style="width: 24px; height: 24px;" class="me-2"></i>
          <span>Đang tải thực đơn...</span>
        </div>
      `;
      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    }

    const menuCollection = collection(db, "menu_items");
    const menuSnapshot = await getDocs(menuCollection);
    menuItems = [];
    menuSnapshot.forEach((doc) => {
      const data = doc.data();
      // Don't include ingredients field when displaying menu
      const { ingredients, ...menuItemData } = data;
      const item = {
        id: doc.id,
        ...menuItemData,
      };
      menuItems.push(item);
      console.log("Menu item loaded:", {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
      });
    });
    console.log("Loaded menu items from Firestore:", menuItems.length);

    // Re-render menu if modal is open
    if (
      document.getElementById("orderModal") &&
      document.getElementById("orderModal").classList.contains("show")
    ) {
      renderMenuCategories();
      renderMenuItems();
    }
  } catch (error) {
    console.error("Error loading menu from Firestore:", error);
    // Show error message to user
    if (typeof showToast === "function") {
      showToast("Không thể tải menu. Vui lòng thử lại.", "error");
    }

    // Show error state in menu container
    const menuContainer = document.getElementById("menuItems");
    if (menuContainer) {
      menuContainer.innerHTML = `
        <div class="p-4 text-center">
          <div class="text-danger">
            <i data-lucide="alert-circle" style="width: 48px; height: 48px;" class="mb-3"></i>
            <p class="mb-2">Không thể tải thực đơn</p>
            <button class="btn btn-outline-primary btn-sm" onclick="loadMenuFromFirestore()">
              <i data-lucide="refresh-cw" style="width: 16px; height: 16px;"></i>
              Thử lại
            </button>
          </div>
        </div>
      `;
      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    }
  }
}

// Function to load menu on page load
async function initializeMenu() {
  await loadMenuFromFirestore();
}

// Load menu when page loads
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initializeMenu, 1000); // Wait a bit for Firebase to initialize
  setTimeout(loadOrdersFromFirestore, 1200); // Load orders after menu
});

// Mock data for orders
// Global variable to store orders loaded from Firestore
let orders = [];

// Function to load orders from Firestore
async function loadOrdersFromFirestore() {
  try {
    console.log("Loading orders from Firestore...");
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"));

    // Use onSnapshot for real-time updates
    onSnapshot(
      q,
      (querySnapshot) => {
        console.log(
          "Received orders data from Firestore, documents count:",
          querySnapshot.size
        );
        orders = [];
        querySnapshot.forEach((doc) => {
          const orderData = doc.data();
          console.log("Order data:", orderData);

          // Convert Firestore timestamp to Date
          const createdAt = orderData.createdAt?.toDate() || new Date();

          orders.push({
            id: doc.id,
            tableId: orderData.tableId || orderData.tableName || "Unknown",
            tableName: orderData.tableName || `Bàn ${orderData.tableId}`,
            items: orderData.items || [],
            notes: orderData.notes || "",
            status: orderData.status || "pending",
            createdAt: createdAt,
            subtotal: orderData.subtotal || 0,
            vat: orderData.vat || 0,
            total: orderData.total || 0,
          });
        });
        console.log("Processed orders:", orders);

        // Calculate table totals from orders
        calculateTableTotals();

        // Update UI if we're on orders management page
        if (currentSection === "orders") {
          updateOrdersStats();
          renderOrders();
        }

        // Re-render tables to show updated totals
        renderTables();
      },
      (error) => {
        console.error("Error loading orders:", error);
        showToast("Lỗi khi tải dữ liệu orders: " + error.message, "error");
      }
    );
  } catch (error) {
    console.error("Error setting up orders listener:", error);
    showToast("Lỗi khi kết nối với cơ sở dữ liệu orders", "error");
  }
}

// Global variables
let selectedCategory = "all";
let selectedTableId = null;
let selectedTableName = "";

let currentViewOrder = null;
let currentSection = "tables"; // 'tables' or 'orders'

// Function to load tables from Firestore
async function loadTablesFromFirestore() {
  try {
    console.log("Loading tables from Firestore...");
    const tablesRef = collection(db, "tables");
    const q = query(tablesRef, orderBy("id"));

    // Use onSnapshot for real-time updates
    onSnapshot(
      q,
      (querySnapshot) => {
        console.log(
          "Received tables data from Firestore, documents count:",
          querySnapshot.size
        );
        tables = [];
        querySnapshot.forEach((doc) => {
          const tableData = doc.data();
          console.log("Table data:", tableData);
          tables.push({
            id: tableData.id || doc.id,
            status: tableData.status || "available",
            capacity: tableData.capacity || 4,
            location: tableData.location || "indoor",
            name: tableData.name || `Bàn ${tableData.id}`,
            currentOrder: tableData.currentOrder || null,
            customers: 0, // Will be calculated from orders
            startTime: null, // Will be calculated from orders
            orderTotal: 0, // Will be calculated from orders
          });
        });
        console.log("Processed tables:", tables);

        // Calculate table totals from orders if orders are available
        if (orders.length > 0) {
          calculateTableTotals();
        }

        updateStats();
        renderTables();
        populateTableSelect();
      },
      (error) => {
        console.error("Error loading tables:", error);
        // Show error message to user
        showToast("Lỗi khi tải dữ liệu bàn: " + error.message, "error");
      }
    );
  } catch (error) {
    console.error("Error setting up tables listener:", error);
    showToast("Lỗi khi kết nối với cơ sở dữ liệu", "error");
  }
}

// Function to populate table select dropdown
function populateTableSelect() {
  const selectElement = document.getElementById("selectTableForOrder");
  if (selectElement) {
    selectElement.innerHTML = '<option value="">-- Chọn bàn --</option>';
    tables.forEach((table) => {
      const option = document.createElement("option");
      option.value = table.id;
      option.textContent = table.name || `Bàn ${table.id}`;
      option.disabled = table.status === "occupied";
      selectElement.appendChild(option);
    });
  }
}

// Simple toast notification function
function showToast(message, type = "info") {
  // Create toast element
  const toast = document.createElement("div");
  toast.className = `alert alert-${
    type === "error" ? "danger" : "info"
  } position-fixed`;
  toast.style.cssText =
    "top: 20px; right: 20px; z-index: 9999; min-width: 300px;";
  toast.innerHTML = `
    <div class="d-flex align-items-center">
      <span>${message}</span>
      <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
    </div>
  `;

  document.body.appendChild(toast);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 5000);
}

// Initialize dashboard
document.addEventListener("DOMContentLoaded", function () {
  // Tables will be loaded after authentication in onAuthStateChanged
  renderMenuCategories();
  renderMenuItems();
  setupSearch();

  // Initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // Modal event listeners
  const orderModal = document.getElementById("orderModal");
  if (orderModal) {
    orderModal.addEventListener("hidden.bs.modal", function () {
      // Reset modal state when closed
      currentOrder = [];
      selectedCategory = "all";
      editingOrderId = null; // Reset editing state
      updateOrderDisplay();

      // Reset search
      const searchInput = document.getElementById("menuSearch");
      if (searchInput) {
        searchInput.value = "";
      }

      // Reset categories
      renderMenuCategories();
      renderMenuItems();
    });
    orderModal.addEventListener("shown.bs.modal", function () {
      // Focus on search input when modal opens
      const searchInput = document.getElementById("menuSearch");
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 100);
      }

      // Re-setup submit button event listener to ensure it works
      const submitBtn = document.getElementById("submitOrder");
      console.log("Modal shown - re-checking submit button:", submitBtn);
      if (submitBtn) {
        // Remove existing listeners and add new one
        submitBtn.removeEventListener("click", submitOrder);
        submitBtn.addEventListener("click", submitOrder);
        console.log("Submit button event listener re-added in modal shown");

        // Update button state
        updateSubmitButton();
      }
    });
  }
  // Submit order button
  const submitBtn = document.getElementById("submitOrder");
  console.log(
    "Setting up submit button event listener, button element:",
    submitBtn
  );
  if (submitBtn) {
    submitBtn.addEventListener("click", submitOrder);
    console.log("Submit button event listener added");
  } else {
    console.error("Submit button not found!");
  }

  // Navigation event listeners
  const tablesBtn = document.getElementById("tablesManagementBtn");
  const ordersBtn = document.getElementById("ordersManagementBtn");

  if (tablesBtn) {
    tablesBtn.addEventListener("click", switchToTablesManagement);
  }

  if (ordersBtn) {
    ordersBtn.addEventListener("click", switchToOrdersManagement);
  }

  // Filter event listeners
  const statusFilter = document.getElementById("orderStatusFilter");
  const tableFilter = document.getElementById("orderTableFilter");
  const searchInput = document.getElementById("orderSearch");

  if (statusFilter) {
    statusFilter.addEventListener("change", renderOrders);
  }

  if (tableFilter) {
    tableFilter.addEventListener("change", renderOrders);
  }

  if (searchInput) {
    searchInput.addEventListener("input", renderOrders);
  }
});

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
}

function getTimeElapsed(startTime) {
  if (!startTime) return "";

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
  // Map Firestore status to display status for counting
  const availableTables = tables.filter((t) => t.status === "available").length;
  const occupiedTables = tables.filter((t) => t.status === "occupied").length;
  const cleaningTables = tables.filter((t) => t.status === "cleaning").length;
  const totalTables = tables.length;

  // Update stats cards if elements exist
  const emptyTablesEl = document.getElementById("emptyTables");
  const occupiedTablesEl = document.getElementById("occupiedTables");
  const cleaningTablesEl = document.getElementById("cleaningTables");
  const totalTablesEl = document.getElementById("totalTables");

  if (emptyTablesEl) emptyTablesEl.textContent = availableTables;
  if (occupiedTablesEl) occupiedTablesEl.textContent = occupiedTables;
  if (cleaningTablesEl) cleaningTablesEl.textContent = cleaningTables;
  if (totalTablesEl) totalTablesEl.textContent = totalTables;
}

function renderTables() {
  const container = document.getElementById("tablesGrid");

  if (!container) {
    console.error("Tables grid container not found");
    return;
  }

  if (tables.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="text-muted">
          <i data-lucide="table" style="width: 48px; height: 48px;" class="mb-3 opacity-50"></i>
          <p class="mb-0">Đang tải dữ liệu bàn...</p>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = tables
    .map((table) => {
      const timeElapsed = getTimeElapsed(table.startTime);

      // Map Firestore status to display status
      let displayStatus = table.status;
      let statusText = "";

      switch (table.status) {
        case "available":
          displayStatus = "empty";
          statusText = "Trống";
          break;
        case "occupied":
          displayStatus = "occupied";
          statusText = "Đang phục vụ";
          break;
        case "cleaning":
          displayStatus = "cleaning";
          statusText = "Cần dọn";
          break;
        default:
          displayStatus = "empty";
          statusText = "Trống";
      }
      return `
            <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <div class="table-card ${displayStatus}" onclick="handleTableClick('${
        table.id
      }')">
                    <div class="status-indicator ${displayStatus}"></div>
                    ${
                      timeElapsed
                        ? `<div class="table-time">${timeElapsed}</div>`
                        : ""
                    }
                    <div class="table-number">${
                      table.name || `Bàn ${table.id}`
                    }</div>
                    <div class="table-status ${displayStatus}">${statusText}</div>
                    <div class="table-info">
                        <small class="text-muted">Sức chứa: ${
                          table.capacity
                        } người</small>
                        <div class="text-muted">${
                          table.location === "indoor"
                            ? "Trong nhà"
                            : "Ngoài trời"
                        }</div>
                    </div>
                    ${
                      displayStatus === "occupied"
                        ? `
                        <div class="text-center px-2 pb-2">
                            <small class="text-muted">${
                              table.customers || 0
                            } khách</small>
                            <div class="fw-bold text-primary">${formatCurrency(
                              table.orderTotal || 0
                            )}</div>
                        </div>
                    `
                        : ""
                    }
                </div>
            </div>
        `;
    })
    .join("");

  // Re-initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function handleTableClick(tableId) {
  const table = tables.find((t) => t.id == tableId); // Use == to handle string/number comparison
  if (!table) {
    console.error("Table not found:", tableId);
    return;
  }

  currentTable = table;

  if (table.status === "available") {
    // Open order modal for new order
    openOrderModal(table);
  } else if (table.status === "occupied" || table.status === "cleaning") {
    // Open table actions modal
    openTableActionsModal(table);
  }
}

// Make handleTableClick available globally
window.handleTableClick = handleTableClick;

function openOrderModal(table) {
  selectedTableId = table.id;
  selectedTableName = `Bàn ${table.id}`;
  currentOrder = [];
  selectedCategory = "all";
  editingOrderId = null; // Reset editing state for new orders

  document.getElementById("modalTableName").textContent = selectedTableName;
  const notesEl = document.getElementById("orderNotes");
  if (notesEl) {
    notesEl.value = ""; // Clear notes
  }

  // Setup menu search and category buttons
  setupMenuSearch();
  setupCategoryButtons();
  // Load menu from Firestore before rendering
  loadMenuFromFirestore().then(() => {
    renderMenuCategories();
    renderMenuItems();
    updateOrderDisplay();
    updateSubmitButton(); // Explicitly update submit button state
  });

  const modal = new bootstrap.Modal(document.getElementById("orderModal"));
  modal.show();

  // Re-initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function openTableActionsModal(table) {
  currentTable = table; // Set current table for actions
  document.getElementById("actionsTableName").textContent = `Bàn ${table.id}`;

  const modal = new bootstrap.Modal(
    document.getElementById("tableActionsModal")
  );
  modal.show();

  // Re-initialize Lucide icons
  lucide.createIcons();
}

function renderMenuCategories() {
  // Get unique categories from loaded menu items
  const uniqueCategories = [...new Set(menuItems.map((item) => item.category))];

  // Define category display names and icons
  const categoryConfig = {
    noodles: { name: "Mì & Phở", icon: "bowl" },
    rice: { name: "Cơm", icon: "wheat" },
    drinks: { name: "Đồ uống", icon: "coffee" },
    snacks: { name: "Tráng miệng", icon: "cookie" },
    appetizers: { name: "Khai vị", icon: "utensils" },
    seafood: { name: "Hải sản", icon: "fish" },
    meat: { name: "Thịt", icon: "beef" },
    vegetarian: { name: "Chay", icon: "leaf" },
    desserts: { name: "Tráng miệng", icon: "cake" },
    hotpot: { name: "Lẩu", icon: "pot" },
    grilled: { name: "Nướng", icon: "flame" },
  };

  // Build categories array starting with "All"
  const categories = [
    {
      id: "all",
      name: "Tất cả món",
      icon: "utensils",
      count: menuItems.length,
    },
  ];

  // Add categories that exist in the menu
  uniqueCategories.forEach((categoryId) => {
    const config = categoryConfig[categoryId] || {
      name: categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
      icon: "utensils",
    };

    categories.push({
      id: categoryId,
      name: config.name,
      icon: config.icon,
      count: menuItems.filter((item) => item.category === categoryId).length,
    });
  });

  const categoriesContainer = document.getElementById("menuCategories");
  if (!categoriesContainer) return;

  categoriesContainer.innerHTML = categories
    .map(
      (category) => `
        <button type="button" class="category-btn ${
          selectedCategory === category.id ||
          (selectedCategory === "all" && category.id === "all")
            ? "active"
            : ""
        }" data-category="${category.id}">
            <i data-lucide="${
              category.icon
            }" style="width: 16px; height: 16px;"></i>
            <span>${category.name}</span>
            <div class="category-count">${category.count}</div>
        </button>
    `
    )
    .join("");

  // Re-initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // Setup category button click handlers
  setupCategoryButtons();
}

// Function to setup category buttons
function setupCategoryButtons() {
  const categoryContainer = document.getElementById("menuCategories");
  if (!categoryContainer) return;

  categoryContainer.addEventListener("click", (e) => {
    const button = e.target.closest(".category-btn");
    if (!button) return;

    const category = button.getAttribute("data-category");
    if (!category) return;

    // Update selected category
    selectedCategory = category;

    // Update active button
    const allButtons = categoryContainer.querySelectorAll(".category-btn");
    allButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // Re-render menu items with new filter
    handleMenuSearch();
  });
}

// Call setupCategoryButtons on DOMContentLoaded
document.addEventListener("DOMContentLoaded", setupCategoryButtons);

function renderMenuItems() {
  const menuContainer = document.getElementById("menuItems");
  if (!menuContainer) return;

  console.log("renderMenuItems called, selectedCategory:", selectedCategory);
  console.log("Available menuItems:", menuItems.length);

  // If "all" category is selected or no category filter, show all items
  if (!selectedCategory || selectedCategory === "all") {
    renderFilteredMenuItems(menuItems);
  } else {
    // Use the search function which handles both category and search filtering
    handleMenuSearch();
  }
}

function getCategoryName(category) {
  const categoryConfig = {
    noodles: "Mì & Phở",
    rice: "Cơm",
    drinks: "Đồ uống",
    snacks: "Tráng miệng",
    appetizers: "Khai vị",
    seafood: "Hải sản",
    meat: "Thịt",
    vegetarian: "Chay",
    desserts: "Tráng miệng",
    hotpot: "Lẩu",
    grilled: "Nướng",
  };
  return (
    categoryConfig[category] ||
    category.charAt(0).toUpperCase() + category.slice(1)
  );
}

function addToOrder(itemId) {
  console.log("addToOrder called with itemId:", itemId, "type:", typeof itemId);
  // Convert itemId to string for comparison since it comes from HTML onclick as string
  const itemIdStr = String(itemId);
  const item = menuItems.find((menuItem) => String(menuItem.id) === itemIdStr);
  console.log("Found item:", item);
  console.log("menuItems array:", menuItems);
  if (item) {
    addItemToOrder(item);

    // Show visual feedback
    showToast(`Đã thêm ${item.name} vào order`, "success");
  } else {
    console.error("Item not found for id:", itemId);
  }
}

// Function to add item to current order
function addItemToOrder(item) {
  try {
    console.log("Adding item to order:", item);
    console.log("Current order before adding:", currentOrder);

    // Check if item already exists in order
    const existingItem = currentOrder.find(
      (orderItem) => orderItem.id === item.id
    );

    if (existingItem) {
      // If item exists, increase quantity
      existingItem.quantity += 1;
      console.log("Item exists, increased quantity to:", existingItem.quantity);
    } else {
      // If item doesn't exist, add new item with quantity 1
      currentOrder.push({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
      });
      console.log("Item added as new, new order:", currentOrder);
    }

    // Update order display and submit button
    updateOrderDisplay();
    updateSubmitButton();

    console.log(
      "Order updated successfully, current order length:",
      currentOrder.length
    );
  } catch (error) {
    console.error("Error in addItemToOrder:", error);
  }
}

// Make functions available globally
window.addItemToOrder = addItemToOrder;
window.removeItemFromOrder = removeItemFromOrder;
window.updateItemQuantity = updateItemQuantity;
window.addToOrder = addToOrder;

console.log(
  "addToOrder function exported to window:",
  typeof window.addToOrder
);

// Export all functions needed by HTML onclick handlers
window.handleTableClick = handleTableClick;
window.refreshOrders = refreshOrders;
window.addOrder = addOrder;
window.callWaiter = callWaiter;
window.cleanTable = cleanTable;
window.showCreateOrderModal = showCreateOrderModal;
window.proceedToCreateOrder = proceedToCreateOrder;
window.editOrder = editOrder;
window.updateOrderStatus = updateOrderStatus;
window.markOrderCompleted = markOrderCompleted;
window.viewOrderDetail = viewOrderDetail;
window.editOrderInline = editOrderInline;

// Remove item from order
function removeItemFromOrder(itemId) {
  currentOrder = currentOrder.filter((item) => item.id !== itemId);
  updateOrderDisplay();
  updateSubmitButton();
}

// Update item quantity in order
function updateItemQuantity(itemId, quantity) {
  const item = currentOrder.find((orderItem) => orderItem.id === itemId);
  if (item) {
    if (quantity <= 0) {
      removeItemFromOrder(itemId);
    } else {
      item.quantity = quantity;
    }
  }
  updateOrderDisplay();
  updateSubmitButton();
}

// Update order display in modal
function updateOrderDisplay() {
  const orderContainer = document.getElementById("orderItems");
  const orderCountElement = document.getElementById("orderItemCount");

  if (!orderContainer) return;
  if (currentOrder.length === 0) {
    orderContainer.innerHTML = `
      <div class="empty-order">
        <div class="text-center py-5">
          <i data-lucide="shopping-cart" class="text-muted opacity-50" style="width: 48px; height: 48px;"></i>
          <p class="text-muted mt-3 mb-0">Chưa có món nào</p>
          <small class="text-muted">Chọn món từ menu bên trái</small>
        </div>
      </div>
    `;
    orderCountElement.textContent = "0";

    // Reset totals
    document.getElementById("subtotal").textContent = "0₫";
    document.getElementById("vatAmount").textContent = "0₫";
    document.getElementById("orderTotal").textContent = "0₫";
    return;
  }

  const orderTotal = currentOrder.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const vat = Math.round(orderTotal * 0.1);
  const finalTotal = orderTotal + vat;
  orderContainer.innerHTML = `
    <div class="order-items-list">
      ${currentOrder
        .map(
          (item) => `
        <div class="order-item">
          <div class="order-item-info">
            <div class="order-item-name">${item.name}</div>
            <div class="order-item-price">${formatCurrency(item.price)}</div>
          </div>
          <div class="order-item-controls">
            <div class="quantity-controls">
              <button class="btn btn-outline-secondary btn-sm" onclick="updateItemQuantity(${
                item.id
              }, ${item.quantity - 1})">
                <i data-lucide="minus" style="width: 14px; height: 14px;"></i>
              </button>
              <span class="quantity-display">${item.quantity}</span>
              <button class="btn btn-outline-secondary btn-sm" onclick="updateItemQuantity(${
                item.id
              }, ${item.quantity + 1})">
                <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
              </button>
            </div>
            <div class="order-item-total">${formatCurrency(
              item.price * item.quantity
            )}</div>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;

  // Update totals in existing HTML elements
  document.getElementById("subtotal").textContent = formatCurrency(orderTotal);
  document.getElementById("vatAmount").textContent = formatCurrency(vat);
  document.getElementById("orderTotal").textContent =
    formatCurrency(finalTotal);

  orderCountElement.textContent = currentOrder.length.toString();

  // Re-initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

// Update submit button state
function updateSubmitButton() {
  const submitBtn = document.getElementById("submitOrder");
  console.log(
    "updateSubmitButton called, currentOrder.length:",
    currentOrder.length
  );
  console.log("Submit button element:", submitBtn);
  if (submitBtn) {
    const shouldDisable = currentOrder.length === 0;
    console.log("Should disable button:", shouldDisable);
    console.log("Button disabled before:", submitBtn.disabled);
    submitBtn.disabled = shouldDisable;
    console.log("Button disabled after:", submitBtn.disabled);

    // Also remove/add disabled attribute explicitly
    if (shouldDisable) {
      submitBtn.setAttribute("disabled", "disabled");
    } else {
      submitBtn.removeAttribute("disabled");
    }

    // Update button text based on editing state
    const buttonText = editingOrderId ? "Cập nhật Order" : "Tạo Order";
    if (!submitBtn.disabled) {
      submitBtn.innerHTML = `<i data-lucide="check" style="width: 16px; height: 16px;"></i> ${buttonText}`;
      // Re-initialize Lucide icons
      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    }

    console.log(
      "Button disabled attribute:",
      submitBtn.hasAttribute("disabled")
    );
  }
}

// Table action functions
async function cleanTable() {
  if (!currentTable) return;

  try {
    console.log(
      "Cleaning table:",
      currentTable.id,
      "current status:",
      currentTable.status
    );

    // Update table status in Firestore
    const tableRef = doc(db, "tables", currentTable.id.toString());
    await updateDoc(tableRef, {
      status: "available",
      updatedAt: serverTimestamp(),
    });

    console.log("Table status updated to 'available' in Firestore");

    // Close modal
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("tableActionsModal")
    );
    modal.hide();

    // Show success
    showSuccess(
      "Bàn đã được dọn!",
      `Bàn ${currentTable.id} đã sẵn sàng phục vụ khách mới.`
    );

    currentTable = null;
  } catch (error) {
    console.error("Error cleaning table:", error);
    showToast("Lỗi khi dọn bàn: " + error.message, "error");
  }
}

function addOrder() {
  if (!currentTable) return;

  // Close actions modal
  const actionsModal = bootstrap.Modal.getInstance(
    document.getElementById("tableActionsModal")
  );
  actionsModal.hide();

  // Open order modal
  setTimeout(() => {
    openOrderModal(currentTable);
  }, 300);
}

function callWaiter() {
  if (!currentTable) return;

  // Close modal
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("tableActionsModal")
  );
  modal.hide();

  // Show notification
  showSuccess(
    "Đã gọi phục vụ!",
    `Nhân viên sẽ đến Bàn ${currentTable.id} ngay lập tức.`
  );

  currentTable = null;
}

function switchToTablesManagement() {
  currentSection = "tables";
  document.getElementById("tablesManagement").classList.remove("d-none");
  document.getElementById("ordersManagement").classList.add("d-none");
  document.getElementById("pageTitle").textContent = "Quản lý bàn";

  // Update nav buttons
  document
    .getElementById("tablesManagementBtn")
    .classList.add("nav-button-active");
  document
    .getElementById("ordersManagementBtn")
    .classList.remove("nav-button-active");
}

function switchToOrdersManagement() {
  currentSection = "orders";
  document.getElementById("tablesManagement").classList.add("d-none");
  document.getElementById("ordersManagement").classList.remove("d-none");
  document.getElementById("pageTitle").textContent = "Quản lý Order";

  // Update nav buttons
  document
    .getElementById("tablesManagementBtn")
    .classList.remove("nav-button-active");
  document
    .getElementById("ordersManagementBtn")
    .classList.add("nav-button-active");

  // Load orders from Firestore if not already loaded
  if (orders.length === 0) {
    loadOrdersFromFirestore();
  }

  // Initialize orders data
  updateOrdersStats();
  renderOrders();
  populateTableFilter();
}

function updateOrdersStats() {
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const cookingCount = orders.filter((o) => o.status === "cooking").length;
  const readyCount = orders.filter((o) => o.status === "ready").length;
  const completedCount = orders.filter((o) => o.status === "completed").length;

  document.getElementById("pendingOrders").textContent = pendingCount;
  document.getElementById("cookingOrders").textContent = cookingCount;
  document.getElementById("readyOrders").textContent = readyCount;
  document.getElementById("completedOrders").textContent = completedCount;
}

function getStatusBadge(status) {
  const statusConfig = {
    pending: { class: "bg-warning", text: "Chờ xác nhận" },
    cooking: { class: "bg-info", text: "Đang nấu" },
    ready: { class: "bg-success", text: "Sẵn sàng" },
    completed: { class: "bg-primary", text: "Hoàn thành" },
  };

  const config = statusConfig[status] || {
    class: "bg-secondary",
    text: "Không xác định",
  };
  return `<span class="badge ${config.class}">${config.text}</span>`;
}

function renderOrders() {
  const tbody = document.getElementById("ordersTableBody");
  const noOrdersMessage = document.getElementById("noOrdersMessage");

  // Apply filters
  let filteredOrders = [...orders];

  const statusFilter = document.getElementById("orderStatusFilter")?.value;
  const tableFilter = document.getElementById("orderTableFilter")?.value;
  const searchTerm = document
    .getElementById("orderSearch")
    ?.value?.toLowerCase();

  if (statusFilter && statusFilter !== "all") {
    filteredOrders = filteredOrders.filter(
      (order) => order.status === statusFilter
    );
  }

  if (tableFilter && tableFilter !== "all") {
    filteredOrders = filteredOrders.filter(
      (order) => order.tableId.toString() === tableFilter
    );
  }

  if (searchTerm) {
    filteredOrders = filteredOrders.filter(
      (order) =>
        order.id.toLowerCase().includes(searchTerm) ||
        order.tableName.toLowerCase().includes(searchTerm) ||
        order.items.some((item) => item.name.toLowerCase().includes(searchTerm))
    );
  }

  if (filteredOrders.length === 0) {
    tbody.innerHTML = "";
    noOrdersMessage.classList.remove("d-none");
    return;
  }

  noOrdersMessage.classList.add("d-none");

  tbody.innerHTML = filteredOrders
    .map((order) => {
      const itemsPreview = order.items
        .slice(0, 2)
        .map((item) => `${item.name} (${item.quantity})`)
        .join(", ");
      const remainingItems =
        order.items.length > 2 ? ` và ${order.items.length - 2} món khác` : "";

      return `
            <tr>
                <td class="px-4 py-3">
                    <div class="fw-bold text-primary">${order.id}</div>
                </td>
                <td class="py-3">
                    <div class="fw-medium">${order.tableName}</div>
                </td>
                <td class="py-3">
                    <div>${order.createdAt.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</div>
                    <small class="text-muted">${order.createdAt.toLocaleDateString(
                      "vi-VN"
                    )}</small>
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
                        <button class="btn btn-outline-primary btn-sm" onclick="viewOrderDetail('${
                          order.id
                        }')" title="Xem chi tiết">
                            <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
                        </button>
                        ${
                          order.status !== "completed"
                            ? `
                            <button class="btn btn-outline-warning btn-sm" onclick="editOrderInline('${order.id}')" title="Chỉnh sửa">
                                <i data-lucide="edit" style="width: 14px; height: 14px;"></i>
                            </button>
                        `
                            : ""
                        }
                        ${
                          order.status === "ready"
                            ? `
                            <button class="btn btn-outline-success btn-sm" onclick="markOrderCompleted('${order.id}')" title="Hoàn thành">
                                <i data-lucide="check" style="width: 14px; height: 14px;"></i>
                            </button>
                        `
                            : ""
                        }
                    </div>
                </td>
            </tr>
        `;
    })
    .join("");

  // Re-initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function populateTableFilter() {
  const tableFilter = document.getElementById("orderTableFilter");
  if (!tableFilter) return;

  // Clear existing options except "Tất cả bàn"
  tableFilter.innerHTML = '<option value="all">Tất cả bàn</option>';

  // Add table options
  tables.forEach((table) => {
    const option = document.createElement("option");
    option.value = table.id;
    option.textContent = `Bàn ${table.id}`;
    tableFilter.appendChild(option);
  });
}

function viewOrderDetail(orderId) {
  const order = orders.find((o) => o.id === orderId);
  if (!order) return;

  currentViewOrder = order;

  // Populate modal with order details
  document.getElementById("detailOrderId").textContent = order.id;
  document.getElementById("detailTableNumber").textContent = order.tableName;
  document.getElementById("detailOrderTime").textContent =
    order.createdAt.toLocaleString("vi-VN");
  document.getElementById("detailOrderStatus").innerHTML = getStatusBadge(
    order.status
  );
  document.getElementById("detailOrderNotes").textContent =
    order.notes || "Không có ghi chú";
  document.getElementById("detailSubtotal").textContent = formatCurrency(
    order.subtotal
  );
  document.getElementById("detailVat").textContent = formatCurrency(order.vat);
  document.getElementById("detailTotal").textContent = formatCurrency(
    order.total
  );

  // Render order items
  const itemsContainer = document.getElementById("detailOrderItems");
  itemsContainer.innerHTML = order.items
    .map(
      (item) => `
        <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
            <div>
                <div class="fw-medium">${item.name}</div>
                <small class="text-muted">${formatCurrency(item.price)} x ${
        item.quantity
      }</small>
            </div>
            <div class="fw-bold">${formatCurrency(
              item.price * item.quantity
            )}</div>
        </div>
    `
    )
    .join("");

  // Update modal buttons based on status
  const editBtn = document.getElementById("editOrderBtn");
  const updateStatusBtn = document.getElementById("updateOrderStatusBtn");

  if (order.status === "completed") {
    editBtn.style.display = "none";
    updateStatusBtn.style.display = "none";
  } else {
    editBtn.style.display = "inline-flex";
    updateStatusBtn.style.display = "inline-flex";

    // Update status button text based on current status
    if (order.status === "pending") {
      updateStatusBtn.innerHTML =
        '<i data-lucide="check" style="width: 16px; height: 16px;"></i> Xác nhận';
    } else if (order.status === "cooking") {
      updateStatusBtn.innerHTML =
        '<i data-lucide="check" style="width: 16px; height: 16px;"></i> Sẵn sàng';
    } else if (order.status === "ready") {
      updateStatusBtn.innerHTML =
        '<i data-lucide="check" style="width: 16px; height: 16px;"></i> Hoàn thành';
    }
  }

  // Show modal
  const modal = new bootstrap.Modal(
    document.getElementById("orderDetailModal")
  );
  modal.show();
}

function editOrder() {
  if (!currentViewOrder) return;

  // Set editing mode
  editingOrderId = currentViewOrder.id;

  // Close detail modal
  const detailModal = bootstrap.Modal.getInstance(
    document.getElementById("orderDetailModal")
  );
  detailModal.hide();

  // Set up order modal for editing
  selectedTableId = currentViewOrder.tableId;
  selectedTableName = currentViewOrder.tableName;
  currentOrder = [...currentViewOrder.items];

  // Update modal title to indicate editing
  document.getElementById(
    "modalTableName"
  ).textContent = `${selectedTableName} (Chỉnh sửa)`;

  // Update order summary
  updateOrderDisplay();

  // Show order modal
  const orderModal = new bootstrap.Modal(document.getElementById("orderModal"));
  orderModal.show();
}

async function updateOrderStatus() {
  if (!currentViewOrder) return;

  const order = orders.find((o) => o.id === currentViewOrder.id);
  if (!order) return;

  // Progress status
  const statusFlow = ["pending", "cooking", "ready", "completed"];
  const currentIndex = statusFlow.indexOf(order.status);

  if (currentIndex < statusFlow.length - 1) {
    const newStatus = statusFlow[currentIndex + 1];

    try {
      // Update order status in Firestore
      const orderRef = doc(db, "orders", order.id);
      await updateDoc(orderRef, {
        status: newStatus,
      });

      // Update table status if order is completed
      if (newStatus === "completed") {
        const table = tables.find((t) => t.id === order.tableId);
        if (table) {
          const tableRef = doc(db, "tables", table.id);
          await updateDoc(tableRef, {
            status: "cleaning",
          });
        }
      }

      // Close modal
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("orderDetailModal")
      );
      modal.hide();

      // Show success message
      showSuccess(
        "Trạng thái đã được cập nhật!",
        `Order ${order.id} đã chuyển sang trạng thái mới.`
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      showToast("Lỗi khi cập nhật trạng thái order: " + error.message, "error");
    }
  }
}

function editOrderInline(orderId) {
  const order = orders.find((o) => o.id === orderId);
  if (!order) return;

  viewOrderDetail(orderId);
}

async function markOrderCompleted(orderId) {
  const order = orders.find((o) => o.id === orderId);
  if (!order) return;

  try {
    // Update order status in Firestore
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: "completed",
    });

    // Update table status in Firestore
    const table = tables.find((t) => t.id === order.tableId);
    if (table) {
      const tableRef = doc(db, "tables", table.id);
      await updateDoc(tableRef, {
        status: "cleaning",
      });
    }

    showSuccess(
      "Order đã hoàn thành!",
      `Order ${order.id} đã được đánh dấu hoàn thành.`
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    showToast("Lỗi khi cập nhật trạng thái order: " + error.message, "error");
  }
}

function showCreateOrderModal() {
  // Populate table select with available tables
  const tableSelect = document.getElementById("selectTableForOrder");
  tableSelect.innerHTML = '<option value="">-- Chọn bàn --</option>';

  tables.forEach((table) => {
    const option = document.createElement("option");
    option.value = table.id;
    option.textContent = `Bàn ${table.id} (${
      table.status === "empty"
        ? "Trống"
        : table.status === "occupied"
        ? "Đang phục vụ"
        : "Cần dọn"
    })`;
    tableSelect.appendChild(option);
  });

  const modal = new bootstrap.Modal(
    document.getElementById("createOrderModal")
  );
  modal.show();
}

function proceedToCreateOrder() {
  const tableSelect = document.getElementById("selectTableForOrder");
  const selectedTableId = parseInt(tableSelect.value);

  if (!selectedTableId) {
    alert("Vui lòng chọn bàn");
    return;
  }

  // Close create order modal
  const createModal = bootstrap.Modal.getInstance(
    document.getElementById("createOrderModal")
  );
  createModal.hide();

  // Switch to table management and open order modal
  switchToTablesManagement();

  setTimeout(() => {
    openOrderModal(selectedTableId);
  }, 300);
}

function refreshOrders() {
  // Note: Orders are automatically synced with Firestore via onSnapshot
  // This function just refreshes the UI with current data
  updateOrdersStats();
  renderOrders();
  showSuccess("Đã làm mới!", "Danh sách order đã được cập nhật.");
}

function showSuccess(title, message) {
  document.getElementById("successTitle").textContent = title;
  document.getElementById("successMessage").textContent = message;

  const modal = new bootstrap.Modal(document.getElementById("successModal"));
  modal.show();
}

// Function to submit order to Firestore
async function submitOrder() {
  if (currentOrder.length === 0) {
    showToast("Vui lòng chọn ít nhất một món", "warning");
    return;
  }

  try {
    // Disable submit button to prevent double submission
    const submitBtn = document.getElementById("submitOrder");
    if (submitBtn) {
      submitBtn.disabled = true;
      const loadingText = editingOrderId ? "Đang cập nhật..." : "Đang tạo...";
      submitBtn.innerHTML = `<i data-lucide="loader" style="width: 16px; height: 16px;"></i> ${loadingText}`;
    }

    // Calculate totals
    const subtotal = currentOrder.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const vat = Math.round(subtotal * 0.1);
    const total = subtotal + vat; // Get order notes
    const notesEl = document.getElementById("orderNotes");
    const notes = notesEl ? notesEl.value.trim() : "";

    // Generate custom order ID
    const customOrderId = generateOrderId();

    // Create order object
    const orderData = {
      id: customOrderId,
      tableId: selectedTableId,
      tableName: selectedTableName,
      items: currentOrder.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      notes: notes,
      status: "pending",
      subtotal: subtotal,
      vat: vat,
      total: total,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }; // Add order to Firestore with custom ID
    await setDoc(doc(db, "orders", customOrderId), orderData);

    // If editing an existing order, delete the old one
    if (editingOrderId) {
      try {
        await deleteDoc(doc(db, "orders", editingOrderId));
        console.log("Old order deleted:", editingOrderId);
      } catch (error) {
        console.error("Error deleting old order:", error);
        // Don't fail the whole operation if delete fails
      }
    }

    // Update table status to occupied
    if (tables.find((t) => t.id === selectedTableId)) {
      const tableRef = doc(db, "tables", selectedTableId.toString());
      await updateDoc(tableRef, {
        status: "occupied",
        updatedAt: serverTimestamp(),
      }); // Update local tables array
      const tableIndex = tables.findIndex((t) => t.id === selectedTableId);
      if (tableIndex !== -1) {
        tables[tableIndex].status = "occupied";
        renderTables(); // Re-render tables
      }
    } // Show success message
    const successMessage = editingOrderId
      ? "Order đã được cập nhật thành công!"
      : "Order đã được tạo thành công!";
    showToast(successMessage, "success");

    // Close modal
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("orderModal")
    );
    if (modal) {
      modal.hide();
    }

    // Reset order state
    currentOrder = [];
    selectedTableId = null;
    selectedTableName = "";
    editingOrderId = null; // Reset editing state
  } catch (error) {
    console.error("Error submitting order:", error);
    showToast("Có lỗi xảy ra khi tạo order: " + error.message, "error");
  } finally {
    // Re-enable submit button
    const submitBtn = document.getElementById("submitOrder");
    if (submitBtn) {
      submitBtn.disabled = false;
      const buttonText = editingOrderId ? "Cập nhật Order" : "Tạo Order";
      submitBtn.innerHTML = `<i data-lucide="check" style="width: 16px; height: 16px;"></i> ${buttonText}`;
      // Re-initialize Lucide icons
      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    }
  }
}

// Make submitOrder available globally
window.submitOrder = submitOrder;

// Make navigation functions available globally
window.switchToTablesManagement = switchToTablesManagement;
window.switchToOrdersManagement = switchToOrdersManagement;

// Function to calculate table totals from orders
function calculateTableTotals() {
  // Reset all table totals
  tables.forEach((table) => {
    table.orderTotal = 0;
    table.customers = 0;
    table.startTime = null;
  });
  // Calculate totals from active orders
  orders.forEach((order) => {
    // Only count pending, cooking, and ready orders (not completed)
    if (
      order.status === "pending" ||
      order.status === "cooking" ||
      order.status === "ready"
    ) {
      const table = tables.find((t) => t.id == order.tableId);
      if (table) {
        table.orderTotal += order.total || 0;

        // Estimate customers based on order items (simple heuristic)
        const itemCount = order.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        table.customers = Math.max(table.customers, Math.ceil(itemCount / 3)); // Assume 3 items per customer

        // Set start time to earliest order time if not set
        if (!table.startTime || order.createdAt < table.startTime) {
          table.startTime = order.createdAt;
        }
      }
    }
  });

  console.log(
    "Table totals calculated:",
    tables.map((t) => ({
      id: t.id,
      total: t.orderTotal,
      customers: t.customers,
      status: t.status,
    }))
  );
}

// Function to render filtered menu items
function renderFilteredMenuItems(items) {
  const menuContainer = document.getElementById("menuItems");
  if (!menuContainer) {
    console.log("Menu container not found!");
    return;
  }
  console.log("Rendering menu items:", items.length);
  items.forEach((item, index) => {
    console.log(
      `Item ${index + 1}: ${item.name}, Description: "${
        item.description
      }", Price: ${item.price}, Category: ${item.category}`
    );
  });

  if (!items || items.length === 0) {
    menuContainer.innerHTML = `
      <div class="p-4 text-center">
        <div class="text-muted">
          <i data-lucide="search" style="width: 48px; height: 48px;" class="mb-3 opacity-50"></i>
          <p class="mb-0">Không tìm thấy món ăn nào</p>
          <small>Thử tìm với từ khóa khác</small>
        </div>
      </div>
    `;
    return;
  }
  // Function to get placeholder image based on category
  const getPlaceholderImage = (category) => {
    const placeholders = {
      noodles: "https://via.placeholder.com/280x120/FFE4B5/8B4513?text=Mì+Phở",
      rice: "https://via.placeholder.com/280x120/F5DEB3/8B4513?text=Cơm",
      drinks: "https://via.placeholder.com/280x120/87CEEB/1E90FF?text=Đồ+uống",
      snacks:
        "https://via.placeholder.com/280x120/FFB6C1/FF69B4?text=Tráng+miệng",
      appetizers:
        "https://via.placeholder.com/280x120/98FB98/006400?text=Khai+vị",
      seafood: "https://via.placeholder.com/280x120/20B2AA/FFFFFF?text=Hải+sản",
      meat: "https://via.placeholder.com/280x120/CD853F/FFFFFF?text=Thịt",
      vegetarian: "https://via.placeholder.com/280x120/32CD32/FFFFFF?text=Chay",
      desserts:
        "https://via.placeholder.com/280x120/FFB6C1/FF69B4?text=Tráng+miệng",
      hotpot: "https://via.placeholder.com/280x120/FF6347/FFFFFF?text=Lẩu",
      grilled: "https://via.placeholder.com/280x120/8B4513/FFFFFF?text=Nướng",
    };
    return (
      placeholders[category] ||
      "https://via.placeholder.com/280x120/F0F0F0/888?text=Món+ăn"
    );
  };
  console.log("About to render HTML for", items.length, "items");

  menuContainer.innerHTML = `
    <div class="menu-grid p-3">
      ${items
        .map((item) => {
          console.log(`Generating HTML for item: ${item.name}`);
          return `
        <div class="menu-item-card" onclick="addToOrder('${item.id}')">
          <div class="menu-item-image">
            <img src="${item.image || getPlaceholderImage(item.category)}" 
                 alt="${item.name}" 
                 onerror="this.src='${getPlaceholderImage(item.category)}'">
            <div class="menu-item-overlay">
              <i data-lucide="plus" style="width: 20px; height: 20px;"></i>
            </div>
          </div>
          <div class="menu-item-info">
            <h6 class="menu-item-name">${item.name}</h6>
            ${
              item.description
                ? `<div class="menu-item-description">${item.description}</div>`
                : `<div class="menu-item-description text-muted fst-italic">Chưa có mô tả</div>`
            }
            <div class="menu-item-price">${formatCurrency(
              item.price || 0
            )}</div>
          </div>
        </div>
      `;
        })
        .join("")}
    </div>
  `;

  console.log("HTML rendered successfully");

  // Re-initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

// Function to handle menu search
function handleMenuSearch() {
  const searchInput = document.getElementById("menuSearch");
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";

  console.log(
    "handleMenuSearch called with searchTerm:",
    searchTerm,
    "selectedCategory:",
    selectedCategory
  );
  console.log("Total menuItems available:", menuItems.length);

  let filteredItems = [...menuItems]; // Create a copy

  // Filter by search term
  if (searchTerm) {
    filteredItems = filteredItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm) ||
        (item.description &&
          item.description.toLowerCase().includes(searchTerm))
    );
  }

  // Also filter by selected category (but not if "all" is selected)
  if (selectedCategory && selectedCategory !== "all") {
    filteredItems = filteredItems.filter(
      (item) => item.category === selectedCategory
    );
  }

  console.log("Filtered items count:", filteredItems.length);
  renderFilteredMenuItems(filteredItems);
}

// Function to setup menu search
function setupMenuSearch() {
  const searchInput = document.getElementById("menuSearch");
  if (searchInput) {
    searchInput.addEventListener("input", handleMenuSearch);
    searchInput.addEventListener("keyup", handleMenuSearch);
  }
}

// Call setupMenuSearch on DOMContentLoaded
document.addEventListener("DOMContentLoaded", setupMenuSearch);

// Setup event listeners for orders filters
function setupOrdersFilters() {
  // Status filter
  const statusFilter = document.getElementById("orderStatusFilter");
  if (statusFilter) {
    statusFilter.addEventListener("change", renderOrders);
  }

  // Table filter
  const tableFilter = document.getElementById("orderTableFilter");
  if (tableFilter) {
    tableFilter.addEventListener("change", renderOrders);
  }

  // Search input
  const searchInput = document.getElementById("orderSearch");
  if (searchInput) {
    searchInput.addEventListener("input", renderOrders);
  }
}

// Setup filters when DOM is loaded
document.addEventListener("DOMContentLoaded", setupOrdersFilters);

// Make loadMenuFromFirestore available globally for error retry button
window.loadMenuFromFirestore = loadMenuFromFirestore;

// Debug function to test menu data
window.debugMenuData = function () {
  console.log("Current menuItems array:", menuItems);
  console.log("Menu items count:", menuItems.length);
  if (menuItems.length > 0) {
    console.log("First item example:", menuItems[0]);
  }

  // Try to render the first few items
  if (menuItems.length > 0) {
    renderFilteredMenuItems(menuItems.slice(0, 3));
  }
};

// Debug function to test order functionality
window.debugOrder = function () {
  console.log("Current order:", currentOrder);
  console.log("Current order length:", currentOrder.length);

  const submitBtn = document.getElementById("submitOrder");
  console.log("Submit button element:", submitBtn);
  console.log(
    "Submit button disabled state:",
    submitBtn ? submitBtn.disabled : "button not found"
  );

  // Try manually adding an item
  if (menuItems.length > 0) {
    console.log("Trying to add first menu item:", menuItems[0]);
    addToOrder(menuItems[0].id);
  }
};

// Debug function to test opening modal directly
window.testOrderModal = function () {
  const mockTable = { id: 1 };
  openOrderModal(mockTable);
};

// Debug function to manually enable submit button
window.forceEnableSubmit = function () {
  const submitBtn = document.getElementById("submitOrder");
  if (submitBtn) {
    submitBtn.disabled = false;
    console.log("Submit button force enabled");
  } else {
    console.log("Submit button not found");
  }
};

// Debug function to test submit button click
window.testSubmitClick = function () {
  const submitBtn = document.getElementById("submitOrder");
  if (submitBtn) {
    console.log("Testing submit button click...");
    submitBtn.click();
  } else {
    console.log("Submit button not found");
  }
};

// Debug function to test event listener
window.testEventListener = function () {
  const submitBtn = document.getElementById("submitOrder");
  if (submitBtn) {
    console.log("Testing event listener...");
    console.log("Button disabled:", submitBtn.disabled);
    console.log(
      "Button hasAttribute disabled:",
      submitBtn.hasAttribute("disabled")
    );

    // Try to add click event manually
    submitBtn.onclick = function () {
      console.log("Manual onclick called!");
      submitOrder();
    };

    console.log("Manual onclick added");
  }
};

// Debug function to check all button properties
window.inspectButton = function () {
  const submitBtn = document.getElementById("submitOrder");
  if (submitBtn) {
    console.log("=== BUTTON INSPECTION ===");
    console.log("Element:", submitBtn);
    console.log("disabled property:", submitBtn.disabled);
    console.log(
      "hasAttribute('disabled'):",
      submitBtn.hasAttribute("disabled")
    );
    console.log(
      "getAttribute('disabled'):",
      submitBtn.getAttribute("disabled")
    );
    console.log("classList:", submitBtn.classList.toString());
    console.log("style:", submitBtn.style.cssText);
    console.log("offsetParent:", submitBtn.offsetParent);
    console.log("clientHeight:", submitBtn.clientHeight);
    console.log("onclick:", submitBtn.onclick);
    console.log(
      "addEventListener count:",
      submitBtn.getEventListeners
        ? submitBtn.getEventListeners()
        : "Not available"
    );
  }
};

// Debug function to check orders data
window.debugOrders = function () {
  console.log("=== ORDERS DEBUG ===");
  console.log("Orders array length:", orders.length);
  console.log("Orders data:", orders);
  console.log("Current section:", currentSection);

  // Check if on orders page
  const ordersSection = document.getElementById("ordersManagement");
  console.log("Orders section exists:", !!ordersSection);
  console.log(
    "Orders section visible:",
    ordersSection && !ordersSection.classList.contains("d-none")
  );

  // Check table body
  const tbody = document.getElementById("ordersTableBody");
  console.log("Table body exists:", !!tbody);
  console.log(
    "Table body innerHTML length:",
    tbody ? tbody.innerHTML.length : 0
  );

  // Check stats
  const pendingEl = document.getElementById("pendingOrders");
  console.log(
    "Pending orders display:",
    pendingEl ? pendingEl.textContent : "N/A"
  );
};

// Auto-debug every 5 seconds when on orders page
setInterval(() => {
  if (currentSection === "orders") {
    console.log("Auto-debug: Orders count =", orders.length);
  }
}, 5000);

// Debug function to check table status
window.debugTableStatus = function (tableId) {
  const table = tables.find((t) => t.id == tableId);
  if (table) {
    console.log("=== TABLE DEBUG ===");
    console.log("Table ID:", table.id);
    console.log("Current status:", table.status);
    console.log(
      "Display status:",
      table.status === "available" ? "empty" : table.status
    );
    console.log(
      "Status text:",
      table.status === "available"
        ? "Trống"
        : table.status === "occupied"
        ? "Đang phục vụ"
        : table.status === "cleaning"
        ? "Cần dọn"
        : "Unknown"
    );
    console.log("Full table object:", table);
  } else {
    console.log("Table not found:", tableId);
    console.log(
      "Available tables:",
      tables.map((t) => ({ id: t.id, status: t.status }))
    );
  }
};

// Debug function to manually update table status (for testing)
window.testCleanTable = async function (tableId) {
  try {
    const tableRef = doc(db, "tables", tableId.toString());
    await updateDoc(tableRef, {
      status: "available",
      updatedAt: serverTimestamp(),
    });
    console.log(`Table ${tableId} status updated to 'available'`);
  } catch (error) {
    console.error("Error updating table:", error);
  }
};

// Calculate table totals on page load
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(calculateTableTotals, 1500); // Wait for data to load
});

// Recalculate table totals after every order update
onSnapshot(collection(db, "orders"), (snapshot) => {
  console.log("Orders collection updated, recalculating table totals...");
  calculateTableTotals();
});
