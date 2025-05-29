import { tokenController, logOut } from './tokenController.js';

document.getElementById("logOut").addEventListener("click", () => {
    logOut()
})
const role = window.localStorage.getItem("role")
let markers = []
let ratings = []
let illustrators = []
let illustratorFlag = false
let year
const districts = ["Aveiro", "Beja", "Braga", "Bragança", "Castelo Branco", "Coimbra", "Évora", "Faro", "Guarda", "Leiria", "Lisboa", "Portalegre", "Porto", "Santarém", "Setúbal", "Viana do Castelo", "Vila Real", "Viseu"]
let flag = false


if (window.localStorage.getItem("currentDate") == null) {
    year = new Date().getFullYear()
    window.localStorage.setItem("currentDate", year)
} else {
    year = window.localStorage.getItem("currentDate")
}


document.getElementById("body").addEventListener("load", loadSubmissions(year))

function loadSubmissions(year) {


    let urlExtension = ""
    let userExtension = ""
    document.getElementById("sidebarEmail").innerHTML = window.localStorage.getItem("email")


    switch (role) {
        case "jury":
            document.getElementById("sortSelect").value = "recente"
            urlExtension = "submissions?year="
            userExtension = window.localStorage.getItem("email")
            document.getElementById("hideoption1").classList.add("d-none")
            document.getElementById("hideoption2").classList.add("d-none")
            document.getElementById("hideoption3").classList.add("d-none")
            document.getElementById("hideoption4").classList.add("d-none")
            break;

        case "designer":
            document.getElementById("sortSelect").value = "antigo"
            urlExtension = "winners?year="
            userExtension = window.localStorage.getItem("email")
            document.getElementById("hideoption1").classList.add("d-none")
            document.getElementById("hideoption2").classList.add("d-none")
            document.getElementById("hideoption5").classList.add("d-none")
            document.getElementById("hideoption6").classList.add("d-none")
            document.getElementById("hideoption7").classList.add("d-none")
            break;

        case "revisor":
            document.getElementById("sortSelect").value = "recente"
            urlExtension = "submissions?year="
            userExtension = ""
            break;

        default:
            break;
    }



    axios.get("https://ajudaris-api.onrender.com/submissions/" + urlExtension + year, {
        headers: {
            Authorization: "Bearer " + window.sessionStorage.getItem("token")
        }
    })
        .then((response) => {
            console.log(response)

            const dates = window.localStorage.getItem("dates").split(",")
            document.getElementById("dateSelect").innerHTML = ""

            dates.forEach((date) => {
                const option = document.createElement("option")
                option.value = date
                option.innerHTML = date

                if (date == year) {
                    option.selected = true
                }
                document.getElementById("dateSelect").appendChild(option)

            })
            if (flag == false) {
                flag = true
                document.getElementById("dateSelect").addEventListener("change", function () {

                    loadSubmissions(document.getElementById("dateSelect").value)

                })
            }

            document.getElementById("tableBody").innerHTML = ""
            if (response.data.length === 0) {
                document.getElementById("tableBody").innerHTML = "<tr><td colspan='4'>Nenhuma submissão encontrado.</td></tr>";
                return;
            } else {
                let submissions = response.data
                axios.get("https://ajudaris-api.onrender.com/users/" + userExtension, {
                    headers: {
                        Authorization: "Bearer " + window.sessionStorage.getItem("token")
                    }
                }).then((response) => {


                    submissions.forEach((submission, index) => {
                        const tr = document.createElement("tr")
                        tr.classList.add(index)
                        tr.classList.add("highlightable")

                        let state = submission.state
                        if (submission.state == "submitted") {
                            state = "Submetida"
                        } else if (submission.state == "selected") {
                            state = "Selecionada"
                        }

                        switch (role) {
                            case "jury":
                                markers = response.data.markers
                                ratings = response.data.ratings

                                tr.innerHTML = `<th scope="row" data-bs-toggle="modal" id="${index}title" data-bs-target="#viewModal"> ${submission.title}</th>
                                <th data-bs-toggle="modal" data-bs-target="#viewModal" id="${index}author"> ${submission.author}</td>
                                <th data-bs-toggle="modal" data-bs-target="#viewModal" id="${index}place" > ${submission.submitter.district}</td>
                                <td data-bs-toggle="modal" data-bs-target="#viewModal" id="${index}state">${state}</td>
                                <td class="desktop"><button class="btn btn-warning" type="button" onclick="markSubmission('${submission._id}')"><i
                                        class="bi bi-bookmark" id="mark${submission._id}"></i><span class="desktop">Marcador</span></button></td>
                                <td><input type="number" class="form-control" id="${submission._id}rating" placeholder="0-5" max="5" ></td>
                                `
                                document.getElementById("ratingHeader").classList.remove("d-none")

                                document.getElementById("tableBody").appendChild(tr)

                                break;

                            case "revisor":

                                tr.innerHTML = `<th scope="row" data-bs-toggle="modal" id="${index}title" data-bs-target="#viewModal">${submission.title}</th>
                                <th data-bs-toggle="modal" data-bs-target="#viewModal" id="${index}author" > ${submission.author}</td>
                                <th data-bs-toggle="modal" data-bs-target="#viewModal" id="${index}place" > ${submission.submitter.district}</td>
                                <td data-bs-toggle="modal" data-bs-target="#viewModal" id="${index}state" >${state}</td>
                                <td data-bs-toggle="modal" class="desktop" data-bs-target="#viewModal" id="${index}rating" >${submission.rating}</td>

                                <td class="desktop"><button class="btn btn-warning" type="button" onclick="markSubmission('${submission._id}')"><i
                                    class="bi bi-bookmark" id="mark${submission._id}"></i><span class="desktop">Marcador</span></button></td>
                                <td>
                                <button type="button" class="btn btn-outline-light d-inline-block" style="background-color: #176131;"
                                    onclick="" data-bs-toggle="modal" data-bs-target="#editModal" id ="${index}edit"><i class="bi bi-pencil"></i><span
                                    class="desktop">Editar</span></button>
                                </td>
                                <td class="desktop"><button class="btn btn-danger" type="button" onclick="" data-bs-toggle="modal"
                                    data-bs-target="#deleteModal" id ="${index}del" ><i class="bi bi-trash"></i><span
                                    class="desktop">Eliminar</span></button>
                                </td>
                                `
                                document.getElementById("ratingHeader").classList.remove("d-none")
                                document.getElementById("revisorHeader").classList.add("d-none")


                                if (illustratorFlag == false) {
                                    illustratorFlag = true
                                    response.data.forEach((user) => {
                                        if (user.role == "illustrator") {
                                            illustrators.push(user)
                                        } else if (user._id == window.localStorage.getItem("id") && user.markers != null) {
                                            markers = user.markers
                                        }
                                    })
                                }

                                document.getElementById("tableBody").appendChild(tr)

                                document.getElementById(index + "edit").addEventListener("click", function () {
                                    feedEditModal(submission)
                                })


                                break;

                            case "designer":

                                markers = response.data.markers

                                tr.innerHTML = `<th scope="row" data-bs-toggle="modal" id="${index}title" data-bs-target="#viewModal"> ${submission.title}</th>
                                <th data-bs-toggle="modal" data-bs-target="#viewModal" id="${index}author"> ${submission.author}</td>
                                <th data-bs-toggle="modal" data-bs-target="#viewModal" id="${index}place" > ${submission.submitter.district}</td>
                                <td data-bs-toggle="modal" data-bs-target="#viewModal" id="${index}state">${state}</td>
                                <td class="desktop"><button class="btn btn-warning" type="button" onclick="markSubmission('${submission._id}')"><i
                                        class="bi bi-bookmark" id="mark${submission._id}"></i><span class="desktop">Marcador</span></button></td>
                                `


                                document.getElementById("tableBody").appendChild(tr)
                                break;

                            default:
                                break;
                        }




                        if (markers.includes(submission._id)) {
                            tr.classList.add("marked")
                            document.getElementById("mark" + submission._id).classList.remove("bi-bookmark");
                            document.getElementById("mark" + submission._id).classList.add("bi-bookmark-fill");
                        }

                        if (ratings[0] != null && role == "jury") {
                            if (ratings.some(e => e.submissionId == submission._id)) {
                                document.getElementById(submission._id + "rating").value = ratings[ratings.findIndex(e => e.submissionId == submission._id)].rating
                                tr.classList.add("rated")
                            } else {
                                tr.classList.add("unrated")
                            }
                        } else if (role != "jury") {
                            submission.rating > 0 ? tr.classList.add("rated") : tr.classList.add("unrated")
                        }

                        tr.classList.add(submission.date)
                        if (districts.includes(submission.submitter.district)) {
                                tr.classList.add(submission.submitter.district)
                            } else{
                                tr.classList.add("otherDistrict")
                            }
                        tr.classList.add("submission")
                        tr.setAttribute("id", "submission" + submission._id)
                        tr.classList.add(submission.state)

                        if (submission.illustrated) {
                            tr.classList.add("illustrated")
                        } else {
                            tr.classList.add("nonIllustrated")
                        }

                        document.getElementById(index + "title").addEventListener("click", function () {
                            feedModal(submission)
                        })
                        document.getElementById(index + "author").addEventListener("click", function () {
                            feedModal(submission)
                        })
                        document.getElementById(index + "state").addEventListener("click", function () {
                            feedModal(submission)
                        })
                        if (role == "jury") {
                            let timeout = null
                            document.getElementById(submission._id + "rating").addEventListener("keyup", function () {

                                clearTimeout(timeout);

                                timeout = setTimeout(function () {
                                    submitRating(submission._id)
                                }, 1000);
                            })
                        }

                    })
                }).catch((error) => {
                    if (error.response && error.response.status === 401) {
                        tokenController(loadSubmissions, year)
                    } else {
                        console.log(error)
                        alert("Erro a receber avaliações e marcadores")
                    }
                })
            }

        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                tokenController(loadSubmissions, year)
            } else {
                console.error(error);
                alert("Erro ao receber dados. Tente novamente mais tarde.")
            }
        })

}


