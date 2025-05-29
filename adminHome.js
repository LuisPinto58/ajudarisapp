import { tokenController , logOut} from './tokenController.js';

document.getElementById("logOut").addEventListener("click", () => {
    logOut()
})

function changeYear(operation) {
    document.getElementById("editYear").removeAttribute("disabled")
    if (operation == "add") {
        document.getElementById("editYear").value = Number(document.getElementById("editYear").value) + 1
    } else if (operation == "subtract") {
        document.getElementById("editYear").value = Number(document.getElementById("editYear").value) - 1
    }
    document.getElementById("editYear").addAttribute("disabled")
}


function editAjudaris() {
    const data = {
        message: document.getElementById("editTextarea").value,
        signUpDate: document.getElementById("editEndSignDate").value.toString(),
        submissionDate: document.getElementById("editEndSubmissionDate").value.toString(),
        currentDate: Number(document.getElementById("editYear").value),
        illustratorCode: document.getElementById("editIllustratorCode").value,
        juryCode: document.getElementById("editJuryCode").value,
        revisorCode: document.getElementById("editRevisorCode").value,
        designerCode: document.getElementById("editDesignerCode").value
    }
    console.log(data)

    axios.put("https://ajudaris-api.onrender.com/ajudaris/", data, {
        headers: {
                    Authorization: "Bearer " + window.sessionStorage.getItem("token")
                }
    })
        .then((response) => {
            console.log(response)
            window.location.reload()
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                tokenController(editAjudaris)
            } else {
                console.error(error);
                alert("Erro a submeter, tente novamente mais tarde")
            }
        })
}
let currentDate

function getMessage() {
    axios.get("https://ajudaris-api.onrender.com/ajudaris/admins", {
        headers: {
                    Authorization: "Bearer " + window.sessionStorage.getItem("token")
                }
    })
        .then((response) => {
            document.getElementById("sidebarEmail").innerHTML = window.localStorage.getItem("email")
            const ajudaris = response.data[0]
            const message = ajudaris.message.split("\n")
            currentDate = ajudaris.currentDate
            window.localStorage.setItem("currentDate", ajudaris.currentDate)
            window.localStorage.setItem("dates", ajudaris.dates)

            if (ajudaris.currentDate != window.localStorage.getItem("currentDate")) {
                updateYear()
            }

            message.forEach(paragraph => {
                document.getElementById("message").appendChild(document.createElement("p")).innerHTML = paragraph
                document.getElementById("submissionDate").innerHTML = "ENVIO DA HISTÓRIA (carta, narrativa, poema,...) ATÉ  " + ajudaris.submissionDate
            });
            document.getElementById("editTextarea").value = response.data[0].message
            document.getElementById("editEndSignDate").value = response.data[0].signUpDate
            document.getElementById("editEndSubmissionDate").value = response.data[0].submissionDate
            document.getElementById("editYear").value = response.data[0].currentDate
            document.getElementById("editIllustratorCode").value = response.data[0].illustratorCode
            document.getElementById("editJuryCode").value = response.data[0].juryCode
            document.getElementById("editDesignerCode").value = response.data[0].designerCode
            document.getElementById("editRevisorCode").value = response.data[0].revisorCode
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                tokenController(getMessage)
            }else{
            console.error(error);
            }
        })
}



function updateYear() {
    axios.patch("http://https://ajudaris-api.onrender.com/users/years/" + window.localStorage.getItem("email"), {
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
            console.error(error);
            }
        })
}


window.getMessage = getMessage
window.changeYear = changeYear
window.editAjudaris = editAjudaris;
