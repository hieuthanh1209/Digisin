document.addEventListener("DOMContentLoaded", function () {
  // Mock data for bills
  const mockBills = [
    {
      id: "001",
      table: "5",
      items: [
        { name: "Phở bò", quantity: 2, price: 60000 },
        { name: "Cơm rang", quantity: 1, price: 35000 },
      ],
      status: "pending",
    },
  ];

  const billsList = document.querySelector(".bills-list");

  function formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  }

  function calculateTotal(items) {
    return items.reduce((total, item) => total + item.quantity * item.price, 0);
  }

  function renderBills() {
    billsList.innerHTML = mockBills
      .filter((bill) => bill.status === "pending")
      .map((bill) => {
        const total = calculateTotal(bill.items);
        return `
                    <div class="card" style="width: 100%; margin-bottom: 1rem;">
                        <div class="card-header">
                            <h3>Hóa đơn #${bill.id}</h3>
                            <span class="text-gray-500">Bàn số ${
                              bill.table
                            }</span>
                        </div>
                        <div class="card-content">
                            <ul style="list-style: none;">
                                ${bill.items
                                  .map(
                                    (item) => `
                                    <li style="margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
                                        <span>${item.quantity}x ${
                                      item.name
                                    }</span>
                                        <span>${formatCurrency(
                                          item.quantity * item.price
                                        )}</span>
                                    </li>
                                `
                                  )
                                  .join("")}
                            </ul>
                            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <span>Tổng tiền hàng:</span>
                                    <span>${formatCurrency(total)}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <span>Thuế VAT (${getCurrentVatRate ? (getCurrentVatRate() * 100).toFixed(1) : '10'}%):</span>
                                    <span>${formatCurrency(Math.round(total * (getCurrentVatRate ? getCurrentVatRate() : 0.1)))}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; font-weight: bold; border-top: 1px solid #e5e7eb; padding-top: 0.5rem;">
                                    <span>Thành tiền:</span>
                                    <span>${formatCurrency(total + Math.round(total * (getCurrentVatRate ? getCurrentVatRate() : 0.1)))}</span>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <button class="button" onclick="processBill('${
                              bill.id
                            }')">Thanh toán</button>
                        </div>
                    </div>
                `;
      })
      .join("");
  }

  // Initialize with mock data
  renderBills();

  // Make processBill function global so it can be called from HTML
  window.processBill = function (billId) {
    const bill = mockBills.find((b) => b.id === billId);
    if (bill) {
      if (confirm(`Xác nhận thanh toán hóa đơn #${billId}?`)) {
        bill.status = "paid";
        renderBills();
      }
    }
  };
});
