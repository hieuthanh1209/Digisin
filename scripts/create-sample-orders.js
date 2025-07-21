// Script để tạo 5 đơn hàng ảo trên Firebase Firestore
// File: create-sample-orders.js

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

// Sample menu items
const sampleMenuItems = [
  { name: "Phở bò tái", price: 65000, category: "Món chính" },
  { name: "Cơm gà xối mỡ", price: 55000, category: "Món chính" },
  { name: "Bánh mì thịt nướng", price: 25000, category: "Món phụ" },
  { name: "Bún bò Huế", price: 60000, category: "Món chính" },
  { name: "Gỏi cuốn tôm thịt", price: 35000, category: "Khai vị" },
  { name: "Bánh flan", price: 25000, category: "Tráng miệng" },
  { name: "Trà đào cam sả", price: 35000, category: "Đồ uống" },
  { name: "Cà phê sữa đá", price: 30000, category: "Đồ uống" },
  { name: "Nước cam tươi", price: 25000, category: "Đồ uống" },
  { name: "Canh chua cá", price: 45000, category: "Món chính" }
];

// Sample tables
const sampleTables = ["Bàn 1", "Bàn 2", "Bàn 3", "Bàn 4", "Bàn 5", "Bàn 6", "Bàn 7", "Bàn 8"];

// Function to generate random order ID
function generateOrderId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'DS-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Function to get random items from menu
function getRandomMenuItems() {
  const numItems = Math.floor(Math.random() * 4) + 2; // 2-5 items
  const selectedItems = [];
  const usedIndices = new Set();
  
  for (let i = 0; i < numItems; i++) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * sampleMenuItems.length);
    } while (usedIndices.has(randomIndex));
    
    usedIndices.add(randomIndex);
    const item = sampleMenuItems[randomIndex];
    const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
    
    selectedItems.push({
      id: `item-${randomIndex}`,
      name: item.name,
      price: item.price,
      quantity: quantity,
      category: item.category,
      notes: ""
    });
  }
  
  return selectedItems;
}

// Function to calculate order totals
function calculateOrderTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal; // No tax/discount for sample orders
  
  return { subtotal, total };
}

// Function to create a sample order
function createSampleOrder(orderNumber) {
  const orderId = generateOrderId();
  const table = sampleTables[Math.floor(Math.random() * sampleTables.length)];
  const items = getRandomMenuItems();
  const { subtotal, total } = calculateOrderTotals(items);
  const now = Timestamp.now();
  
  return {
    id: orderId,
    table: table,
    items: items,
    subtotal: subtotal,
    total: total,
    status: "completed", // Completed but not paid
    paymentStatus: null, // Ready for payment
    orderTime: now,
    createdAt: now,
    updatedAt: now,
    customerCount: Math.floor(Math.random() * 6) + 1, // 1-6 people
    notes: `Đơn hàng demo #${orderNumber} - Chờ thanh toán`,
    waiterName: "Demo Waiter",
    waiterId: "demo-waiter-id"
  };
}

// Main function to create 5 sample orders
async function createSampleOrders() {
  console.log("🚀 Đang tạo 5 đơn hàng ảo trên Firebase Firestore...");
  
  try {
    const orders = [];
    
    for (let i = 1; i <= 5; i++) {
      const sampleOrder = createSampleOrder(i);
      console.log(`📝 Tạo đơn hàng ${i}:`, {
        id: sampleOrder.id,
        table: sampleOrder.table,
        items: sampleOrder.items.length,
        total: sampleOrder.total
      });
      
      // Add to Firestore
      const docRef = await addDoc(collection(db, "orders"), sampleOrder);
      console.log(`✅ Đơn hàng ${sampleOrder.id} đã được tạo với document ID:`, docRef.id);
      
      orders.push({
        ...sampleOrder,
        firestoreId: docRef.id
      });
    }
    
    console.log("🎉 Hoàn thành! Đã tạo 5 đơn hàng ảo:");
    orders.forEach((order, index) => {
      console.log(`${index + 1}. ${order.id} - ${order.table} - ${order.total.toLocaleString()}₫`);
    });
    
    console.log("\n🧪 Bây giờ bạn có thể test PayOS với các đơn hàng này!");
    console.log("📱 Reload trang cashier-dashboard.html để xem các đơn hàng mới");
    
    return orders;
    
  } catch (error) {
    console.error("❌ Lỗi khi tạo đơn hàng ảo:", error);
    throw error;
  }
}

// Export function to global scope
window.createSampleOrders = createSampleOrders;

console.log("📦 Script tạo đơn hàng ảo đã được load!");
console.log("🎯 Chạy lệnh: createSampleOrders() để tạo 5 đơn hàng demo");
