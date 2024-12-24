// Main
(() => {
  initializeAddToCartButtons();
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