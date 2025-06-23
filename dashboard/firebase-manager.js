// Firebase Manager - Centralized functions for Firestore operations
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
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
  getDocs,
  Timestamp,
  limit,
  startAfter,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import firebaseConfig from "../config/firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Export core Firebase instances and functions for global use
export {
  db,
  collection,
  doc,
  getDocs,
  updateDoc,
  setDoc,
  deleteDoc,
  Timestamp,
};

// Staff Management Functions
export async function getAllStaff() {
  try {
    const staffCollection = collection(db, "users");
    const querySnapshot = await getDocs(staffCollection);

    const staffMembers = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      staffMembers.push({
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp to Date if needed
        startDate: data.startDate ? data.startDate.toDate() : null,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
      });
    });

    return staffMembers;
  } catch (error) {
    console.error("Error getting staff members:", error);
    throw error;
  }
}

export async function getStaffById(staffId) {
  try {
    const docRef = doc(db, "users", staffId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        // Convert Firestore Timestamp to Date if needed
        startDate: data.startDate ? data.startDate.toDate() : null,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
      };
    } else {
      throw new Error("Staff member not found");
    }
  } catch (error) {
    console.error("Error getting staff member:", error);
    throw error;
  }
}

export async function createFirebaseUser(email, password) {
  try {
    // Create user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error creating Firebase Authentication user:", error);
    throw error;
  }
}

