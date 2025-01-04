const adminLogin = () => {
    const adminLoginForm = document.querySelector("#admin-login-form");
    if (!adminLoginForm) return;

    adminLoginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const inputEmail = adminLoginForm.querySelector("#input-email");
        const inputPassword = adminLoginForm.querySelector("#input-password");
        const adminLoginFormData = new FormData(adminLoginForm);
        const {success, url, email, password, message} = await handleAdminLogin(adminLoginFormData);

        if (success) window.location.href = url;
        inputEmail.nextElementSibling.innerHTML = email ? email : "";
        inputPassword.nextElementSibling.innerHTML = password ? password : "";
        if (message) {
            Toastify({
                text: message, backgroundColor: "red", duration: 3000,
            }).showToast();
        }
    });
}
const handleAdminLogin = async (formData) => {
    const URL = "/admin-login/";
    const res = await fetch(URL, {
        method: "POST", body: formData
    });
    return await res.json();
}

const MODE = {
    edit: "edit", add: "add",
}

let mode = MODE.add;

const getCurrentPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('page');
}
let currentPage = 1;

let submited = false;

const form = document.querySelector(".crud-form");
const popup = document.querySelector(".popup");
const closeFormButton = document.querySelector(".close-button");
const addButton = document.querySelector("#add");
const editListButton = [...document.querySelectorAll(".edit-button")];
const deleteListButton = [...document.querySelectorAll(".delete-button")];
const paginationListButton = [...document.querySelectorAll(".pagination .page-item a")]
const buttonLogout = document.querySelector(".button-logout");

buttonLogout.addEventListener("click", async () => {
    await fetch("/user-logout/")
    window.location.href = "/admin-login/";
})

const showFormAddRecord = () => {
    mode = MODE.add;
    showForm(popup)
    handleTitleForm(form, getCurrentPage());
    handleSubmitForm(form, getCurrentPage(), popup);
}

const showFormEditRecord = async (editButton) => {
    mode = MODE.edit
    const id = editButton.getAttribute("data-edit");
    if (getCurrentPage() === "users") await updateUserInfoToEditForm(form, id);
    if (getCurrentPage() === "products") {
        await updateProductInfoToEditForm(form, id);
    }
    showForm(popup)
    handleTitleForm(form, getCurrentPage());
    handleSubmitForm(form, getCurrentPage(), popup);
}

const getDataByPage = async (page, currentPage) => {
    const url = `/${page}/?current_page=${currentPage ? currentPage : 1}`
    const res = await fetch(url, {
        method: "GET",
    });
    return await res.json();
}

const render = (page, data) => {
    const table = document.querySelector(".table");
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";
    renderTBody(tbody, data, page);
}

const createEditButton = (id) => {
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'btn btn-primary edit-button';
    editButton.setAttribute('data-edit', id);
    editButton.textContent = 'Sửa';
    editButton.addEventListener("click", async () => await showFormEditRecord(editButton));
    return editButton;
}

const createDeleteButton = (id) => {
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn btn-danger delete-button';
    deleteButton.setAttribute('data-delete', id);
    deleteButton.textContent = 'Xóa';
    deleteButton.addEventListener("click", async () => await handleDeleteRecord(deleteButton));
    return deleteButton;
}

const renderTBody = (tbody, data, page) => {
    data.forEach((item, index) => {
        const tr = document.createElement("tr");
        if (page === "users") {
            const tdId = document.createElement("td");
            tdId.textContent = item.id;
            tr.appendChild(tdId)

            const tdFirstName = document.createElement("td");
            tdFirstName.textContent = item.first_name;
            tr.appendChild(tdFirstName)

            const tdLastName = document.createElement("td");
            tdLastName.textContent = item.last_name;
            tr.appendChild(tdLastName)

            const tdEmail = document.createElement("td");
            tdEmail.textContent = item.email;
            tr.appendChild(tdEmail)

            const tdRole = document.createElement("td");
            tdRole.textContent = item.is_staff ? "admin" : "Khách hàng";
            tr.appendChild(tdRole)

            const tdStatus = document.createElement("td");
            tdStatus.textContent = item.is_active ? "Hoạt động" : "Không hoạt động";
            tr.appendChild(tdStatus)

            const tdCreatedAt = document.createElement("td");
            tdCreatedAt.textContent = item.date_joined;
            tr.appendChild(tdCreatedAt)

            const tdAction = document.createElement("td");
            const editButton = createEditButton(item.id);
            const deleteButton = createDeleteButton(item.id);
            tdAction.appendChild(editButton)
            tdAction.appendChild(deleteButton)
            tr.appendChild(tdAction)
        }
        if (page === "products") {
            const tdId = document.createElement("td");
            tdId.textContent = item.id;
            tr.appendChild(tdId)

            const tdName = document.createElement("td");
            tdName.textContent = item.name;
            tr.appendChild(tdName)

            const tdPrice = document.createElement("td");
            tdPrice.textContent = item.price;
            tr.appendChild(tdPrice)

            const tdBrand = document.createElement("td");
            tdBrand.textContent = item.brandName;
            tr.appendChild(tdBrand)

            const tdCategory = document.createElement("td");
            tdCategory.textContent = item.categoryName;
            tr.appendChild(tdCategory)

            const tdImg = document.createElement("td");
            tdImg.classList.add("td-img")
            const imgElement = document.createElement('img');
            imgElement.className = 'product-img';
            imgElement.src = item.image;
            tdImg.appendChild(imgElement);
            tr.appendChild(tdImg)

            const tdCreatedAt = document.createElement("td");
            tdCreatedAt.textContent = item.createdAt;
            tr.appendChild(tdCreatedAt)

            const tdAction = document.createElement("td");
            const editButton = createEditButton(item.id);
            const deleteButton = createDeleteButton(item.id);
            tdAction.appendChild(editButton)
            tdAction.appendChild(deleteButton)
            tr.appendChild(tdAction)
        }
        tbody.appendChild(tr)

    })
}

