// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  setDoc,
  Timestamp,
  getDocs,
  limit,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import firebaseConfig from "../config/firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Track orders
let pendingPaymentOrders = [];
let completedOrders = [];

// Discount codes data
const discountCodes = [
  {
    code: "WELCOME15",
    title: "Chào mừng khách mới",
    description: "Giảm giá cho khách hàng lần đầu",
    discount: 15,
    minOrder: 100000,
    conditions: "Áp dụng cho đơn hàng từ 100.000₫",
  },
  {
    code: "HAPPY10",
    title: "Giảm giá vui vẻ",
    description: "Khuyến mãi cuối tuần",
    discount: 10,
    minOrder: 50000,
    conditions: "Áp dụng cho đơn hàng từ 50.000₫",
  },
  {
    code: "VIP20",
    title: "Khách hàng VIP",
    description: "Ưu đãi đặc biệt cho khách VIP",
    discount: 20,
    minOrder: 200000,
    conditions: "Áp dụng cho đơn hàng từ 200.000₫",
  },
  {
    code: "STUDENT5",
    title: "Sinh viên",
    description: "Giảm giá cho sinh viên",
    discount: 5,
    minOrder: 30000,
    conditions: "Áp dụng cho đơn hàng từ 30.000₫",
  },
  {
    code: "LUNCH20",
    title: "Combo trưa",
    description: "Ưu đãi giờ ăn trưa",
    discount: 20,
    minOrder: 80000,
    conditions: "Áp dụng 11:00-14:00, đơn từ 80.000₫",
  },
];

let currentOrder = null;
let selectedDiscountCode = null;
const VAT_RATE = 0.1; // 8% VAT

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Lucide icons
  lucide.createIcons();
  // Check authentication state
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in
      console.log("User authenticated:", user.uid);

      // Check user role from Firestore
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();

          // Check if user has cashier role
          if (userData.role !== "cashier") {
            alert("Bạn không có quyền truy cập trang này!");
            await signOut(auth);
            window.location.href = "../index.html";
            return;
          }

          // Save user info to localStorage
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              uid: user.uid,
              name: userData.displayName || "Thu ngân",
              email: user.email,
              role: userData.role,
              phoneNumber: userData.phoneNumber,
              avatar: userData.profileImage,
            })
          );

          // Load user profile and orders
          loadUserProfile(user.uid);
          loadOrdersFromFirestore();
        } else {
          console.error("User data not found in Firestore");
          alert("Không tìm thấy thông tin người dùng!");
          await signOut(auth);
          window.location.href = "../index.html";
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        // Still allow access but with limited functionality
        loadUserProfile(user.uid);
        loadOrdersFromFirestore();
      }
    } else {
      // User is signed out, redirect to login
      console.log("User not authenticated, redirecting to login");
      window.location.href = "../index.html";
    }
  });

  // Payment form event listeners
  setupPaymentForm();

  // Discount search event listener
  setupDiscountSearch();

  // Order search event listener
  setupOrderSearch();
  // Handle logout
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      // Show confirmation dialog
      if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
        try {
          // Show loading notification
          showNotification("Đang đăng xuất...", "info");

          // Clear user session data
          localStorage.removeItem("userInfo");
          sessionStorage.removeItem("userInfo");
          localStorage.removeItem("authToken");
          sessionStorage.removeItem("authToken");

          // Sign out from Firebase
          await signOut(auth);

          // Show success message
          showNotification("Đăng xuất thành công!", "success");

          // Redirect after a short delay
          setTimeout(() => {
            window.location.href = "../index.html";
          }, 1000);
        } catch (error) {
          console.error("Error signing out:", error);
          showNotification("Có lỗi xảy ra khi đăng xuất", "error");

          // Still redirect even if there's an error
          setTimeout(() => {
            window.location.href = "../index.html";
          }, 1000);
        }
      }
    });
  }
});

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
}

function getTimeAgo(orderTime) {
  const now = new Date();
  const diffInMinutes = Math.floor((now - orderTime) / (1000 * 60));

  if (diffInMinutes < 1) return "Vừa xong";
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  return `${diffInHours} giờ trước`;
}

function updateStats() {
  const searchInput = document.getElementById("orderSearch");
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";

  // Filter pending orders based on search term
  const filteredPendingOrders = pendingPaymentOrders.filter((order) => {
    return (
      order.id.toLowerCase().includes(searchTerm) ||
      order.table.toLowerCase().includes(searchTerm)
    );
  });

  const pendingCount = searchTerm
    ? filteredPendingOrders.length
    : pendingPaymentOrders.length;
  const completedToday = completedOrders.length;
  const totalRevenue = completedOrders.reduce((sum, order) => {
    return sum + (order.finalTotal || order.total);
  }, 0);

  document.getElementById("pendingPayments").textContent = pendingCount;
  document.getElementById("completedPayments").textContent = completedToday;
  document.getElementById("totalRevenue").textContent =
    formatCurrency(totalRevenue);
  document.getElementById("pendingBadge").textContent = `${pendingCount} đơn`;
}