export async function addStaffMember(staffData) {
  try {
    // Add timestamps
    const staffWithTimestamps = {
      ...staffData,
      startDate: Timestamp.fromDate(new Date(staffData.startDate)),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // If we have a specific ID to use
    if (staffData.uid) {
      const docRef = doc(db, "users", staffData.uid);
      await setDoc(docRef, staffWithTimestamps);
      return { id: staffData.uid, ...staffWithTimestamps };
    } else {
      // Let Firestore generate ID
      const docRef = await addDoc(collection(db, "users"), staffWithTimestamps);
      return { id: docRef.id, ...staffWithTimestamps };
    }
  } catch (error) {
    console.error("Error adding staff member:", error);
    throw error;
  }
}

export async function updateStaffMember(staffId, staffData) {
  try {
    const staffRef = doc(db, "users", staffId);

    // Prepare data for update and filter out undefined values
    const updateData = {
      ...staffData,
      updatedAt: Timestamp.now(),
    };

    // Convert date string to Timestamp if provided
    if (staffData.startDate) {
      updateData.startDate = Timestamp.fromDate(new Date(staffData.startDate));
    }

    // Filter out undefined values to prevent Firebase errors
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    await updateDoc(staffRef, filteredData);
    return { id: staffId, ...filteredData };
  } catch (error) {
    console.error("Error updating staff member:", error);
    throw error;
  }
}

export async function deleteStaffMember(staffId) {
  try {
    const staffRef = doc(db, "users", staffId);
    await deleteDoc(staffRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting staff member:", error);
    throw error;
  }
}

export async function getActiveStaffCount() {
  try {
    const q = query(collection(db, "users"), where("status", "==", "active"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error("Error getting active staff count:", error);
    throw error;
  }
}

// Menu Management Functions
export async function getAllMenuItems() {
  try {
    const menuCollection = collection(db, "menu_items");
    const querySnapshot = await getDocs(menuCollection);

    const menuItems = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      menuItems.push({
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp to Date if needed
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
      });
    });

    return menuItems;
  } catch (error) {
    console.error("Error getting menu items:", error);
    throw error;
  }
}

export async function getMenuItemById(itemId) {
  try {
    const docRef = doc(db, "menu_items", itemId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        // Convert Firestore Timestamp to Date if needed
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
      };
    } else {
      throw new Error("Menu item not found");
    }
  } catch (error) {
    console.error("Error getting menu item:", error);
    throw error;
  }
}

export async function addMenuItem(menuItemData) {
  try {
    // Add timestamps
    const itemWithTimestamps = {
      ...menuItemData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // If we have a specific ID to use
    if (menuItemData.id) {
      const docRef = doc(db, "menu_items", menuItemData.id);
      await setDoc(docRef, itemWithTimestamps);
      return { id: menuItemData.id, ...itemWithTimestamps };
    } else {
      // Let Firestore generate ID
      const docRef = await addDoc(
        collection(db, "menu_items"),
        itemWithTimestamps
      );
      return { id: docRef.id, ...itemWithTimestamps };
    }
  } catch (error) {
    console.error("Error adding menu item:", error);
    throw error;
  }
}

export async function updateMenuItem(itemId, menuItemData) {
  try {
    // Remove any fields that should not be updated and filter out undefined values
    const { id, createdAt, ...updateData } = menuItemData;

    // Filter out undefined values to prevent Firebase errors
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    // Add updated timestamp
    filteredData.updatedAt = Timestamp.now();

    const docRef = doc(db, "menu_items", itemId);
    await updateDoc(docRef, filteredData);

    return { id: itemId, ...filteredData };
  } catch (error) {
    console.error("Error updating menu item:", error);
    throw error;
  }
}

export async function deleteMenuItem(itemId) {
  try {
    const docRef = doc(db, "menu_items", itemId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting menu item:", error);
    throw error;
  }
}

// Upload image to Firebase Storage
export async function uploadMenuImage(file) {
  try {
    const storageRef = ref(storage, `menu_images/${file.name}_${Date.now()}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export async function filterMenuItemsByCategory(category) {
  try {
    let menuQuery;

    if (category && category !== "all") {
      menuQuery = query(
        collection(db, "menu_items"),
        where("category", "==", category)
      );
    } else {
      menuQuery = collection(db, "menu_items");
    }

    const querySnapshot = await getDocs(menuQuery);

    const menuItems = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      menuItems.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
      });
    });

    return menuItems;
  } catch (error) {
    console.error("Error filtering menu items by category:", error);
    throw error;
  }
}

export async function getMenuCategories() {
  try {
    // Get all menu items
    const menuCollection = collection(db, "menu_items");
    const querySnapshot = await getDocs(menuCollection);

    // Extract unique categories
    const categoriesSet = new Set();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.category) {
        categoriesSet.add(data.category);
      }
    });

    return Array.from(categoriesSet);
  } catch (error) {
    console.error("Error getting menu categories:", error);
    throw error;
  }
}

// Inventory Management Functions
export async function getAllInventoryItems() {
  try {
    const inventoryCollection = collection(db, "inventory");
    const querySnapshot = await getDocs(inventoryCollection);

    const inventoryItems = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      inventoryItems.push({
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp to Date if needed
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
      });
    });

    return inventoryItems;
  } catch (error) {
    console.error("Error getting inventory items:", error);
    throw error;
  }
}

export async function getInventoryItemById(itemId) {
  try {
    const docRef = doc(db, "inventory", itemId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        // Convert Firestore Timestamp to Date if needed
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
      };
    } else {
      throw new Error("Inventory item not found");
    }
  } catch (error) {
    console.error("Error getting inventory item:", error);
    throw error;
  }
}

export async function addInventoryItem(inventoryItemData) {
  try {
    // Round numerical values to 3 decimal places before adding
    const roundedData = { ...inventoryItemData };
    if (typeof roundedData.currentStock === "number") {
      roundedData.currentStock = roundTo3Decimals(roundedData.currentStock);
    }
    if (typeof roundedData.usedToday === "number") {
      roundedData.usedToday = roundTo3Decimals(roundedData.usedToday);
    }
    if (typeof roundedData.standardAmount === "number") {
      roundedData.standardAmount = roundTo3Decimals(roundedData.standardAmount);
    }
    if (typeof roundedData.minimumStock === "number") {
      roundedData.minimumStock = roundTo3Decimals(roundedData.minimumStock);
    }
    if (typeof roundedData.unitPrice === "number") {
      roundedData.unitPrice = roundTo3Decimals(roundedData.unitPrice);
    }

    // Add timestamps
    const itemWithTimestamps = {
      ...roundedData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // If we have a specific ID to use
    if (inventoryItemData.id) {
      const docRef = doc(db, "inventory", inventoryItemData.id);
      await setDoc(docRef, itemWithTimestamps);
      return { id: inventoryItemData.id, ...itemWithTimestamps };
    } else {
      // Let Firestore generate ID
      const docRef = await addDoc(
        collection(db, "inventory"),
        itemWithTimestamps
      );
      return { id: docRef.id, ...itemWithTimestamps };
    }
  } catch (error) {
    console.error("Error adding inventory item:", error);
    throw error;
  }
}

export async function updateInventoryItem(itemId, inventoryItemData) {
  try {
    // Remove any fields that should not be updated and filter out undefined values
    const { id, createdAt, ...updateData } = inventoryItemData;

    // Filter out undefined values to prevent Firebase errors
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    // Round numerical values to 3 decimal places
    if (typeof filteredData.currentStock === "number") {
      filteredData.currentStock = roundTo3Decimals(filteredData.currentStock);
    }
    if (typeof filteredData.usedToday === "number") {
      filteredData.usedToday = roundTo3Decimals(filteredData.usedToday);
    }
    if (typeof filteredData.standardAmount === "number") {
      filteredData.standardAmount = roundTo3Decimals(
        filteredData.standardAmount
      );
    }
    if (typeof filteredData.minimumStock === "number") {
      filteredData.minimumStock = roundTo3Decimals(filteredData.minimumStock);
    }
    if (typeof filteredData.unitPrice === "number") {
      filteredData.unitPrice = roundTo3Decimals(filteredData.unitPrice);
    }

    // Add updated timestamp
    filteredData.updatedAt = Timestamp.now();

    const docRef = doc(db, "inventory", itemId);
    await updateDoc(docRef, filteredData);

    return { id: itemId, ...filteredData };
  } catch (error) {
    console.error("Error updating inventory item:", error);
    throw error;
  }
}

export async function deleteInventoryItem(itemId) {
  try {
    const docRef = doc(db, "inventory", itemId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    throw error;
  }
}

export async function getLowStockItems(thresholdMultiplier = 1) {
  try {
    const inventoryCollection = collection(db, "inventory");
    const querySnapshot = await getDocs(inventoryCollection);

    const lowStockItems = [];
    querySnapshot.forEach((doc) => {
      const item = doc.data();
      // Check if current stock is at or below threshold
      if (item.currentStock <= item.threshold * thresholdMultiplier) {
        lowStockItems.push({
          id: doc.id,
          ...item,
          createdAt: item.createdAt ? item.createdAt.toDate() : null,
          updatedAt: item.updatedAt ? item.updatedAt.toDate() : null,
          // Add alert level for UI display
          alertLevel:
            item.currentStock <= item.threshold * 0.5 ? "critical" : "warning",
        });
      }
    });

    // Sort by alert level (critical first) and then by stock level
    lowStockItems.sort((a, b) => {
      if (a.alertLevel === "critical" && b.alertLevel !== "critical") return -1;
      if (a.alertLevel !== "critical" && b.alertLevel === "critical") return 1;
      return a.currentStock - b.currentStock;
    });

    return lowStockItems;
  } catch (error) {
    console.error("Error getting low stock items:", error);
    throw error;
  }
}

export async function getHighVarianceItems(varianceThreshold = 0.05) {
  try {
    const inventoryCollection = collection(db, "inventory");
    const querySnapshot = await getDocs(inventoryCollection);

    const highVarianceItems = [];
    querySnapshot.forEach((doc) => {
      const item = doc.data();
      // Calculate variance percentage
      const variance =
        Math.abs(item.usedToday - item.standardAmount) / item.standardAmount;

      // Add items with variance above threshold
      if (variance > varianceThreshold) {
        highVarianceItems.push({
          id: doc.id,
          ...item,
          variance: variance,
          createdAt: item.createdAt ? item.createdAt.toDate() : null,
          updatedAt: item.updatedAt ? item.updatedAt.toDate() : null,
        });
      }
    });

    return highVarianceItems;
  } catch (error) {
    console.error("Error getting high variance items:", error);
    throw error;
  }
}

export async function updateInventoryFromReadyOrder(orderId) {
  try {
    console.log(`🔄 Starting inventory update for order: ${orderId}`);

    // 1. Get the order details
    const orderDoc = await getDoc(doc(db, "orders", orderId));
    if (!orderDoc.exists()) {
      console.error(`❌ Order ${orderId} not found`);
      return false;
    }

    const orderData = orderDoc.data();
    console.log(`📋 Order data:`, orderData);

    // Only process if the order has a "ready" status
    if (orderData.status !== "ready") {
      console.log(
        `⚠️ Order ${orderId} is not in 'ready' status, current status: ${orderData.status}`
      );
      return false;
    }

    // 2. Get all menu items in the order
    const orderItems = orderData.items || [];
    if (orderItems.length === 0) {
      console.log(`⚠️ Order ${orderId} has no items`);
      return false;
    }

    console.log(`📦 Order items:`, orderItems);

    // 3. Get all menu items from the database to determine their ingredients
    const menuItems = await getAllMenuItems();
    const menuItemsMap = {};
    menuItems.forEach((item) => {
      menuItemsMap[item.name] = item;
    });

    console.log(`🍽️ Available menu items:`, Object.keys(menuItemsMap));

    // 4. Get all inventory items
    const inventoryItems = await getAllInventoryItems();
    const inventoryMap = {};
    inventoryItems.forEach((item) => {
      inventoryMap[item.name] = item;
    });

    console.log(`📊 Available inventory items:`, Object.keys(inventoryMap)); // 5. Calculate ingredient usage based on ordered items and update inventory
    const inventoryUpdates = [];

    for (const orderItem of orderItems) {
      const menuItem = menuItemsMap[orderItem.name];

      if (menuItem && menuItem.ingredients && menuItem.ingredients.length > 0) {
        // For each ingredient in the menu item
        for (const ingredient of menuItem.ingredients) {
          // Handle different ingredient formats
          let ingredientName, ingredientAmount, ingredientId;

          if (typeof ingredient === "string") {
            // Old format: just ingredient name
            ingredientName = ingredient;
            ingredientAmount = 1; // default amount
            ingredientId = null;
          } else {
            // New format: object with id, name, amount, unit, baseAmount, baseUnit
            ingredientName = ingredient.name;
            ingredientId = ingredient.id;

            // Use baseAmount if available (calculated from unit conversion)
            // Otherwise, convert amount based on unit
            if (ingredient.baseAmount) {
              ingredientAmount = ingredient.baseAmount;
            } else {
              // Fallback conversion logic
              const amount = ingredient.amount || 1;
              const unit = ingredient.unit || "gram";

              // Convert to base inventory unit (usually kg)
              if (unit === "gram" || unit === "g") {
                ingredientAmount = amount / 1000; // Convert gram to kg
              } else if (unit === "lạng") {
                ingredientAmount = amount / 10; // Convert lạng to kg
              } else if (unit === "kg") {
                ingredientAmount = amount;
              } else if (unit === "ml") {
                ingredientAmount = amount / 1000; // Convert ml to liters
              } else if (unit === "lít" || unit === "l") {
                ingredientAmount = amount;
              } else {
                // For units like 'cái', 'hộp', 'quả' - use as is
                ingredientAmount = amount;
              }
            }
          }

          // Find inventory item by ID first, then by name
          let inventoryItem = null;
          if (ingredientId) {
            inventoryItem = inventoryItems.find(
              (item) => item.id === ingredientId
            );
          }
          if (!inventoryItem) {
            inventoryItem = inventoryMap[ingredientName];
          }
          if (inventoryItem) {
            // Calculate total amount to reduce from inventory
            const totalAmountToReduce = ingredientAmount * orderItem.quantity; // Update the inventory item with rounded values (3 decimal places)
            const newCurrentStock = Math.max(
              0,
              inventoryItem.currentStock - totalAmountToReduce
            );
            const newUsedToday =
              (inventoryItem.usedToday || 0) + totalAmountToReduce;

            const updatedInventory = {
              ...inventoryItem,
              currentStock: roundTo3Decimals(newCurrentStock),
              usedToday: roundTo3Decimals(newUsedToday),
            };

            inventoryUpdates.push({
              itemId: inventoryItem.id,
              data: updatedInventory,
            });
            console.log(
              `✅ Updated ${ingredientName}: -${formatNumberForDisplay(
                totalAmountToReduce
              )}${inventoryItem.unit}, stock: ${formatNumberForDisplay(
                updatedInventory.currentStock
              )}${inventoryItem.unit}, used today: ${formatNumberForDisplay(
                updatedInventory.usedToday
              )}${inventoryItem.unit}`
            );
          } else {
            console.warn(
              `⚠️ Inventory item not found: ${ingredientName} (ID: ${ingredientId})`
            );
          }
        }
      } else {
        console.warn(`Menu item ${orderItem.name} has no ingredients defined`);
      }
    } // 6. Perform all inventory updates
    if (inventoryUpdates.length > 0) {
      console.log(`💾 Updating ${inventoryUpdates.length} inventory items...`);
      const updatePromises = inventoryUpdates.map((update) =>
        updateInventoryItem(update.itemId, update.data)
      );

      await Promise.all(updatePromises);
      console.log(`✅ Successfully updated inventory for order ${orderId}`);
    } else {
      console.log(`ℹ️ No inventory updates needed for order ${orderId}`);
    }

    return true;
  } catch (error) {
    console.error("❌ Error updating inventory from ready order:", error);
    return false;
  }
}

// Finance Management Functions
export async function getAllFinanceTransactions() {
  try {
    const financeCollection = collection(db, "finance_transactions");
    const q = query(financeCollection, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);

    const transactions = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      transactions.push({
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp to Date if needed
        date: data.date
          ? data.date.toDate
            ? data.date.toDate()
            : new Date(data.date)
          : null,
        createdAt: data.createdAt
          ? data.createdAt.toDate
            ? data.createdAt.toDate()
            : new Date(data.createdAt)
          : null,
        updatedAt: data.updatedAt
          ? data.updatedAt.toDate
            ? data.updatedAt.toDate()
            : new Date(data.updatedAt)
          : null,
      });
    });

    // Enhance transactions with cashier names for transactions that have invoices
    const enhancedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        if (
          transaction.invoice &&
          transaction.invoice.cashierId &&
          !transaction.invoice.cashierName
        ) {
          return await enhanceFinanceTransactionWithCashierName(transaction);
        }
        return transaction;
      })
    );

    return enhancedTransactions;
  } catch (error) {
    console.error("Error getting finance transactions:", error);
    return [];
  }
}

export async function getFinanceTransactionById(transactionId) {
  try {
    const transactionDoc = doc(db, "finance_transactions", transactionId);
    const docSnap = await getDoc(transactionDoc);

    if (docSnap.exists()) {
      const data = docSnap.data();
      let transaction = {
        id: docSnap.id,
        ...data,
        date: data.date
          ? data.date.toDate
            ? data.date.toDate()
            : new Date(data.date)
          : null,
        createdAt: data.createdAt
          ? data.createdAt.toDate
            ? data.createdAt.toDate()
            : new Date(data.createdAt)
          : null,
        updatedAt: data.updatedAt
          ? data.updatedAt.toDate
            ? data.updatedAt.toDate()
            : new Date(data.updatedAt)
          : null,
      };

      // Enhance with cashier name if needed
      if (
        transaction.invoice &&
        transaction.invoice.cashierId &&
        !transaction.invoice.cashierName
      ) {
        transaction = await enhanceFinanceTransactionWithCashierName(
          transaction
        );
      }

      return transaction;
    } else {
      console.log("No such finance transaction!");
      return null;
    }
  } catch (error) {
    console.error("Error getting finance transaction:", error);
    return null;
  }
}

export async function addFinanceTransaction(transactionData) {
  try {
    // Generate transaction code if not provided
    if (!transactionData.code) {
      const prefix = transactionData.type === "income" ? "PT" : "PC";
      const year = new Date().getFullYear();

      // Get the count of transactions for this year
      const existingTransactions = await getAllFinanceTransactions();
      const thisYearTransactions = existingTransactions.filter(
        (t) => t.code && t.code.includes(year.toString())
      );
      const nextNumber = thisYearTransactions.length + 1;

      transactionData.code = `${prefix}${year}${nextNumber
        .toString()
        .padStart(3, "0")}`;
    }
    const docData = {
      ...transactionData,
      date: transactionData.date
        ? Timestamp.fromDate(new Date(transactionData.date))
        : Timestamp.now(),
      amount: parseFloat(transactionData.amount) || 0,
      // Use provided createdAt if available (for preserving original when editing), otherwise use current time
      createdAt: transactionData.createdAt
        ? transactionData.createdAt instanceof Timestamp
          ? transactionData.createdAt
          : Timestamp.fromDate(new Date(transactionData.createdAt))
        : Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(
      collection(db, "finance_transactions"),
      docData
    );
    console.log("Finance transaction added with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding finance transaction:", error);
    throw error;
  }
}

export async function updateFinanceTransaction(transactionId, transactionData) {
  try {
    const transactionRef = doc(db, "finance_transactions", transactionId);

    const updateData = {
      ...transactionData,
      amount: parseFloat(transactionData.amount) || 0,
      updatedAt: Timestamp.now(),
    };

    // Convert date to Timestamp if it's a string or Date object
    if (transactionData.date) {
      updateData.date = Timestamp.fromDate(new Date(transactionData.date));
    }

    // Filter out undefined values to prevent Firebase errors
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    await updateDoc(transactionRef, filteredData);
    console.log("Finance transaction updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating finance transaction:", error);
    throw error;
  }
}

export async function deleteFinanceTransaction(transactionId) {
  try {
    await deleteDoc(doc(db, "finance_transactions", transactionId));
    console.log("Finance transaction deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting finance transaction:", error);
    throw error;
  }
}

export async function getFinanceTransactionsByDateRange(startDate, endDate) {
  try {
    const financeCollection = collection(db, "finance_transactions");
    const q = query(
      financeCollection,
      where("date", ">=", Timestamp.fromDate(new Date(startDate))),
      where("date", "<=", Timestamp.fromDate(new Date(endDate))),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);
    const transactions = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      transactions.push({
        id: doc.id,
        ...data,
        date: data.date ? data.date.toDate() : null,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
      });
    });

    // Enhance transactions with cashier names for transactions that have invoices
    const enhancedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        if (
          transaction.invoice &&
          transaction.invoice.cashierId &&
          !transaction.invoice.cashierName
        ) {
          return await enhanceFinanceTransactionWithCashierName(transaction);
        }
        return transaction;
      })
    );

    return enhancedTransactions;
  } catch (error) {
    console.error("Error getting finance transactions by date range:", error);
    return [];
  }
}

export async function getFinanceTransactionsByType(type) {
  try {
    const financeCollection = collection(db, "finance_transactions");
    const q = query(
      financeCollection,
      where("type", "==", type),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);
    const transactions = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      transactions.push({
        id: doc.id,
        ...data,
        date: data.date ? data.date.toDate() : null,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
      });
    });

    // Enhance transactions with cashier names for transactions that have invoices
    const enhancedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        if (
          transaction.invoice &&
          transaction.invoice.cashierId &&
          !transaction.invoice.cashierName
        ) {
          return await enhanceFinanceTransactionWithCashierName(transaction);
        }
        return transaction;
      })
    );

    return enhancedTransactions;
  } catch (error) {
    console.error("Error getting finance transactions by type:", error);
    return [];
  }
}

export async function getFinanceTransactionsByCategory(category) {
  try {
    const financeCollection = collection(db, "finance_transactions");
    const q = query(
      financeCollection,
      where("category", "==", category),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);
    const transactions = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      transactions.push({
        id: doc.id,
        ...data,
        date: data.date ? data.date.toDate() : null,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
      });
    });

    // Enhance transactions with cashier names for transactions that have invoices
    const enhancedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        if (
          transaction.invoice &&
          transaction.invoice.cashierId &&
          !transaction.invoice.cashierName
        ) {
          return await enhanceFinanceTransactionWithCashierName(transaction);
        }
        return transaction;
      })
    );

    return enhancedTransactions;
  } catch (error) {
    console.error("Error getting finance transactions by category:", error);
    return [];
  }
}

export async function getFinanceSummary(startDate = null, endDate = null) {
  try {
    let transactions;

    if (startDate && endDate) {
      transactions = await getFinanceTransactionsByDateRange(
        startDate,
        endDate
      );
    } else {
      transactions = await getAllFinanceTransactions();
    }

    const summary = {
      totalIncome: 0,
      totalExpenses: 0,
      netProfit: 0,
      transactionCount: transactions.length,
      incomeTransactions: 0,
      expenseTransactions: 0,
      categories: {},
    };

    transactions.forEach((transaction) => {
      const amount = parseFloat(transaction.amount) || 0;

      if (transaction.type === "income") {
        summary.totalIncome += amount;
        summary.incomeTransactions++;
      } else if (transaction.type === "expense") {
        summary.totalExpenses += amount;
        summary.expenseTransactions++;
      }

      // Group by category
      const category = transaction.category || "other";
      if (!summary.categories[category]) {
        summary.categories[category] = {
          income: 0,
          expenses: 0,
          count: 0,
        };
      }

      summary.categories[category].count++;
      if (transaction.type === "income") {
        summary.categories[category].income += amount;
      } else {
        summary.categories[category].expenses += amount;
      }
    });

    summary.netProfit = summary.totalIncome - summary.totalExpenses;

    return summary;
  } catch (error) {
    console.error("Error getting finance summary:", error);
    return {
      totalIncome: 0,
      totalExpenses: 0,
      netProfit: 0,
      transactionCount: 0,
      incomeTransactions: 0,
      expenseTransactions: 0,
      categories: {},
    };
  }
}

// Order Management Functions
export async function getAllOrders() {
  try {
    const ordersCollection = collection(db, "orders");
    const q = query(ordersCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const orders = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
      });
    });

    return orders;
  } catch (error) {
    console.error("Error getting orders:", error);
    return [];
  }
}

export async function getOrderById(orderId) {
  try {
    const orderDoc = doc(db, "orders", orderId);
    const docSnap = await getDoc(orderDoc);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting order:", error);
    return null;
  }
}

export async function getPaidOrders() {
  try {
    const ordersCollection = collection(db, "orders");
    const q = query(
      ordersCollection,
      where("paymentStatus", "==", "paid"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    const paidOrders = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      paidOrders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
      });
    });

    return paidOrders;
  } catch (error) {
    console.error("Error getting paid orders:", error);
    return [];
  }
}

// Function to check if an order has already been recorded in finance_transactions
export async function isOrderRecordedInFinance(orderId) {
  try {
    const financeCollection = collection(db, "finance_transactions");
    const q = query(financeCollection, where("orderId", "==", orderId));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking if order is recorded in finance:", error);
    return false;
  }
}

// Function to create finance transaction from paid order
export async function createFinanceTransactionFromOrder(order) {
  try {
    // Check if this order has already been recorded
    const isAlreadyRecorded = await isOrderRecordedInFinance(order.id);
    if (isAlreadyRecorded) {
      console.log(
        `Order ${order.id} has already been recorded in finance transactions`
      );
      return null;
    } // Get cashier name
    const cashierName = await getCashierNameById(order.cashierId);

    // Create finance transaction data
    // Use updatedAt (completion date) as the transaction date, fallback to createdAt
    const transactionDate = order.updatedAt || order.createdAt || new Date();

    console.log(`💰 Creating finance transaction for order ${order.id}:`);
    console.log(`   - Completion date: ${transactionDate}`);
    console.log(`   - Amount: ${order.totalAmount || order.total || 0}`);
    console.log(`   - Payment status: ${order.paymentStatus}`);

    const financeData = {
      type: "income",
      category: "sales",
      amount: order.totalAmount || order.total || 0,
      description: `Doanh thu từ đơn hàng #${order.id}`,
      date: transactionDate,
      paymentMethod: order.paymentMethod || "Tiền mặt",
      orderId: order.id,
      tableId: order.tableId || null,
      invoice: {
        cashierId: order.cashierId || "system",
        cashierName: cashierName,
        tableId: order.tableId || null,
        tableNumber: order.tableNumber || null,
        items: order.items || [],
        subtotal: order.subtotal || 0,
        vat: order.vat || order.tax || 0,
        discount: order.discount || 0,
        total: order.totalAmount || order.total || 0,
        paymentMethod: order.paymentMethod || "Tiền mặt",
        customerInfo: order.customerInfo || null,
      },
      notes: `Đơn hàng bàn ${order.tableId || order.tableNumber || "N/A"} - ${
        order.customerInfo?.name || "Khách lẻ"
      }`,
      createdBy: "system",
    };

    // Add the finance transaction
    const transactionId = await addFinanceTransaction(financeData);
    console.log(
      `Created finance transaction ${transactionId} for order ${order.id}`
    );

    return transactionId;
  } catch (error) {
    console.error("Error creating finance transaction from order:", error);
    throw error;
  }
}

// Function to sync all paid orders to finance transactions
export async function syncPaidOrdersToFinance() {
  try {
    const paidOrders = await getPaidOrders();
    console.log(`Found ${paidOrders.length} paid orders`);

    const results = {
      total: paidOrders.length,
      processed: 0,
      skipped: 0,
      errors: 0,
    };

    for (const order of paidOrders) {
      try {
        const transactionId = await createFinanceTransactionFromOrder(order);
        if (transactionId) {
          results.processed++;
        } else {
          results.skipped++;
        }
      } catch (error) {
        console.error(`Error processing order ${order.id}:`, error);
        results.errors++;
      }
    }

    console.log("Sync results:", results);
    return results;
  } catch (error) {
    console.error("Error syncing paid orders to finance:", error);
    throw error;
  }
}

// Function to automatically sync new paid orders (can be called periodically)
export async function autoSyncNewPaidOrders() {
  try {
    // Get paid orders from the last 24 hours to avoid processing too many old orders
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const ordersCollection = collection(db, "orders");
    const q = query(
      ordersCollection,
      where("paymentStatus", "==", "paid"),
      where("createdAt", ">=", Timestamp.fromDate(yesterday)),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const recentPaidOrders = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      recentPaidOrders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
      });
    });

    const results = {
      total: recentPaidOrders.length,
      processed: 0,
      skipped: 0,
      errors: 0,
    };

    for (const order of recentPaidOrders) {
      try {
        const transactionId = await createFinanceTransactionFromOrder(order);
        if (transactionId) {
          results.processed++;
        } else {
          results.skipped++;
        }
      } catch (error) {
        console.error(`Error processing order ${order.id}:`, error);
        results.errors++;
      }
    }

    return results;
  } catch (error) {
    console.error("Error auto-syncing new paid orders:", error);
    throw error;
  }
}

