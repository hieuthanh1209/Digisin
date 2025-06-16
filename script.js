import { loginWithEmail, checkAuthState } from "./src/firebase.js";

document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");

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

        loginError.textContent = errorMessage;
        loginError.style.display = "block";
      }
    } catch (error) {
      console.error("Lỗi xử lý đăng nhập:", error);
      loginError.textContent =
        "Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.";
      loginError.style.display = "block";
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
