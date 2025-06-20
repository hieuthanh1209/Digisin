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
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

import firebaseConfig from "../config/firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

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

    // Prepare data for update
    const updateData = {
      ...staffData,
      updatedAt: Timestamp.now(),
    };

    // Convert date string to Timestamp if provided
    if (staffData.startDate) {
      updateData.startDate = Timestamp.fromDate(new Date(staffData.startDate));
    }

    await updateDoc(staffRef, updateData);
    return { id: staffId, ...updateData };
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
    // Remove any fields that should not be updated
    const { id, createdAt, ...updateData } = menuItemData;

    // Add updated timestamp
    updateData.updatedAt = Timestamp.now();

    const docRef = doc(db, "menu_items", itemId);
    await updateDoc(docRef, updateData);

    return { id: itemId, ...updateData };
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
    // Add timestamps
    const itemWithTimestamps = {
      ...inventoryItemData,
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
    // Remove any fields that should not be updated
    const { id, createdAt, ...updateData } = inventoryItemData;

    // Add updated timestamp
    updateData.updatedAt = Timestamp.now();

    const docRef = doc(db, "inventory", itemId);
    await updateDoc(docRef, updateData);

    return { id: itemId, ...updateData };
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
    // 1. Get the order details
    const orderDoc = await getDoc(doc(db, "orders", orderId));
    if (!orderDoc.exists()) {
      console.error(`Order ${orderId} not found`);
      return false;
    }

    const orderData = orderDoc.data();

    // Only process if the order has a "ready" status
    if (orderData.status !== "ready") {
      console.log(`Order ${orderId} is not in 'ready' status`);
      return false;
    }

    // 2. Get all menu items in the order
    const orderItems = orderData.items || [];
    if (orderItems.length === 0) {
      console.log(`Order ${orderId} has no items`);
      return false;
    }

    // 3. Get all menu items from the database to determine their ingredients
    const menuItems = await getAllMenuItems();
    const menuItemsMap = {};
    menuItems.forEach((item) => {
      menuItemsMap[item.name] = item;
    });

    // 4. Get all inventory items
    const inventoryItems = await getAllInventoryItems();
    const inventoryMap = {};
    inventoryItems.forEach((item) => {
      inventoryMap[item.name] = item;
    });

    // 5. Calculate ingredient usage based on ordered items and update inventory
    const inventoryUpdates = [];

    for (const orderItem of orderItems) {
      const menuItem = menuItemsMap[orderItem.name];

      if (menuItem && menuItem.ingredients && menuItem.ingredients.length > 0) {
        // For each ingredient in the menu item
        for (const ingredient of menuItem.ingredients) {
          if (inventoryMap[ingredient]) {
            const inventoryItem = inventoryMap[ingredient];

            // Calculate how much to reduce from inventory
            // In a real system, you would have ingredient quantities per menu item
            // For simplicity, assuming 1 unit of ingredient per menu item
            const qtyToReduce = orderItem.quantity;

            // Update the inventory item
            const updatedInventory = {
              ...inventoryItem,
              currentStock: Math.max(
                0,
                inventoryItem.currentStock - qtyToReduce
              ),
              usedToday: inventoryItem.usedToday + qtyToReduce,
            };

            inventoryUpdates.push({
              itemId: inventoryItem.id,
              data: updatedInventory,
            });
          }
        }
      }
    }

    // 6. Perform all inventory updates
    const updatePromises = inventoryUpdates.map((update) =>
      updateInventoryItem(update.itemId, update.data)
    );

    await Promise.all(updatePromises);

    console.log(`Successfully updated inventory for order ${orderId}`);
    return true;
  } catch (error) {
    console.error("Error updating inventory from ready order:", error);
    return false;
  }
}