// Function to get cashier name from cashier ID
export async function getCashierNameById(cashierId) {
  try {
    if (!cashierId || cashierId === "system") {
      return "Hệ thống";
    }

    const cashier = await getStaffById(cashierId);
    return cashier
      ? cashier.displayName || cashier.name || cashierId
      : cashierId;
  } catch (error) {
    console.error("Error getting cashier name:", error);
    return cashierId;
  }
}

// Function to enhance finance transaction with cashier name
export async function enhanceFinanceTransactionWithCashierName(transaction) {
  if (transaction.invoice && transaction.invoice.cashierId) {
    const cashierName = await getCashierNameById(transaction.invoice.cashierId);
    transaction.invoice.cashierName = cashierName;
  }
  return transaction;
}

// Dashboard Functions - NEW
export async function getTodayStats() {
  try {
    // Get today's date (start and end of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Query orders from today
    const ordersQuery = query(
      collection(db, "orders"),
      where("createdAt", ">=", Timestamp.fromDate(today)),
      where("createdAt", "<", Timestamp.fromDate(tomorrow))
    );

    const ordersSnapshot = await getDocs(ordersQuery);

    // Calculate stats
    let revenue = 0;
    let orderCount = 0;
    let activeTables = new Set();

    ordersSnapshot.forEach((doc) => {
      const order = doc.data();
      orderCount++;

      if (order.paymentStatus === "paid") {
        revenue += order.totalAmount || 0;
      }

      if (order.status !== "completed" && order.status !== "cancelled") {
        if (order.tableNumber) {
          activeTables.add(order.tableNumber);
        }
      }
    });

    return {
      revenue,
      orderCount,
      activeTablesCount: activeTables.size,
    };
  } catch (error) {
    console.error("Error getting today's stats:", error);
    throw error;
  }
}