function renderPendingOrders() {
  const container = document.getElementById("pendingOrders");
  const searchInput = document.getElementById("orderSearch");
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";

  // Filter orders based on search term
  const filteredOrders = pendingPaymentOrders.filter((order) => {
    return (
      order.id.toLowerCase().includes(searchTerm) ||
      order.table.toLowerCase().includes(searchTerm)
    );
  });

  if (filteredOrders.length === 0) {
    container.innerHTML = `
      <div class="text-center text-muted py-4">
        <i data-lucide="clock" style="width: 48px; height: 48px; opacity: 0.5;"></i>
        <p class="mt-2">Không có đơn hàng nào chờ thanh toán</p>
      </div>
    `;
    return;
  }

  // Create rows with 2 orders each
  let ordersHtml = '<div class="row g-3">';
  filteredOrders.forEach((order, index) => {
    if (index % 2 === 0 && index > 0) {
      ordersHtml += '</div><div class="row g-3 mt-2">';
    }

    const timeAgo = getTimeAgo(
      order.cookingCompletedTime || order.orderTime || new Date()
    );
    const orderItems = order.items || [];

    ordersHtml += `
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm order-card h-100">
          <div class="card-body p-3">            <div class="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h6 class="fw-bold mb-1">${order.id}</h6>
                <div class="d-flex gap-1 flex-wrap">
                  <span class="badge bg-primary">${order.table}</span>
                  ${
                    order.isMerged
                      ? '<span class="merge-badge">GHÉP ĐƠN</span>'
                      : ""
                  }
                  ${
                    order.isSplit
                      ? '<span class="split-badge">TÁCH ĐƠN</span>'
                      : ""
                  }
                </div>
              </div>
              <div class="text-end">
                <small class="text-muted">${timeAgo}</small>
                <div class="mt-1">
                  <span class="badge bg-warning text-dark">Chờ thanh toán</span>
                </div>
            </div>
            </div>
            
            ${
              order.isMerged
                ? `
              <div class="mb-2 p-2 bg-light rounded">
                <small class="text-muted">
                  <i data-lucide="merge" style="width: 12px; height: 12px;"></i>
                  Ghép từ: ${
                    order.mergedFrom ? order.mergedFrom.join(", ") : "N/A"
                  }
                  ${order.mergeNotes ? `<br>Ghi chú: ${order.mergeNotes}` : ""}
                </small>
              </div>
            `
                : ""
            }
            
            ${
              order.isSplit
                ? `
              <div class="mb-2 p-2 bg-light rounded">
                <small class="text-muted">
                  <i data-lucide="split" style="width: 12px; height: 12px;"></i>
                  Tách từ: ${order.splitFrom || "N/A"}
                </small>
              </div>
            `
                : ""
            }
            
            <div class="order-items mb-3">
              ${orderItems
                .slice(0, 2)
                .map(
                  (item) => `
                <div class="d-flex justify-content-between small">
                  <span>${item.quantity}x ${item.name}</span>
                  <span>${formatCurrency(item.quantity * item.price)}</span>
                </div>
              `
                )
                .join("")}
              ${
                orderItems.length > 2
                  ? `
                <div class="text-muted small">... và ${
                  orderItems.length - 2
                } món khác</div>
              `
                  : ""
              }
            </div>
            
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <strong class="text-primary">${formatCurrency(
                  order.total
                )}</strong>
              </div>
              <div class="btn-group" role="group">
                <button class="btn btn-outline-primary btn-sm" onclick="printPendingInvoice('${
                  order.id
                }')" title="In hóa đơn tạm">
                  <i data-lucide="printer" style="width: 14px; height: 14px;"></i>
                </button>
                <button class="btn btn-primary btn-sm" onclick="openPaymentModal('${
                  order.id
                }')">
                  <i data-lucide="credit-card" style="width: 14px; height: 14px;"></i>
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  ordersHtml += "</div>";

  container.innerHTML = ordersHtml;

  // Re-initialize Lucide icons
  lucide.createIcons();
}

function renderRecentPayments() {
  const container = document.getElementById("recentPayments");

  if (completedOrders.length === 0) {
    container.innerHTML = `
      <div class="text-center text-muted py-4">
        <i data-lucide="check-circle-2" style="width: 48px; height: 48px; opacity: 0.5;"></i>
        <p class="mt-2">Chưa có thanh toán nào hôm nay</p>
      </div>
    `;
    return;
  }

  container.innerHTML = completedOrders
    .map((order) => {
      const paymentTime = getTimeAgo(order.paymentTime || new Date());
      return `
        <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
          <div>
            <div class="fw-medium">${order.id} - ${order.table}</div>
            <small class="text-muted">${
              order.paymentMethod
            } • ${paymentTime}</small>
          </div>
          <div class="text-end">
            <div class="fw-bold text-success">${formatCurrency(
              order.finalTotal || order.total
            )}</div>
            <button class="btn btn-outline-primary btn-sm mt-1" onclick="printCompletedOrder('${
              order.id
            }')">
              <i data-lucide="printer" style="width: 12px; height: 12px;"></i>
              In lại
            </button>
          </div>
        </div>
      `;
    })
    .join("");

  // Re-initialize Lucide icons
  lucide.createIcons();
}

function setupDiscountSearch() {
  const searchInput = document.getElementById("discountSearch");
  if (searchInput) {
    searchInput.addEventListener("input", renderDiscountCodes);
  }
}

function setupOrderSearch() {
  const orderSearchInput = document.getElementById("orderSearch");
  const clearOrderSearchBtn = document.getElementById("clearOrderSearch");

  if (orderSearchInput) {
    orderSearchInput.addEventListener("input", function () {
      updateStats();
      renderPendingOrders();
    });
  }

  if (clearOrderSearchBtn) {
    clearOrderSearchBtn.addEventListener("click", function () {
      orderSearchInput.value = "";
      updateStats();
      renderPendingOrders();
    });
  }
}

function openPaymentModal(orderId) {
  currentOrder = pendingPaymentOrders.find((order) => order.id === orderId);
  if (!currentOrder) return;

  // Reset selected discount code
  selectedDiscountCode = null;

  // Populate payment details
  const paymentDetails = document.getElementById("paymentDetails");
  paymentDetails.innerHTML = `
    <div class="order-summary p-3 bg-light rounded">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold mb-0">Đơn hàng ${currentOrder.id}</h6>
        <span class="badge bg-primary">${currentOrder.table}</span>
      </div>
      <div class="items-list">
        ${currentOrder.items
          .map(
            (item) => `
            <div class="d-flex justify-content-between mb-1">
              <span>${item.quantity}x ${item.name}</span>
              <span>${formatCurrency(item.quantity * item.price)}</span>
            </div>
          `
          )
          .join("")}
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
  document.getElementById("paymentMethod").value = "cash";
  document.getElementById("customerPaid").value = "";
  document.getElementById("discountSearch").value = "";

  // Update payment summary
  updatePaymentSummary();
  updateCashAmountVisibility();

  // Show modal
  const modal = new bootstrap.Modal(document.getElementById("paymentModal"));
  modal.show();

  // Re-initialize Lucide icons
  lucide.createIcons();
}

function renderDiscountCodes() {
  const container = document.getElementById("discountCodes");
  const searchInput = document.getElementById("discountSearch");
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";

  // Filter discount codes based on search term
  const filteredCodes = discountCodes.filter((code) => {
    return (
      code.code.toLowerCase().includes(searchTerm) ||
      code.title.toLowerCase().includes(searchTerm) ||
      code.description.toLowerCase().includes(searchTerm)
    );
  });

  if (filteredCodes.length === 0) {
    container.innerHTML = `
      <div class="text-center text-muted py-3">
        <p class="mb-0">Không tìm thấy mã giảm giá</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredCodes
    .map((code) => {
      const isSelected =
        selectedDiscountCode && selectedDiscountCode.code === code.code;
      const canApply = currentOrder && currentOrder.total >= code.minOrder;

      return `
        <div class="discount-card ${isSelected ? "selected" : ""} ${
        !canApply ? "disabled" : ""
      }" 
             onclick="${canApply ? `selectDiscountCode('${code.code}')` : ""}"
             style="${!canApply ? "opacity: 0.5; cursor: not-allowed;" : ""}">
          <div class="d-flex justify-content-between align-items-start">
            <div class="flex-grow-1">
              <div class="fw-bold text-primary">${code.code}</div>
              <div class="small fw-medium">${code.title}</div>
              <div class="small text-muted">${code.description}</div>
              <div class="small text-success mt-1">${code.conditions}</div>
            </div>
            <div class="discount-percent">
              ${code.discount}%
            </div>
          </div>
          ${
            !canApply
              ? `
            <div class="small text-danger mt-2">
              Cần đơn hàng tối thiểu ${formatCurrency(code.minOrder)}
            </div>
          `
              : ""
          }
        </div>
      `;
    })
    .join("");
}

function selectDiscountCode(codeId) {
  const code = discountCodes.find((c) => c.code === codeId);
  if (!code || currentOrder.total < code.minOrder) return;

  selectedDiscountCode =
    selectedDiscountCode && selectedDiscountCode.code === codeId ? null : code;

  renderDiscountCodes();
  updatePaymentSummary();
}

function setupPaymentForm() {
  const customerPaidInput = document.getElementById("customerPaid");
  const paymentMethodSelect = document.getElementById("paymentMethod");
  const processButton = document.getElementById("processPayment");

  // Update summary when inputs change
  customerPaidInput.addEventListener("input", updatePaymentSummary);

  // Handle payment method change
  paymentMethodSelect.addEventListener("change", function () {
    updateCashAmountVisibility();
    updatePaymentSummary();
    updatePaymentButtons();
  });

  // Process payment
  processButton.addEventListener("click", processPayment);
}

function updateCashAmountVisibility() {
  const paymentMethod = document.getElementById("paymentMethod").value;
  const cashAmountSection = document.getElementById("cashAmountSection");

  if (paymentMethod === "cash") {
    cashAmountSection.classList.remove("hidden");
    cashAmountSection.style.display = "block";
  } else {
    cashAmountSection.classList.add("hidden");
    cashAmountSection.style.display = "none";
    document.getElementById("customerPaid").value = "";
  }
}

function updatePaymentButtons() {
  // All payment methods now use the same button
  const processButton = document.getElementById("processPayment");
  processButton.style.display = "inline-block";
}

function updatePaymentSummary() {
  if (!currentOrder) return;

  const customerPaid =
    parseFloat(document.getElementById("customerPaid").value) || 0;
  const paymentMethod = document.getElementById("paymentMethod").value;

  // Use subtotal if available, otherwise use total as base amount
  const subtotal = currentOrder.subtotal || currentOrder.total || 0;
  // Calculate tax as exact amount
  const taxAmount = parseFloat((subtotal * VAT_RATE).toFixed(0));
  // Add subtotal and tax to get afterTax amount
  const afterTax = subtotal + taxAmount;

  const discountPercent = selectedDiscountCode
    ? selectedDiscountCode.discount
    : 0;
  // Calculate exact discount amount
  const discountAmount = parseFloat(
    (afterTax * (discountPercent / 100)).toFixed(0)
  );
  const finalTotal = afterTax - discountAmount;

  const change =
    paymentMethod === "cash" ? Math.max(0, customerPaid - finalTotal) : 0;

  // Update display
  document.getElementById("subtotal").textContent = formatCurrency(subtotal);
  document.getElementById("taxAmount").textContent = `+${formatCurrency(
    taxAmount
  )}`;
  document.getElementById("discountLabel").textContent = `${discountPercent}%`;
  document.getElementById("discountAmount").textContent = `-${formatCurrency(
    discountAmount
  )}`;
  document.getElementById("finalTotal").textContent =
    formatCurrency(finalTotal);
  document.getElementById("changeAmount").textContent = formatCurrency(change);

  // Show/hide discount line
  const discountLine = document.getElementById("discountLine");
  if (selectedDiscountCode) {
    discountLine.style.display = "flex";
  } else {
    discountLine.style.display = "none";
  }

  // Show/hide change line
  const changeLine = document.getElementById("changeLine");
  if (paymentMethod === "cash") {
    changeLine.style.display = "flex";
  } else {
    changeLine.style.display = "none";
  }

  // Enable/disable process button
  const processButton = document.getElementById("processPayment");

  if (paymentMethod === "cash") {
    processButton.disabled = customerPaid < finalTotal;
  } else {
    processButton.disabled = false;
  }
}

async function processPayment() {
  if (!currentOrder) {
    alert("Không có đơn hàng nào được chọn!");
    return;
  }

  const paymentMethod = document.getElementById("paymentMethod").value;
  const customerPaid =
    parseFloat(document.getElementById("customerPaid").value) || 0;
  // Calculate payment details with precise calculation to avoid floating point errors
  const subtotal = currentOrder.subtotal || currentOrder.total || 0;
  // Calculate tax as exact amount with rounding
  const taxAmount = parseFloat((subtotal * VAT_RATE).toFixed(0));
  const afterTax = subtotal + taxAmount;
  const discountPercent = selectedDiscountCode
    ? selectedDiscountCode.discount
    : 0;
  // Calculate exact discount amount with rounding
  const discountAmount = parseFloat(
    (afterTax * (discountPercent / 100)).toFixed(0)
  );
  const finalTotal = afterTax - discountAmount;
  const changeAmount =
    paymentMethod === "cash" ? Math.max(0, customerPaid - finalTotal) : 0;

  // Validate cash payment
  if (paymentMethod === "cash" && customerPaid < finalTotal) {
    alert("Số tiền khách đưa không đủ để thanh toán!");
    return;
  }

  try {
    // Show loading state
    const processButton = document.getElementById("processPayment");
    const originalText = processButton.innerHTML;
    processButton.disabled = true;
    processButton.innerHTML =
      '<i data-lucide="loader-2" style="width: 16px; height: 16px;"></i> Đang xử lý...';

    // Update order status in Firestore
    const paymentData = {
      paymentMethod: getPaymentMethodText(paymentMethod),
      finalTotal: finalTotal,
      subtotal: subtotal,
      vat: taxAmount,
      discount: discountPercent,
      discountCode: selectedDiscountCode?.code || "",
      customerPaid: customerPaid,
      changeAmount: changeAmount,
    };

    await processPaymentInFirestore(
      currentOrder.firestoreId || currentOrder.id,
      paymentData
    );

    // Create finance transaction
    await createFinanceTransaction(
      currentOrder.firestoreId || currentOrder.id,
      paymentData
    );

    // Reset form
    selectedDiscountCode = null;
    document.getElementById("customerPaid").value = "";
    document.getElementById("paymentMethod").value = "cash";

    // Close payment modal
    const paymentModal = bootstrap.Modal.getInstance(
      document.getElementById("paymentModal")
    );
    paymentModal.hide();

    // Show success modal
    document.getElementById("successMessage").textContent = `Đơn hàng ${
      currentOrder.table
    } đã được thanh toán thành công. Tổng tiền: ${formatCurrency(finalTotal)}`;

    const successModal = new bootstrap.Modal(
      document.getElementById("successModal")
    );
    successModal.show();

    // Store current order for printing
    window.lastProcessedOrder = {
      ...currentOrder,
      paymentMethod: getPaymentMethodText(paymentMethod),
      finalTotal: finalTotal,
      subtotal: subtotal,
      vat: taxAmount,
      discount: discountPercent,
      discountCode: selectedDiscountCode?.code || "",
      customerPaid: customerPaid,
      changeAmount: changeAmount,
      paymentTime: new Date(),
    };

    currentOrder = null;
  } catch (error) {
    console.error("Error processing payment:", error);
    alert("Có lỗi xảy ra khi xử lý thanh toán: " + error.message);
  } finally {
    // Reset button state
    const processButton = document.getElementById("processPayment");
    processButton.disabled = false;
    processButton.innerHTML = originalText;
    lucide.createIcons();
  }
}

// Creating finance transaction after order payment
async function createFinanceTransaction(orderId, paymentData) {
  try {
    console.log(
      "Creating finance transaction for order:",
      orderId,
      paymentData
    );

    // Check if collection exists first
    const financeRef = collection(db, "finance_transactions");

    // Generate a unique receipt code (Mã phiếu thu)
    const now = new Date();
    const year = now.getFullYear();

    // Get the count of existing finance records for this year to create sequential codes
    const countQuery = query(
      financeRef,
      where("type", "==", "income"),
      where("code", ">=", `PT${year}`),
      where("code", "<", `PT${year + 1}`)
    );

    const countSnapshot = await getDocs(countQuery);
    const receiptCount = countSnapshot.size + 1;

    // Format: PT2025001, PT2025002, etc.
    const receiptCode = `PT${year}${receiptCount.toString().padStart(3, "0")}`;

    // Prepare the transaction data
    const transactionData = {
      type: "income",
      code: receiptCode, // Add unique receipt code
      category: "Doanh thu bán hàng", // Set default category
      amount: parseFloat(paymentData.finalTotal.toFixed(0)) || 0, // Use precise amount
      date: Timestamp.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      description: `Thanh toán đơn hàng ${orderId}`,
      orderId: orderId, // Link to the original order
      paymentMethod: paymentData.paymentMethod || "cash",
      subtotal: parseFloat(paymentData.subtotal.toFixed(0)) || 0,
      vat: parseFloat(paymentData.vat.toFixed(0)) || 0,
      discount: paymentData.discount || 0,
      discountCode: paymentData.discountCode || "",
      cashierId: auth.currentUser?.uid || "",
      cashierName: auth.currentUser?.displayName || "Thu ngân",
      // Save full invoice details
      invoice: {
        items: currentOrder ? currentOrder.items : [],
        orderId: orderId,
        table: currentOrder ? currentOrder.table : "",
        orderTime: currentOrder ? currentOrder.orderTime : Timestamp.now(),
        subtotal: parseFloat(paymentData.subtotal.toFixed(0)) || 0,
        vat: parseFloat(paymentData.vat.toFixed(0)) || 0,
        discount: paymentData.discount || 0,
        total: parseFloat(paymentData.finalTotal.toFixed(0)) || 0,
      },
    };

    // Create the transaction document
    const docRef = await addDoc(financeRef, transactionData);
    console.log("Finance transaction created with ID:", docRef.id);

    return docRef;
  } catch (error) {
    console.error("Error creating finance transaction:", error);
    // Don't throw error to not block the payment process
    // Just log the error
    return null;
  }
}

function getPaymentMethodText(method) {
  const methods = {
    cash: "Tiền mặt",
    card: "Thẻ",
    transfer: "Chuyển khoản",
  };
  return methods[method] || "Không xác định";
}

function printInvoice(isCompleted = false) {
  const orderToPrint = isCompleted ? window.lastCompletedOrder : currentOrder;
  if (!orderToPrint) return;

  const subtotal = orderToPrint.total;
  const taxAmount = isCompleted ? orderToPrint.taxAmount : subtotal * VAT_RATE;
  const afterTax = subtotal + taxAmount;

  let discountPercent = 0;
  let discountCode = "";
  let discountAmount = 0;
  let finalTotal = afterTax;

  if (isCompleted) {
    discountPercent = orderToPrint.discount || 0;
    discountCode = orderToPrint.discountCode || "";
    discountAmount = orderToPrint.finalTotal
      ? afterTax - orderToPrint.finalTotal
      : 0;
    finalTotal = orderToPrint.finalTotal || afterTax;
  } else if (selectedDiscountCode) {
    discountPercent = selectedDiscountCode.discount;
    discountCode = selectedDiscountCode.code;
    discountAmount = afterTax * (discountPercent / 100);
    finalTotal = afterTax - discountAmount;
  }

  const invoiceHtml = `
    <div style="max-width: 400px; margin: 0 auto; font-family: Arial, sans-serif; font-weight: bold; font-size: 14px; line-height: 1.4;">
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
          <span>${new Date().toLocaleDateString("vi-VN")}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span><strong>Giờ:</strong></span>
          <span>${new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}</span>
        </div>
        ${
          isCompleted
            ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span><strong>Thu ngân:</strong></span>
              <span>Thu ngân</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span><strong>Phương thức:</strong></span>
              <span>${orderToPrint.paymentMethod}</span>
            </div>
          `
            : ""
        }
      </div>
      
      <div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 10px 0; margin-bottom: 15px;">
        ${orderToPrint.items
          .map(
            (item) => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span>${item.quantity}x ${item.name}</span>
              <span>${formatCurrency(item.quantity * item.price)}</span>
            </div>
          `
          )
          .join("")}
      </div>
      
      <div style="margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
          <span>Tổng tiền hàng:</span>
          <span>${formatCurrency(subtotal)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
          <span>Thuế VAT (10%):</span>
          <span>${formatCurrency(taxAmount)}</span>
        </div>
        ${
          discountPercent > 0
            ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span>Giảm giá (${discountCode}):</span>
              <span>-${formatCurrency(discountAmount)}</span>
            </div>
          `
            : ""
        }
      </div>
      
      <div style="border-top: 2px solid #000; padding-top: 10px; margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold;">
          <span>THÀNH TIỀN:</span>
          <span>${formatCurrency(finalTotal)}</span>
        </div>
        ${
          isCompleted && orderToPrint.paymentMethod === "Tiền mặt"
            ? `
            <div style="display: flex; justify-content: space-between; margin-top: 5px;">
              <span>Tiền khách đưa:</span>
              <span>${formatCurrency(orderToPrint.customerPaid)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Tiền thối:</span>
              <span>${formatCurrency(orderToPrint.change)}</span>
            </div>
          `
            : ""
        }
      </div>
      
      <div style="text-align: center; font-size: 12px; border-top: 1px dashed #000; padding-top: 10px;">
        ${
          isCompleted
            ? `
            <p style="margin: 0 0 5px 0;"><strong>CẢM ƠN QUÝ KHÁCH!</strong></p>
            <p style="margin: 0;">Hẹn gặp lại!</p>
          `
            : `
            <p style="margin: 0 0 5px 0; color: #ff6b35;"><strong>HÓA ĐƠN TẠM</strong></p>
            <p style="margin: 0; color: #666;">CHƯA THANH TOÁN</p>
            <p style="margin: 5px 0 0 0; font-size: 10px; color: #666;">
              Vui lòng thanh toán để hoàn tất đơn hàng
            </p>
          `
        }
      </div>
    </div>
  `;

  // Open invoice in new window for printing
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Hóa đơn ${orderToPrint.id}${isCompleted ? "" : " (Tạm)"}</title>
      <style>
        @page { 
          size: A5; 
          margin: 10mm; 
        }
        body { 
          margin: 0; 
          padding: 0; 
          font-family: Arial, sans-serif; 
          font-weight: bold;
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

// Function to print invoices for pending orders
async function printPendingInvoice(orderId) {
  const order = pendingPaymentOrders.find((o) => o.id === orderId);
  if (!order) {
    console.error("Order not found:", orderId);
    return;
  }

  printInvoice(false);
}

// Firebase authentication and data loading functions
async function loadUserProfile(uid) {
  try {
    console.log("Loading user profile for UID:", uid);

    // Try to get user profile from Firestore
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();

      // Save to localStorage for offline access
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          uid: userData.uid || uid,
          name: userData.displayName || "Thu ngân",
          email: userData.email,
          role: userData.role,
          phoneNumber: userData.phoneNumber,
          avatar: userData.profileImage,
          status: userData.status,
        })
      );

      // Update UI with Firebase data
      updateUserUI(userData);

      console.log("User info loaded from Firebase:", userData);
    } else {
      // Fallback to auth user info
      const user = auth.currentUser;
      if (user) {
        const userName =
          user.displayName || user.email?.split("@")[0] || "Thu ngân";
        document.getElementById("userName").textContent = userName;

        if (user.photoURL) {
          const profileImageElement =
            document.getElementById("userProfileImage");
          if (profileImageElement) {
            profileImageElement.innerHTML = `<img src="${user.photoURL}" alt="Profile" class="w-100 h-100 rounded-circle object-fit-cover">`;
          }
        }
      } else {
        document.getElementById("userName").textContent = "Thu ngân";
      }
    }
  } catch (error) {
    console.error("Error loading user profile:", error);
    document.getElementById("userName").textContent = "Thu ngân";
  }
}

/**
 * Update user interface with user data
 */
function updateUserUI(userData) {
  // Update user name
  const displayName = userData.displayName || userData.name || "Thu ngân";
  document.getElementById("userName").textContent = displayName;

  // Set profile image if available
  const profileImage = document.getElementById("userProfileImage");
  const avatarUrl =
    userData.profileImage || userData.avatar || userData.photoURL;

  if (avatarUrl) {
    profileImage.style.backgroundImage = `url(${avatarUrl})`;
    profileImage.style.backgroundSize = "cover";
    profileImage.style.backgroundPosition = "center";
    profileImage.innerHTML = ""; // Clear any existing content
  } else {
    // Default profile icon
    profileImage.style.backgroundImage = "none";
    profileImage.innerHTML =
      '<i data-lucide="user" style="width: 20px; height: 20px; color: white; margin: 10px;"></i>';
  }

  // Re-initialize Lucide icons
  lucide.createIcons();
}

function loadOrdersFromFirestore() {
  try {
    console.log("Loading orders from Firestore..."); // Load all orders and filter in JavaScript for payment-ready orders
    const pendingQuery = query(
      collection(db, "orders"),
      orderBy("updatedAt", "desc")
    );

    onSnapshot(
      pendingQuery,
      (snapshot) => {
        console.log("Pending payment orders snapshot received:", snapshot.size);
        console.log(
          "All documents:",
          snapshot.docs.map((doc) => ({
            id: doc.id,
            status: doc.data().status,
            paymentStatus: doc.data().paymentStatus,
          }))
        );

        // Filter orders that are ready for payment (completed, merged, or split but not yet paid)
        pendingPaymentOrders = snapshot.docs
          .filter((doc) => {
            const data = doc.data();
            // Show orders that are:
            // 1. Completed by chef but not yet paid by cashier
            // 2. Merged orders that are ready for payment
            // 3. Split orders that are ready for payment
            // EXCLUDE any orders that are already paid
            const isEligible =
              (data.status === "completed" || data.status === "ready") &&
              (!data.paymentStatus || data.paymentStatus !== "paid");
            console.log(
              `Order ${doc.id}: status=${data.status}, paymentStatus=${data.paymentStatus}, eligible=${isEligible}, isMerged=${data.isMerged}`
            );
            return isEligible;
          })
          .map((doc) => {
            const data = doc.data();
            return {
              id: data.id || doc.id, // Use custom ID if available, fallback to Firestore document ID
              firestoreId: doc.id, // Keep original document ID for Firestore operations
              table: data.tableName || data.table || `Bàn ${data.tableId}`,
              tableId: data.tableId,
              items: data.items || [],
              subtotal: data.subtotal || 0,
              vat: data.vat || 0,
              total: data.total || 0,
              notes: data.notes || "",
              status: data.status,
              paymentStatus: data.paymentStatus || null,
              // Merge information
              isMerged: data.isMerged || false,
              mergedFrom: data.mergedFrom || null,
              mergeNotes: data.mergeNotes || null,
              // Split information
              isSplit: data.isSplit || false,
              splitFrom: data.splitFrom || null,
              orderTime:
                data.cookingCompletedTime?.toDate() ||
                data.updatedAt?.toDate() ||
                data.createdAt?.toDate() ||
                new Date(),
              createdAt: data.createdAt?.toDate() || new Date(),
              cookingCompletedTime:
                data.cookingCompletedTime?.toDate() ||
                data.updatedAt?.toDate() ||
                new Date(),
              waiterId: data.waiterId || "",
              waiterName: data.waiterName || "N/A",
            };
          });
        console.log("Pending orders loaded:", pendingPaymentOrders.length);
        console.log(
          "Pending orders details:",
          pendingPaymentOrders.map((o) => ({
            id: o.id,
            status: o.status,
            paymentStatus: o.paymentStatus,
          }))
        );
        updateStats();
        renderPendingOrders();
      },
      (error) => {
        console.error("Error loading pending orders:", error);
        handleFirestoreError(error, "tải đơn hàng chờ thanh toán");
      }
    ); // Load paid orders from today (for payment history)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const paidQuery = query(
      collection(db, "orders"),
      where("paymentStatus", "==", "paid"),
      where("paymentTime", ">=", Timestamp.fromDate(today)),
      orderBy("paymentTime", "desc"),
      limit(50) // Limit to last 50 transactions
    );

    onSnapshot(
      paidQuery,
      (snapshot) => {
        console.log("Paid orders snapshot received:", snapshot.size);
        completedOrders = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: data.id || doc.id, // Use custom ID if available, fallback to Firestore document ID
            firestoreId: doc.id, // Keep original document ID for Firestore operations
            table: data.tableName || data.table || `Bàn ${data.tableId}`,
            tableId: data.tableId,
            items: data.items || [],
            subtotal: data.subtotal || 0,
            vat: data.vat || 0,
            total: data.total || 0,
            finalTotal: data.finalTotal || data.total || 0,
            discount: data.discount || 0,
            discountCode: data.discountCode || "",
            paymentMethod: data.paymentMethod || "cash",
            customerPaid: data.customerPaid || 0,
            changeAmount: data.changeAmount || 0,
            notes: data.notes || "",
            status: data.status,
            paymentTime: data.paymentTime?.toDate() || new Date(),
            cashierId: data.cashierId || "",
            cashierName: data.cashierName || "N/A",
            // Merge information
            isMerged: data.isMerged || false,
            mergedFrom: data.mergedFrom || null,
            mergeNotes: data.mergeNotes || null,
            // Split information
            isSplit: data.isSplit || false,
            splitFrom: data.splitFrom || null,
          };
        });
        console.log("Completed orders loaded:", completedOrders.length);
        updateStats();
        renderRecentPayments();
      },
      (error) => {
        handleFirestoreError(error, "tải lịch sử thanh toán");
      }
    );
  } catch (error) {
    handleFirestoreError(error, "thiết lập kết nối cơ sở dữ liệu");
  }
}