const updateProductInfoToEditForm = async (form, productId) => {
    const res = await fetch(`/products/${productId}`);
    const {product: {id, brand, category, name, price}} = await res.json();


    const inputId = form.querySelector("#input-id");
    const inputName = form.querySelector("#input-name");
    const inputPrice = form.querySelector("#input-price");
    const selectBrand = form.querySelector("#brand");
    const selectCategory = form.querySelector("#category")

    inputId.value = id;
    inputName.value = name;
    inputPrice.value = price;
    selectBrand.value = brand;
    selectCategory.value = category;
}

const updateUserInfoToEditForm = async (form, userId) => {
    const res = await fetch(`/users/${userId}`);
    const {user: {id, firstName, lastName, email, status}} = await res.json();

    const inputId = form.querySelector("#input-id");
    const inputLastName = form.querySelector("#input-lastname");
    const inputFirstName = form.querySelector("#input-firstname");
    const inputEmail = form.querySelector("#input-email")
    const checkbox = form.querySelector("#status");

    inputId.value = id;
    inputLastName.value = firstName ? firstName : "";
    inputFirstName.value = lastName ? lastName : "";
    inputEmail.value = email;
    checkbox.checked = status;
}

const showToast = (mess, color) => {
    Toastify({
        text: mess, backgroundColor: color, // Màu nền hoặc bất kỳ giá trị CSS hợp lệ nào
        duration: 3000, // Thời gian hiển thị
    }).showToast();
}

const handleSubmitForm = (form, page, popup) => {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log(submited)
        if (submited === true) return;
        submited = true;

        const formData = new FormData(form);
        if (page === "users") {
            if (mode === MODE.add) {
                const {success, message} = await addNewRecord("/users/", formData);
                if (success) showToast(message, "green");
            }

            if (mode === MODE.edit) {
                const {success, message} = await editRecord("/users-update/", formData);
                if (success) showToast(message, "green");
            }

            hideForm(popup, form)
            const {users} = await getDataByPage(page, currentPage);
            render(page, users)
            submited = false
            return;
        }

        if (page === "products") {
            if (mode === MODE.add) {
                const {success, message} = await addNewRecord("/products/", formData);
                if (success) showToast(message, "green");
            }
            if (mode === MODE.edit) {
                const {success, message} = await editRecord("/products-update/", formData);
                if (success) showToast(message, "green");
            }
            hideForm(popup, form)
            const {products} = await getDataByPage(page, currentPage);
            render(page, products)
            submited = false
            return;
        }

        if (page === "orders") {
            if (mode === MODE.add) {
            }
            if (mode === MODE.edit) {
            }
        }

    })
}

const addNewRecord = async (url, formData) => {
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }
    const res = await fetch(url, {
        method: "POST", body: formData
    });
    return await res.json();
}

const editRecord = async (url, formData) => {
    const res = await fetch(url, {
        method: "POST", body: formData
    });
    return await res.json();
}

const handleTitleForm = (form, page, state) => {
    const formTitle = form.querySelector(".form-header-title");
    if (page === "users") {
        if (state === MODE.add) formTitle.textContent = "Thêm người dùng";
        if (state === MODE.edit) formTitle.textContent = "Sửa thông tin người dùng"
    }
}

const showForm = (popup) => popup.classList.add("show");
const hideForm = (popup, form) => {
    popup.classList.remove("show");
    form.reset();
}

const removeActivePaginations = () => {
    paginationListButton.forEach(pagination => {
        pagination.classList.remove("active")
    })
}

const getCSRFToken = () => {
    let csrfToken = null;
    const csrfCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
    if (csrfCookie) {
        csrfToken = csrfCookie.split('=')[1];
    }
    return csrfToken;
}

const proccessDelete = async (url, id) => {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({"id": id})
    });
    return await res.json();
}

const handleDeleteRecord = async (deleteButton) => {
    const id = deleteButton.getAttribute("data-delete");
    const result = confirm(`Bạn có muốn xóa ${getCurrentPage()} có id: ${id}`)
    if (result) {
        const page = getCurrentPage();
        let url = "";

        if (page === "users") {
            url = "/user-delete/"
        }

        if (page === "products") {
            url = "/product-delete/"
        }

        const data = await proccessDelete(url, id);
        showToast(data.message, "green")

        const {users, products} = await getDataByPage(page, currentPage);
        if (page === "users") render(page, users)
        if (page === "products") render(page, products)

    }
}

const init = () => {
    addButton.addEventListener("click", () => showFormAddRecord());
    editListButton.forEach((editButton) => {
        editButton.addEventListener("click", async () => await showFormEditRecord(editButton))
    })
    closeFormButton.addEventListener("click", () => hideForm(popup, form))

    deleteListButton.forEach((deleteButton) => {
        deleteButton.addEventListener("click", async () => await handleDeleteRecord(deleteButton))
    })

    paginationListButton.forEach(paginationButton => {
        paginationButton.addEventListener('click', async () => {
            currentPage = paginationButton.getAttribute("data-page");
            const {users, products} = await getDataByPage(getCurrentPage(), currentPage)
            removeActivePaginations();
            paginationButton.classList.add("active");
            if (getCurrentPage() === "users") {
                render(getCurrentPage(), users)
                return;
            }
            if (getCurrentPage() === "products") {
                console.log(products)
                render(getCurrentPage(), products)
            }

        })
    })
}

// main
(() => {
    init();
    adminLogin();
})()