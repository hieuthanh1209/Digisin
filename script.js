document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");
  // Demo user accounts with roles
  const users = {
    // Thu ngân
    "thanhhieu@gmail.com": { password: "123456", role: "cashier" },
    "tiendung@yahoo.com": { password: "56789", role: "cashier" },

    // Phục vụ
    "ngochoa@gmail.com": { password: "123456", role: "waiter" },
    "thuytien@yahoo.com": { password: "56789", role: "waiter" },

    // Đầu bếp
    "minhtri@gmail.com": { password: "123456", role: "chef" },
    "vietanh@yahoo.com": { password: "56789", role: "chef" },

    // Quản lý
    "quocminh@gmail.com": { password: "123456", role: "manager" },
    "thanhtrung@yahoo.com": { password: "56789", role: "manager" },
  };

  // Handle form submission
  loginForm.addEventListener("submit", function (e) {
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

    // Check if user exists
    if (users[username] && users[username].password === password) {
      // Get user role
      const userRole = users[username].role;

      // Store login info if "remember me" is checked
      if (document.getElementById("remember").checked) {
        localStorage.setItem("restaurantUser", username);
        // In a real app, you would use a more secure method for authentication
      }

      // Redirect to appropriate dashboard based on role
      window.location.href = `./dashboard/${userRole}-dashboard.html`;
    } else {
      // Show error message
      loginError.textContent = "Tên đăng nhập hoặc mật khẩu không chính xác";
      loginError.style.display = "block";
    }
  });

  // Check for saved login
  const savedUser = localStorage.getItem("restaurantUser");
  if (savedUser) {
    document.getElementById("username").value = savedUser;
    document.getElementById("remember").checked = true;
  }
});