// Connection status management
let isConnected = true;

function showConnectionStatus(connected) {
  isConnected = connected;
  const statusElement = document.getElementById("connectionStatus");

  if (!statusElement) {
    // Create connection status element if it doesn't exist
    const statusDiv = document.createElement("div");
    statusDiv.id = "connectionStatus";
    statusDiv.className =
      "alert alert-warning alert-dismissible fade show position-fixed";
    statusDiv.style.cssText =
      "top: 70px; right: 20px; z-index: 1060; display: none;";
    statusDiv.innerHTML = `
      <i data-lucide="wifi-off" style="width: 16px; height: 16px;"></i>
      <span class="ms-2">Mất kết nối với cơ sở dữ liệu. Đang thử kết nối lại...</span>
    `;
    document.body.appendChild(statusDiv);
  }

  const statusDiv = document.getElementById("connectionStatus");
  if (!connected) {
    statusDiv.style.display = "block";
    statusDiv.classList.add("show");
  } else {
    statusDiv.style.display = "none";
    statusDiv.classList.remove("show");
  }

  // Re-initialize icons
  lucide.createIcons();
}

// Add error handling for Firestore connection issues
function handleFirestoreError(error, operation) {
  console.error(`Firestore error during ${operation}:`, error);

  if (error.code === "unavailable" || error.code === "deadline-exceeded") {
    showConnectionStatus(false);

    // Try to reconnect after a delay
    setTimeout(() => {
      if (!isConnected) {
        console.log("Attempting to reconnect to Firestore...");
        loadOrdersFromFirestore();
      }
    }, 5000);
  } else {
    showErrorMessage(`Lỗi ${operation}: ${error.message}`);
  }
}

