import { loginWithEmail, checkAuthState } from "./src/firebase.js";

// Global function for filling demo account credentials
window.fillDemoAccount = function(email, password) {
  const usernameField = document.getElementById("username");
  const passwordField = document.getElementById("password");
  
  if (usernameField && passwordField) {
    // Clear existing values first with animation
    usernameField.style.transition = "all 0.2s ease";
    passwordField.style.transition = "all 0.2s ease";
    
    // Brief scale animation to show something is happening
    usernameField.style.transform = "scale(1.02)";
    passwordField.style.transform = "scale(1.02)";
    
    // Clear and fill with slight delay for better UX
    setTimeout(() => {
      usernameField.value = "";
      passwordField.value = "";
      
      // Type effect simulation
      let emailIndex = 0;
      let passwordIndex = 0;
      
      const typeEmail = () => {
        if (emailIndex < email.length) {
          usernameField.value += email[emailIndex];
          emailIndex++;
          setTimeout(typeEmail, 30);
        }
      };
      
      const typePassword = () => {
        if (passwordIndex < password.length) {
          passwordField.value += password[passwordIndex];
          passwordIndex++;
          setTimeout(typePassword, 30);
        } else {
          // Finished typing, add success highlight
          usernameField.style.backgroundColor = "#e8f5e8";
          passwordField.style.backgroundColor = "#e8f5e8";
          usernameField.style.borderColor = "#22c55e";
          passwordField.style.borderColor = "#22c55e";
          
          // Reset transform
          usernameField.style.transform = "scale(1)";
          passwordField.style.transform = "scale(1)";
          
          // Remove highlight after 1.5 seconds
          setTimeout(() => {
            usernameField.style.backgroundColor = "";
            passwordField.style.backgroundColor = "";
            usernameField.style.borderColor = "";
            passwordField.style.borderColor = "";
          }, 1500);
          
          // Focus on login button to encourage login
          setTimeout(() => {
            const loginButton = document.querySelector('button[type="submit"]');
            if (loginButton) {
              loginButton.focus();
              // Add a subtle pulse to the login button
              loginButton.style.animation = "pulse 0.6s ease-in-out";
              setTimeout(() => {
                loginButton.style.animation = "";
              }, 600);
            }
          }, 500);
        }
      };
      
      // Start typing email first, then password
      typeEmail();
      setTimeout(typePassword, email.length * 30 + 100);
      
    }, 100);
  }
};

document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");

  // Check for error message from sessionStorage (e.g., from manager dashboard redirect)
  const redirectError = sessionStorage.getItem("loginError");
  if (redirectError) {
    showError(redirectError);
    sessionStorage.removeItem("loginError"); // Clear after showing
  }

  // Function to show error message
  function showError(message) {
    loginError.textContent = message;
    loginError.style.display = "block";
    loginError.style.backgroundColor = "#fee";
    loginError.style.border = "1px solid #f99";
    loginError.style.color = "#c33";
    loginError.style.padding = "10px";
    loginError.style.borderRadius = "4px";
    loginError.style.marginBottom = "15px";

    // Auto hide after 8 seconds
    setTimeout(() => {
      if (loginError.style.display === "block") {
        loginError.style.opacity = "0";
        setTimeout(() => {
          loginError.style.display = "none";
          loginError.style.opacity = "1";
        }, 300);
      }
    }, 8000);
  }

  // Hàm chuyển hướng dựa trên vai trò
  function redirectBasedOnRole(role) {
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
        console.error("Role không hợp lệ:", role);
    }
  }

  // Kiểm tra trạng thái đăng nhập khi tải trang
  checkAuthState(({ loggedIn, user }) => {
    if (loggedIn) {
      // Người dùng đã đăng nhập, điều hướng đến trang tương ứng
      if (user && user.role) {
        redirectBasedOnRole(user.role);
      } else {
        console.warn(
          "Người dùng đã đăng nhập nhưng không tìm thấy thông tin role"
        );
      }
    }
  });

  // Handle form submission
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    // Hide previous error message
    loginError.style.display = "none";

    // Basic validation
    if (!username || !password) {
      loginError.textContent = "Vui lòng nhập đầy đủ thông tin đăng nhập";
      loginError.style.display = "block";
      return;
    }

    // Hiển thị thông báo đang xử lý
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang xử lý...';

    try {
      // Đăng nhập với Firebase
      const result = await loginWithEmail(username, password);

      if (result.success) {
        // Lưu trạng thái đăng nhập nếu "remember me" được chọn
        if (document.getElementById("remember").checked) {
          localStorage.setItem("restaurantRememberMe", "true");
        }

        // Điều hướng đã được xử lý trong hàm loginWithEmail
      } else {
        // Hiển thị lỗi cụ thể
        let errorMessage = "Đăng nhập thất bại. Vui lòng thử lại.";

        if (
          result.error &&
          result.error.includes("auth/network-request-failed")
        ) {
          errorMessage =
            "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn.";
        } else if (
          result.error &&
          result.error.includes("auth/wrong-password")
        ) {
          errorMessage = "Sai mật khẩu. Vui lòng thử lại.";
        } else if (
          result.error &&
          result.error.includes("auth/user-not-found")
        ) {
          errorMessage = "Không tìm thấy tài khoản với email này.";
        } else if (result.error) {
          errorMessage = result.error;
        }
        showError(errorMessage);
      }
    } catch (error) {
      console.error("Lỗi xử lý đăng nhập:", error);
      showError("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.");
    } finally {
      // Khôi phục trạng thái nút submit
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });

  // Check for saved login
  const savedUser = localStorage.getItem("restaurantUser");
  if (savedUser) {
    document.getElementById("username").value = savedUser;
    document.getElementById("remember").checked = true;
  }
});
