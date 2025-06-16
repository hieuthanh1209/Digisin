// Script để thêm orders mẫu vào Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Import Firebase config
import { firebaseConfig } from "../config/firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample orders data
const sampleOrders = [
  {
    tableId: "1",
    tableName: "Bàn 1",
    items: [
      { id: "1", name: "Phở bò tái", price: 45000, quantity: 1 },
      { id: "15", name: "Cà phê đen", price: 20000, quantity: 2 },
    ],
    notes: "Không hành",
    status: "pending",
    subtotal: 85000,
    vat: 8500,
    total: 93500,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  },
  {
    tableId: "2",
    tableName: "Bàn 2",
    items: [
      { id: "3", name: "Bún bò Huế", price: 50000, quantity: 1 },
      { id: "11", name: "Cơm gà nướng", price: 55000, quantity: 1 },
    ],
    notes: "",
    status: "cooking",
    subtotal: 105000,
    vat: 10500,
    total: 115500,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  },
  {
    tableId: "3",
    tableName: "Bàn 3",
    items: [
      { id: "7", name: "Bánh mì thịt nướng", price: 25000, quantity: 2 },
      { id: "18", name: "Sinh tố bơ", price: 35000, quantity: 1 },
    ],
    notes: "Bánh mì không rau thơm",
    status: "ready",
    subtotal: 85000,
    vat: 8500,
    total: 93500,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  },
  {
    tableId: "4",
    tableName: "Bàn 4",
    items: [
      { id: "13", name: "Cơm chiên dương châu", price: 60000, quantity: 1 },
    ],
    notes: "",
    status: "completed",
    subtotal: 60000,
    vat: 6000,
    total: 66000,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  },
];

// Function to add sample orders
async function addSampleOrders() {
  console.log("Adding sample orders to Firestore...");

  try {
    for (const orderData of sampleOrders) {
      const docRef = await addDoc(collection(db, "orders"), orderData);
      console.log(`Order added with ID: ${docRef.id}`);
    }

    console.log("All sample orders added successfully!");
    alert("Sample orders added successfully!");
  } catch (error) {
    console.error("Error adding sample orders:", error);
    alert("Error adding sample orders: " + error.message);
  }
}

// Call the function when script loads
window.addSampleOrders = addSampleOrders;

// Auto-run if this script is loaded directly
if (window.location.search.includes("auto=true")) {
  addSampleOrders();
}