function changeCategory(category, location) {
    // Hide all submissions
    const elements = document.getElementsByClassName("submission");
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.add("d-none");
    }

    //Changes the type of request after searching by user
    if (year == "") {
        year = window.localStorage.getItem("currentDate")
        urlExtension = "submissions?year="
        document.getElementById("writtingSelect").children[6].remove()

        loadSubmissions(year)
    }

    // Show only those that match BOTH category and location
    for (let i = 0; i < elements.length; i++) {
        if (
            elements[i].classList.contains(category) &&
            elements[i].classList.contains(location)
        ) {
            elements[i].classList.remove("d-none");
        }
    }
}

function submitRating(subId) {
    const rating = document.getElementById(subId + "rating").value

    if (rating > 5 || rating < 0) {
        alert("Avaliação fora dos limites.")
        document.getElementById(subId + "rating").value = ""
        document.getElementById(subId + "ratingModal").value = ""

    } else {

        axios.patch("https://ajudaris-api.onrender.com/users/ratings/" + window.localStorage.getItem("email"), {
            id: subId,
            rating: rating,
        }, {
            headers: {
                Authorization: "Bearer " + window.sessionStorage.getItem("token")
            }
        }).then((response) => {
            console.log(response)
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                tokenController(submitRating, subId)
            } else {
                alert("Erro a submeter avaliação")
                console.log(error)
            }
        })
    }
}


