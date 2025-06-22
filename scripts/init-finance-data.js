// Initialize Finance Data in Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import firebaseConfig from "../config/firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample finance data
const sampleFinanceData = [
  {
    code: "PT2025001",
    date: new Date("2025-06-15"),
    type: "income",
    category: "sales",
    description: "Doanh thu bán hàng ngày 15/06/2025",
    amount: 12500000,
    paymentMethod: "cash",
    note: "Đã đối chiếu với sổ quỹ",
  },
  {
    code: "PC2025001",
    date: new Date("2025-06-16"),
    type: "expense",
    category: "inventory",
    description: "Nhập nguyên liệu thực phẩm tươi",
    amount: 4500000,
    paymentMethod: "transfer",
    note: "Chuyển khoản cho nhà cung cấp ABC",
  },
  {
    code: "PC2025002",
    date: new Date("2025-06-20"),
    type: "expense",
    category: "salary",
    description: "Lương nhân viên tháng 6/2025",
    amount: 35000000,
    paymentMethod: "transfer",
    note: "Đã chuyển khoản cho 10 nhân viên",
  },
  {
    code: "PC2025003",
    date: new Date("2025-06-21"),
    type: "expense",
    category: "utilities",
    description: "Tiền điện nước tháng 6/2025",
    amount: 3200000,
    paymentMethod: "cash",
    note: "",
  },
  {
    code: "PT2025002",
    date: new Date("2025-06-22"),
    type: "income",
    category: "sales",
    description: "Doanh thu bán hàng ngày 22/06/2025",
    amount: 8700000,
    paymentMethod: "cash",
    note: "",
  },
  {
    code: "PC2025004",
    date: new Date("2025-05-01"),
    type: "expense",
    category: "rent",
    description: "Tiền thuê mặt bằng tháng 5/2025",
    amount: 15000000,
    paymentMethod: "transfer",
    note: "Đã thanh toán đúng hạn",
  },
  {
    code: "PT2025003",
    date: new Date("2025-06-19"),
    type: "income",
    category: "sales",
    description: "Doanh thu bán hàng ngày 19/06/2025",
    amount: 9800000,
    paymentMethod: "cash",
    note: "",
  },
  {
    code: "PC2025005",
    date: new Date("2025-06-18"),
    type: "expense",
    category: "inventory",
    description: "Nhập thực phẩm khô và gia vị",
    amount: 2800000,
    paymentMethod: "cash",
    note: "Nhập hàng từ kho tổng",
  },
  {
    code: "PT2025004",
    date: new Date("2025-06-21"),
    type: "income",
    category: "sales",
    description: "Doanh thu bán hàng ngày 21/06/2025",
    amount: 11200000,
    paymentMethod: "cash",
    note: "Ngày cuối tuần - doanh thu cao",
  },
  {
    code: "PC2025006",
    date: new Date("2025-06-14"),
    type: "expense",
    category: "other",
    description: "Sửa chữa thiết bị bếp",
    amount: 1500000,
    paymentMethod: "cash",
    note: "Sửa bếp gas và nồi áp suất",
  },
];

async function initializeFinanceData() {
  console.log("Initializing finance data...");

  try {
    const financeCollection = collection(db, "finance_transactions");

    for (const transaction of sampleFinanceData) {
      const docData = {
        ...transaction,
        date: Timestamp.fromDate(transaction.date),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(financeCollection, docData);
      console.log(
        `Added finance transaction with ID: ${docRef.id} - ${transaction.code}`
      );
    }

    console.log("Finance data initialization completed!");
    alert("Dữ liệu thu chi đã được khởi tạo thành công!");
  } catch (error) {
    console.error("Error initializing finance data:", error);
    alert("Lỗi khi khởi tạo dữ liệu thu chi: " + error.message);
  }
}

// Make function globally available
window.initializeFinanceData = initializeFinanceData;

// Auto-run when page loads
document.addEventListener("DOMContentLoaded", function () {
  const initButton = document.getElementById("initFinanceBtn");
  if (initButton) {
    initButton.addEventListener("click", initializeFinanceData);
  }
});
