// cashier-history.js - Script for handling payment history functionality

// Import Firebase functions
import {
  getPaymentHistory,
  getPaymentStats,
  searchTransactions,
  getTransactionDetail,
  getCurrentUserInfo,
  checkAuthState,
  logout,
} from "../src/firebase.js";

document.addEventListener("DOMContentLoaded", async function () {
  // Initialize Lucide icons
  lucide.createIcons();

  // Check authentication state first
  checkAuthState(async (authResult) => {
    if (!authResult.loggedIn) {
      // Redirect to login if not authenticated
      window.location.href = "../index.html";
      return;
    }

    // Check if user has cashier role
    if (authResult.user && authResult.user.role !== "cashier") {
      alert("Bạn không có quyền truy cập trang này!");
      window.location.href = "../index.html";
      return;
    }

    // Initialize user info with authenticated user data
    if (authResult.user) {
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          uid: authResult.user.uid,
          name: authResult.user.displayName || "Thu ngân",
          email: authResult.user.email,
          role: authResult.user.role,
          phoneNumber: authResult.user.phoneNumber,
          avatar: authResult.user.profileImage,
        })
      );
    }

    await initializeUserInfo();
  });

  // Initialize date range picker
  initDateRangePicker();

  // Initialize page variables
  let currentPage = 1;
  const recordsPerPage = 10;
  let paymentHistoryData = [];
  let filteredData = [];

  // Load initial data from Firebase
  await loadPaymentHistory();

  // Setup event listeners
  setupEventListeners();

  /**
   * Initialize date range picker
   */
  function initDateRangePicker() {
    // Get current date
    const today = moment();
    const startDate = moment().subtract(30, "days");

    // Initialize date range picker
    $("#dateRangePicker").daterangepicker({
      startDate: startDate,
      endDate: today,
      ranges: {
        "Hôm nay": [moment(), moment()],
        "Hôm qua": [moment().subtract(1, "days"), moment().subtract(1, "days")],
        "7 ngày qua": [moment().subtract(6, "days"), moment()],
        "30 ngày qua": [moment().subtract(29, "days"), moment()],
        "Tháng này": [moment().startOf("month"), moment().endOf("month")],
        "Tháng trước": [
          moment().subtract(1, "month").startOf("month"),
          moment().subtract(1, "month").endOf("month"),
        ],
      },
      locale: {
        format: "DD/MM/YYYY",
        applyLabel: "Áp dụng",
        cancelLabel: "Hủy",
        fromLabel: "Từ",
        toLabel: "Đến",
        customRangeLabel: "Tùy chỉnh",
        daysOfWeek: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
        monthNames: [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ],
        firstDay: 1,
      },
    });

    // Display initial date range
    $("#dateRangePicker").val(
      startDate.format("DD/MM/YYYY") + " - " + today.format("DD/MM/YYYY")
    );
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Date range picker change - reload data for new range
    $("#dateRangePicker").on("apply.daterangepicker", function (ev, picker) {
      handleDateRangeChange();
    });

    // Other filters - just apply client-side filtering
    $("#paymentMethodFilter").on("change", function () {
      applyFilters();
    });

    $("#statusFilter").on("change", function () {
      applyFilters();
    });

    // Search input with debounce
    let searchTimeout;
    $("#historySearch").on("input", function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        applyFilters();
      }, 300); // 300ms debounce
    });

    // Clear search button
    $("#clearHistorySearch").on("click", function () {
      $("#historySearch").val("");
      applyFilters();
    }); // Export button
    $("#exportBtn").on("click", function () {
      exportToExcel();
    });

    // Refresh button
    $("#refreshBtn").on("click", function () {
      loadPaymentHistory();
    }); // Print invoice button
    $("#printInvoiceBtn").on("click", function () {
      printInvoice();
    });

    // Logout button
    $("#logoutButton").on("click", function () {
      handleLogout();
    });

    // Delegate for invoice detail view
    $("#paymentHistoryBody").on("click", ".view-invoice-btn", function () {
      const orderId = $(this).data("orderid");
      showInvoiceDetail(orderId);
    });

    // Refresh button (optional - add to UI if needed)
    $(document).on("keydown", function (e) {
      if (e.key === "F5" || (e.ctrlKey && e.key === "r")) {
        e.preventDefault();
        loadPaymentHistory();
      }
    });
  }

  /**
   * Load payment history from Firebase Firestore
   */
  async function loadPaymentHistory() {
    try {
      console.log("Starting to load payment history from Firebase...");

      // Show loading state
      showLoadingState();

      // Get date range from picker
      const dateRange = $("#dateRangePicker").data("daterangepicker");
      const startDate = dateRange
        ? dateRange.startDate.toDate()
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = dateRange ? dateRange.endDate.toDate() : new Date();

      console.log("Date range:", { startDate, endDate });

      // Load payment history from Firebase
      const result = await getPaymentHistory({
        startDate,
        endDate,
        limit: 200,
      });

      console.log("Firebase result:", result);
      if (result.success) {
        paymentHistoryData = result.data;
        filteredData = [...paymentHistoryData];

        console.log(
          "Loaded payment history from Firebase:",
          paymentHistoryData.length,
          "orders"
        );
        console.log("Sample data:", paymentHistoryData.slice(0, 2));

        // Apply initial rendering
        renderSummaryStats(filteredData);
        renderPaymentHistoryTable(filteredData, currentPage, recordsPerPage);
        renderPagination(filteredData.length, currentPage, recordsPerPage);
      } else {
        console.error("Error loading payment history:", result.error);
        showErrorState("Không thể tải dữ liệu lịch sử thanh toán");
        // Fallback to mock data for development
        paymentHistoryData = generateMockPaymentHistory();
        filteredData = [...paymentHistoryData];
        renderSummaryStats(filteredData);
        renderPaymentHistoryTable(filteredData, currentPage, recordsPerPage);
        renderPagination(filteredData.length, currentPage, recordsPerPage);
      }
    } catch (error) {
      console.error("Error in loadPaymentHistory:", error);
      showErrorState("Có lỗi xảy ra khi tải dữ liệu");
      // Fallback to mock data
      paymentHistoryData = generateMockPaymentHistory();
      filteredData = [...paymentHistoryData];
      renderSummaryStats(filteredData);
      renderPaymentHistoryTable(filteredData, currentPage, recordsPerPage);
      renderPagination(filteredData.length, currentPage, recordsPerPage);
    }
  }

  /**
   * Show loading state
   */
  function showLoadingState() {
    const tableBody = $("#paymentHistoryBody");
    tableBody.html(`
      <tr>
        <td colspan="8" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
        </td>
      </tr>
    `);
  }

  /**
   * Show error state
   */
  function showErrorState(message) {
    const tableBody = $("#paymentHistoryBody");
    tableBody.html(`
      <tr>
        <td colspan="8" class="text-center py-5">
          <div class="text-danger">
            <i data-lucide="alert-circle" style="width: 48px; height: 48px; margin-bottom: 1rem;"></i>
            <p>${message}</p>
            <button class="btn btn-outline-primary btn-sm" onclick="location.reload()">
              Thử lại
            </button>
          </div>
        </td>
      </tr>
    `);
    lucide.createIcons();
  }
  /**
   * Apply all filters and search
   */
  async function applyFilters() {
    try {
      // Show loading state
      showLoadingState();

      // Get filter values
      const dateRange = $("#dateRangePicker").data("daterangepicker");
      const startDate = dateRange.startDate.toDate();
      const endDate = dateRange.endDate.toDate();
      const paymentMethod = $("#paymentMethodFilter").val();
      const status = $("#statusFilter").val();
      const searchTerm = $("#historySearch").val().toLowerCase().trim();

      // Prepare filters for Firebase
      const filters = {
        startDate,
        endDate,
        limit: 200,
      };

      // Add payment method filter
      if (paymentMethod !== "all") {
        const methodMapping = {
          cash: "Tiền mặt",
          card: "Thẻ",
          transfer: "Chuyển khoản",
        };
        filters.paymentMethod = methodMapping[paymentMethod];
      }

      let result;

      // Use search function if there's a search term
      if (searchTerm) {
        result = await searchTransactions(searchTerm, filters);
      } else {
        result = await getPaymentHistory(filters);
      }

      if (result.success) {
        filteredData = result.data;

        // Apply status filter (client-side since Firebase doesn't have status field)
        if (status !== "all") {
          filteredData = filteredData.filter((payment) => {
            if (status === "success") return payment.status === "Thành công";
            if (status === "refunded") return payment.status === "Hoàn tiền";
            return true;
          });
        }

        // Reset to first page
        currentPage = 1;

        // Update UI
        renderSummaryStats(filteredData);
        renderPaymentHistoryTable(filteredData, currentPage, recordsPerPage);
        renderPagination(filteredData.length, currentPage, recordsPerPage);
      } else {
        console.error("Error filtering data:", result.error);
        showErrorState("Không thể lọc dữ liệu");
      }
    } catch (error) {
      console.error("Error in applyFilters:", error);
      showErrorState("Có lỗi xảy ra khi lọc dữ liệu");
    }
  }

  /**
   * Render summary statistics
   */
  function renderSummaryStats(data) {
    // Count total orders
    const totalOrders = data.length;

    // Calculate total revenue
    const totalRevenue = data.reduce((sum, payment) => sum + payment.amount, 0); // Calculate revenue by payment method
    const cashPayments = data.filter(
      (payment) => payment.paymentMethod === "Tiền mặt"
    );
    const cardPayments = data.filter(
      (payment) => payment.paymentMethod === "Thẻ"
    );
    const transferPayments = data.filter(
      (payment) => payment.paymentMethod === "Chuyển khoản"
    );

    const cashRevenue = cashPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    const cardRevenue = cardPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    const transferRevenue = transferPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    // Update UI
    $("#totalOrdersCount").text(totalOrders);
    $("#totalRevenue").text(formatCurrency(totalRevenue));
    $("#cashRevenue").text(formatCurrency(cashRevenue));
    $("#cardRevenue").text(formatCurrency(cardRevenue));
    $("#transferRevenue").text(formatCurrency(transferRevenue));

    // Update record counts in footer
    $("#displayedRecords").text(Math.min(totalOrders, recordsPerPage));
    $("#totalRecords").text(totalOrders);
  }

  /**
   * Render payment history table
   */
  function renderPaymentHistoryTable(data, page, perPage) {
    const tableBody = $("#paymentHistoryBody");
    tableBody.empty();

    // Calculate start and end indices
    const startIndex = (page - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, data.length);

    // If no data
    if (data.length === 0) {
      tableBody.html(`
                <tr>
                    <td colspan="8" class="text-center py-5">
                        <div class="text-muted">
                            <i data-lucide="file-question" style="width: 48px; height: 48px; margin-bottom: 1rem;"></i>
                            <p>Không tìm thấy giao dịch nào</p>
                        </div>
                    </td>
                </tr>
            `);
      lucide.createIcons();
      return;
    }

    // Create table rows
    for (let i = startIndex; i < endIndex; i++) {
      const payment = data[i];

      // Status badge class
      let statusBadgeClass = "bg-success";
      if (payment.status === "Hoàn tiền") {
        statusBadgeClass = "bg-danger";
      } else if (payment.status === "Đang xử lý") {
        statusBadgeClass = "bg-warning text-dark";
      } // Payment method icon
      let methodIcon = "cash";
      if (payment.paymentMethod === "Thẻ") {
        methodIcon = "credit-card";
      } else if (payment.paymentMethod === "Chuyển khoản") {
        methodIcon = "smartphone";
      }

      // Create table row
      const row = `
                <tr>
                    <td class="ps-4 fw-medium">${payment.orderId}</td>
                    <td>${payment.table}</td>
                    <td class="fw-medium">${formatCurrency(payment.amount)}</td>
                    <td>
                        <div class="d-flex align-items-center">
                            <i data-lucide="${methodIcon}" class="me-2" style="width: 16px; height: 16px;"></i>
                            ${payment.paymentMethod}
                        </div>
                    </td>
                    <td>${formatDateTime(payment.timestamp)}</td>
                    <td>${payment.cashier}</td>
                    <td><span class="badge ${statusBadgeClass}">${
        payment.status
      }</span></td>
                    <td class="text-end pe-4">
                        <button class="btn btn-sm btn-outline-primary view-invoice-btn" data-orderid="${
                          payment.orderId
                        }">
                            <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
                            Xem
                        </button>
                    </td>
                </tr>
            `;

      tableBody.append(row);
    }

    // Update displayed records count
    $("#displayedRecords").text(Math.min(endIndex - startIndex, data.length));

    // Re-initialize Lucide icons in the table
    lucide.createIcons();
  }

  /**
   * Render pagination controls
   */
  function renderPagination(totalRecords, currentPage, perPage) {
    const pagination = $("#pagination");
    pagination.empty();

    // Calculate total pages
    const totalPages = Math.ceil(totalRecords / perPage);

    // If no data or only one page, hide pagination
    if (totalRecords === 0 || totalPages <= 1) {
      return;
    }

    // Previous button
    pagination.append(`
            <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
                <a class="page-link" href="#" data-page="${
                  currentPage - 1
                }" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
        `);

    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      pagination.append(`
                <li class="page-item">
                    <a class="page-link" href="#" data-page="1">1</a>
                </li>
            `);

      if (startPage > 2) {
        pagination.append(`
                    <li class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>
                `);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pagination.append(`
                <li class="page-item ${i === currentPage ? "active" : ""}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `);
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pagination.append(`
                    <li class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>
                `);
      }

      pagination.append(`
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>
                </li>
            `);
    }

    // Next button
    pagination.append(`
            <li class="page-item ${
              currentPage === totalPages ? "disabled" : ""
            }">
                <a class="page-link" href="#" data-page="${
                  currentPage + 1
                }" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        `);

    // Add event listeners to pagination items
    pagination.find(".page-link").on("click", function (e) {
      e.preventDefault();
      const pageNum = parseInt($(this).data("page"));
      if (pageNum && pageNum !== currentPage) {
        currentPage = pageNum;
        renderPaymentHistoryTable(filteredData, currentPage, recordsPerPage);
        renderPagination(filteredData.length, currentPage, recordsPerPage);
      }
    });
  }
  /**
   * Show invoice detail modal
   */
  // Store the currently active order ID for reference
  let activeOrderId = null;

  async function showInvoiceDetail(orderId) {
    try {
      // Store the order ID as the active one
      activeOrderId = orderId;

      // Update the modal title to include the order ID
      $("#invoiceDetailModal .modal-title").text(
        `Chi tiết hóa đơn #${orderId}`
      );

      // Show loading in modal
      const modalBody = $("#invoiceDetailBody");
      modalBody.html(`
        <div class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p class="mt-2 text-muted">Đang tải chi tiết hóa đơn...</p>
        </div>
      `);

      // Show modal first
      const modal = new bootstrap.Modal(
        document.getElementById("invoiceDetailModal")
      );
      modal.show();

      // Find the payment in the filtered data first (faster)
      let payment = filteredData.find((p) => p.orderId === orderId);

      // If not found in filtered data, search in all data
      if (!payment) {
        payment = paymentHistoryData.find((p) => p.orderId === orderId);
      }

      // If still not found, try to get from Firebase
      if (!payment) {
        // Try to find transaction by orderId in Firebase
        const result = await searchTransactions(orderId);
        if (result.success && result.data.length > 0) {
          payment = result.data[0];
        }
      }

      if (!payment) {
        modalBody.html(`
          <div class="text-center py-4">
            <div class="text-danger">
              <i data-lucide="alert-circle" style="width: 48px; height: 48px; margin-bottom: 1rem;"></i>
              <p>Không tìm thấy thông tin hóa đơn</p>
            </div>
          </div>
        `);
        lucide.createIcons();
        return;
      }

      // Generate invoice detail HTML
      generateInvoiceHTML(payment, modalBody);
    } catch (error) {
      console.error("Error showing invoice detail:", error);
      const modalBody = $("#invoiceDetailBody");
      modalBody.html(`
        <div class="text-center py-4">
          <div class="text-danger">
            <i data-lucide="alert-circle" style="width: 48px; height: 48px; margin-bottom: 1rem;"></i>
            <p>Có lỗi xảy ra khi tải chi tiết hóa đơn</p>
          </div>
        </div>
      `);
      lucide.createIcons();
    }
  }

  /**
   * Generate invoice HTML content
   */
  function generateInvoiceHTML(payment, modalBody) {
    // Ensure items array exists
    if (!payment.items || !Array.isArray(payment.items)) {
      payment.items = [
        {
          name: "Sản phẩm",
          quantity: 1,
          price: payment.amount || 0,
        },
      ];
    }

    // Invoice header
    let invoiceHTML = `
            <div class="text-center mb-4">
                <h4 class="mb-1">NHÀ HÀNG ABC</h4>
                <p class="text-muted mb-1">123 Đường XYZ, Quận ABC, TP HCM</p>
                <p class="text-muted mb-1">SĐT: 0123 456 789</p>
            </div>
            <div class="text-center mb-4">
                <h5 class="fw-bold">HÓA ĐƠN THANH TOÁN</h5>
                <p class="text-muted">Mã hóa đơn: ${payment.orderId}</p>
            </div>
            <div class="row mb-3">
                <div class="col-6">
                    <p class="mb-1"><span class="fw-medium">Bàn:</span> ${
                      payment.table || "N/A"
                    }</p>
                    <p class="mb-1"><span class="fw-medium">Thời gian:</span> ${formatDateTime(
                      payment.timestamp
                    )}</p>
                </div>
                <div class="col-6">
                    <p class="mb-1"><span class="fw-medium">Thu ngân:</span> ${
                      payment.cashier || "N/A"
                    }</p>
                    <p class="mb-1"><span class="fw-medium">Trạng thái:</span> 
                        <span class="badge ${
                          payment.status === "Thành công"
                            ? "bg-success"
                            : "bg-danger"
                        }">
                            ${payment.status || "Thành công"}
                        </span>
                    </p>
                </div>
            </div>
            <hr>
            <table class="table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Món</th>
                        <th class="text-end">SL</th>
                        <th class="text-end">Đơn giá</th>
                        <th class="text-end">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
        `;

    // Invoice items
    let subtotal = 0;
    payment.items.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      invoiceHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td class="text-end">${item.quantity}</td>
                    <td class="text-end">${formatCurrency(item.price)}</td>
                    <td class="text-end">${formatCurrency(itemTotal)}</td>
                </tr>
            `;
    });

    // Calculate tax and totals using historical VAT rate
    let taxRate;
    let vatLabel;
    
    if (typeof getOrderVatLabel === 'function') {
        // Use new helper function that handles migration automatically
        vatLabel = getOrderVatLabel(payment, 'vi');
        taxRate = payment.vatRate || (payment.timestamp ? getVatRateForOrder(payment.timestamp) : getCurrentVatRate());
    } else if (typeof getVatRateForOrder === 'function' && payment.timestamp) {
        taxRate = getVatRateForOrder(payment.timestamp);
        vatLabel = typeof getVatLabelForOrder === 'function' 
            ? getVatLabelForOrder(payment.timestamp, 'vi') 
            : `Thuế VAT (${(taxRate * 100).toFixed(1)}%):`;
        console.log(`Using historical VAT rate ${(taxRate * 100).toFixed(1)}% for order from ${new Date(payment.timestamp).toLocaleString()}`);
    } else {
        taxRate = typeof getCurrentVatRate === 'function' ? getCurrentVatRate() : 0.1;
        vatLabel = typeof getCurrentVatLabel === 'function' 
            ? getCurrentVatLabel('vi') 
            : `Thuế VAT (${(taxRate * 100).toFixed(1)}%):`;
        console.log(`Using current VAT rate ${(taxRate * 100).toFixed(1)}% (no timestamp or function available)`);
    }
    
    const taxAmount = subtotal * taxRate;
    const discountPercent = payment.discount ? payment.discount.percent : 0;
    const discountAmount = subtotal * (discountPercent / 100);
    const total = subtotal + taxAmount - discountAmount;

    // Invoice footer with totals
    invoiceHTML += `
                </tbody>
                <tfoot class="table-footer">
                <tfoot>
                    <tr>
                        <td colspan="4" class="text-end fw-medium">Tổng tiền hàng:</td>
                        <td class="text-end">${formatCurrency(subtotal)}</td>
                    </tr>
                    <tr>
                        <td colspan="4" class="text-end fw-medium">${vatLabel}</td>
                        <td class="text-end">${formatCurrency(taxAmount)}</td>
                    </tr>
                `;

    // Add discount if applicable
    if (payment.discount) {
      invoiceHTML += `
                <tr>
                    <td colspan="4" class="text-end fw-medium">Giảm giá (${
                      payment.discount.percent
                    }%):</td>
                    <td class="text-end text-success">-${formatCurrency(
                      discountAmount
                    )}</td>
                </tr>
            `;
    }

    // Final total
    invoiceHTML += `
                    <tr>
                        <td colspan="4" class="text-end fw-bold fs-5">Thành tiền:</td>
                        <td class="text-end fw-bold fs-5">${formatCurrency(
                          total
                        )}</td>
                    </tr>
                </tfoot>
            </table>
            <hr>
            <div class="row">
                <div class="col-6">
                    <p class="fw-medium mb-1">Phương thức thanh toán:</p>
                    <p>${payment.paymentMethod || "Tiền mặt"}</p>
                </div>
            </div>
            <div class="text-center mt-4">
                <p class="mb-1">Cảm ơn quý khách và hẹn gặp lại!</p>
            </div>
        `;

    // Set content
    modalBody.html(invoiceHTML);
  }
  /**
   * Export data to Excel
   */
  function exportToExcel() {
    // Prepare data for Excel export
    const headerRow = [
      "Mã đơn",
      "Bàn",
      "Số tiền",
      "Phương thức",
      "Thời gian",
      "Thu ngân",
      "Trạng thái",
    ];

    // Convert filtered data to array format for Excel
    const excelData = [headerRow];

    filteredData.forEach((payment) => {
      const row = [
        payment.orderId,
        payment.table,
        payment.amount,
        payment.paymentMethod,
        formatDateTime(payment.timestamp),
        payment.cashier,
        payment.status,
      ];
      excelData.push(row);
    });

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelData);

    // Add some styling for header row
    const headerCellStyle = {
      font: { bold: true },
      alignment: { horizontal: "center" },
    };

    // Set column widths
    const colWidths = [
      { wch: 10 }, // Mã đơn
      { wch: 10 }, // Bàn
      { wch: 12 }, // Số tiền
      { wch: 15 }, // Phương thức
      { wch: 20 }, // Thời gian
      { wch: 15 }, // Thu ngân
      { wch: 12 }, // Trạng thái
    ];
    ws["!cols"] = colWidths;

    // Format currency column
    for (let i = 1; i < excelData.length; i++) {
      // Format cell references for the amount column (C2, C3,...)
      const cellRef = XLSX.utils.encode_cell({ r: i, c: 2 });
      if (!ws[cellRef]) continue;
      ws[cellRef].z = "#,##0";
      ws[cellRef].v = Number(excelData[i][2]); // Convert to number for proper formatting
    }

    // Get current date for filename
    const now = new Date();
    const dateStr = `${now.getDate()}-${
      now.getMonth() + 1
    }-${now.getFullYear()}`;
    const timeStr = `${now.getHours()}-${now.getMinutes()}`;

    // Add sheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Lịch sử thanh toán");

    // Export workbook
    XLSX.writeFile(wb, `Lich_su_thanh_toan_${dateStr}_${timeStr}.xlsx`);
  }
  /**
   * Print invoice
   */ function printInvoice() {
    // Get the currently open modal content
    const modalBody = document.getElementById("invoiceDetailBody");
    if (!modalBody) {
      alert("Không tìm thấy chi tiết hóa đơn");
      return;
    }

    // Find the order ID from the modal content
    // It's in the element with text "Mã hóa đơn: XXX"
    const orderIdElements = modalBody.querySelectorAll("p.text-muted");
    let orderId = null;

    for (const element of orderIdElements) {
      if (element.textContent.includes("Mã hóa đơn:")) {
        orderId = element.textContent.replace("Mã hóa đơn:", "").trim();
        break;
      }
    }

    if (!orderId) {
      alert("Không tìm thấy thông tin mã hóa đơn");
      return;
    } // Try to find a payment that matches the order ID
    let payment = paymentHistoryData.find((p) => p.orderId === orderId);

    // If payment not found, try using the activeOrderId
    if (!payment && activeOrderId) {
      payment = paymentHistoryData.find((p) => p.orderId === activeOrderId);
    }

    // If still not found, try to get the active order ID from the modal title
    if (!payment) {
      const activeOrderIdElement = document.querySelector(
        "#invoiceDetailModal .modal-title"
      );
      if (activeOrderIdElement && activeOrderIdElement.textContent) {
        const titleMatch = activeOrderIdElement.textContent.match(
          /Chi tiết hóa đơn #(\S+)/
        );
        if (titleMatch && titleMatch[1]) {
          payment = paymentHistoryData.find((p) => p.orderId === titleMatch[1]);
        }
      }
    }
    if (!payment) {
      const debugInfo = `
        Không tìm thấy dữ liệu thanh toán:
        - Mã đơn từ text: ${orderId}
        - Mã đơn đang hoạt động: ${activeOrderId}
        - Tổng số hóa đơn có sẵn: ${paymentHistoryData.length}
      `;
      console.error(debugInfo);
      alert("Không tìm thấy dữ liệu thanh toán cho mã đơn: " + orderId);
      return;
    }

    // Tính toán các giá trị cho hóa đơn
    let subtotal = 0;
    payment.items.forEach((item) => {
      subtotal += item.price * item.quantity;
    });

    // Use historical VAT rate for old orders
    let taxRate;
    let vatLabel;
    
    if (typeof getOrderVatLabel === 'function') {
        // Use new helper function that handles migration automatically
        vatLabel = getOrderVatLabel(payment, 'vi');
        taxRate = payment.vatRate || (payment.timestamp ? getVatRateForOrder(payment.timestamp) : getCurrentVatRate());
    } else if (typeof getVatRateForOrder === 'function' && payment.timestamp) {
        taxRate = getVatRateForOrder(payment.timestamp);
        vatLabel = typeof getVatLabelForOrder === 'function' 
            ? getVatLabelForOrder(payment.timestamp, 'vi') 
            : `Thuế VAT (${(taxRate * 100).toFixed(1)}%):`;
        console.log(`Receipt: Using historical VAT rate ${(taxRate * 100).toFixed(1)}% for order from ${new Date(payment.timestamp).toLocaleString()}`);
    } else {
        taxRate = typeof getCurrentVatRate === 'function' ? getCurrentVatRate() : 0.1;
        vatLabel = typeof getCurrentVatLabel === 'function' 
            ? getCurrentVatLabel('vi') 
            : `Thuế VAT (${(taxRate * 100).toFixed(1)}%):`;
        console.log(`Receipt: Using current VAT rate ${(taxRate * 100).toFixed(1)}% (no timestamp or function available)`);
    }
    
    const taxAmount = subtotal * taxRate;
    const afterTax = subtotal + taxAmount;

    const discountPercent = payment.discount ? payment.discount.percent : 0;
    const discountCode = payment.discount ? payment.discount.code : "";
    const discountAmount = subtotal * (discountPercent / 100);
    const finalTotal = afterTax - discountAmount;

    // Tạo nội dung HTML cho hóa đơn
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
                    <span>${payment.orderId}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>Bàn:</strong></span>
                    <span>${payment.table}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>Ngày:</strong></span>
                    <span>${moment(payment.timestamp).format(
                      "DD/MM/YYYY"
                    )}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>Giờ:</strong></span>
                    <span>${moment(payment.timestamp).format("HH:mm")}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>Thu ngân:</strong></span>
                    <span>${payment.cashier}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>Phương thức:</strong></span>
                    <span>${payment.paymentMethod}</span>
                </div>
            </div>
            
            <div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 10px 0; margin-bottom: 15px;">
                ${payment.items
                  .map(
                    (item) => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                        <span>${item.quantity}x ${item.name}</span>
                        <span>${formatCurrency(
                          item.quantity * item.price
                        )}</span>
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
                    <span>${vatLabel}</span>
                    <span>${formatCurrency(taxAmount)}</span>
                </div>
                ${
                  discountPercent > 0
                    ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                        <span>Giảm giá (${
                          discountCode || discountPercent + "%"
                        }):</span>
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
            </div>
              <div style="text-align: center; font-size: 12px; border-top: 1px dashed #000; padding-top: 10px;">
                <p style="margin: 0 0 5px 0;"><strong>CẢM ƠN QUÝ KHÁCH!</strong></p>
                <p style="margin: 0;">Hẹn gặp lại!</p>
            </div>
        </div>
    `;

    // Mở hóa đơn trong cửa sổ mới để in
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Hóa đơn ${payment.orderId}</title>
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

    // In sau một khoảng thời gian ngắn để đảm bảo trang đã được tải
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }

  /**
   * Generate mock payment history data
   */
  function generateMockPaymentHistory() {
    // Payment methods
    const paymentMethods = [
      "Tiền mặt",
      "Tiền mặt",
      "Thẻ",
      "Chuyển khoản",
      "Tiền mặt",
      "Thẻ",
      "Chuyển khoản",
    ];

    // Status options
    const statuses = [
      "Thành công",
      "Thành công",
      "Thành công",
      "Thành công",
      "Hoàn tiền",
    ];

    // Menu items
    const menuItems = [
      { name: "Cơm rang dương châu", price: 65000 },
      { name: "Phở bò tái chín", price: 75000 },
      { name: "Gỏi cuốn tôm thịt", price: 55000 },
      { name: "Bún chả", price: 70000 },
      { name: "Chả giò hải sản", price: 60000 },
      { name: "Cá kho tộ", price: 85000 },
      { name: "Canh chua cá lóc", price: 75000 },
      { name: "Rau muống xào tỏi", price: 40000 },
      { name: "Cơm gà Hải Nam", price: 80000 },
      { name: "Lẩu thái", price: 250000 },
    ];

    // Discount options
    const discounts = [
      null,
      null,
      null,
      { code: "WELCOME10", percent: 10 },
      { code: "WEEKEND15", percent: 15 },
      { code: "MEMBER20", percent: 20 },
    ];

    // Generate mock data
    const result = [];

    // Current date and time
    const now = new Date();

    // Generate 50 records over the past 60 days
    for (let i = 1; i <= 50; i++) {
      // Random date within the past 60 days
      const randomDays = Math.floor(Math.random() * 60);
      const randomHours = Math.floor(Math.random() * 12) + 10; // Between 10am and 10pm
      const randomMinutes = Math.floor(Math.random() * 60);

      const paymentDate = new Date(now);
      paymentDate.setDate(now.getDate() - randomDays);
      paymentDate.setHours(randomHours, randomMinutes);

      // Order ID format: HDyyMMdd-XXX (e.g., HD230615-001)
      const orderIdDate = `${paymentDate
        .getFullYear()
        .toString()
        .slice(2)}${String(paymentDate.getMonth() + 1).padStart(
        2,
        "0"
      )}${String(paymentDate.getDate()).padStart(2, "0")}`;
      const orderId = `HD${orderIdDate}-${String(i).padStart(3, "0")}`;

      // Random table number (1-15)
      const tableNumber = Math.floor(Math.random() * 15) + 1;

      // Random items (2-6 items)
      const itemCount = Math.floor(Math.random() * 5) + 2;
      const items = [];
      let totalAmount = 0;

      for (let j = 0; j < itemCount; j++) {
        const randomItemIndex = Math.floor(Math.random() * menuItems.length);
        const item = menuItems[randomItemIndex];
        const quantity = Math.floor(Math.random() * 3) + 1;

        items.push({
          name: item.name,
          price: item.price,
          quantity: quantity,
        });

        totalAmount += item.price * quantity;
      }

      // Apply random discount
      const discountIndex = Math.floor(Math.random() * discounts.length);
      const discount = discounts[discountIndex];

      // Apply discount if present
      if (discount) {
        totalAmount = totalAmount * (1 - discount.percent / 100);
      }

      // Add tax (10%)
      totalAmount = Math.round(totalAmount * 1.1);

      // Select random payment method
      const paymentMethodIndex = Math.floor(
        Math.random() * paymentMethods.length
      );

      // Select random status
      const statusIndex = Math.floor(Math.random() * statuses.length);

      // Create the payment record
      result.push({
        orderId: orderId,
        timestamp: paymentDate.toISOString(),
        table: `Bàn ${tableNumber}`,
        items: items,
        amount: totalAmount,
        paymentMethod: paymentMethods[paymentMethodIndex],
        cashier: "Thu ngân",
        status: statuses[statusIndex],
        discount: discount,
      });
    }

    // Sort by timestamp (newest first)
    result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return result;
  }

  /**
   * Format currency (VND)
   */
  function formatCurrency(amount) {
    if (typeof amount !== "number" || isNaN(amount)) {
      return "0₫";
    }
    return amount.toLocaleString("vi-VN") + "₫";
  }

  /**
   * Format date and time
   */
  function formatDateTime(date) {
    if (!date) return "N/A";

    // Handle different date formats
    if (typeof date === "string") {
      date = new Date(date);
    }

    if (date instanceof Date && !isNaN(date)) {
      return moment(date).format("DD/MM/YYYY HH:mm");
    }

    return "N/A";
  }

  /**
   * Handle date range picker change with reload
   */
  function handleDateRangeChange() {
    // Reload data when date range changes significantly
    loadPaymentHistory();
  }
  /**
   * Initialize user information
   */
  async function initializeUserInfo() {
    try {
      // First try to get user info from Firebase
      const firebaseResult = await getCurrentUserInfo();

      if (firebaseResult.success) {
        const userData = firebaseResult.data;

        // Save to localStorage for offline access
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            uid: userData.uid,
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
        return;
      }
    } catch (error) {
      console.error("Error loading user info from Firebase:", error);
    }

    // Fallback to localStorage
    const userInfo = getUserInfo();
    if (userInfo) {
      updateUserUI(userInfo);
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
    const avatarUrl = userData.profileImage || userData.avatar;

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
      initializeUserInfo();

      console.log("User info updated:", userInfo);
    } catch (error) {
      console.error("Error setting user info:", error);
    }
  }
  /**
   * Update user information from external source
   */
  async function updateUserInfoFromSource() {
    try {
      // Fetch fresh user data from Firebase
      const firebaseResult = await getCurrentUserInfo();

      if (firebaseResult.success) {
        const userData = firebaseResult.data;

        // Update localStorage with fresh data
        setUserInfo({
          uid: userData.uid,
          name: userData.displayName || "Thu ngân",
          email: userData.email,
          role: userData.role,
          phoneNumber: userData.phoneNumber,
          avatar: userData.profileImage,
          status: userData.status,
        });

        return userData;
      } else {
        console.warn(
          "Could not fetch user info from Firebase:",
          firebaseResult.error
        );
        return getUserInfo(); // Return cached data
      }
    } catch (error) {
      console.error("Error updating user info from source:", error);
      return getUserInfo(); // Return fallback
    }
  }

  /**
   * Refresh user information from Firebase
   */
  async function refreshUserInfo() {
    try {
      showNotification("Đang cập nhật thông tin người dùng...", "info");

      const userData = await updateUserInfoFromSource();
      if (userData) {
        updateUserUI(userData);
        showNotification("Cập nhật thông tin thành công!", "success");
      }
    } catch (error) {
      console.error("Error refreshing user info:", error);
      showNotification("Không thể cập nhật thông tin người dùng", "error");
    }
  }

  // Make refresh function available globally for debugging
  window.refreshUserInfo = refreshUserInfo;

  // Make functions available globally for testing/debugging
  window.setUserInfo = setUserInfo;
  window.getUserInfo = getUserInfo;
  window.updateUserInfoFromSource = updateUserInfoFromSource;
  /**
   * Handle logout functionality
   */
  async function handleLogout() {
    // Show confirmation dialog
    if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
      try {
        // Show loading notification
        showNotification("Đang đăng xuất...", "info");

        // Logout from Firebase
        await logout();

        // Clear user session data
        localStorage.removeItem("userInfo");
        sessionStorage.removeItem("userInfo");
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");

        // Clear any cached data
        localStorage.removeItem("paymentHistory");
        localStorage.removeItem("orderCache");

        // Show logout success message
        showNotification("Đăng xuất thành công!", "success");

        // Redirect to login page or main page after a short delay
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 1000);
      } catch (error) {
        console.error("Error during logout:", error);
        showNotification("Có lỗi xảy ra khi đăng xuất", "error");

        // Still redirect even if there's an error
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 1000);
      }
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
});