export async function getWeeklyRevenue() {
  try {
    // Get dates for the past 7 days
    const dates = [];
    const revenues = [];
    const labels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      // Query orders for this day
      const ordersQuery = query(
        collection(db, "orders"),
        where("createdAt", ">=", Timestamp.fromDate(date)),
        where("createdAt", "<", Timestamp.fromDate(nextDay)),
        where("paymentStatus", "==", "paid")
      );

      const ordersSnapshot = await getDocs(ordersQuery);

      // Calculate total revenue for this day
      let dailyRevenue = 0;
      ordersSnapshot.forEach((doc) => {
        const order = doc.data();
        dailyRevenue += order.totalAmount || 0;
      });

      // Prepare data for chart
      dates.push(date);
      revenues.push(dailyRevenue);
    }

    // Format the data for chart display
    // Return days in appropriate order (usually Monday to Sunday)
    const daysOfWeek = dates.map((date) => date.getDay()); // 0 = Sunday, 1 = Monday, etc.
    const formattedLabels = daysOfWeek.map((day) => labels[day]);

    return {
      labels: formattedLabels,
      revenues: revenues,
    };
  } catch (error) {
    console.error("Error getting weekly revenue:", error);
    throw error;
  }
}

export async function getTopSellingItems(limit = 5) {
  try {
    // Get all order items from paid orders in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const ordersQuery = query(
      collection(db, "orders"),
      where("createdAt", ">=", Timestamp.fromDate(thirtyDaysAgo)),
      where("paymentStatus", "==", "paid")
    );

    const ordersSnapshot = await getDocs(ordersQuery);

    // Process orders to count item sales
    const itemSales = {};

    ordersSnapshot.forEach((doc) => {
      const order = doc.data();
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item) => {
          const itemId = item.id;
          const itemName = item.name;
          const quantity = item.quantity || 1;

          if (!itemSales[itemId]) {
            itemSales[itemId] = {
              id: itemId,
              name: itemName,
              sold: 0,
            };
          }

          itemSales[itemId].sold += quantity;
        });
      }
    });

    // Convert to array and sort by quantity sold
    const topItems = Object.values(itemSales)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, limit);

    return topItems;
  } catch (error) {
    console.error("Error getting top selling items:", error);
    throw error;
  }
}

