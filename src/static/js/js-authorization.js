function trySignUp() {
    const login = document.getElementById("R_Login").textContent;
    const name = document.getElementById("R_Name").textContent;
    const password = document.getElementById("R_Password").textContent;
    const email = document.getElementById("R_EMail").textContent;

    fetch("/user/signup", {
        method: "POST",
        body: JSON.stringify({ login: login, password: password, email: email, name: name }),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    }).then(async result => {
        result = await result.json();
        if (result.logined) window.location = "/forms";
        else alert(result.message);
    });
}

function tryLogIn() {
    const login = document.getElementById("L_Login").value;
    const password = document.getElementById("L_Password").value;

    fetch("/user/login", {
        method: "POST",
        body: JSON.stringify({ login: login, password: password }),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    }).then(async result => {
        result = await result.json();
        if (result.logined) window.location = "/form";
        else alert(result.message);
    });
}