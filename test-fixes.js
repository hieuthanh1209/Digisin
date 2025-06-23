// Test script to verify the fixes
console.log("🔧 Testing dashboard fixes...");

// Test 1: Check if Firebase functions are available globally
function testFirebaseFunctions() {
  console.log("📝 Testing Firebase functions availability...");

  const requiredFunctions = [
    "db",
    "collection",
    "getDocs",
    "doc",
    "setDoc",
    "deleteDoc",
    "Timestamp",
  ];
  const missingFunctions = [];

  requiredFunctions.forEach((funcName) => {
    if (typeof window[funcName] === "undefined") {
      missingFunctions.push(funcName);
    } else {
      console.log(`✅ ${funcName} is available globally`);
    }
  });

  if (missingFunctions.length > 0) {
    console.error(`❌ Missing functions: ${missingFunctions.join(", ")}`);
    return false;
  }

  console.log("✅ All Firebase functions are available globally");
  return true;
}

// Test 2: Check if testInventoryUpdate is available
function testInventoryFunctionAvailability() {
  console.log("📝 Testing testInventoryUpdate function availability...");

  if (typeof window.testInventoryUpdate === "function") {
    console.log("✅ testInventoryUpdate function is available globally");
    return true;
  } else {
    console.error("❌ testInventoryUpdate function is not available globally");
    return false;
  }
}

// Test 3: Check if getTablesData function can access Firebase
function testGetTablesData() {
  console.log("📝 Testing getTablesData Firebase access...");

  if (typeof window.getTablesData === "function") {
    console.log("✅ getTablesData function is available");
    // Note: We can't actually call it here as it's async and requires proper Firebase setup
    // but we can check if the required Firebase functions are available
    return testFirebaseFunctions();
  } else {
    console.error("❌ getTablesData function is not available");
    return false;
  }
}

// Run all tests
function runAllTests() {
  console.log("🚀 Running all tests...");

  const test1 = testFirebaseFunctions();
  const test2 = testInventoryFunctionAvailability();
  const test3 = testGetTablesData();

  if (test1 && test2 && test3) {
    console.log("🎉 All tests passed! The fixes should be working.");
    return true;
  } else {
    console.error(
      "❌ Some tests failed. Please check the console for details."
    );
    return false;
  }
}

// Export the test function
window.testFixes = runAllTests;

// Auto-run tests when this script loads
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    console.log("🔄 Auto-running tests in 2 seconds...");
    runAllTests();
  }, 2000);
});