// Process payment and update order status in Firestore
async function processPaymentInFirestore(orderId, paymentData) {
  try {
    console.log("Processing payment for order:", orderId, paymentData);

    const orderRef = doc(db, "orders", orderId); // Prepare payment update data    // Ensure all numeric values are properly rounded before storing
    const updateData = {
      paymentStatus: "paid",
      paymentTime: Timestamp.now(),
      paymentMethod: paymentData.paymentMethod || "cash",
      finalTotal: parseFloat(paymentData.finalTotal.toFixed(0)) || 0,
      subtotal: parseFloat(paymentData.subtotal.toFixed(0)) || 0,
      vat: parseFloat(paymentData.vat.toFixed(0)) || 0,
      discount: paymentData.discount || 0,
      discountCode: paymentData.discountCode || "",
      customerPaid: parseFloat(paymentData.customerPaid.toFixed(0)) || 0,
      changeAmount: parseFloat(paymentData.changeAmount.toFixed(0)) || 0,
      cashierId: auth.currentUser?.uid || "",
      cashierName: auth.currentUser?.displayName || "Thu ngân",
      updatedAt: Timestamp.now(),
      // For analytics purposes, store all calculated values to ensure accuracy
      totalAmount: parseFloat(paymentData.finalTotal.toFixed(0)) || 0,
    };

    // Update the order document first
    await updateDoc(orderRef, updateData);
    console.log("Payment processed successfully for order:", orderId);

    // Create a corresponding finance transaction
    await createFinanceTransaction(orderId, paymentData);
    console.log("Finance transaction created for order:", orderId);

    return true;
  } catch (error) {
    console.error("Error processing payment in Firestore:", error);
    throw new Error(`Không thể cập nhật thanh toán: ${error.message}`);
  }
}

