const REGISTER_REGEX = {
    "NAME": new RegExp("^[A-Za-zÀ-ÿ\\s'-]{1,50}$"),
    "PASSWORD": new RegExp("^[a-zA-Z0-9]{8,}$"),
}

const MESS_ERRORS = {
    "NAME": "Tên chỉ được phép chứa chữ cái, dấu cách, và dài tối đa 50 ký tự",
    "PASSWORD": "Mật khẩu phải có ít nhất 8 ký tự và chỉ bao gồm chữ cái hoặc số.",
}


const handleRegister = () => {
    const registerForm = document.querySelector("#register-form");
    if (!registerForm) return;

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const inputFirstName = registerForm.querySelector("#input-firstname");
        const inputLastName = registerForm.querySelector("#input-lastname");
        const inputEmail = registerForm.querySelector("#input-email");
        const inputPassword = registerForm.querySelector("#input-password");
        const inputConfirmPassword = registerForm.querySelector("#input-confirm-password");

        const errorMessageFirstName = helperValidate("name", inputFirstName.value);
        const errorMessageLastName = helperValidate('name', inputLastName.value);
        const errorMessagePassword = helperValidate("password", inputPassword.value);
        showError(inputFirstName, errorMessageFirstName);
        showError(inputLastName, errorMessageLastName);
        showError(inputPassword, errorMessagePassword);

        const errorMessageConfirmPassword = inputPassword.value === inputConfirmPassword.value ? "" : "Xác nhận mật khẩu không hợp lệ. ";
        inputConfirmPassword.nextElementSibling.textContent = errorMessageConfirmPassword;
        if (Boolean(errorMessageConfirmPassword) || Boolean(errorMessageFirstName) || Boolean(errorMessageLastName) || Boolean(errorMessagePassword)) return;

        const url = "/register/"
        const formData = new FormData(registerForm);

        const res = await fetch(url, {
            method: "POST", body: formData
        });
        const data = await res.json();
        console.log(data)
        if (data.success) {
            registerForm.reset();
            registerForm.querySelectorAll(".form-error").forEach(i => i.textContent = "");
            Toastify({
                text: data.mess,
                backgroundColor: "green", // Màu nền hoặc bất kỳ giá trị CSS hợp lệ nào
                duration: 3000, // Thời gian hiển thị
            }).showToast();
        }

        if (!data.success && data.email) {
            inputEmail.nextElementSibling.textContent = data.email;
        }
    })
}

const showError = (element, message) => {
    if (element == null) return;
    element.nextElementSibling.textContent = message;
}

const helperValidate = (nameField, value) => {
    if (nameField === "name") {
        return REGISTER_REGEX.NAME.test(value) ? "" : MESS_ERRORS.NAME;
    }
    if (nameField === "password") {
        return REGISTER_REGEX.PASSWORD.test(value) ? "" : MESS_ERRORS.PASSWORD;
    }
}

// Main
(() => {
    
    if (document.querySelector("#register-form")) {
      handleRegister();
    }

  
    if (document.querySelector(".add-to-cart-btn")) {
      initializeAddToCartButtons();
    }
})()

function initializeAddToCartButtons() {
  // Lấy tất cả các nút "Thêm vào giỏ hàng"
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

  // Lặp qua từng nút và thêm sự kiện click
  addToCartButtons.forEach(button => {
      button.addEventListener('click', function () {
          // Lấy product_id từ thuộc tính data-id
          const productId = this.getAttribute('data-id');

          // Gửi yêu cầu POST đến server để thêm sản phẩm vào giỏ
          fetch('/add-to-cart/', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'X-CSRFToken': getCookie('csrftoken') // Lấy CSRF token từ cookie
              },
              body: new URLSearchParams({
                  product_id: productId
              })
          })
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                  alert(data.message); // Hiển thị thông báo thành công
              } else {
                  alert(data.message); // Hiển thị thông báo lỗi
              }
          })
          .catch(error => {
              console.error('Error:', error); // Log lỗi nếu có
          });
      });
  });
}

// Hàm lấy CSRF token từ cookie
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}