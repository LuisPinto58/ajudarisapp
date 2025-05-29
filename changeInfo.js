import { tokenController } from './tokenController.js';

let email

document.getElementById("backbtn1").addEventListener("click", function () {
    history.back();
})



function loadUser () {
    if (window.localStorage.getItem("changeUser") != null) {
        email = window.localStorage.getItem("changeUser")
        window.localStorage.removeItem("changeUser")
    }else{
        email = window.localStorage.getItem("email")
    }

    axios.get("https://ajudaris-api.onrender.com/users/" + email,{
        headers: {
                    Authorization: "Bearer " + window.sessionStorage.getItem("token")
                }
    })
    .then((response) => {
        console.log(response.data)
        document.getElementById("InstitutionName").value = response.data.name
        if (document.getElementById("Location").innerHTML.indexOf('value="' + response.data.district + '"') > -1) {
            document.getElementById("Location").value = response.data.district
        }else{
            document.getElementById("Location").value = "Outra"
            checkOther()    
            document.getElementById("Other").value = response.data.district
        }
            document.getElementById("Location2").value = response.data.city

            response.data.schools.forEach((school, index) => {
                if (index > 0) {
                    addEntry("School")
                }
                document.getElementById("SchoolName" + (index + 1)).value = school.name
                document.getElementById("SchoolAddress" + (index + 1)).value = school.address
                document.getElementById("SchoolEmail" + (index + 1)).value = school.email
                document.getElementById("SchoolContact" + (index + 1)).value = school.phone
            })
            response.data.teachers.forEach((teacher, index) => {
                if (index > 0) {
                    addEntry("Teacher")
                }
                document.getElementById("TeacherName" + (index + 1)).value = teacher.name
                document.getElementById("TeacherEmail" + (index + 1)).value = teacher.email
                document.getElementById("TeacherContact" + (index + 1)).value = teacher.phone
            }
            )
            response.data.interlocutors.forEach((interlocutor, index) => {
                if (index > 0) {
                    addEntry("Inter")
                }
                document.getElementById("InterName" + (index + 1)).value = interlocutor.name
                document.getElementById("InterEmail" + (index + 1)).value = interlocutor.email
                document.getElementById("InterContact" + (index + 1)).value = interlocutor.phone
            }
            )

    })
    .catch((error) => {
        if (error.response && error.response.status === 401) {
            tokenController(loadUser)
        }else{
        console.error(error);
        alert("Erro ao receber dados. Tente novamente mais tarde.")}
    })

}




function changeForm(x, direction) {
        if (direction == "next") {
                if ($("#Form" + x)[0].checkValidity()) {
                    const section1 = "section" + x;
                    const section2 = "section" + (x + 1);
                    document.getElementById(section1).classList.add("d-none");
                    document.getElementById(section2).classList.remove("d-none");
                    document.getElementById("errorMessage" + x).classList.add("d-none")
                    const popup = document.getElementById("myPopup" + (x+1));
                    popup.classList.toggle("show")
                    setTimeout(() => {
                        popup.classList.toggle("show")
                    }, "5000");
                }
                else {
                    document.getElementById("errorMessage" + x).classList.remove("d-none");
                }

        } else {
            const section1 = "section" + x;
            const section2 = "section" + (x - 1);
            document.getElementById(section1).classList.add("d-none");
            document.getElementById(section2).classList.remove("d-none");
            document.getElementById("errorMessage" + x).classList.add("d-none")
        }
    
}
let otherflag = false;

function checkOther() {
    if (document.getElementById("Location").value == "Outra") {
        document.getElementById("OtherLocation").classList.remove("d-none");
        otherflag = true;
    } else {
        otherflag = false;
        document.getElementById("OtherLocation").classList.add("d-none");
    }
}

