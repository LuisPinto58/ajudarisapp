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

            
        document.getElementById("sidebarEmail").innerHTML = window.localStorage.getItem("email")
        const message = response.data.message.split("\n")
        currentDate = response.data.currentDate
        window.localStorage.setItem("currentDate", response.data.currentDate)
        window.localStorage.setItem("dates", response.data.dates)
        


        if(response.data.currentDate != window.localStorage.getItem("currentDate")){
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
    axios.patch("https://ajudaris-api.onrender.com/users/years/" + window.localStorage.getItem("email"),{
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


window.getMessage = getMessage;