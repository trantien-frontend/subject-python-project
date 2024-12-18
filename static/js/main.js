const ajaxLoginForm = () => {
    const loginButton = document.querySelector(".login-button");
    const popup = document.querySelector(".popup")
    if (!loginButton || !popup) return;

    loginButton.addEventListener('click', async () => {
        const url = "/login-form/"
        try {
            const formRes = await fetch(url);
            popup.innerHTML = await formRes.text();
            popup.classList.add('show');

            handleLoginForm();

            const closeButton = document.querySelector(".close-button");
            closeButton.addEventListener('click', () => {
                popup.classList.remove('show');
            })
            document.addEventListener('keydown', (e) => {
                if (e.key === "Escape") popup.classList.remove('show')
            })

        } catch (exception) {
            console.log(exception)
        }
    })

    const handleLoginForm = () => {
        const formLogin = document.querySelector("#login-form");
        const email = formLogin.querySelector("#input-email");
        const password = formLogin.querySelector("#input-password");
        if (!formLogin) return;

        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const url = "/login/"
            const formData = new FormData(formLogin);

            const res = await fetch(url, {
                method: "POST", body: formData
            });

            const {email: emailErrorMess, password: passwordErrorMess, url: currentURL} = JSON.parse(await res.text());
            if (emailErrorMess) email.nextElementSibling.textContent = emailErrorMess;
            if (passwordErrorMess) password.nextElementSibling.innerHTML = passwordErrorMess;
            if (currentURL) {
                window.location.href = currentURL;
            }
        })
    }
}

(() => {
    ajaxLoginForm();
})()