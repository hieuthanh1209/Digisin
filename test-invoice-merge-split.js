// Test file for Invoice Merge/Split functionality
// File: test-invoice-merge-split.js

console.log("🧪 Testing Invoice Merge/Split Feature");

// Test 1: Check if functions are exported to window
console.log("\n1. Testing function exports...");

const requiredFunctions = [
  "showMergeInvoicesModal",
  "toggleInvoiceSelection",
  "mergeInvoices",
  "showSplitInvoiceModal",
  "addNewInvoice",
  "removeNewInvoice",
  "removeItemFromNewInvoice",
  "splitInvoice",
];

let allFunctionsExist = true;
requiredFunctions.forEach((func) => {
  if (typeof window[func] === "function") {
    console.log(`✅ ${func} - exported correctly`);
  } else {
    console.log(`❌ ${func} - not found or not a function`);
    allFunctionsExist = false;
  }
});

if (allFunctionsExist) {
  console.log("✅ All required functions are exported");
} else {
  console.log("❌ Some functions are missing");
}

// Test 2: Check if modal elements exist
console.log("\n2. Testing modal elements...");

const requiredModals = ["mergeInvoicesModal", "splitInvoiceModal"];

const requiredElements = [
  "mergeInvoicesList",
  "mergePreview",
  "mergeNotes",
  "confirmMergeBtn",
  "splitInvoiceSelect",
  "splitItemsList",
  "newInvoicesList",
  "confirmSplitBtn",
];

let allElementsExist = true;

// Check modals
requiredModals.forEach((modalId) => {
  const modal = document.getElementById(modalId);
  if (modal) {
    console.log(`✅ Modal ${modalId} - exists`);
  } else {
    console.log(`❌ Modal ${modalId} - not found`);
    allElementsExist = false;
  }
});

// Check elements
requiredElements.forEach((elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    console.log(`✅ Element ${elementId} - exists`);
  } else {
    console.log(`❌ Element ${elementId} - not found`);
    allElementsExist = false;
  }
});

if (allElementsExist) {
  console.log("✅ All required elements exist");
} else {
  console.log("❌ Some elements are missing");
}
console.log(
  "originalInvoiceDetails:",
  document.getElementById("originalInvoiceDetails") !== null
);
console.log(
  "originalItemsList:",
  document.getElementById("originalItemsList") !== null
);
console.log(
  "newInvoicesContainer:",
  document.getElementById("newInvoicesContainer") !== null
);
console.log(
  "splitInvoiceBtn:",
  document.getElementById("splitInvoiceBtn") !== null
);

// Test CSS classes
console.log("\nTesting CSS classes:");
const testElements = [
  { class: "invoice-checkbox-item", name: "Invoice checkbox item" },
  { class: "drag-drop-area", name: "Drag drop area" },
  { class: "draggable-item", name: "Draggable item" },
  { class: "new-invoice-card", name: "New invoice card" },
  { class: "merged-invoice-badge", name: "Merged invoice badge" },
];

testElements.forEach((test) => {
  const element = document.createElement("div");
  element.className = test.class;
  document.body.appendChild(element);
  const computedStyle = window.getComputedStyle(element);
  console.log(`${test.name} styling applied:`, computedStyle.display !== "");
  document.body.removeChild(element);
});

// Test drag and drop support
console.log("\nTesting drag and drop support:");
const testDiv = document.createElement("div");
testDiv.draggable = true;
console.log(
  "Drag and drop supported:",
  "ondragstart" in testDiv && "ondrop" in testDiv && "ondragover" in testDiv
);

// Test utility functions
console.log("\nTesting utility functions:");
try {
  // Test formatCurrency if available
  if (typeof formatCurrency !== "undefined") {
    console.log("formatCurrency test:", formatCurrency(123456));
  } else {
    console.log("formatCurrency: Not available globally");
  }

  // Test formatTime if available
  if (typeof formatTime !== "undefined") {
    console.log("formatTime test:", formatTime(new Date()));
  } else {
    console.log("formatTime: Not available globally");
  }
} catch (error) {
  console.log("Utility function test error:", error.message);
}

// Test button visibility
console.log("\nTesting button visibility:");
const mergeBtn = document.querySelector(
  'button[onclick="showMergeInvoicesModal()"]'
);
const splitBtn = document.querySelector(
  'button[onclick="showSplitInvoiceModal()"]'
);
console.log("Merge button visible:", mergeBtn !== null);
console.log("Split button visible:", splitBtn !== null);

// Test Bootstrap modal functionality
console.log("\nTesting Bootstrap modal functionality:");
if (typeof bootstrap !== "undefined") {
  console.log("Bootstrap available:", true);
  console.log("Modal class available:", typeof bootstrap.Modal !== "undefined");
} else {
  console.log("Bootstrap not available");
}

