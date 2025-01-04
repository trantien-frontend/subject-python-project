var categories
var brands

(() => {
    loadData()
    const urlParams = new URLSearchParams(window.location.search);
    const key = urlParams.get('key')
    if (key && key.trim() != '') {
        $("#search-input").val(key);
    }
})()

async function loadData() {
    const url = "/header/"
    const res = await fetch(url, {
        method: "GET"
    });
    const data = await res.json();

    updateHTML(data);
}

function updateHTML(data) {
    categoryHTML = data.categories
        .map(item => `
            <li class="nav-item category">
                <a class="nav-link login-button link" href="/category/${item.id}">
                    <i class="fa-solid ${getIconByName(item.name)}"></i>
                    ${item.name}
                </a>
            </li>
        `).join('');
    brandsHTML = data.brands
        .map(item => `
            <li class="nav-item category">
                <a class="nav-link login-button link" href="/brand/${item.id}">
                    <i class="fa-solid fa-mobile-screen"></i>
                    ${item.name}
                </a>
            </li>
        `).join('');
    $('#category-list').html(categoryHTML);
    $('#brand-list').html(brandsHTML);
}

$("#search-input").keyup(function(event) {
    if (event.keyCode === 13) {
        key = $("#search-input").val();

        if (key.trim() == '') return;

        window.location.href = `/products/search?key=${encodeURIComponent(key)}`;
    }
});

function getIconByName(name) {
  console.log("name", name)
  switch (name) {
    case "Đồ điện tử":
      return "fa-hard-drive"
    case "TV":
      return "fa-tv"
    case "Điện Thoại":
      return "fa-mobile-screen-button"
    case "Thiết Bị Gia Dụng":
      return "fa-blender-phone"
  }
}