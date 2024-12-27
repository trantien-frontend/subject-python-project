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
        const path = window.location.pathname + window.location.search;;
        if (!formLogin) return;

        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const url = "/login/"
            const formData = new FormData(formLogin);
            formData.append('currentURL', path);

            const res = await fetch(url, {
                method: "POST", body: formData
            });

            const {email: emailErrorMess, password: passwordErrorMess, currentURL: currentURL, message: message, success: success} = JSON.parse(await res.text());
            if (emailErrorMess) email.nextElementSibling.textContent = emailErrorMess;
            if (passwordErrorMess) password.nextElementSibling.innerHTML = passwordErrorMess;
            if (success && currentURL) {
                showToast(message).then((_) => {
                    window.location.href = currentURL;
                })
            }
        })
    }
}

async function logout() {
    document.cookie.replace(
        /(?<=^|;).+?(?=\=|;|$)/g,
        name => location.hostname
            .split(/\.(?=[^\.]+\.)/)
            .reduceRight((acc, val, i, arr) => i ? arr[i]='.'+val+acc : (arr[i]='', arr), '')
            .map(domain => document.cookie=`${name}=;max-age=0;path=/;domain=${domain}`)
    );
    location.reload();
}

(() => {
    ajaxLoginForm();
})()