function showErrorMessage(message) {
  // Create a toast notification instead of alert
  const toastContainer =
    document.getElementById("toastContainer") || createToastContainer();

  const toastId = "toast-" + Date.now();
  const toastHtml = `
    <div id="${toastId}" class="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          <i data-lucide="alert-circle" style="width: 16px; height: 16px;"></i>
          <span class="ms-2">${message}</span>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;

  toastContainer.insertAdjacentHTML("beforeend", toastHtml);

  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, {
    autohide: true,
    delay: 5000,
  });

  toast.show();

  // Remove toast element after it's hidden
  toastElement.addEventListener("hidden.bs.toast", () => {
    toastElement.remove();
  });

  // Re-initialize Lucide icons
  lucide.createIcons();
}

function showSuccessMessage(message) {
  const toastContainer =
    document.getElementById("toastContainer") || createToastContainer();

  const toastId = "toast-" + Date.now();
  const toastHtml = `
    <div id="${toastId}" class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          <i data-lucide="check-circle" style="width: 16px; height: 16px;"></i>
          <span class="ms-2">${message}</span>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;

  toastContainer.insertAdjacentHTML("beforeend", toastHtml);

  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, {
    autohide: true,
    delay: 3000,
  });

  toast.show();

  toastElement.addEventListener("hidden.bs.toast", () => {
    toastElement.remove();
  });

  lucide.createIcons();
}

function createToastContainer() {
  const container = document.createElement("div");
  container.id = "toastContainer";
  container.className = "toast-container position-fixed top-0 end-0 p-3";
  container.style.zIndex = "1070";
  document.body.appendChild(container);
  return container;
}

// Function to print pending invoice from modal
async function printPendingInvoiceFromModal() {
  if (currentOrder) {
    printInvoice(false);
  }
}

// Function to print completed order
function printCompletedOrder(orderId) {
  const order = completedOrders.find((o) => o.id === orderId);
  if (order) {
    window.lastCompletedOrder = order;
    printInvoice(true);
  }
}

// Function to show QR code preview
function showQRCodePreview(orderId) {
  console.log("QR code preview for order:", orderId);
  // This function can be implemented if QR code functionality is needed
}

