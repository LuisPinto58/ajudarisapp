import { tokenController , logOut} from './tokenController.js';

document.getElementById("logOut").addEventListener("click", () => {
    logOut()
})

function loadSubmissions() {
    axios.get("https://ajudaris-api.onrender.com/submissions/" + window.localStorage.getItem("id"), {
        headers: {
            Authorization: "Bearer " + window.sessionStorage.getItem("token")
        }
    })
        .then((response) => {
            document.getElementById("sidebarEmail").innerHTML = window.localStorage.getItem("email")

            if (window.localStorage.getItem("verified") == "false") {
                document.getElementById("addButton").disabled = true
            } else {
                document.getElementById("verifyButton").classList.add("d-none")
            }
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
                        <td class="desktop"><button class="btn btn-danger" type="button" id ="${index}del" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bi bi-trash"></i><span class="desktop">Eliminar</span></button></td>`

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
                    document.getElementById(index + "del").addEventListener("click", function () {
                        if (confirm("Tem certeza que deseja eliminar este utilizador?")) {
                            axios.delete("https://ajudaris-api.onrender.com/submissions/" + submission._id, {
                                headers: {
                                    Authorization: "Bearer " + window.sessionStorage.getItem("token")
                                }
                            })
                        }
                    })


                })
            }
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                tokenController(loadSubmissions)
            }else{
            console.error(error);
            alert("Erro ao receber dados. Tente novamente mais tarde.")}
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
            if (error.response && error.response.status === 401) {
                tokenController(loadSubmissions)
            }else{
            if (error.response.data == "OTP already sent.") {
                console.error(error);
                alert("Código OTP já enviado.")
                $('#verificationModal').modal('show');

            } else {
                console.error(error);
                alert("Erro a verificar conta")
            }
        }})

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
            }else{
            console.error(error);
            alert("Erro a verificar conta")
}})
}

function feedModal(submission) {
    document.getElementById("title").innerHTML = submission.title
    document.getElementById("author").innerHTML = submission.author
    document.getElementById("submission").innerHTML = submission.submitter.email
    document.getElementById("downloader").innerHTML = `
    <img src="assets/file-earmark.svg" alt="file image" id="currentFile" height="148px" class= 'highlightable'>`
    document.getElementById("currentFile").addEventListener("click", function () {
        axios.get("https://ajudaris-api.onrender.com/submissions/documents/" + submission._id, {
            headers: {
                Authorization: "Bearer " + window.sessionStorage.getItem("token")
            }
        })
            .then((response) => {
                // Decode the Base64 string and trigger the download
                const base64String = response.data;
                const byteCharacters = atob(base64String); // Decode Base64 to binary string
                const byteNumbers = new Array(byteCharacters.length);

                // Convert binary string to byte array
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);

                // Create a Blob from the byte array
                const blob = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

                // Create a download link and trigger the download
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = `${submission.title}.docx`; // Set the file name
                link.click();

                // Clean up the URL object
                URL.revokeObjectURL(link.href);
            })
    });

    document.getElementById("viewFooter").innerHTML = ""
    const b1 = document.createElement("div")
    b1.style.width = "24%"
    b1.innerHTML = `
    <button type="submit" class="btn btn-danger" style="width: 100%; border: 0px;" >Eliminar</button>`
    b1.addEventListener("click", function () {

        if (confirm("Tem certeza que deseja eliminar esta submissão?")) {

            axios.delete("https://ajudaris-api.onrender.com/submissions/" + submission._id, {
                headers: {
                    Authorization: "Bearer " + window.sessionStorage.getItem("token")
                }
            }
            ).then(() => {
                window.location.reload()
            })
        }
    }
    )

    const b2 = document.createElement("div")
    b2.style.width = "36%"
    b2.innerHTML = `<button type="button" class="btn btn-primary" style="width:100% ;background-color: #88AA31; border: 0px;" data-bs-toggle="modal" data-bs-target="#editModal">Editar</button>`
    b2.addEventListener("click", function () {
        feedEditModal(submission)
    })



    document.getElementById("viewFooter").appendChild(b1)
    document.getElementById("viewFooter").appendChild(b2)



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

function addSubmission() {
    const file = document.getElementById("file-input").files[0]
    if (!file) {
        alert("Por favor, selecione um ficheiro.");
        return;
    } else {
        getBase64(file).then(
            data => {
                const submission = {
                    title: document.getElementById("TitleInput").value,
                    author: document.getElementById("AuthorInput").value,
                    document: data,
                    submitter: window.localStorage.getItem("id"),
                }
                axios.post("https://ajudaris-api.onrender.com/submissions", submission, {
                    headers: {
                        Authorization: "Bearer " + window.sessionStorage.getItem("token")
                    }
                })
                    .then((response) => {
                        alert("Submissão enviada com sucesso!")
                        window.location.reload()
                    })
                    .catch((error) => {
                        if (error.response && error.response.status === 401) {
                            tokenController(addSubmission)
                        }else{
                        console.error(error);
                        alert("Erro ao enviar submissão. Tente novamente mais tarde.")
                    }})
            })
    }
}

function feedEditModal(submission) {
    document.getElementById("InputNewTitle").value = submission.title
    document.getElementById("InputNewAuthor").value = submission.author

    document.getElementById("editFooter").innerHTML = ""
    const b1 = document.createElement("div")
    b1.style.width = "24%"
    b1.innerHTML = `<button type="button" class="btn btn-danger" style="width: 100%; border: 0px;" ">Eliminar</button>`
    b1.addEventListener("click", function () {

        if (confirm("Tem certeza que deseja eliminar esta submissão?")) {

            axios.delete("https://ajudaris-api.onrender.com/submissions/" + submission._id, {
                headers: {
                    Authorization: "Bearer " + window.sessionStorage.getItem("token")
                }
            }
            ).then(() => {
                window.location.reload()
            })
        }
    }
    )

    const b2 = document.createElement("div")
    b2.style.width = "36%"
    b2.innerHTML = `<button type="button" class="btn btn-primary" style="width:100% ;background-color: #88AA31; border: 0px;">Editar</button>`
    b2.addEventListener("click", function () {
        submissionVerifier(submission)
    })

    document.getElementById("editFooter").appendChild(b1)
    document.getElementById("editFooter").appendChild(b2)

}

function submissionVerifier(submission) {
    const file = document.getElementById("edit-input").files[0]
    if (!file) {
        const editedSubmission = {
            title: document.getElementById("InputNewTitle").value,
            author: document.getElementById("InputNewAuthor").value,
        }
        editSubmission(submission, editedSubmission)

    } else {
        getBase64(file).then(
            data => {
                const editedSubmission = {
                    title: document.getElementById("InputNewTitle").value,
                    author: document.getElementById("InputNewAuthor").value,
                    document: data,
                }
                editSubmission(submission, editedSubmission)
            })
    }
}

function editSubmission(submission, editedSubmission) {
    axios.put("https://ajudaris-api.onrender.com/submissions/institutions/" + submission._id, editedSubmission, {
        headers: {
            Authorization: "Bearer " + window.sessionStorage.getItem("token")
        }
    })
        .then((response) => {
            console.log(response.data)
            alert("Submissão alterada com sucesso!")
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                tokenController(editSubmission, submission, editedSubmission)
            }else{
            console.error(error);
            alert("Erro ao enviar submissão. Tente novamente mais tarde.")
}})
}


window.loadSubmissions = loadSubmissions
window.addSubmission = addSubmission;
window.verifyAccount = verifyAccount;

