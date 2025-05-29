import { tokenController , logOut} from './tokenController.js';

document.getElementById("logOut").addEventListener("click", () => {
    logOut()
})

function loadSubmissions() {
    axios.get("https://ajudaris-api.onrender.com/submissions/illustrations/" + window.localStorage.getItem("id"), {
        headers: {
                    Authorization: "Bearer " + window.sessionStorage.getItem("token")
                }
    })
        .then((response) => {
            console.log(response.data)
            if (window.localStorage.getItem("verified") == "true") {
                document.getElementById("verifyButton").classList.add("d-none")
            }
            document.getElementById("sidebarEmail").innerHTML = window.localStorage.getItem("email")

            const dates = window.localStorage.getItem("dates").split(",")
            dates.forEach((date) => {
                const option = document.createElement("option")
                option.value = date
                option.innerHTML = date
                if (date == window.localStorage.getItem("currentDate")) {
                    option.selected = true
                }
                document.getElementById("dateSelect").appendChild(option)

            })
            document.getElementById("dateSelect").addEventListener("change", function () {
                console.log("oi")
                const elements1 = document.getElementsByClassName("submission")
                const elements2 = document.getElementsByClassName(document.getElementById("dateSelect").value)
                for (let i = 0; i < elements1.length; i++) {
                    elements1[i].classList.add("d-none");
                }
                for (let i = 0; i < elements2.length; i++) {
                    elements2[i].classList.remove("d-none");
                }
            })




            if (response.data.length === 0) {
                document.getElementById("tableBody").innerHTML = "<tr><td colspan='4'>Nenhuma submissão encontrado.</td></tr>";
                return;
            } else {
                response.data.forEach((submission, index) => {

                    let state = submission.state
                    if (submission.state == "submitted") {
                        state = "Submetida"
                    } else if (submission.state == "selected") {
                        state = "Selecionada"
                    }

                    const tr = document.createElement("tr")
                    tr.classList.add("highlightable")
                    tr.innerHTML = `<th scope="row" data-bs-toggle="modal" id="${index}title" data-bs-target="#viewModal"> ${submission.title}</th>
                        <th data-bs-toggle="modal" data-bs-target="#viewModal" id="${index}author"> ${submission.author}</td>
                        <td data-bs-toggle="modal" data-bs-target="#viewModal" id="${index}state">${state}</td>
                        <td><button type="button" class="btn btn-outline-light d-inline-block"
                            style="background-color: #176131;" id ="${index}edit" data-bs-toggle="modal" data-bs-target="#editModal"><i class="bi bi-pencil" ></i><span class="desktop">Editar</span></button></td>
                        `

                    document.getElementById("tableBody").appendChild(tr)

                    tr.classList.add(submission.date)
                    tr.classList.add("submission")

                    document.getElementById(index + "title").addEventListener("click", function () {
                        feedModal(submission)
                    })
                    document.getElementById(index + "author").addEventListener("click", function () {
                        feedModal(submission)
                    })
                    document.getElementById(index + "state").addEventListener("click", function () {
                        feedModal(submission)
                    })
                    document.getElementById(index + "edit").addEventListener("click", function () {
                        feedEditModal(submission)
                    })


                })
            }
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                tokenController(loadSubmissions);
            }
            console.error(error);
            alert("Erro ao receber dados. Tente novamente mais tarde.")
        })

}



function feedModal(submission) {
    document.getElementById("title").innerHTML = submission.title
    document.getElementById("author").innerHTML = submission.author
    document.getElementById("submission").innerHTML = submission.submitter.email
    document.getElementById("downloader").innerHTML = `
    <img src="assets/file-earmark.svg" alt="file image" id="currentFile" height="148px" class= 'highlightable'>`
    document.getElementById("currentFile").addEventListener("click", function () {
        let sub = submission
        axios.get("https://ajudaris-api.onrender.com/submissions/documents/" + submission._id, {
            headers: {
                Authorization: "Bearer " + window.sessionStorage.getItem("token")
            }
        })
            .then((response) => {
                downloadFile(response, "documents", sub)
            })
    });
    document.getElementById("downloader2").innerHTML = `
    <img src="assets/file-earmark.svg" alt="file image" id="currentFile" height="148px" class= 'highlightable'>`

    document.getElementById("viewFooter").innerHTML = ""

    const b1 = document.createElement("div")
    b1.style.width = "36%"
    b1.innerHTML = `<button type="button" class="btn btn-primary" style="width:100% ;background-color: #88AA31; border: 0px;" data-bs-toggle="modal" data-bs-target="#editModal">Editar</button>`

    if (submission.illustrated) {
        decodeImage(submission).then((resp) => {
            const src = resp[0]
            if (src) {
                document.getElementById("downloader2").innerHTML = `
                    <img src="${src}" alt="image" id="currentImage" width="100%" class="highlightable">`;
            } else {
                document.getElementById("downloader2").innerHTML = `<img src="assets/file-image.svg" alt="image" id="currentImage" height="148px" class="highlightable">`;
            }
            document.getElementById("currentImage").addEventListener("click", () => downloadFile(resp[1], "images", submission));
        });
        document.getElementById("illustrator").innerHTML = "Submissão de imagem por: " + submission.illustrator.email

        b1.innerHTML = `<button type="button" class="btn btn-primary" style="width:100% ;background-color: #88AA31; border: 0px;" data-bs-toggle="modal" data-bs-target="#editModal">Editar</button>`

    } else {
        b1.innerHTML = `<button type="button" class="btn btn-primary" style="width:100% ;background-color: #88AA31; border: 0px;" data-bs-toggle="modal" data-bs-target="#editModal">Adicionar</button>`


        document.getElementById("downloader2").innerHTML = `<h6>Esta submissão ainda não foi ilustrada</h6>`
        document.getElementById("illustrator").innerHTML = ""
    }


    b1.addEventListener("click", function () {
        feedEditModal(submission)
    })



    document.getElementById("viewFooter").appendChild(b1)



}

