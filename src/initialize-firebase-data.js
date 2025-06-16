// Script để tạo dữ liệu mẫu trên Firestore và Firebase Authentication
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import firebaseConfig from "../config/firebase-config.js";

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Debug information
console.log("Firebase initialized with version 10.8.0");
console.log("DB object type:", typeof db);
console.log(
  "DB object methods:",
  Object.getOwnPropertyNames(Object.getPrototypeOf(db))
);

// Tài khoản demo
const demoUsers = [
  // Thu ngân
  {
    email: "thanhhieu@gmail.com",
    password: "123456",
    role: "cashier",
    displayName: "Thanh Hiếu",
    phoneNumber: "0901234567",
  },
  {
    email: "tiendung@yahoo.com",
    password: "56789",
    role: "cashier",
    displayName: "Tiến Dũng",
    phoneNumber: "0912345678",
  },

  // Phục vụ
  {
    email: "ngochoa@gmail.com",
    password: "123456",
    role: "waiter",
    displayName: "Ngọc Hoa",
    phoneNumber: "0923456789",
  },
  {
    email: "thuytien@yahoo.com",
    password: "56789",
    role: "waiter",
    displayName: "Thúy Tiên",
    phoneNumber: "0934567890",
  },

  // Đầu bếp
  {
    email: "minhtri@gmail.com",
    password: "123456",
    role: "chef",
    displayName: "Minh Trí",
    phoneNumber: "0945678901",
  },
  {
    email: "vietanh@yahoo.com",
    password: "56789",
    role: "chef",
    displayName: "Việt Anh",
    phoneNumber: "0956789012",
  },

  // Quản lý
  {
    email: "quocminh@gmail.com",
    password: "123456",
    role: "manager",
    displayName: "Quốc Minh",
    phoneNumber: "0967890123",
  },
  {
    email: "thanhtrung@yahoo.com",
    password: "56789",
    role: "manager",
    displayName: "Thanh Trung",
    phoneNumber: "0978901234",
  },
];

