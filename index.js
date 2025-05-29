
function logIn(){
    const data = {
        email: document.getElementById("InputEmail").value,
        password: document.getElementById("InputPassword").value
    }

    axios.post("https://ajudaris-api.onrender.com/users/login",data)
    .then((response) => {
        window.sessionStorage.setItem("token", response.data.accessToken)
        window.sessionStorage.setItem("refreshToken", response.data.refreshToken)
        window.localStorage.setItem("email", document.getElementById("InputEmail").value)
        window.localStorage.setItem("role", response.data.user.role)
        window.localStorage.setItem("currentDate", response.data.user.currentDate)
        window.localStorage.setItem("verified", response.data.user.verified)
        window.localStorage.setItem("id", response.data.user._id)
        window.location.href = response.data.homeUrl
    })
    .catch((error) => {
        console.error(error);
        alert("Erro a fazer login")
    })
    
    
}

document.getElementById("OTPSender").addEventListener("click", function(){
    axios.post("https://ajudaris-api.onrender.com/users/send-otp", {email: document.getElementById("ResetEmail").value, use: "reset"})
    .then((response) => {
        console.log(response)
        alert("Verifique a sua caixa de endereço eletrónico para restablecer password (certifique-se que o email não está na caixa de spam)")
        document.getElementById("emailResetdiv").classList.add("d-none")
        document.getElementById("OTPSender").classList.add("d-none")
        document.getElementById("passwordResetdiv").classList.remove("d-none")
        document.getElementById("passwordReseter").classList.remove("d-none")
        
    })
    .catch((error) => {
            if(error.response.data == "OTP already sent."){
                console.error(error);
                alert("Código OTP já enviado.")
                document.getElementById("emailResetdiv").classList.add("d-none")
                document.getElementById("OTPSender").classList.add("d-none")
                document.getElementById("passwordResetdiv").classList.remove("d-none")
                document.getElementById("passwordReseter").classList.remove("d-none")
            }else{
                console.error(error);
                alert("Erro a restablecer password")
            }
    })

})

document.getElementById("passwordReseter").addEventListener("click", function(){
    if(document.getElementById("ResetPassword").value != document.getElementById("ConfirmResetPassword").value){
        alert("As passwords não coincidem")
        return
    }else{
        axios.post("https://ajudaris-api.onrender.com/users/password-reset", {password: document.getElementById("ResetPassword").value, otp: document.getElementById("OTP").value, email: document.getElementById("ResetEmail").value})
        .then((response) => {
            console.log(response)
            alert("Palavra-passe alterada com sucesso")
            document.getElementById("emailResetdiv").classList.remove("d-none")
            document.getElementById("OTPSender").classList.remove("d-none")
            document.getElementById("passwordResetdiv").classList.add("d-none")
            document.getElementById("passwordReseter").classList.add("d-none")
        })
        .catch((error) => {
        console.error(error);
        alert("Erro a restablecer password")
        })
    }
    

})
