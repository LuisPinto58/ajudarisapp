import { tokenController , logOut} from './tokenController.js';

document.getElementById("logOut").addEventListener("click", () => {
    logOut()
})
document.getElementById("logOut2").addEventListener("click", () => {
    logOut()
})

function loadEmail() {
    document.getElementById("sidebarEmail").innerHTML = window.localStorage.getItem("email")
    document.getElementById("mobileEmail").innerHTML = window.localStorage.getItem("email")
}


function changePassword() {
    if (document.getElementById("InputPasswordNew").value == document.getElementById("InputPasswordConfirm").value) {
        axios.patch("https://ajudaris-api.onrender.com/users/" + window.localStorage.getItem("email"), {
            password: document.getElementById("InputPasswordNew").value
        }, {
            headers: {
                Authorization: "Bearer " + window.sessionStorage.getItem("token")
            }
        })
            .then((response) => {
                alert("Password changed successfully")
                logOut()
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    tokenController(changePassword)
                }else{
                console.error(error);
                alert("Error changing password")
    }})
    } else {
        document.getElementById("errorMessage").classList.remove("d-none");
    }
}

function deleteAccount() {
    if (confirm("Ao eliminar a sua conta, os dados que submeteu também serão eliminados. Confirmar?")) {
        axios.delete("https://ajudaris-api.onrender.com/users/" + window.localStorage.getItem("email"), {
            headers: {
                Authorization: "Bearer " + window.sessionStorage.getItem("token")
            }
        })
            .then((response) => {
                alert("Conta eliminada com sucesso")
                window.sessionStorage.removeItem("token")
                window.sessionStorage.removeItem("refreshToken")
                window.localStorage.removeItem("email")
                window.localStorage.removeItem("user")
                window.location.href = "/"
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    tokenController(deleteAccount)
                }else{
                console.error(error);
                alert("Erro a eliminar conta.")}
            })
    }
}

window.loadEmail = loadEmail
window.changePassword = changePassword;
window.deleteAccount = deleteAccount;