function markSubmission(id) {
    if (document.getElementById("mark" + id).classList.contains('bi-bookmark-fill')) {

        markers = markers.filter(marker => marker !== id)

        axios.patch("https://ajudaris-api.onrender.com/users/markers/" + window.localStorage.getItem("email"), {
            markers: markers
        }, {
            headers: {
                Authorization: "Bearer " + window.sessionStorage.getItem("token")
            }
        }).then((response) => {
            console.log(response)
            document.getElementById("mark" + id).classList.remove("bi-bookmark-fill");
            document.getElementById("mark" + id).classList.add("bi-bookmark");
            if (document.getElementById("modalFav") != null) {
                document.getElementById("modalFav").innerHTML = `<i class="bi bi-bookmark"></i>Marcador`
            }
            document.getElementById("submission" + id).classList.remove("marked");
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                tokenController(markSubmission, id)
            } else {
                console.error(error);
                alert("Erro a colocar marcador")
            }
        })

    } else {
        markers.push(id)

        axios.patch("https://ajudaris-api.onrender.com/users/markers/" + window.localStorage.getItem("email"), {
            markers: markers
        }, {
            headers: {
                Authorization: "Bearer " + window.sessionStorage.getItem("token")
            }
        }).then((response) => {
            console.log(response)
            document.getElementById("mark" + id).classList.remove("bi-bookmark");
            document.getElementById("mark" + id).classList.add("bi-bookmark-fill");
            if (document.getElementById("modalFav") != null) {
                document.getElementById("modalFav").innerHTML = `<i class="bi bi-bookmark-fill"></i>Marcador`
            }
            document.getElementById("submission" + id).classList.add("marked");
            markers.push(id)
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                tokenController(markSubmission, id)
            } else {
                console.error(error);
                alert("Erro a colocar marcador")
            }
        })
    }
}



