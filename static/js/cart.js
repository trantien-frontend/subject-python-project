(() => {
    initializeAddToCartButtons();
})()

function initializeAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-id');

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
                    alert(data.message);
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
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

    $('.cart-item-total-price').each(() => {
        let itemTotalPrice = parseInt($(this).text().replace(/[^\d]/g, ''));
        totalCartPrice += itemTotalPrice;
    });
    $('#cart-total-price').text(`${totalCartPrice.toLocaleString()}`);
    $('.cart-total-price').text(`${totalCartPrice.toLocaleString()}`);
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
        console.log(data.mess)
    }
}

$(document).ready(function () {
    $('input#name, input#phone, input#address, input#country, input#city').on('input', function () {
        let disable = false;
        const cartForms = $('.cart-form');

        if (cartForms?.length <= 0) {
            disable = true;
        }

        $('input#name, input#phone, input#address, input#country, input#city').each(function () {
            if ($(this).val().trim() === '') {
                disable = true;
                return false;
            }
        });

        $('.check-out').prop('disabled', disable);
    });
});