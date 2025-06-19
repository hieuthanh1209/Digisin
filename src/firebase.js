// Khởi tạo Firebase cho ứng dụng
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  startAfter,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import firebaseConfig from "../config/firebase-config.js";

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Authentication Functions
export async function loginWithEmail(email, password) {
  try {
    // Thêm timeout dài hơn để xử lý các kết nối chậm
    auth.settings = {
      ...auth.settings,
      appVerificationDisabledForTesting: true,
    };

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Lấy thông tin người dùng từ Firestore để xác định role
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data();

    if (!userData) {
      console.error("Không tìm thấy thông tin người dùng trong database");
      return { success: false, error: "Không tìm thấy thông tin người dùng" };
    }

    const role = userData.role;

    // Điều hướng dựa trên role
    switch (role) {
      case "cashier":
        window.location.href = "./dashboard/cashier-dashboard.html";
        break;
      case "waiter":
        window.location.href = "./dashboard/waiter-dashboard.html";
        break;
      case "chef":
        window.location.href = "./dashboard/chef-dashboard.html";
        break;
      case "manager":
        window.location.href = "./dashboard/manager-dashboard.html";
        break;
      default:
        console.error("Role không hợp lệ hoặc không được thiết lập");
        return { success: false, error: "Role không hợp lệ" };
    }

    return { success: true, user: userData };
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return { success: false, error: error.message };
  }
}

// Kiểm tra trạng thái đăng nhập
export function checkAuthState(callback) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      // Lấy thêm thông tin từ Firestore
      getDoc(doc(db, "users", user.uid))
        .then((docSnap) => {
          if (docSnap.exists()) {
            callback({
              loggedIn: true,
              user: {
                ...user,
                ...docSnap.data(),
              },
            });
          } else {
            callback({ loggedIn: true, user });
          }
        })
        .catch((err) => {
          console.error("Error getting user data:", err);
          callback({ loggedIn: true, user });
        });
    } else {
      callback({ loggedIn: false });
    }
  });
}

// Đăng xuất
export function logout() {
  return auth.signOut();
}

