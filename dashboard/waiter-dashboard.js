document.addEventListener("DOMContentLoaded", function () {
  // Mock data
  const mockTables = Array.from({ length: 10 }, (_, i) => ({
    number: i + 1,
    status: "empty", // empty, occupied, ordered
    order: null,
  }));

  const mockMenu = [
    { id: 1, name: "Phở bò", price: 60000 },
    { id: 2, name: "Cơm rang", price: 35000 },
    { id: 3, name: "Bún chả", price: 45000 },
    { id: 4, name: "Bánh mì", price: 25000 },
  ];

  const tablesGrid = document.querySelector(".tables-grid");
  const newOrderModal = document.getElementById("newOrderModal");
  const menuItemsContainer = document.getElementById("menuItems");

  function renderTables() {
    tablesGrid.innerHTML = mockTables
      .map(
        (table) => `
            <div class="card">
                <div class="card-header">
                    <h3>Bàn ${table.number}</h3>
                    <span class="text-gray-500">${getStatusText(
                      table.status
                    )}</span>
                </div>
                <div class="card-content">
                    ${
                      table.order
                        ? renderOrderSummary(table.order)
                        : "Chưa có đơn hàng"
                    }
                </div>
                <div class="card-footer">
                    ${
                      table.status === "empty"
                        ? `<button class="button" onclick="showNewOrderForm(${table.number})">Tạo đơn</button>`
                        : `<button class="button" disabled>Đã có khách</button>`
                    }
                </div>
            </div>
        `
      )
      .join("");
  }

  function getStatusText(status) {
    switch (status) {
      case "empty":
        return "Trống";
      case "occupied":
        return "Có khách";
      case "ordered":
        return "Đã đặt món";
      default:
        return status;
    }
  }

  function renderOrderSummary(order) {
    return `
            <ul style="list-style: none;">
                ${order.items
                  .map(
                    (item) => `
                    <li>${item.quantity}x ${item.name}</li>
                `
                  )
                  .join("")}
            </ul>
        `;
  }

  function renderMenuItems() {
    menuItemsContainer.innerHTML = mockMenu
      .map(
        (item) => `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <div>
                    <span>${item.name}</span>
                    <span class="text-gray-500">${formatCurrency(
                      item.price
                    )}</span>
                </div>
                <div>
                    <input type="number" 
                           class="input" 
                           style="width: 60px;" 
                           min="0" 
                           value="0"
                           data-item-id="${item.id}"
                           onchange="updateOrderTotal()">
                </div>
            </div>
        `
      )
      .join("");
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  }

  // Initialize
  renderTables();
  renderMenuItems();

  // Make functions global
  window.showNewOrderForm = function (tableNumber) {
    if (tableNumber) {
      document.getElementById("tableNumber").value = tableNumber;
    }
    newOrderModal.classList.add("active");
  };

  window.hideNewOrderForm = function () {
    newOrderModal.classList.remove("active");
    document.getElementById("newOrderForm").reset();
  };

  window.submitOrder = function () {
    const tableNumber = parseInt(document.getElementById("tableNumber").value);
    const items = Array.from(
      document.querySelectorAll('#menuItems input[type="number"]')
    )
      .map((input) => ({
        id: parseInt(input.dataset.itemId),
        quantity: parseInt(input.value),
        name: mockMenu.find(
          (item) => item.id === parseInt(input.dataset.itemId)
        ).name,
      }))
      .filter((item) => item.quantity > 0);

    if (!tableNumber || items.length === 0) {
      alert("Vui lòng chọn số bàn và ít nhất một món ăn");
      return;
    }

    const table = mockTables.find((t) => t.number === tableNumber);
    if (table && table.status === "empty") {
      table.status = "ordered";
      table.order = { items };
      renderTables();
      hideNewOrderForm();
    } else {
      alert("Bàn không hợp lệ hoặc đã có khách");
    }
  };

  window.updateOrderTotal = function () {
    // This function can be implemented to show order total in real-time
  };
});