// Utility Functions
function calculateDiscountAmount(subtotal) {
  if (!selectedDiscountCode) return 0;
  const taxAmount = subtotal * VAT_RATE;
  const afterTax = subtotal + taxAmount;
  return Math.round(afterTax * (selectedDiscountCode.discount / 100));
}

function calculateFinalTotal(subtotal) {
  const taxAmount = Math.round(subtotal * VAT_RATE);
  const afterTax = subtotal + taxAmount;
  const discountAmount = selectedDiscountCode
    ? Math.round(afterTax * (selectedDiscountCode.discount / 100))
    : 0;
  return Math.round(afterTax - discountAmount);
}

/**
 * Get user information from storage
 */
function getUserInfo() {
  try {
    // Try to get from localStorage first
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      return JSON.parse(userInfo);
    }

    // Try to get from sessionStorage
    const sessionUserInfo = sessionStorage.getItem("userInfo");
    if (sessionUserInfo) {
      return JSON.parse(sessionUserInfo);
    }

    // Default fallback
    return {
      id: "cashier_001",
      name: "Thu ngân",
      role: "cashier",
      department: "Thanh toán",
    };
  } catch (error) {
    console.error("Error getting user info:", error);
    return {
      id: "cashier_001",
      name: "Thu ngân",
      role: "cashier",
      department: "Thanh toán",
    };
  }
}

/**
 * Set user information
 */
function setUserInfo(userInfo) {
  try {
    // Save to localStorage for persistence
    localStorage.setItem("userInfo", JSON.stringify(userInfo));

    // Update UI immediately
    updateUserUI(userInfo);

    console.log("User info updated:", userInfo);
  } catch (error) {
    console.error("Error setting user info:", error);
  }
}