export async function getOrdersInProgress() {
  try {
    // Query for orders not in completed/cancelled status
    const ordersQuery = query(
      collection(db, "orders"),
      where("status", "in", ["new", "preparing", "ready"])
    );

    const snapshot = await getDocs(ordersQuery);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || null,
    }));
  } catch (error) {
    console.error("Error fetching orders in progress:", error);
    throw error;
  }
}

// Inventory Alert Functions
export async function getInventoryAlerts() {
  try {
    // Get low stock items
    const lowStockQuery = query(
      collection(db, "inventory"),
      where("currentStock", "<=", where("threshold"))
    );

    const lowStockSnapshot = await getDocs(lowStockQuery);
    const lowStockItems = lowStockSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      alertType: "low_stock",
    }));

    return lowStockItems;
  } catch (error) {
    console.error("Error getting inventory alerts:", error);
    throw error;
  }
}

// Authentication Functions
export async function logout() {
  try {
    await signOut(auth);
    console.log("🚪 User signed out from Firebase successfully");
    return true;
  } catch (error) {
    console.error("❌ Error signing out from Firebase:", error);
    throw error;
  }
}

// Utility function to round numbers to 3 decimal places
function roundTo3Decimals(number) {
  return Math.round(number * 1000) / 1000;
}

// Utility function to format numbers for display (remove unnecessary trailing zeros)
function formatNumberForDisplay(number) {
  const rounded = roundTo3Decimals(number);
  return rounded % 1 === 0
    ? rounded.toString()
    : rounded.toFixed(3).replace(/\.?0+$/, "");
}
