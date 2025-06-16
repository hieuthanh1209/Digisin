// Script to add sample menu items with recipes to Firestore
// Run this script to populate the menu_items collection with recipe data

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample menu items with recipes
const sampleMenuItems = [
  {
    id: "pho-bo",
    name: "Phở Bò",
    category: "Món chính",
    price: 85000,
    description: "Phở bò truyền thống với nước dầm đậm đà",
    ingredients: [
      "Thịt bò tái",
      "Bánh phở",
      "Hành lá",
      "Ngò gai",
      "Giá đỗ",
      "Chanh",
      "Ớt",
    ],
    recipe: {
      steps: [
        "Luộc bánh phở với nước sôi trong 2-3 phút",
        "Xếp bánh phở vào tô, cho thịt bò tái lên trên",
        "Chan nước dùng nóng vào tô",
        "Thêm hành lá, ngò gai, giá đỗ",
        "Ăn kèm với chanh và ớt",
      ],
      preparationTime: 5,
      cookingTime: 15,
      difficulty: "easy",
      servings: 1,
    },
    cookingTime: 15,
    difficulty: "easy",
    available: true,
    createdAt: Timestamp.now(),
  },
  {
    id: "com-tam",
    name: "Cơm Tấm Sườn Nướng",
    category: "Món chính",
    price: 75000,
    description: "Cơm tấm với sườn nướng thơm ngon",
    ingredients: [
      "Cơm tấm",
      "Sườn heo",
      "Đồ chua",
      "Nước mắm pha",
      "Hành phi",
      "Mỡ hành",
    ],
    recipe: {
      steps: [
        "Ướp sườn với gia vị trong 30 phút",
        "Nướng sườn trên bếp than hoặc lò nướng 15-20 phút",
        "Nấu cơm tấm",
        "Chuẩn bị đồ chua và nước mắm pha",
        "Bày cơm ra đĩa, xếp sườn nướng lên trên",
        "Rưới mỡ hành, ăn kèm đồ chua",
      ],
      preparationTime: 35,
      cookingTime: 20,
      difficulty: "medium",
      servings: 1,
    },
    cookingTime: 20,
    difficulty: "medium",
    available: true,
    createdAt: Timestamp.now(),
  },
  {
    id: "banh-mi",
    name: "Bánh Mì Thịt Nướng",
    category: "Đồ ăn nhanh",
    price: 25000,
    description: "Bánh mì giòn với thịt nướng thơm lừng",
    ingredients: [
      "Bánh mì",
      "Thịt heo nướng",
      "Đồ chua",
      "Rau thơm",
      "Ớt",
      "Tương ớt",
      "Mayonnaise",
    ],
    recipe: {
      steps: [
        "Nướng bánh mì đến khi giòn vàng",
        "Rạch bánh mì, phết mayonnaise và tương ớt",
        "Cho thịt nướng vào bánh",
        "Thêm đồ chua, rau thơm, ớt",
        "Gói bánh và phục vụ",
      ],
      preparationTime: 3,
      cookingTime: 5,
      difficulty: "easy",
      servings: 1,
    },
    cookingTime: 5,
    difficulty: "easy",
    available: true,
    createdAt: Timestamp.now(),
  },
  {
    id: "goi-cuon",
    name: "Gỏi Cuốn Tôm Thịt",
    category: "Khai vị",
    price: 45000,
    description: "Gỏi cuốn tươi với tôm và thịt",
    ingredients: [
      "Bánh tráng",
      "Tôm luộc",
      "Thịt heo luộc",
      "Bún tươi",
      "Rau xà lách",
      "Rau thơm",
      "Tương đậu phộng",
    ],
    recipe: {
      steps: [
        "Luộc tôm và thịt heo",
        "Làm mềm bánh tráng bằng nước ấm",
        "Bày rau xà lách, bún, thịt, tôm lên bánh tráng",
        "Cuốn chặt bánh tráng",
        "Cắt thành miếng vừa ăn",
        "Ăn kèm với tương đậu phộng",
      ],
      preparationTime: 15,
      cookingTime: 10,
      difficulty: "medium",
      servings: 4,
    },
    cookingTime: 10,
    difficulty: "medium",
    available: true,
    createdAt: Timestamp.now(),
  },
  {
    id: "che-ba-mau",
    name: "Chè Ba Màu",
    category: "Tráng miệng",
    price: 30000,
    description: "Chè ba màu mát lạnh",
    ingredients: [
      "Đậu xanh",
      "Đậu đỏ",
      "Thạch rau câu",
      "Nước cốt dừa",
      "Đường",
      "Đá bào",
    ],
    recipe: {
      steps: [
        "Nấu đậu xanh và đậu đỏ riêng biệt",
        "Làm thạch rau câu cắt miếng nhỏ",
        "Pha nước cốt dừa với đường",
        "Cho đậu đỏ vào ly trước",
        "Tiếp theo là thạch rau câu",
        "Cuối cùng là đậu xanh và nước cốt dừa",
        "Thêm đá bào và phục vụ",
      ],
      preparationTime: 20,
      cookingTime: 30,
      difficulty: "medium",
      servings: 1,
    },
    cookingTime: 30,
    difficulty: "medium",
    available: true,
    createdAt: Timestamp.now(),
  },
];

// Function to add sample menu items
async function addSampleMenuItems() {
  try {
    console.log("Đang thêm dữ liệu mẫu menu items...");

    for (const item of sampleMenuItems) {
      const menuRef = doc(db, "menu_items", item.id);
      await setDoc(menuRef, item);
      console.log(`✅ Đã thêm: ${item.name}`);
    }

    console.log("🎉 Hoàn thành thêm dữ liệu mẫu menu items!");
    console.log(`📊 Tổng cộng: ${sampleMenuItems.length} món ăn`);
  } catch (error) {
    console.error("❌ Lỗi khi thêm dữ liệu:", error);
  }
}

// Run the script
addSampleMenuItems();
