var categories
var brands

(() => {
    loadData()
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
                <a class="nav-link login-button link">
                    <i class="fa-solid ${item.icon}"></i>
                    ${item.name}
                </a>
            </li>
        `).join('');
    brandsHTML = data.brands
        .map(item => `
            <li class="nav-item category">
                <a class="nav-link login-button link">
                    <i class="fa-solid fa-mobile-screen"></i>
                    ${item.name}
                </a>
            </li>
        `).join('');
    $('#category-list').html(categoryHTML);
    $('#brand-list').html(brandsHTML);
}