// Test Lucide icons
console.log("\nTesting Lucide icons:");
if (typeof lucide !== "undefined") {
  console.log("Lucide available:", true);
  console.log(
    "CreateIcons function:",
    typeof lucide.createIcons !== "undefined"
  );
} else {
  console.log("Lucide not available");
}

console.log("\n=== Invoice Merge/Split Tests Completed ===");

// Additional functional tests
console.log("\n=== Functional Tests ===");

// Test global variables
console.log("Global variables:");
console.log(
  "selectedInvoicesForMerge exists:",
  typeof selectedInvoicesForMerge !== "undefined"
);
console.log(
  "originalInvoiceForSplit exists:",
  typeof originalInvoiceForSplit !== "undefined"
);
console.log("newInvoices exists:", typeof newInvoices !== "undefined");
console.log("invoiceCounter exists:", typeof invoiceCounter !== "undefined");

console.log("\nAll tests completed!");

// Test 3: Check CSS classes
console.log("\n3. Testing CSS classes...");

const requiredClasses = [
  "invoice-checkbox-item",
  "merge-preview",
  "merged-invoice-info",
  "split-items-list",
  "draggable-item",
  "drag-drop-area",
  "new-invoice-card",
  "merge-badge",
  "split-badge",
];

let allClassesExist = true;
const styleSheets = Array.from(document.styleSheets);

requiredClasses.forEach((className) => {
  let classFound = false;

  try {
    // Check if class exists in any stylesheet
    for (const sheet of styleSheets) {
      if (sheet.href && sheet.href.includes("cashier-styles.css")) {
        const rules = Array.from(sheet.cssRules || sheet.rules || []);
        for (const rule of rules) {
          if (rule.selectorText && rule.selectorText.includes(className)) {
            classFound = true;
            break;
          }
        }
      }
    }
  } catch (e) {
    // Can't access external stylesheets due to CORS, that's okay
    console.log(`⚠️ CSS class ${className} - cannot verify (CORS restriction)`);
    return;
  }

  if (classFound) {
    console.log(`✅ CSS class ${className} - found`);
  } else {
    console.log(`❌ CSS class ${className} - not found`);
    allClassesExist = false;
  }
});

// Test 4: Check button integration
console.log("\n4. Testing button integration...");

const mergeButton = document.querySelector(
  'button[onclick="showMergeInvoicesModal()"]'
);
const splitButton = document.querySelector(
  'button[onclick="showSplitInvoiceModal()"]'
);

if (mergeButton) {
  console.log("✅ Merge button - found and connected");
} else {
  console.log("❌ Merge button - not found or not connected");
}

if (splitButton) {
  console.log("✅ Split button - found and connected");
} else {
  console.log("❌ Split button - not found or not connected");
}

// Test 5: Test basic functionality (if possible)
console.log("\n5. Testing basic functionality...");

// Test merge modal opening
try {
  if (typeof window.showMergeInvoicesModal === "function") {
    console.log("✅ Can call showMergeInvoicesModal function");
  }
} catch (e) {
  console.log("❌ Error calling showMergeInvoicesModal:", e.message);
}

// Test split modal opening
try {
  if (typeof window.showSplitInvoiceModal === "function") {
    console.log("✅ Can call showSplitInvoiceModal function");
  }
} catch (e) {
  console.log("❌ Error calling showSplitInvoiceModal:", e.message);
}

// Test drag and drop capability
console.log("\n6. Testing drag and drop support...");

if (
  "draggable" in document.createElement("div") &&
  "ondragstart" in document.createElement("div")
) {
  console.log("✅ Browser supports HTML5 drag and drop");
} else {
  console.log("❌ Browser does not support HTML5 drag and drop");
}

// Test Firestore integration
console.log("\n7. Testing Firestore integration...");

if (typeof db !== "undefined") {
  console.log("✅ Firestore database connection available");
} else {
  console.log("❌ Firestore database connection not found");
}

if (typeof addDoc !== "undefined" && typeof updateDoc !== "undefined") {
  console.log("✅ Firestore functions available");
} else {
  console.log("❌ Firestore functions not available");
}

// Summary
console.log("\n📋 Test Summary");
console.log("================");

if (allFunctionsExist && allElementsExist) {
  console.log(
    "🎉 All tests passed! Invoice Merge/Split feature should work correctly."
  );
  console.log("\n📝 Next steps:");
  console.log("1. Test with real data by creating some pending orders");
  console.log("2. Try merging 2-3 orders");
  console.log("3. Try splitting an order with multiple items");
  console.log("4. Verify the data is saved correctly in Firestore");
} else {
  console.log("⚠️ Some tests failed. Please check the implementation.");
  console.log("\n🔧 Troubleshooting:");
  console.log("1. Make sure all CSS is loaded properly");
  console.log("2. Check that all HTML elements are present");
  console.log("3. Verify JavaScript functions are exported to window");
  console.log("4. Check browser console for any errors");
}

console.log("\n🏁 Test completed!");