/**
 * Show notification message
 */
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `alert alert-${
    type === "success" ? "success" : type === "error" ? "danger" : "info"
  } alert-dismissible fade show position-fixed`;
  notification.style.cssText =
    "top: 20px; right: 20px; z-index: 9999; min-width: 300px;";
  notification.innerHTML = `
    <i data-lucide="${
      type === "success"
        ? "check-circle"
        : type === "error"
        ? "alert-circle"
        : "info"
    }" style="width: 16px; height: 16px; margin-right: 8px;"></i>
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  // Add to page
  document.body.appendChild(notification);

  // Re-initialize Lucide icons
  lucide.createIcons();

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
}

// ========================================
// MERGE AND SPLIT INVOICE FUNCTIONALITY
// ========================================

// Global variables for merge/split functionality
let selectedInvoicesForMerge = [];
let invoiceToSplit = null;
let newInvoicesForSplit = [];
let nextNewInvoiceId = 1;

// ========================================
// MERGE INVOICES FUNCTIONALITY
// ========================================

/**
 * Show merge invoices modal
 */
function showMergeInvoicesModal() {
  const modal = new bootstrap.Modal(
    document.getElementById("mergeInvoicesModal")
  );
  modal.show();

  // Reset state
  selectedInvoicesForMerge = [];
  document.getElementById("mergeNotes").value = "";

  // Populate invoices for merge
  populateInvoicesForMerge();
  updateMergePreview();

  // Setup search functionality
  setupMergeInvoiceSearch();
}

/**
 * Populate invoices that can be merged
 */
function populateInvoicesForMerge() {
  const container = document.getElementById("mergeInvoicesList");

  // Filter orders that can be merged (already filtered by pendingPaymentOrders, just exclude merged ones)
  const mergeableOrders = pendingPaymentOrders.filter(
    (order) => !order.isMerged
  );

  if (mergeableOrders.length < 2) {
    container.innerHTML = `
      <div class="text-center py-4">
        <i data-lucide="info" style="width: 48px; height: 48px; margin-bottom: 1rem; color: #ffc107;"></i>
        <p class="text-muted">Cần ít nhất 2 hóa đơn chờ thanh toán để thực hiện ghép đơn</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = mergeableOrders
    .map((order) => {
      const isSelected = selectedInvoicesForMerge.includes(order.id);
      return `
      <div class="invoice-checkbox-item ${
        isSelected ? "selected" : ""
      }" onclick="toggleInvoiceSelection('${order.id}')">
        <input type="checkbox" class="form-check-input" ${
          isSelected ? "checked" : ""
        } onclick="event.stopPropagation()">
        <div class="invoice-item-header">
          <h6 class="mb-1 fw-bold">${order.id}</h6>
          <span class="badge bg-primary">${order.table}</span>
        </div>
        <div class="invoice-item-details">
          <div class="d-flex justify-content-between mb-1">
            <span>${order.items?.length || 0} món</span>
            <span class="fw-medium text-success">${formatCurrency(
              order.total
            )}</span>
          </div>
          <div class="text-muted small">
            ${getTimeAgo(order.orderTime || new Date())}
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  lucide.createIcons();
}

/**
 * Toggle invoice selection for merge
 */
function toggleInvoiceSelection(orderId) {
  const index = selectedInvoicesForMerge.indexOf(orderId);

  if (index > -1) {
    selectedInvoicesForMerge.splice(index, 1);
  } else {
    selectedInvoicesForMerge.push(orderId);
  }

  // Re-render the list to update UI
  populateInvoicesForMerge();
  updateMergePreview();
}

/**
 * Update merge preview
 */
function updateMergePreview() {
  const container = document.getElementById("mergePreview");
  const confirmBtn = document.getElementById("confirmMergeBtn");

  if (selectedInvoicesForMerge.length < 2) {
    container.innerHTML = `
      <div class="text-muted text-center py-4">
        <i data-lucide="file-plus" style="width: 48px; height: 48px; margin-bottom: 1rem;"></i>
        <p>Chọn ít nhất 2 hóa đơn để xem trước</p>
      </div>
    `;
    confirmBtn.disabled = true;
    lucide.createIcons();
    return;
  }

  // Get selected orders
  const selectedOrders = pendingPaymentOrders.filter((order) =>
    selectedInvoicesForMerge.includes(order.id)
  );

  // Calculate totals
  const totalAmount = selectedOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );
  const totalItems = selectedOrders.reduce(
    (sum, order) => sum + (order.items?.length || 0),
    0
  );
  const tables = selectedOrders.map((order) => order.table).join(", ");

  // Combine all items
  const allItems = [];
  selectedOrders.forEach((order) => {
    if (order.items) {
      order.items.forEach((item) => {
        const existingItem = allItems.find(
          (existing) => existing.name === item.name
        );
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          allItems.push({ ...item });
        }
      });
    }
  });

  container.className = "merge-preview has-content";
  container.innerHTML = `
    <div class="merged-invoice-info">
      <h6 class="fw-bold mb-3">
        <span class="merge-badge me-2">GHÉP ĐƠN</span>
        Hóa đơn mới
      </h6>
      
      <div class="row mb-3">
        <div class="col-6">
          <div class="text-muted small">Số hóa đơn ghép</div>
          <div class="fw-medium">${selectedInvoicesForMerge.length} đơn</div>
        </div>
        <div class="col-6">
          <div class="text-muted small">Bàn</div>
          <div class="fw-medium">${tables}</div>
        </div>
      </div>
      
      <div class="row mb-3">
        <div class="col-6">
          <div class="text-muted small">Tổng món</div>
          <div class="fw-medium">${totalItems} món</div>
        </div>
        <div class="col-6">
          <div class="text-muted small">Tổng tiền</div>
          <div class="fw-bold text-success">${formatCurrency(totalAmount)}</div>
        </div>
      </div>
      
      <h6 class="fw-bold mb-2">Danh sách món ăn</h6>
      <div class="merged-items-list">
        ${allItems
          .map(
            (item) => `
          <div class="merged-item">
            <span>${item.quantity}x ${item.name}</span>
            <span class="fw-medium">${formatCurrency(
              item.quantity * item.price
            )}</span>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;

  confirmBtn.disabled = false;
  lucide.createIcons();
}

/**
 * Setup search functionality for merge invoices
 */
function setupMergeInvoiceSearch() {
  const searchInput = document.getElementById("mergeInvoiceSearch");

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const items = document.querySelectorAll(
      "#mergeInvoicesList .invoice-checkbox-item"
    );

    items.forEach((item) => {
      const text = item.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
}

/**
 * Merge selected invoices
 */
async function mergeInvoices() {
  if (selectedInvoicesForMerge.length < 2) {
    showToast("Cần chọn ít nhất 2 hóa đơn để ghép", "error");
    return;
  }

  try {
    // Show loading
    const confirmBtn = document.getElementById("confirmMergeBtn");
    const originalText = confirmBtn.innerHTML;
    confirmBtn.disabled = true;
    confirmBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2"></span>Đang xử lý...';

    // Get selected orders
    const selectedOrders = pendingPaymentOrders.filter((order) =>
      selectedInvoicesForMerge.includes(order.id)
    );

    // Generate new merged order ID
    const timestamp = Date.now();
    const newOrderId = `DS-GHEP-${timestamp}`;

    // Combine all items
    const allItems = [];
    selectedOrders.forEach((order) => {
      if (order.items) {
        order.items.forEach((item) => {
          const existingItem = allItems.find(
            (existing) => existing.name === item.name
          );
          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            allItems.push({ ...item });
          }
        });
      }
    });

    // Calculate totals
    const totalAmount = selectedOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );
    const tables = selectedOrders.map((order) => order.table).join(", ");
    const mergeNotes = document.getElementById("mergeNotes").value;

    // Create new merged order
    const mergedOrder = {
      id: newOrderId,
      table: tables,
      items: allItems,
      total: totalAmount,
      status: "ready",
      isMerged: true,
      mergedFrom: selectedInvoicesForMerge,
      mergeNotes: mergeNotes || null,
      orderTime: Timestamp.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Add to Firestore with custom document ID
    const ordersRef = collection(db, "orders");
    const mergedDocRef = doc(ordersRef, newOrderId); // Use DS-GHEP-xxx as document ID
    await setDoc(mergedDocRef, mergedOrder);

    // Update original orders to mark as merged
    for (const orderId of selectedInvoicesForMerge) {
      // Find the order to get its firestoreId
      const orderData = selectedOrders.find((o) => o.id === orderId);
      const actualOrderId = orderData?.firestoreId || orderId;

      const orderRef = doc(db, "orders", actualOrderId);
      await updateDoc(orderRef, {
        status: "merged",
        mergedInto: newOrderId,
        mergedAt: Timestamp.now(),
      });
    }

    // Close modal
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("mergeInvoicesModal")
    );
    modal.hide();

    // Show success message
    showToast(
      `Đã ghép thành công ${selectedInvoicesForMerge.length} hóa đơn thành đơn ${newOrderId}`,
      "success"
    );

    // Reset state
    selectedInvoicesForMerge = [];
  } catch (error) {
    console.error("Error merging invoices:", error);
    showToast("Lỗi khi ghép hóa đơn: " + error.message, "error");

    // Restore button
    const confirmBtn = document.getElementById("confirmMergeBtn");
    confirmBtn.disabled = false;
    confirmBtn.innerHTML = originalText;
  }
}

// ========================================
// SPLIT INVOICE FUNCTIONALITY
// ========================================

/**
 * Show split invoice modal
 */
function showSplitInvoiceModal() {
  const modal = new bootstrap.Modal(
    document.getElementById("splitInvoiceModal")
  );
  modal.show();

  // Reset state
  invoiceToSplit = null;
  newInvoicesForSplit = [];
  nextNewInvoiceId = 1;

  // Populate invoice selection
  populateInvoicesForSplit();
  updateSplitUI();
}

/**
 * Populate invoices that can be split
 */
function populateInvoicesForSplit() {
  const select = document.getElementById("splitInvoiceSelect");

  // Filter orders that can be split (already filtered by pendingPaymentOrders, needs multiple items, not split before)
  const splittableOrders = pendingPaymentOrders.filter(
    (order) => !order.isSplit && order.items && order.items.length > 1
  );

  select.innerHTML = '<option value="">-- Chọn hóa đơn --</option>';

  if (splittableOrders.length === 0) {
    select.innerHTML =
      '<option value="">Không có hóa đơn nào có thể tách</option>';
    return;
  }

  select.innerHTML += splittableOrders
    .map(
      (order) => `
    <option value="${order.id}">${order.id} - ${order.table} (${
        order.items.length
      } món - ${formatCurrency(order.total)})</option>
  `
    )
    .join("");

  // Setup change handler
  select.addEventListener("change", (e) => {
    selectInvoiceToSplit(e.target.value);
  });
}

/**
 * Select invoice to split
 */
function selectInvoiceToSplit(orderId) {
  if (!orderId) {
    invoiceToSplit = null;
    updateSplitUI();
    return;
  }

  invoiceToSplit = pendingPaymentOrders.find((order) => order.id === orderId);
  if (!invoiceToSplit) {
    showToast("Không tìm thấy hóa đơn", "error");
    return;
  }

  // Reset new invoices
  newInvoicesForSplit = [];
  nextNewInvoiceId = 1;

  updateSplitUI();
}

/**
 * Update split UI
 */
function updateSplitUI() {
  updateSplitItemsList();
  updateNewInvoicesList();
  updateSplitConfirmButton();
}

/**
 * Update split items list
 */
function updateSplitItemsList() {
  const container = document.getElementById("splitItemsList");

  if (!invoiceToSplit) {
    container.innerHTML = `
      <div class="text-muted text-center py-4">
        <i data-lucide="package" style="width: 48px; height: 48px; margin-bottom: 1rem;"></i>
        <p>Chọn hóa đơn để xem danh sách món ăn</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  // Get items that haven't been moved to new invoices
  const usedItems = newInvoicesForSplit.reduce((acc, invoice) => {
    invoice.items.forEach((item) => {
      const key = `${item.name}-${item.price}`;
      acc[key] = (acc[key] || 0) + item.quantity;
    });
    return acc;
  }, {});

  const availableItems = invoiceToSplit.items
    .filter((item) => {
      const key = `${item.name}-${item.price}`;
      const usedQuantity = usedItems[key] || 0;
      return item.quantity > usedQuantity;
    })
    .map((item) => {
      const key = `${item.name}-${item.price}`;
      const usedQuantity = usedItems[key] || 0;
      return {
        ...item,
        quantity: item.quantity - usedQuantity,
      };
    });

  container.innerHTML = `
    <h6 class="fw-bold mb-3">Món ăn có thể tách (${availableItems.length})</h6>
    ${availableItems
      .map(
        (item) => `
      <div class="draggable-item" draggable="true" data-item='${JSON.stringify(
        item
      )}'>
        <div>
          <div class="fw-medium">${item.name}</div>
          <div class="text-muted small">${formatCurrency(item.price)} x ${
          item.quantity
        }</div>
        </div>
        <div class="fw-bold text-success">${formatCurrency(
          item.price * item.quantity
        )}</div>
      </div>
    `
      )
      .join("")}
  `;

  // Setup drag and drop
  setupDragAndDrop();
  lucide.createIcons();
}

/**
 * Update new invoices list
 */
function updateNewInvoicesList() {
  const container = document.getElementById("newInvoicesList");

  if (newInvoicesForSplit.length === 0) {
    container.innerHTML = `
      <div class="text-muted text-center py-4">
        <i data-lucide="file-plus" style="width: 48px; height: 48px; margin-bottom: 1rem;"></i>
        <p>Bấm "Thêm hóa đơn" để tạo hóa đơn mới</p>
        <button class="btn btn-outline-success" onclick="addNewInvoice()">
          <i data-lucide="plus" style="width: 16px; height: 16px;"></i>
          Thêm hóa đơn đầu tiên
        </button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = newInvoicesForSplit
    .map((invoice) => {
      const total = invoice.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return `
      <div class="new-invoice-card" data-invoice-id="${invoice.id}">
        <button class="remove-invoice-btn" onclick="removeNewInvoice('${
          invoice.id
        }')" title="Xóa hóa đơn">×</button>
        
        <div class="new-invoice-header">
          <h6 class="fw-bold mb-0">
            <span class="split-badge me-2">TÁCH</span>
            ${invoice.name}
          </h6>
          <div class="new-invoice-total">${formatCurrency(total)}</div>
        </div>
        
        <div class="drag-drop-area" data-invoice-id="${invoice.id}">
          ${
            invoice.items.length === 0
              ? `
            <div class="text-muted text-center py-3">
              <i data-lucide="package" style="width: 32px; height: 32px; margin-bottom: 0.5rem;"></i>
              <p class="mb-0">Kéo món ăn vào đây</p>
            </div>
          `
              : ""
          }
          
          <div class="dropped-items-list">
            ${invoice.items
              .map(
                (item) => `
              <div class="dropped-item">
                <div>
                  <div class="fw-medium">${item.name}</div>
                  <div class="text-muted small">${formatCurrency(
                    item.price
                  )} x ${item.quantity}</div>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <span class="fw-bold">${formatCurrency(
                    item.price * item.quantity
                  )}</span>
                  <button class="remove-item-btn" onclick="removeItemFromNewInvoice('${
                    invoice.id
                  }', '${item.name}', ${item.price})" title="Xóa món">×</button>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  // Setup drop zones
  setupDropZones();
  lucide.createIcons();
}

/**
 * Add new invoice for split
 */
function addNewInvoice() {
  if (!invoiceToSplit) {
    showToast("Vui lòng chọn hóa đơn cần tách trước", "error");
    return;
  }

  const newInvoice = {
    id: `new-${nextNewInvoiceId++}`,
    name: `Hóa đơn ${nextNewInvoiceId - 1}`,
    items: [],
  };

  newInvoicesForSplit.push(newInvoice);
  updateNewInvoicesList();
  updateSplitConfirmButton();
}

/**
 * Remove new invoice
 */
function removeNewInvoice(invoiceId) {
  const index = newInvoicesForSplit.findIndex(
    (invoice) => invoice.id === invoiceId
  );
  if (index > -1) {
    newInvoicesForSplit.splice(index, 1);
    updateSplitUI();
  }
}

/**
 * Remove item from new invoice
 */
function removeItemFromNewInvoice(invoiceId, itemName, itemPrice) {
  const invoice = newInvoicesForSplit.find((inv) => inv.id === invoiceId);
  if (!invoice) return;

  const itemIndex = invoice.items.findIndex(
    (item) => item.name === itemName && item.price === itemPrice
  );

  if (itemIndex > -1) {
    invoice.items.splice(itemIndex, 1);
    updateSplitUI();
  }
}

/**
 * Setup drag and drop functionality
 */
function setupDragAndDrop() {
  const draggableItems = document.querySelectorAll(".draggable-item");

  draggableItems.forEach((item) => {
    item.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", e.target.dataset.item);
      e.target.classList.add("dragging");
    });

    item.addEventListener("dragend", (e) => {
      e.target.classList.remove("dragging");
    });
  });
}

/**
 * Setup drop zones
 */
function setupDropZones() {
  const dropZones = document.querySelectorAll(".drag-drop-area");

  dropZones.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("drag-over");
    });

    zone.addEventListener("dragleave", (e) => {
      if (!zone.contains(e.relatedTarget)) {
        zone.classList.remove("drag-over");
      }
    });

    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("drag-over");

      const itemData = JSON.parse(e.dataTransfer.getData("text/plain"));
      const invoiceId = zone.dataset.invoiceId;

      addItemToNewInvoice(invoiceId, itemData);
    });
  });
}

/**
 * Add item to new invoice
 */
function addItemToNewInvoice(invoiceId, itemData) {
  const invoice = newInvoicesForSplit.find((inv) => inv.id === invoiceId);
  if (!invoice) return;

  // Check if item already exists in this invoice
  const existingItem = invoice.items.find(
    (item) => item.name === itemData.name && item.price === itemData.price
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    invoice.items.push({
      ...itemData,
      quantity: 1,
    });
  }

  updateSplitUI();
}

/**
 * Update split confirm button
 */
function updateSplitConfirmButton() {
  const confirmBtn = document.getElementById("confirmSplitBtn");

  // Enable if we have an invoice to split and at least one new invoice with items
  const hasValidSplit =
    invoiceToSplit &&
    newInvoicesForSplit.length > 0 &&
    newInvoicesForSplit.some((invoice) => invoice.items.length > 0);

  confirmBtn.disabled = !hasValidSplit;
}

/**
 * Split invoice
 */
async function splitInvoice() {
  if (!invoiceToSplit || newInvoicesForSplit.length === 0) {
    showToast("Vui lòng thiết lập đầy đủ thông tin tách đơn", "error");
    return;
  }

  // Validate that we have items in new invoices
  const validInvoices = newInvoicesForSplit.filter(
    (invoice) => invoice.items.length > 0
  );
  if (validInvoices.length === 0) {
    showToast("Vui lòng thêm món ăn vào các hóa đơn mới", "error");
    return;
  }

  try {
    // Show loading
    const confirmBtn = document.getElementById("confirmSplitBtn");
    const originalText = confirmBtn.innerHTML;
    confirmBtn.disabled = true;
    confirmBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2"></span>Đang xử lý...';

    const timestamp = Date.now();

    // Create new split orders
    for (let i = 0; i < validInvoices.length; i++) {
      const splitInvoice = validInvoices[i];
      const total = splitInvoice.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const newOrderId = `${invoiceToSplit.id}-SPLIT-${i + 1}`;

      const splitOrder = {
        id: newOrderId,
        table: invoiceToSplit.table,
        items: splitInvoice.items,
        total: total,
        status: "ready",
        isSplit: true,
        splitFrom: invoiceToSplit.id,
        orderTime: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      // Add to Firestore
      const ordersRef = collection(db, "orders");
      await addDoc(ordersRef, splitOrder);
    }

    // Update original order
    const remainingItems = [];
    const usedItems = validInvoices.reduce((acc, invoice) => {
      invoice.items.forEach((item) => {
        const key = `${item.name}-${item.price}`;
        acc[key] = (acc[key] || 0) + item.quantity;
      });
      return acc;
    }, {});

    // Calculate remaining items
    invoiceToSplit.items.forEach((item) => {
      const key = `${item.name}-${item.price}`;
      const usedQuantity = usedItems[key] || 0;
      const remainingQuantity = item.quantity - usedQuantity;

      if (remainingQuantity > 0) {
        remainingItems.push({
          ...item,
          quantity: remainingQuantity,
        });
      }
    });

    const orderRef = doc(db, "orders", invoiceToSplit.id);

    if (remainingItems.length > 0) {
      // Update original order with remaining items
      const remainingTotal = remainingItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      await updateDoc(orderRef, {
        items: remainingItems,
        total: remainingTotal,
        splitInto: validInvoices.map(
          (_, i) => `${invoiceToSplit.id}-SPLIT-${i + 1}`
        ),
        splitAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } else {
      // Mark original order as completely split
      await updateDoc(orderRef, {
        status: "split",
        splitInto: validInvoices.map(
          (_, i) => `${invoiceToSplit.id}-SPLIT-${i + 1}`
        ),
        splitAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }

    // Close modal
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("splitInvoiceModal")
    );
    modal.hide();

    // Show success message
    showToast(
      `Đã tách thành công hóa đơn ${invoiceToSplit.id} thành ${validInvoices.length} hóa đơn mới`,
      "success"
    );

    // Reset state
    invoiceToSplit = null;
    newInvoicesForSplit = [];
    nextNewInvoiceId = 1;
  } catch (error) {
    console.error("Error splitting invoice:", error);
    showToast("Lỗi khi tách hóa đơn: " + error.message, "error");

    // Restore button
    const confirmBtn = document.getElementById("confirmSplitBtn");
    confirmBtn.disabled = false;
    confirmBtn.innerHTML = originalText;
  }
}

// ========================================
// GLOBAL EXPORTS FOR MERGE/SPLIT
// ========================================

// Export merge functions
window.showMergeInvoicesModal = showMergeInvoicesModal;
window.toggleInvoiceSelection = toggleInvoiceSelection;
window.mergeInvoices = mergeInvoices;

// Export split functions
window.showSplitInvoiceModal = showSplitInvoiceModal;
window.addNewInvoice = addNewInvoice;
window.removeNewInvoice = removeNewInvoice;
window.removeItemFromNewInvoice = removeItemFromNewInvoice;
window.splitInvoice = splitInvoice;

// Make functions globally available
window.printPendingInvoiceFromModal = printPendingInvoiceFromModal;
window.printPendingInvoice = printPendingInvoice;
window.openPaymentModal = openPaymentModal;
window.printInvoice = printInvoice;
window.printCompletedOrder = printCompletedOrder;
