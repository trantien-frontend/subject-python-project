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
        if (data.success) {
            registerForm.reset();
            registerForm.querySelectorAll(".form-error").forEach(i => i.textContent = "");
            window.location.href = data.redirect_url;
            Toastify({
                text: data.mess,
                backgroundColor: "green",
                duration: 3000,
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
    handleRegister();
})()
