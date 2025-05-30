# Hướng dẫn tùy chỉnh kích thước PayOS

## 1. Kích thước PayOS Iframe

### Kích thước Compact (Nhỏ gọn)

```css
#payos-checkout-iframe {
  min-height: 350px;
  height: 50vh;
  max-height: 400px;
}
```

### Kích thước Standard (Tiêu chuẩn)

```css
#payos-checkout-iframe {
  min-height: 500px;
  height: 65vh;
  max-height: 600px;
}
```

### Kích thước Large (Lớn)

```css
#payos-checkout-iframe {
  min-height: 700px;
  height: 80vh;
  max-height: 900px;
}
```

### Kích thước Full Height (Toàn màn hình)

```css
#payos-checkout-iframe {
  height: calc(100vh - 200px); /* Trừ đi header và footer */
  min-height: 600px;
  max-height: none;
}
```

## 2. Kích thước Modal

### Modal Size Classes

```css
/* Compact Modal - 1000px */
.modal-compact .modal-dialog {
  max-width: 1000px;
}

/* Standard Modal - 1200px (Default) */
.modal-xl .modal-dialog {
  max-width: 1200px;
}

/* Large Modal - 1400px */
.modal-large .modal-dialog {
  max-width: 1400px;
}

/* Extra Large Modal - 1600px */
.modal-xxl .modal-dialog {
  max-width: 1600px;
}

/* Ultra Wide Modal - 1800px */
.modal-ultra .modal-dialog {
  max-width: 1800px;
}
```

## 3. Responsive Breakpoints

### Mobile (< 576px)

```css
@media (max-width: 576px) {
  #payos-checkout-iframe {
    min-height: 350px;
    height: 45vh;
    max-height: 400px;
  }

  .modal-dialog {
    margin: 0.5rem;
    max-width: calc(100vw - 1rem);
  }
}
```

### Tablet (576px - 768px)

```css
@media (min-width: 576px) and (max-width: 768px) {
  #payos-checkout-iframe {
    min-height: 450px;
    height: 55vh;
    max-height: 500px;
  }
}
```

### Desktop (768px - 1200px)

```css
@media (min-width: 768px) and (max-width: 1200px) {
  #payos-checkout-iframe {
    min-height: 500px;
    height: 65vh;
    max-height: 650px;
  }
}
```

### Large Desktop (> 1200px)

```css
@media (min-width: 1200px) {
  #payos-checkout-iframe {
    min-height: 600px;
    height: 75vh;
    max-height: 800px;
  }
}
```

## 4. JavaScript Dynamic Sizing

### Auto-resize dựa trên content

```javascript
function autoResizePayOSIframe() {
  const iframe = document.getElementById("payos-checkout-iframe");
  const container = document.getElementById("payosContainer");

  // Resize observer để theo dõi thay đổi content
  const observer = new ResizeObserver((entries) => {
    for (let entry of entries) {
      if (entry.contentRect.height > 0) {
        // Tự động điều chỉnh chiều cao
        iframe.style.height =
          Math.max(500, entry.contentRect.height + 50) + "px";
      }
    }
  });

  observer.observe(iframe);
}
```

### Responsive sizing dựa trên viewport

```javascript
function setResponsiveSize() {
  const iframe = document.getElementById("payos-checkout-iframe");
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (viewportWidth < 576) {
    // Mobile
    iframe.style.height = "45vh";
    iframe.style.minHeight = "350px";
    iframe.style.maxHeight = "400px";
  } else if (viewportWidth < 768) {
    // Tablet
    iframe.style.height = "55vh";
    iframe.style.minHeight = "450px";
    iframe.style.maxHeight = "500px";
  } else if (viewportWidth < 1200) {
    // Desktop
    iframe.style.height = "65vh";
    iframe.style.minHeight = "500px";
    iframe.style.maxHeight = "650px";
  } else {
    // Large Desktop
    iframe.style.height = "75vh";
    iframe.style.minHeight = "600px";
    iframe.style.maxHeight = "800px";
  }
}

// Gọi khi load và resize
window.addEventListener("load", setResponsiveSize);
window.addEventListener("resize", setResponsiveSize);
```

## 5. Preset Size Classes

### Thêm vào CSS