function downloadFile(resp, type, submission) {
    // Decode the Base64 string and trigger the download
    const base64String = resp.data;
    const byteCharacters = atob(base64String); // Decode Base64 to binary string
    const byteNumbers = new Array(byteCharacters.length);

    // Convert binary string to byte array
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob from the byte array
    let blob
    if (type == "documents") {
        blob = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    } else if (type == "images") {
        blob = new Blob([byteArray], { type: "image/*" });
    }

    // Create a download link and trigger the download
    let extension = ".docx"
    if (type == "documents") {
        extension = "docx"
    } else if (type == "images") {
        extension = "jpg"
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${submission.title}.${extension}`; // Set the file name
    link.click();

    // Clean up the URL object
    URL.revokeObjectURL(link.href);

}

function decodeImage(submission) {
    return axios
        .get("https://ajudaris-api.onrender.com/submissions/images/" + submission._id, {
            headers: {
                Authorization: "Bearer " + window.sessionStorage.getItem("token"),
            },
        })
        .then((response) => {
            // Decode the Base64 string
            const base64String = response.data;

            // Create a data URL for the image
            const src = `data:image/*;base64,${base64String}`;

            return [src, response]; // Return the data URL
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                tokenController(decodeImage, submission);
            }
            console.error("Error decoding image:", error);
            return null; // Return null if there's an error
        });
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve(reader.result.replace(/^.*,/, ''));
        };
        reader.onerror = error => reject(error);
    });
}

function feedEditModal(submission) {


    if (submission.illustrated) {
        document.getElementById("Editimage").src = "assets/file-refresh.svg"
    } else {
        document.getElementById("Editimage").src = "assets/upload.svg"
    }


    document.getElementById("editFooter").innerHTML = ""
    const b1 = document.createElement("div")
    b1.style.width = "32%"
    b1.innerHTML = `<button type="button" class="btn btn-danger" style="width: 100%; border: 0px;" ">Eliminar ilustração</button>`
    b1.addEventListener("click", function () {

        if (confirm("Tem certeza que deseja eliminar esta submissão?")) {
            submissionVerifier(submission, "delete")
        }
    }
    )

    const b2 = document.createElement("div")
    b2.style.width = "36%"
    b2.innerHTML = `<button type="button" class="btn btn-primary" style="width:100% ;background-color: #88AA31; border: 0px;">Editar</button>`
    b2.addEventListener("click", function () {
        submissionVerifier(submission, "edit")
    })

    document.getElementById("editFooter").appendChild(b1)
    document.getElementById("editFooter").appendChild(b2)

}

function submissionVerifier(submission, request) {
    if (request == "edit") {
        const file = document.getElementById("edit-input").files[0]
        if (!file) {
            alert("Por favor, selecione um arquivo para enviar.")
            return;
        } else {
            getBase64(file).then(
                data => {
                    const editedSubmission = {
                        illustrated: true,
                        illustration: data,
                    }
                    editSubmission(submission, editedSubmission)
                })
        }
    } else {
        const editedSubmission = {
            illustrated: false,
            illustration: "none",
        }
        editSubmission(submission, editedSubmission)
    }

}

function editSubmission(submission, editedSubmission) {
    axios.put("https://ajudaris-api.onrender.com/submissions/illustrations/" + submission._id, editedSubmission, {
        headers: {
            Authorization: "Bearer " + window.sessionStorage.getItem("token")
        }
    })
        .then((response) => {

            console.log(response.data)
            alert("Submissão alterada com sucesso!")
            window.location.reload()
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                tokenController(editSubmission, submission, editedSubmission)
            }
            console.error(error);
            alert("Erro ao enviar submissão. Tente novamente mais tarde.")
        })
}

document.getElementById("verifyButton").addEventListener("click", function () {
    axios.post("https://ajudaris-api.onrender.com/users/send-otp", { email: window.localStorage.getItem("email"), use: "verification" })
        .then((response) => {
            console.log(response)
            alert("Verifique a sua caixa de endereço eletrónico para verificar a sua conta (certifique-se que o email não está na caixa de spam)")
            $('#verificationModal').modal('show');

        })
        .catch((error) => {
            if (error.response.data == "OTP already sent.") {
                console.error(error);
                alert("Erro:Código OTP já enviado.")
                $('#verificationModal').modal('show');

            } else {
                console.error(error);
                alert("Erro a verificar conta")
            }
        })

})

function verifyAccount() {
    axios.put("https://ajudaris-api.onrender.com/users/email-verification", { email: window.localStorage.getItem("email"), otp: document.getElementById("verifyOTP").value }, {
        headers: {
                    Authorization: "Bearer " + window.sessionStorage.getItem("token")
                }
    })
        .then((response) => {
            console.log(response)
            alert("Conta verificada com sucesso!")
            window.localStorage.setItem("verified", "true")
            document.getElementById("addButton").disabled = false
            document.getElementById("verifyButton").classList.add("d-none")
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                tokenController(verifyAccount)
            }
            console.error(error);
            alert("Erro a verificar conta")
        })
}

window.loadSubmissions = loadSubmissions;
window.editSubmission = editSubmission;
window.verifyAccount = verifyAccount;