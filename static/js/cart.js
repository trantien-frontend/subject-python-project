(() => {

})()

function initializeAddToCartButtons(id, isLogin = 'True') {
    if (isLogin === 'False') {
        loginRequired();
        return;
    } else {
        handleAddToCart(id);
    }
}

function handleAddToCart(productId) {
    fetch('/add-to-cart/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': getCartFromCookie('csrftoken')
        },
        body: new URLSearchParams({
            product_id: productId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message)
        } else {
            loginRequired();
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function loginRequired() {
    Swal.fire({
        title: "Bạn chưa đăng nhập",
        text: "Bạn cần phải đăng nhập để tiếp tục!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đăng Nhập",
        cancelButtonText: "Thoát",
    }).then((result) => {
        if (result.isConfirmed) {
            const loginButton = document.querySelector(".login-button");
            loginButton.click();
        } else {
            return;
        }
    });
}

function getCartFromCookie(name) {
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

function quantityChange(input, number, product) {
    totalCartPrice = 0;

    if (parseInt(input.value) < input.min) input.value = min;
    if (parseInt(input.value) > input.max) input.value = max;

    $(`#cart-item-total-price-${number}`).text(`${(Number(product) * Number(input.value)).toLocaleString()} VNĐ`);

    $('.cart-item-total-price').each(function () {
        let itemTotalPrice = parseInt($(this).text().replace(/[^\d]/g, ''));
        totalCartPrice += Number(itemTotalPrice);
    });

    $('#cart-total-price').text(`${totalCartPrice.toLocaleString()}`);
    $('.cart-total-price').text(`${totalCartPrice.toLocaleString()}`);
}

function onCheckoutClicked(isLogin) {
    if (isLogin === 'False') {
        Swal.fire({
            title: "Bạn chưa đăng nhập",
            text: "Bạn cần phải đăng nhập để tiếp tục đặt hàng!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đăng Nhập",
            cancelButtonText: "Thoát",
        }).then((result) => {
            if (!result.isConfirmed) {
                checkout();
            } else {
                return;
            }
        });
    } else {
        checkout();
    }
}

async function checkout() {
    products = [];
    $('.cart-form').each((index, element) => {
        products.push({
            productId: Number($(element).val()),
            quantity: Number($(`#quantity-${index + 1}`).val())
        })
    })

    const formData = new FormData(document.getElementById('checkout-info'));
 
    const url = "/order/"
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCartFromCookie('csrftoken')
        },
        body: JSON.stringify({ products: products, ...JSON.parse(JSON.stringify(Object.fromEntries(formData)))  })
    });
    const data = await res.json();

    if (data.success) {
        showToast(data.message).then((_) => {
            removeAllCart();
        })
    }
}

async function onRemoveItemInCart(id) {
    console.log(id)
    try {
      const response = await fetch('/remove-item-from-cart/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': getCartFromCookie('csrftoken')
          },
          body: JSON.stringify({
            product_id: id
          })
      });

      const data = await response.json();

      if (data.success) {
          location.reload();
      }
    } catch (error) {
      console.error(error);
    }
}

async function removeAllCart() {
  try {
      const response = await fetch('/remove-cart/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': getCartFromCookie('csrftoken')
          }
      });

      const data = await response.json();

      if (data.success) {
          location.reload();
      }
  } catch (error) {
      console.error(error);
  }
}

$(document).ready(function () {
    $('input#name, input#phone, input#address, input#country, input#note').on('input', function () {
        let disable = false;
        const cartForms = $('.cart-form');

        if (cartForms?.length <= 0) {
            disable = true;
        }

        $('input#name, input#phone, input#address, input#country, input#note').each(function () {
            if ($(this).val().trim() === '') {
                disable = true;
                return false;
            }
        });

        $('.check-out').prop('disabled', disable);
    });
});