function feedModal(submission) {
    document.getElementById("title").innerHTML = submission.title
    document.getElementById("author").innerHTML = submission.author
    document.getElementById("local").innerHTML = submission.submitter.district + "(" + submission.submitter.city + ")"
    document.getElementById("submission").innerHTML = submission.submitter.email
    document.getElementById("downloader").innerHTML = `
    <img src="assets/file-earmark.svg" alt="file image" id="currentFile" height="148px" class= 'highlightable'>`
    document.getElementById("currentFile").addEventListener("click", function () {
        let sub = submission
        axios.get("https://ajudaris-api.onrender.com/submissions/documents/" + submission._id, {
            headers: {
                Authorization: "Bearer " + window.sessionStorage.getItem("token")
            }
        }).then((response) => {
            downloadFile(response, "documents", sub)
        })
    });
    document.getElementById("viewFooter").innerHTML = ""



    if (role != "jury") {

        document.getElementById("downloader2").innerHTML = `
    <img src="assets/file-earmark.svg" alt="file image" id="currentFile" height="148px" class= 'highlightable'>`



        if (submission.illustrated) {


            document.getElementById("imageHider").classList.remove("d-none")


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


        } else {
            document.getElementById("downloader2").innerHTML = `<h6>Esta submissão ainda não foi ilustrada</h6>`
            document.getElementById("illustrator").innerHTML = ""
        }

        if (role == "revisor") {
            const b1 = document.createElement("div")
            b1.style.width = "36%"

            b1.innerHTML = `<button type="button" class="btn btn-primary" style="width:100% ;background-color: #88AA31; border: 0px;" data-bs-toggle="modal" data-bs-target="#editModal">Editar</button>`


            b1.addEventListener("click", function () {
                feedEditModal(submission)
            })

            document.getElementById("viewFooter").appendChild(b1)
        }
    } else {

        if (markers.includes(submission._id)) {
            document.getElementById("viewFooter").innerHTML = `
            <label for="${submission._id}ratingModal">Avaliação</label>
            <input type="number" class="form-control" id="${submission._id}ratingModal" placeholder="0-5" max="5" style="width: 45%;">
        <button type="button" class="btn btn-warning" style="width: 35%; border: 0px;"
            onclick="markSubmission('${submission._id}')" id="modalFav"><i class="bi bi-bookmark-fill"></i>Marcador</button>
          `
        } else {
            document.getElementById("viewFooter").innerHTML = `
            <label for="${submission._id}ratingModal">Avaliação</label>
            <input type="number" class="form-control" id="${submission._id}ratingModal" placeholder="0-5" max="5" style="width: 45%;">
        <button type="button" class="btn btn-warning" style="width: 35%; border: 0px;"
            onclick="markSubmission('${submission._id}')" id="modalFav"><i class="bi bi-bookmark"></i>Marcador</button>
          `
        }
        document.getElementById(`${submission._id}ratingModal`).value = document.getElementById(`${submission._id}rating`).value

        let timeout = null
        document.getElementById(`${submission._id}ratingModal`).addEventListener("keyup", () => {
            clearTimeout(timeout);

            timeout = setTimeout(function () {
                document.getElementById(`${submission._id}rating`).value = document.getElementById(`${submission._id}ratingModal`).value
                submitRating(submission._id)
            }, 1000);
        })



    }



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
    let extension = "docx"
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
                tokenController(decodeImage, submission)
            } else {
                console.error("Error decoding image:", error);
                return null;
            } // Return null if there's an error
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


    document.getElementById("InputNewTitle").value = submission.title
    document.getElementById("InputNewAuthor").value = submission.author
    document.getElementById("InputNewState").value = submission.state

    if (submission.illustrator == null) {
        document.getElementById("illustratorSelect").innerHTML = `
            <select class="form-select choices-single" id="InputNewIllustrator">
                <option value=""></option>
            </select>
            `
    } else {
        document.getElementById("illustratorSelect").innerHTML = `
            <select class="form-select choices-single" id="InputNewIllustrator">
                
            </select>
            `
    }


    illustrators.forEach((user) => {
        const option = document.createElement("option")
        option.value = user._id
        option.innerHTML = user.email
        if (submission.illustrator != null) {
            if (user._id == submission.illustrator._id) {
                option.selected = true
                document.getElementById("InputNewIllustrator").setAttribute("placeholder", user.email)
            }
        }

        document.getElementById("InputNewIllustrator").appendChild(option)
    })

    new Choices(document.querySelector(".choices-single"))



    document.getElementById("editFooter").innerHTML = ""
    const b1 = document.createElement("div")
    b1.style.width = "24%"
    b1.innerHTML = `<button type="button" class="btn btn-danger" style="width: 100%; border: 0px;" data-bs-toggle="modal">Eliminar</button>`
    b1.addEventListener("click", function () {
        if (confirm("Tem certeza que deseja eliminar este utilizador?")) {

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
    const file = document.getElementById("file-input").files[0]
    const image = document.getElementById("image-input").files[0]

    if (document.getElementById("InputNewIllustrator").value == "") {
        if (!file && !image) {
            const editedSubmission = {
                title: document.getElementById("InputNewTitle").value,
                author: document.getElementById("InputNewAuthor").value,
                state: document.getElementById("InputNewState").value
            }
            editSubmission(submission, editedSubmission)

        } else if (file && !image) {
            getBase64(file).then(
                data => {
                    const editedSubmission = {
                        title: document.getElementById("InputNewTitle").value,
                        author: document.getElementById("InputNewAuthor").value,
                        state: document.getElementById("InputNewState").value,
                        document: data
                    }
                    editSubmission(submission, editedSubmission)
                })
        } else if (!file && image) {
            getBase64(image).then(
                data => {
                    const editedSubmission = {
                        title: document.getElementById("InputNewTitle").value,
                        author: document.getElementById("InputNewAuthor").value,
                        state: document.getElementById("InputNewState").value,
                        document: data,
                        illustrated: true,
                        illustration: data
                    }
                    editSubmission(submission, editedSubmission)
                })
        } else if (file && image) {
            getBase64(file).then(
                data => {
                    getBase64(image).then((
                        data2 => {
                            const editedSubmission = {
                                title: document.getElementById("InputNewTitle").value,
                                author: document.getElementById("InputNewAuthor").value,
                                state: document.getElementById("InputNewState").value,
                                document: data,
                                illustrated: true,
                                illustration: data2
                            }
                            editSubmission(submission, editedSubmission)
                        })
                    )
                })
        }
    } else {
        if (!file && !image) {
            const editedSubmission = {
                title: document.getElementById("InputNewTitle").value,
                author: document.getElementById("InputNewAuthor").value,
                state: document.getElementById("InputNewState").value,
                illustrator: document.getElementById("InputNewIllustrator").value,
            }
            editSubmission(submission, editedSubmission)

        } else if (file && !image) {
            getBase64(file).then(
                data => {
                    const editedSubmission = {
                        title: document.getElementById("InputNewTitle").value,
                        author: document.getElementById("InputNewAuthor").value,
                        state: document.getElementById("InputNewState").value,
                        document: data,
                        illustrator: document.getElementById("InputNewIllustrator").value,
                    }
                    editSubmission(submission, editedSubmission)
                })
        } else if (!file && image) {
            getBase64(image).then(
                data => {
                    const editedSubmission = {
                        title: document.getElementById("InputNewTitle").value,
                        author: document.getElementById("InputNewAuthor").value,
                        state: document.getElementById("InputNewState").value,
                        document: data,
                        illustrated: true,
                        illustration: data,
                        illustrator: document.getElementById("InputNewIllustrator").value,
                    }
                    editSubmission(submission, editedSubmission)
                })
        } else if (file && image) {
            getBase64(file).then(
                data => {
                    getBase64(image).then((
                        data2 => {
                            const editedSubmission = {
                                title: document.getElementById("InputNewTitle").value,
                                author: document.getElementById("InputNewAuthor").value,
                                state: document.getElementById("InputNewState").value,
                                document: data,
                                illustrated: true,
                                illustration: data2,
                                illustrator: document.getElementById("InputNewIllustrator").value,
                            }
                            editSubmission(submission, editedSubmission)
                        })
                    )
                })
        }
    }

}

function editSubmission(submission, editedSubmission) {
    console.log(editedSubmission)
    axios.put("https://ajudaris-api.onrender.com/submissions/" + submission._id, editedSubmission, {
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
                tokenController(submissionVerifier, submission)
            } else {
                console.error(error);
                alert("Erro ao enviar submissão. Tente novamente mais tarde.")
            }
        })
}


function sort(type) {
    const tableBody = document.getElementById("tableBody");
    const rows = Array.from(tableBody.children);

    if (type === "recente") {
        // Sort by most recent year (descending)
        rows.sort((a, b) => {
            const indexA = parseInt(a.classList[0]);
            const indexB = parseInt(b.classList[0]);
            return indexB - indexA;
        });
    } else if (type === "antigo") {
        // Sort by oldest year (ascending)
        rows.sort((a, b) => {
            const indexA = parseInt(a.classList[0]);
            const indexB = parseInt(b.classList[0]);
            return indexA - indexB;
        });
    } else if (type === "avaliacao") {
        // Sort by rating descending
        if (role == "jury") {
            rows.sort((a, b) => {
                const ratingA = parseFloat(a.children[4].children[0].value) || 0;
                const ratingB = parseFloat(b.children[4].children[0].value) || 0;
                return ratingB - ratingA;
            })
        }else {
            rows.sort((a, b) => {
                console.log(a.children[4].textContent)
                const ratingA = parseFloat(a.children[4].textContent) || 0;
                const ratingB = parseFloat(b.children[4].textContent) || 0;
                return ratingB - ratingA;
            });
        }
    }


    // Remove all rows and re-append in sorted order
    rows.forEach(row => tableBody.appendChild(row));
}



window.sort = sort
window.changeCategory = changeCategory
window.markSubmission = markSubmission