```css
/* Size Presets */
.payos-size-small #payos-checkout-iframe {
  min-height: 350px;
  height: 50vh;
  max-height: 400px;
}

.payos-size-medium #payos-checkout-iframe {
  min-height: 500px;
  height: 65vh;
  max-height: 600px;
}

.payos-size-large #payos-checkout-iframe {
  min-height: 650px;
  height: 75vh;
  max-height: 800px;
}

.payos-size-xl #payos-checkout-iframe {
  min-height: 800px;
  height: 85vh;
  max-height: 1000px;
}
```

### Sử dụng trong JavaScript

```javascript
function setPayOSSize(size) {
  const modal = document.getElementById("paymentModal");

  // Remove existing size classes
  modal.classList.remove(
    "payos-size-small",
    "payos-size-medium",
    "payos-size-large",
    "payos-size-xl"
  );

  // Add new size class
  modal.classList.add("payos-size-" + size);
}

// Sử dụng:
// setPayOSSize('small');    // Kích thước nhỏ
// setPayOSSize('medium');   // Kích thước trung bình
// setPayOSSize('large');    // Kích thước lớn
// setPayOSSize('xl');       // Kích thước rất lớn
```

## 6. Configuration Options

### Tạo object config để dễ quản lý

```javascript
const PayOSSizeConfig = {
  small: {
    minHeight: "350px",
    height: "50vh",
    maxHeight: "400px",
    modalWidth: "1000px",
  },
  medium: {
    minHeight: "500px",
    height: "65vh",
    maxHeight: "600px",
    modalWidth: "1200px",
  },
  large: {
    minHeight: "650px",
    height: "75vh",
    maxHeight: "800px",
    modalWidth: "1400px",
  },
  xl: {
    minHeight: "800px",
    height: "85vh",
    maxHeight: "1000px",
    modalWidth: "1600px",
  },
};

function applyPayOSSize(sizeName) {
  const config = PayOSSizeConfig[sizeName];
  const iframe = document.getElementById("payos-checkout-iframe");
  const modal = document.querySelector("#paymentModal .modal-dialog");

  // Apply iframe size
  iframe.style.minHeight = config.minHeight;
  iframe.style.height = config.height;
  iframe.style.maxHeight = config.maxHeight;

  // Apply modal width
  modal.style.maxWidth = config.modalWidth;
}
```

## 7. User Preference Storage

### Lưu preferences người dùng

```javascript
// Save user preference
function savePayOSSize(size) {
  localStorage.setItem("payos-size-preference", size);
  applyPayOSSize(size);
}

// Load user preference
function loadPayOSSize() {
  const savedSize = localStorage.getItem("payos-size-preference") || "medium";
  applyPayOSSize(savedSize);
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", loadPayOSSize);
```

## 8. Size Toggle UI

### Thêm nút toggle size

```html
<div class="payos-size-controls">
  <label class="form-label">Kích thước giao diện:</label>
  <div class="btn-group" role="group">
    <button
      type="button"
      class="btn btn-outline-primary btn-sm"
      onclick="savePayOSSize('small')"
    >
      S
    </button>
    <button
      type="button"
      class="btn btn-outline-primary btn-sm"
      onclick="savePayOSSize('medium')"
    >
      M
    </button>
    <button
      type="button"
      class="btn btn-outline-primary btn-sm"
      onclick="savePayOSSize('large')"
    >
      L
    </button>
    <button
      type="button"
      class="btn btn-outline-primary btn-sm"
      onclick="savePayOSSize('xl')"
    >
      XL
    </button>
  </div>
</div>
```

## 9. Recommended Settings

### Dành cho restaurant POS system

```css
/* Recommended for restaurant cashier */
#payos-checkout-iframe {
  min-height: 550px;
  height: 70vh;
  max-height: 700px;
}

.modal-xl .modal-dialog {
  max-width: 1400px; /* Đủ rộng cho 2 cột */
}
```

### Dành cho mobile-first

```css
/* Mobile-first approach */
#payos-checkout-iframe {
  min-height: 400px;
  height: 60vh;
  max-height: 500px;
}

@media (min-width: 768px) {
  #payos-checkout-iframe {
    min-height: 550px;
    height: 70vh;
    max-height: 700px;
  }
}
```
