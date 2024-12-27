(() => {
    loadData();
})()

async function loadData() {
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const key = urlParams.get('key')
    const id = path.match(/\/(brand|category)\/(\d+)\//);
    const url = id ? `${id[0]}products/` : `/api/products/search?key=${key}`
    const res = await fetch(url, {
        method: "GET"
    });
    const data = await res.json();

    if (data.products && data.products.length) {
        initialProductList(data);
    } else {
        $("#data-container").html(getNotFoundProductHTML);
    }
}

function initialProductList(data) {
    $('#pagination').pagination({
        dataSource: data.products,
        pageSize: 4,
        autoHidePrevious: true,
        autoHideNext: true,
        callback: function(data, pagination) {
            var html = data.map((it) => getHTMLTemplate(it)).join(" ");
            $("#data-container").html(html);
        }
    })
}

function getNotFoundProductHTML() {
    return `<img src="/static/img/product-empty.png" alt="" style="width: 200px;">
                <div class="d-flex justify-content-center mt-4 fw-bold fs-3">Không Tìm Thấy Sản Phẩm!</div>
            `;
}

function getHTMLTemplate(product) {
    return `<div class="col-3">
                <div class="box box--ss h-100 d-flex flex-column shadow">
                    <div class="box-image">
                        <img src="https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-grey-thumbnew-600x600.jpg">
                    </div>
                    <div class="d-flex flex-column justify-content-between h-100">
                        <div class="box-content">
                            <h4 class="box-name">${product.name}</h4>
                        </div>
                        <div class="box-button m-0">
                            <h5 class="box-price">${Number(product.price).toLocaleString()} VNĐ</h5>
                            <button class="add-to-cart-btn" onclick="initializeAddToCartButtons(${ product.id })">Thêm vào giỏ hàng</button>
                        </div>
                    </div>
                </div>
            </div>`;
}