// Firestore Database Functions
// Lấy danh sách món ăn
export async function getMenuItems(category = null) {
  try {
    let menuQuery;

    if (category) {
      menuQuery = query(
        collection(db, "menu_items"),
        where("category", "==", category),
        where("status", "==", "active")
      );
    } else {
      menuQuery = query(
        collection(db, "menu_items"),
        where("status", "==", "active")
      );
    }

    const querySnapshot = await getDocs(menuQuery);
    const menuItems = [];

    querySnapshot.forEach((doc) => {
      menuItems.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return menuItems;
  } catch (error) {
    console.error("Error getting menu items:", error);
    throw error;
  }
}

// Lấy danh sách bàn
export async function getTables() {
  try {
    const querySnapshot = await getDocs(collection(db, "tables"));
    const tables = [];

    querySnapshot.forEach((doc) => {
      tables.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return tables;
  } catch (error) {
    console.error("Error getting tables:", error);
    throw error;
  }
}

// Tạo đơn hàng mới
export async function createOrder(orderData) {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Cập nhật trạng thái bàn
    await updateDoc(doc(db, "tables", orderData.tableId), {
      status: "occupied",
      currentOrder: docRef.id,
      updatedAt: new Date(),
    });

    return { success: true, orderId: docRef.id };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: error.message };
  }
}

// Cập nhật đơn hàng
export async function updateOrder(orderId, orderData) {
  try {
    await updateDoc(doc(db, "orders", orderId), {
      ...orderData,
      updatedAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating order:", error);
    return { success: false, error: error.message };
  }
}

// Hoàn thành đơn hàng và thanh toán
export async function completeOrder(orderId, paymentData) {
  try {
    // 1. Lấy thông tin đơn hàng
    const orderDoc = await getDoc(doc(db, "orders", orderId));
    if (!orderDoc.exists()) {
      return { success: false, error: "Không tìm thấy đơn hàng" };
    }

    const orderData = orderDoc.data();

    // 2. Cập nhật đơn hàng sang trạng thái hoàn thành
    await updateDoc(doc(db, "orders", orderId), {
      status: "completed",
      paymentStatus: "paid",
      paymentMethod: paymentData.method,
      updatedAt: new Date(),
      completedAt: new Date(),
    });

    // 3. Tạo giao dịch thanh toán
    await addDoc(collection(db, "transactions"), {
      type: "income",
      category: "sales",
      date: new Date(),
      amount: orderData.total,
      paymentMethod: paymentData.method,
      description: `Thanh toán đơn hàng #${orderId}`,
      relatedOrderId: orderId,
      createdBy: paymentData.cashierId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 4. Đặt lại trạng thái bàn
    await updateDoc(doc(db, "tables", orderData.tableId), {
      status: "available",
      currentOrder: null,
      updatedAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error completing order:", error);
    return { success: false, error: error.message };
  }
}

// Quản lý kho
export async function getInventoryItems() {
  try {
    const querySnapshot = await getDocs(collection(db, "inventory"));
    const items = [];

    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return items;
  } catch (error) {
    console.error("Error getting inventory items:", error);
    throw error;
  }
}

// Cập nhật số lượng tồn kho thủ công (nhập/xuất kho)
export async function updateInventory(
  ingredientId,
  quantity,
  type,
  reason,
  userId
) {
  try {
    // 1. Lấy thông tin nguyên liệu hiện tại
    const ingredientDoc = await getDoc(doc(db, "inventory", ingredientId));
    if (!ingredientDoc.exists()) {
      return { success: false, error: "Không tìm thấy nguyên liệu" };
    }

    const ingredientData = ingredientDoc.data();
    let newStock = ingredientData.currentStock;

    // 2. Cập nhật số lượng tồn kho
    if (type === "in") {
      newStock += quantity;
    } else if (type === "out") {
      newStock = Math.max(0, newStock - quantity);
    }

    await updateDoc(doc(db, "inventory", ingredientId), {
      currentStock: newStock,
      updatedAt: new Date(),
    });

    // 3. Tạo lịch sử kho
    await addDoc(collection(db, "inventory_history"), {
      ingredientId: ingredientId,
      ingredientName: ingredientData.name,
      type: type,
      quantity: quantity,
      remainingStock: newStock,
      unit: ingredientData.unit,
      date: new Date(),
      reason: reason,
      createdBy: userId,
      createdAt: new Date(),
    });

    // 4. Kiểm tra và tạo thông báo nếu tồn kho dưới ngưỡng
    if (newStock <= ingredientData.thresholdAlert) {
      await addDoc(collection(db, "notifications"), {
        type: "alert",
        title: "Cảnh báo tồn kho thấp",
        message: `Nguyên liệu ${ingredientData.name} đã xuống dưới ngưỡng cảnh báo (${newStock} ${ingredientData.unit})`,
        targetRoles: ["manager"],
        read: {},
        relatedTo: {
          type: "inventory",
          id: ingredientId,
        },
        createdAt: new Date(),
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating inventory:", error);
    return { success: false, error: error.message };
  }
}

// Upload hình ảnh
export async function uploadImage(file, folder, itemId) {
  try {
    const storageRef = ref(storage, `${folder}/${itemId}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    return { success: true, url: downloadURL };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, error: error.message };
  }
}

// ==================== PAYMENT HISTORY FUNCTIONS ====================

// Lấy lịch sử thanh toán với bộ lọc
export async function getPaymentHistory(filters = {}) {
  try {
    // Query từ collection orders với paymentStatus: "paid"
    let q = collection(db, "orders");

    // Tạo mảng điều kiện where
    const whereConstraints = [];

    // Lọc theo trạng thái thanh toán (chỉ lấy đơn đã thanh toán)
    whereConstraints.push(where("paymentStatus", "==", "paid"));

    // Lọc theo khoảng thời gian (dùng paymentTime thay vì date)
    if (filters.startDate) {
      whereConstraints.push(
        where("paymentTime", ">=", Timestamp.fromDate(filters.startDate))
      );
    }
    if (filters.endDate) {
      whereConstraints.push(
        where("paymentTime", "<=", Timestamp.fromDate(filters.endDate))
      );
    }

    // Lọc theo phương thức thanh toán
    if (filters.paymentMethod && filters.paymentMethod !== "all") {
      let paymentMethodValue = filters.paymentMethod;
      // Map giá trị filter sang giá trị trong Firestore
      if (filters.paymentMethod === "cash") paymentMethodValue = "Tiền mặt";
      else if (filters.paymentMethod === "card") paymentMethodValue = "Thẻ";
      else if (filters.paymentMethod === "transfer")
        paymentMethodValue = "Chuyển khoản";

      whereConstraints.push(where("paymentMethod", "==", paymentMethodValue));
    }

    // Áp dụng các điều kiện và sắp xếp
    q = query(
      q,
      ...whereConstraints,
      orderBy("paymentTime", "desc"),
      limit(filters.limit || 100)
    );

    const querySnapshot = await getDocs(q);
    const payments = [];

    // Xử lý dữ liệu từ mỗi đơn hàng
    querySnapshot.forEach((docSnapshot) => {
      const orderData = docSnapshot.data();

      payments.push({
        id: docSnapshot.id,
        orderId: docSnapshot.id, // Sử dụng document ID làm orderId
        amount: orderData.finalTotal || orderData.total || 0,
        paymentMethod: orderData.paymentMethod || "Tiền mặt",
        timestamp:
          orderData.paymentTime?.toDate() ||
          orderData.createdAt?.toDate() ||
          new Date(),
        cashier: orderData.cashierName || "Thu ngân",
        status: orderData.status === "completed" ? "Thành công" : "Đang xử lý",
        table: orderData.tableName || orderData.tableId || "N/A",
        items: orderData.items || [],
        discount: orderData.discountCode
          ? {
              code: orderData.discountCode,
              percent: orderData.discount || 0,
            }
          : null,
        subtotal: orderData.subtotal || 0,
        vatAmount: orderData.vat || 0,
        changeAmount: orderData.changeAmount || 0,
        customerPaid: orderData.customerPaid || 0,
        notes: orderData.notes || "",
        // Thêm các thông tin khác từ order data
        cookingStartTime: orderData.cookingStartTime?.toDate(),
        cookingCompletedTime: orderData.cookingCompletedTime?.toDate(),
        createdAt: orderData.createdAt?.toDate(),
        updatedAt: orderData.updatedAt?.toDate(),
      });
    });

    return { success: true, data: payments, total: payments.length };
  } catch (error) {
    console.error("Error getting payment history:", error);
    return { success: false, error: error.message, data: [] };
  }
}

// Lấy thống kê thanh toán theo khoảng thời gian
export async function getPaymentStats(startDate, endDate) {
  try {
    const q = query(
      collection(db, "orders"),
      where("paymentStatus", "==", "paid"),
      where("paymentTime", ">=", Timestamp.fromDate(startDate)),
      where("paymentTime", "<=", Timestamp.fromDate(endDate)),
      orderBy("paymentTime", "desc")
    );

    const querySnapshot = await getDocs(q);
    const orders = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        amount: data.finalTotal || data.total || 0,
        paymentMethod: data.paymentMethod || "Tiền mặt",
        date:
          data.paymentTime?.toDate() || data.createdAt?.toDate() || new Date(),
      });
    });

    // Tính toán thống kê
    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, t) => sum + t.amount, 0),
      cashRevenue: orders
        .filter((t) => t.paymentMethod === "Tiền mặt")
        .reduce((sum, t) => sum + t.amount, 0),
      cardRevenue: orders
        .filter((t) => t.paymentMethod === "Thẻ")
        .reduce((sum, t) => sum + t.amount, 0),
      transferRevenue: orders
        .filter((t) => t.paymentMethod === "Chuyển khoản")
        .reduce((sum, t) => sum + t.amount, 0),
    };

    return { success: true, stats };
  } catch (error) {
    console.error("Error getting payment stats:", error);
    return {
      success: false,
      error: error.message,
      stats: {
        totalOrders: 0,
        totalRevenue: 0,
        cashRevenue: 0,
        cardRevenue: 0,
        transferRevenue: 0,
      },
    };
  }
}

// Lấy chi tiết giao dịch theo ID
export async function getTransactionDetail(transactionId) {
  try {
    const transactionDoc = await getDoc(doc(db, "transactions", transactionId));

    if (!transactionDoc.exists()) {
      return { success: false, error: "Không tìm thấy giao dịch" };
    }

    const transactionData = transactionDoc.data();

    // Lấy thông tin đơn hàng liên quan
    let orderData = null;
    if (transactionData.relatedOrderId) {
      const orderDoc = await getDoc(
        doc(db, "orders", transactionData.relatedOrderId)
      );
      if (orderDoc.exists()) {
        orderData = orderDoc.data();
      }
    }

    return {
      success: true,
      data: {
        id: transactionDoc.id,
        ...transactionData,
        orderData,
        timestamp:
          transactionData.date?.toDate() ||
          transactionData.createdAt?.toDate() ||
          new Date(),
      },
    };
  } catch (error) {
    console.error("Error getting transaction detail:", error);
    return { success: false, error: error.message };
  }
}

// Tìm kiếm giao dịch theo từ khóa
export async function searchTransactions(searchTerm, filters = {}) {
  try {
    // Lấy tất cả giao dịch trong khoảng thời gian
    const baseFilters = {
      startDate: filters.startDate,
      endDate: filters.endDate,
      paymentMethod: filters.paymentMethod,
      limit: 200, // Tăng limit để tìm kiếm
    };

    const result = await getPaymentHistory(baseFilters);

    if (!result.success) {
      return result;
    }

    // Lọc theo từ khóa tìm kiếm
    const searchTermLower = searchTerm.toLowerCase().trim();
    const filteredTransactions = result.data.filter((transaction) => {
      return (
        transaction.orderId.toLowerCase().includes(searchTermLower) ||
        transaction.table.toLowerCase().includes(searchTermLower) ||
        transaction.cashier.toLowerCase().includes(searchTermLower) ||
        transaction.paymentMethod.toLowerCase().includes(searchTermLower)
      );
    });

    return { success: true, data: filteredTransactions };
  } catch (error) {
    console.error("Error searching transactions:", error);
    return { success: false, error: error.message, data: [] };
  }
}

// Get current user info from Firestore
export async function getCurrentUserInfo() {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: "Người dùng chưa đăng nhập" };
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      return { success: false, error: "Không tìm thấy thông tin người dùng" };
    }

    const userData = userDoc.data();
    return {
      success: true,
      data: {
        uid: user.uid,
        email: user.email,
        displayName: userData.displayName || user.displayName,
        role: userData.role,
        phoneNumber: userData.phoneNumber,
        profileImage: userData.profileImage,
        status: userData.status,
        salary: userData.salary,
        startDate: userData.startDate,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
    };
  } catch (error) {
    console.error("Error getting current user info:", error);
    return { success: false, error: error.message };
  }
}

export { db, auth, storage };