function addEntry(section) {
    const count = (document.getElementById(section + "Name").childElementCount) + 1;
    console.log(count)
    document.getElementById(section + "Button").disabled = false;
    const element1 = document.createElement("div")
    element1.innerHTML = `<input type="text" style="margin-bottom: 8px" class="form-control" id="${section}Name${count}" required placeholder="Nome">`
    const element2 = document.createElement("div")
    element2.innerHTML = `<input type="text" style="margin-bottom: 8px" class="form-control" id="${section}Address${count}" required placeholder="Morada">`
    const element3 = document.createElement("div")
    element3.innerHTML = `<input type="number" style="margin-bottom: 8px" class="form-control" id="${section}Contact${count}" required placeholder="Contacto">`
    const element4 = document.createElement("div")
    element4.innerHTML = `<input type="email" style="margin-bottom: 8px" class="form-control" id="${section}Email${count}" required placeholder="Email">`

    document.getElementById(section + "Name").append(element1)
    if (document.getElementById(section + "Address") != null) {
        document.getElementById(section + "Address").append(element2)
    }
    document.getElementById(section + "Contact").append(element3)
    document.getElementById(section + "Email").append(element4)
}
function removeEntry(section) {
    const count = (document.getElementById(section + "Name").childElementCount);
    console.log(count)
    if (count == 1) {
        return;
    } else {
        if (count == 2) {
            document.getElementById(section + "Button").disabled = true;
        }
        document.getElementById(section + "Name" + count).parentElement.remove()
        if (document.getElementById(section + "Address" + count) != null) {
            document.getElementById(section + "Address" + count).parentElement.remove()
        }
        document.getElementById(section + "Contact" + count).parentElement.remove()
        document.getElementById(section + "Email" + count).parentElement.remove()
    }

}

function editUser() {
    let userDistrict 
    if (otherflag) {
        userDistrict = document.getElementById("Other").value;
    }
    else {
        userDistrict = document.getElementById("Location").value;
    }

    let schoolsArray = []
    let teachersArray = []
    let interlocutorsArray = []


    for (let index = 1; index < Infinity; index++) {
        if (document.getElementById("SchoolName" + index) != null) {
            let school = {
                name: document.getElementById("SchoolName" + index).value,
                address: document.getElementById("SchoolAddress" + index).value,
                email: document.getElementById("SchoolEmail" + index).value,
                phone: document.getElementById("SchoolContact" + index).value
            }
            schoolsArray.push(school)
        } else {
            break;
        }
    }
    for (let index = 1; index < Infinity; index++) {
        if (document.getElementById("TeacherName" + index) != null) {
            let teacher = {
                name: document.getElementById("TeacherName" + index).value,
                email: document.getElementById("TeacherEmail" + index).value,
                phone: document.getElementById("TeacherContact" + index).value
            }
            teachersArray.push(teacher)
        } else {
            break;
        }
    }
    for (let index = 1; index < Infinity; index++) {
        if (document.getElementById("InterName" + index) != null) {
            let interlocutor = {
                name: document.getElementById("InterName" + index).value,
                email: document.getElementById("InterEmail" + index).value,
                phone: document.getElementById("InterContact" + index).value
            }
            interlocutorsArray.push(interlocutor)
        } else {
            break;
        }
    }

    let data = {
        name: document.getElementById("InstitutionName").value,
        city: document.getElementById("Location2").value,
        district: userDistrict,
        schools: schoolsArray,
        teachers: teachersArray,
        interlocutors: interlocutorsArray
    }
    axios.put("https://ajudaris-api.onrender.com/users/" + email, data,{
        headers: {
                    Authorization: "Bearer " + window.sessionStorage.getItem("token")
                }
    })
    .then((response) => {
        console.log(response.data)
        alert("Dados editados com sucesso")
        history.back();
    })
    .catch((error) => {
        if (error.response && error.response.status === 401) {
            tokenController(editUser)
        }else{
        console.error(error);
        alert("Erro ao editar conta. Tente novamente mais tarde.")
        }
    })
}

window.changeForm = changeForm;
window.addEntry = addEntry;
window.removeEntry = removeEntry;
window.editUser = editUser
window.loadUser = loadUser

