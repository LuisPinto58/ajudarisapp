import { tokenController , logOut} from './tokenController.js';

document.getElementById("logOut").addEventListener("click", () => {
    logOut()
})

let currentDate

function getMessage() {
    axios.get("https://ajudaris-api.onrender.com/ajudaris", {
        headers: {
                    Authorization: "Bearer " + window.sessionStorage.getItem("token")
                }
    })
        .then((response) => {


            if (window.localStorage.getItem("verified") == "false") {
                if (confirm("A sua conta ainda não foi verificada. Deseja verificar agora?")) {
                    axios.post("https://ajudaris-api.onrender.com/users/send-otp", { email: window.localStorage.getItem("email"), use: "verification" })
                        .then((response) => {
                            console.log(response)
                            alert("Verifique a sua caixa de endereço eletrónico para verificar a sua conta (certifique-se que o email não está na caixa de spam)")
                            $('#verificationModal').modal('show');

                        })
                        .catch((error) => {
                            if (error.response && error.response.status === 401) {
                                tokenController(getMessage)
                            }else{
                            if (error.response.data == "OTP already sent.") {
                                console.error(error);
                                alert("Erro:Código OTP já enviado.")
                                $('#verificationModal').modal('show');

                            } else {
                                console.error(error);
                                alert("Erro a verificar conta")
                            }
                }})
                }
            }

            document.getElementById("sidebarEmail").innerHTML = window.localStorage.getItem("email")
            const message = response.data.message.split("\n")
            currentDate = response.data.currentDate
            window.localStorage.setItem("currentDate", response.data.currentDate)
            window.localStorage.setItem("dates", response.data.dates)



            if (response.data.currentDate != window.localStorage.getItem("currentDate")) {
                $('#changeInfoModal').modal('toggle');
                updateYear()
            }
            message.forEach(paragraph => {
                document.getElementById("message").appendChild(document.createElement("p")).innerHTML = paragraph
                document.getElementById("submissionDate").innerHTML = "ENVIO DA HISTÓRIA (carta, narrativa, poema,...) ATÉ  " + response.data.submissionDate
            });
            if (response.data.currentDate < new Date().toISOString().split("T")[0]) {
                document.getElementById("message").innerHTML = "A data de entrega já passou!"
                document.getElementById("submissionDate").innerHTML = ""
            }
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                tokenController(getMessage)
            }else{
            console.error(error);}
        })
}



function updateYear() {
    axios.patch("https://ajudaris-api.onrender.com/users/years/" + window.localStorage.getItem("email"), {
        date: currentDate
    }, {
        headers: {
                    Authorization: "Bearer " + window.sessionStorage.getItem("token")
                }
    })
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                tokenController(updateYear)
            }else{
            console.error(error);}
        })
}

function verifyAccount() {
    axios.post("https://ajudaris-api.onrender.com/users/email-verification", { email: window.localStorage.getItem("email"), otp: document.getElementById("verifyOTP").value }, {
        headers: {
                    Authorization: "Bearer " + window.sessionStorage.getItem("token")
                }
    })
        .then((response) => {
            console.log(response)
            alert("Conta verificada com sucesso!")
            window.localStorage.setItem("verified", "true")
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                tokenController(verifyAccount)
            }else{
            console.error(error);
            alert("Erro a verificar conta")}
        })
}


window.verifyAccount = verifyAccount
window.getMessage = getMessage;