// Dữ liệu mẫu cho menu_items (các món ăn)
const menuItems = [
  {
    id: "MN001",
    name: "Phở bò tái",
    category: "Mì & Phở",
    price: 65000,
    cost: 40000,
    description: "Phở bò với thịt tái mềm, nước dùng đậm đà",
    image:
      "https://cdn.tgdd.vn/Files/2022/01/25/1412805/cach-nau-pho-bo-nam-dinh-chuan-vi-thom-ngon-nhu-hang-quan-202201250313281535.jpg",
    ingredients: [
      { id: "NL001", name: "Thịt bò", amount: 150, unit: "gram" },
      { id: "NL002", name: "Bánh phở", amount: 200, unit: "gram" },
      { id: "NL003", name: "Hành lá", amount: 20, unit: "gram" },
    ],
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "MN002",
    name: "Cơm gà xối mỡ",
    category: "Cơm",
    price: 55000,
    cost: 35000,
    description: "Cơm với gà giòn xối mỡ, ăn kèm dưa chua",
    image:
      "https://cdn.tgdd.vn/Files/2021/08/09/1373046/2-cach-lam-ga-xoi-mo-thom-ngon-gion-rum-tai-nha-202108091929509336.jpg",
    ingredients: [
      { id: "NL005", name: "Gà", amount: 200, unit: "gram" },
      { id: "NL006", name: "Gạo", amount: 150, unit: "gram" },
      { id: "NL007", name: "Dưa chua", amount: 50, unit: "gram" },
    ],
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "MN003",
    name: "Trà đào cam sả",
    category: "Đồ uống",
    price: 35000,
    cost: 15000,
    description: "Trà đào thơm mát, có cam và sả",
    image:
      "https://cdn.tgdd.vn/2021/07/CookRecipe/Avatar/tra-dao-cam-sa-thumbnail.jpg",
    ingredients: [
      { id: "NL010", name: "Trà túi lọc", amount: 2, unit: "cái" },
      { id: "NL011", name: "Đào", amount: 50, unit: "gram" },
      { id: "NL012", name: "Cam", amount: 30, unit: "gram" },
      { id: "NL013", name: "Sả", amount: 10, unit: "gram" },
    ],
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "MN004",
    name: "Bánh flan",
    category: "Tráng miệng",
    price: 25000,
    cost: 10000,
    description: "Bánh flan mềm mịn, ngọt dịu",
    image:
      "https://cdn.tgdd.vn/2021/05/CookDish/tong-hop-cac-cach-lam-banh-flan-cuc-ngon-cuc-don-gian-tai-nha-avt-1200x676.jpg",
    ingredients: [
      { id: "NL020", name: "Trứng gà", amount: 2, unit: "quả" },
      { id: "NL021", name: "Đường", amount: 50, unit: "gram" },
      { id: "NL022", name: "Sữa", amount: 100, unit: "ml" },
    ],
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Dữ liệu mẫu cho inventory (kho)
const inventoryItems = [
  {
    id: "NL001",
    name: "Thịt bò",
    unit: "kg",
    standardAmount: 1,
    currentStock: 10,
    usedToday: 0.5,
    thresholdAlert: 2,
    cost: 250000,
    variance: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "NL002",
    name: "Bánh phở",
    unit: "kg",
    standardAmount: 1,
    currentStock: 15,
    usedToday: 1.2,
    thresholdAlert: 3,
    cost: 50000,
    variance: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "NL005",
    name: "Gà",
    unit: "kg",
    standardAmount: 1,
    currentStock: 8,
    usedToday: 1.5,
    thresholdAlert: 2,
    cost: 120000,
    variance: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "NL006",
    name: "Gạo",
    unit: "kg",
    standardAmount: 1,
    currentStock: 25,
    usedToday: 2,
    thresholdAlert: 5,
    cost: 18000,
    variance: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "NL010",
    name: "Trà túi lọc",
    unit: "hộp",
    standardAmount: 1,
    currentStock: 20,
    usedToday: 0.5,
    thresholdAlert: 5,
    cost: 45000,
    variance: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Dữ liệu mẫu cho tables (bàn ăn)
const tables = [
  {
    id: "T001",
    name: "Bàn 1",
    capacity: 4,
    status: "available",
    location: "indoor",
    currentOrder: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "T002",
    name: "Bàn 2",
    capacity: 2,
    status: "available",
    location: "indoor",
    currentOrder: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "T003",
    name: "Bàn 3",
    capacity: 6,
    status: "available",
    location: "indoor",
    currentOrder: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "T004",
    name: "Bàn 4",
    capacity: 8,
    status: "available",
    location: "vip",
    currentOrder: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "T005",
    name: "Bàn 5",
    capacity: 4,
    status: "available",
    location: "outdoor",
    currentOrder: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Hàm tạo tài khoản Firebase Authentication và thông tin người dùng trên Firestore
async function createUser(userData) {
  try {
    console.log(`Đang tạo người dùng ${userData.email}...`);

    // Kiểm tra xem user đã tồn tại trên Firestore chưa
    try {
      // Sử dụng cú pháp Firebase v9 để kiểm tra
      const userEmail = userData.email;
      const userDocId = userEmail.replace(/[.#$]/g, "_");
      const userRef = doc(db, "users", userDocId);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        console.log(`Người dùng ${userData.email} đã tồn tại trong Firestore.`);
        return;
      }
    } catch (checkError) {
      console.log(
        `Kiểm tra người dùng ${userData.email} thất bại nhưng vẫn tiếp tục:`,
        checkError
      );
    }

    // Tạo tài khoản trên Firebase Authentication
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
    } catch (authError) {
      // Kiểm tra nếu lỗi do email đã tồn tại
      if (authError.code === "auth/email-already-in-use") {
        console.log(
          `Email ${userData.email} đã được sử dụng trong Authentication.`
        );
        return;
      }
      throw authError;
    }

    const user = userCredential.user; // Thêm thông tin người dùng vào Firestore
    // Lưu cả theo UID (cho Auth) và theo email đã xử lý (để dễ tìm kiếm)
    const userDocId = userData.email.replace(/[.#$]/g, "_");

    // Lưu theo UID từ Firebase Auth
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      displayName: userData.displayName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      role: userData.role,
      status: "active",
      profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        userData.displayName
      )}&background=random`,
      startDate: new Date(),
      salary:
        userData.role === "manager"
          ? 12000000
          : userData.role === "chef"
          ? 10000000
          : 8000000,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Lưu một bản theo email đã xử lý để dễ tìm kiếm
    await setDoc(doc(db, "users", userDocId), {
      uid: user.uid,
      displayName: userData.displayName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      role: userData.role,
      status: "active",
      profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        userData.displayName
      )}&background=random`,
      startDate: new Date(),
      salary:
        userData.role === "manager"
          ? 12000000
          : userData.role === "chef"
          ? 10000000
          : 8000000,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(
      `Đã tạo người dùng ${userData.email} thành công với vai trò ${userData.role}.`
    );
  } catch (error) {
    console.error(`Lỗi tạo người dùng ${userData.email}:`, error);
  }
}

// Hàm thêm món ăn vào Firestore
async function createMenuItem(menuItemData) {
  try {
    // Kiểm tra xem món ăn đã tồn tại chưa
    const itemDoc = await getDoc(doc(db, "menu_items", menuItemData.id));
    if (itemDoc.exists()) {
      console.log(`Món ăn ${menuItemData.name} đã tồn tại.`);
      return;
    }

    // Thêm món ăn vào Firestore
    await setDoc(doc(db, "menu_items", menuItemData.id), menuItemData);
    console.log(`Đã thêm món ăn ${menuItemData.name} thành công.`);
  } catch (error) {
    console.error(`Lỗi tạo món ăn ${menuItemData.name}:`, error);
  }
}

// Hàm thêm nguyên liệu vào kho
async function createInventoryItem(inventoryData) {
  try {
    // Kiểm tra xem nguyên liệu đã tồn tại chưa
    const itemDoc = await getDoc(doc(db, "inventory", inventoryData.id));
    if (itemDoc.exists()) {
      console.log(`Nguyên liệu ${inventoryData.name} đã tồn tại.`);
      return;
    }

    // Thêm nguyên liệu vào Firestore
    await setDoc(doc(db, "inventory", inventoryData.id), inventoryData);
    console.log(`Đã thêm nguyên liệu ${inventoryData.name} thành công.`);
  } catch (error) {
    console.error(`Lỗi tạo nguyên liệu ${inventoryData.name}:`, error);
  }
}

// Hàm thêm bàn ăn
async function createTable(tableData) {
  try {
    // Kiểm tra xem bàn đã tồn tại chưa
    const tableDoc = await getDoc(doc(db, "tables", tableData.id));
    if (tableDoc.exists()) {
      console.log(`Bàn ${tableData.name} đã tồn tại.`);
      return;
    }

    // Thêm bàn vào Firestore
    await setDoc(doc(db, "tables", tableData.id), tableData);
    console.log(`Đã thêm bàn ${tableData.name} thành công.`);
  } catch (error) {
    console.error(`Lỗi tạo bàn ${tableData.name}:`, error);
  }
}

// Hàm tạo cấu hình nhà hàng
async function createSettings() {
  try {
    // Cấu hình thông tin nhà hàng
    await setDoc(doc(db, "settings", "restaurant_info"), {
      name: "Nhà hàng Việt Nam",
      address: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
      phone: "028 1234 5678",
      email: "contact@nhahangvietnam.com",
      logo: "https://cdn-icons-png.flaticon.com/512/2555/2555072.png",
      taxRate: 10,
      currency: "VND",
      businessHours: {
        monday: { open: "10:00", close: "22:00" },
        tuesday: { open: "10:00", close: "22:00" },
        wednesday: { open: "10:00", close: "22:00" },
        thursday: { open: "10:00", close: "22:00" },
        friday: { open: "10:00", close: "23:00" },
        saturday: { open: "09:00", close: "23:00" },
        sunday: { open: "09:00", close: "22:00" },
      },
      updatedAt: new Date(),
    });

    // Cấu hình hệ thống
    await setDoc(doc(db, "settings", "system_config"), {
      allowNegativeInventory: false,
      inventoryAlertThreshold: 10,
      allowVariance: 5,
      autoBackup: true,
      receiptFooter:
        "Cảm ơn quý khách đã sử dụng dịch vụ của Nhà hàng Việt Nam!",
      updatedAt: new Date(),
    });

    console.log("Đã tạo cấu hình nhà hàng thành công.");
  } catch (error) {
    console.error("Lỗi tạo cấu hình:", error);
  }
}

// Hàm khởi tạo toàn bộ dữ liệu mẫu
async function initializeData() {
  console.log("Bắt đầu khởi tạo dữ liệu mẫu...");

  try {
    // Thiết lập cấu hình
    await createSettings();

    // Tạo tài khoản người dùng
    for (const user of demoUsers) {
      try {
        await createUser(user);
        // Thêm độ trễ để tránh rate limit của Firebase
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(
          `Lỗi hoàn thiện việc tạo người dùng ${user.email}:`,
          error
        );
      }
    }
  } catch (error) {
    console.error("Lỗi khởi tạo dữ liệu:", error);
  }

  // Thêm món ăn
  for (const item of menuItems) {
    await createMenuItem(item);
  }

  // Thêm nguyên liệu vào kho
  for (const item of inventoryItems) {
    await createInventoryItem(item);
  }

  // Thêm bàn ăn
  for (const table of tables) {
    await createTable(table);
  }

  console.log("Hoàn thành khởi tạo dữ liệu mẫu!");
}

// Bắt đầu khởi tạo dữ liệu khi nhấn nút
document
  .getElementById("initializeButton")
  .addEventListener("click", initializeData);

// In thông báo khi tải trang
document.addEventListener("DOMContentLoaded", function () {
  console.log(
    "Trang khởi tạo dữ liệu Firebase đã được tải. Nhấn nút 'Khởi tạo dữ liệu' để bắt đầu."
  );
});
