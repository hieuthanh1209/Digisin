// Test script cho tính năng ghép bàn
console.log("Testing merge tables functionality...");

// Test function exports
console.log("Testing function exports:");
console.log("showMergeTablesModal:", typeof window.showMergeTablesModal);
console.log("mergeTables:", typeof window.mergeTables);
console.log("confirmMergeTables:", typeof window.confirmMergeTables);
console.log("splitMergedTable:", typeof window.splitMergedTable);
console.log("openTableActionsModal:", typeof window.openTableActionsModal);

// Test modal elements
console.log("\nTesting modal elements:");
console.log(
  "mergeTablesModal:",
  document.getElementById("mergeTablesModal") !== null
);
console.log(
  "mergeConfirmationModal:",
  document.getElementById("mergeConfirmationModal") !== null
);
console.log(
  "tableActionsModal:",
  document.getElementById("tableActionsModal") !== null
);

// Test form elements
console.log("\nTesting form elements:");
console.log("mainTable select:", document.getElementById("mainTable") !== null);
console.log(
  "tablesSelection:",
  document.getElementById("tablesSelection") !== null
);
console.log("mergeNotes:", document.getElementById("mergeNotes") !== null);
console.log(
  "splitTableBtn:",
  document.getElementById("splitTableBtn") !== null
);

// Test CSS classes
console.log("\nTesting CSS classes:");
const testElement = document.createElement("div");
testElement.className = "table-card merged";
document.body.appendChild(testElement);
const computedStyle = window.getComputedStyle(testElement);
console.log("Merged table styling applied:", computedStyle.border !== "");
document.body.removeChild(testElement);

console.log("\nAll tests completed!");
