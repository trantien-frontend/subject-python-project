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

// Main JS
(() => {

})()