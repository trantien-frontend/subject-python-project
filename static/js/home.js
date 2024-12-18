import {helperFormatPrice} from "./utils";

const swiper = new Swiper('.swiper', {
    direction: 'horizontal', loop: true, navigation: {
        nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev',
    }, pagination: {
        el: '.swiper-pagination', clickable: true,
    },

    scrollbar: {
        el: '.swiper-scrollbar', draggable: true,
    },
});

const formatProductPrice = () => {
    const productsPrice = [...document.querySelectorAll(".box-price")];
    if (productsPrice.length === 0) return;
    productsPrice.forEach(productPrice => productPrice.childNodes[0].textContent = helperFormatPrice(productPrice.childNodes[0].textContent))
}

// Main JS
(() => {
    formatProductPrice();
})()