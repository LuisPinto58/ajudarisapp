let role = "institution"

function changeForm(x, direction) {

    if (document.getElementById("AccountType").value == "institution") {
        role = document.getElementById("AccountType").value
        
        if (direction == "next") {
            if (document.getElementById("CreatePassword").value == document.getElementById("ConfirmPassword").value) {
                if ($("#Form" + x)[0].checkValidity()) {
                    const section1 = "section" + x;
                    const section2 = "section" + (x + 1);
                    document.getElementById(section1).classList.add("d-none");
                    document.getElementById(section2).classList.remove("d-none");
                    document.getElementById("errorMessage" + x).classList.add("d-none")
                    const popup = document.getElementById("myPopup" + (x+1));
                    popup.classList.toggle("show")
                    const timer = setTimeout(() => {
                        popup.classList.toggle("show")
                    }, "8000");
                    popup.addEventListener("click",()=>{
                        popup.classList.toggle("show")
                        clearTimeout(timer)
                    })
                }
                else {
                    document.getElementById("errorMessage" + x).classList.remove("d-none");
                }

            }else {
                document.getElementById("errorMessage" + x).classList.remove("d-none");
            }
        }else {
            const section1 = "section" + x;
            const section2 = "section" + (x - 1);
            document.getElementById(section1).classList.add("d-none");
            document.getElementById(section2).classList.remove("d-none");
        }
    }else {
        role = document.getElementById("AccountType").value
        if (direction == "next") {
            if (document.getElementById("CreatePassword").value == document.getElementById("ConfirmPassword").value) {
                if ($("#Form1")[0].checkValidity()) {
                    const section1 = "section" + 1;
                    const section2 = "section" + 6;
                    document.getElementById(section1).classList.add("d-none");
                    document.getElementById(section2).classList.remove("d-none");
                    document.getElementById("errorMessage1").classList.add("d-none")
                    
                }
                else {
                    document.getElementById("errorMessage1").classList.remove("d-none");
                }

            }else {
                document.getElementById("errorMessage1").classList.remove("d-none");
            }
        }else {
            const section1 = "section6" ;
            const section2 = "section1";
            document.getElementById(section1).classList.add("d-none");
            document.getElementById(section2).classList.remove("d-none");
        }

    }
}
let otherflag = false;

function checkOther() {
    if (document.getElementById("Location").value == "Outra") {
        otherflag = true;
        document.getElementById("OtherLocation").classList.remove("d-none");
    } else {
        otherflag = false;
        document.getElementById("OtherLocation").classList.add("d-none");
    }
}

function checkRole(){
    if (document.getElementById("AccountType").value != "institution") {
        document.getElementById("codeDiv").classList.remove("d-none");
    } else {
        document.getElementById("codeDiv").classList.add("d-none");
    }
}

function passwordView() {
    if (document.getElementById("CreatePassword").type == "password") {
        document.getElementById("CreatePassword").type = "text";
        document.getElementById("ConfirmPassword").type = "text";
    }else {
        document.getElementById("CreatePassword").type = "password";
        document.getElementById("ConfirmPassword").type = "password";
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

function addEntryAlt(section) {
    const form = document.getElementById(section + "Form");
    const count = (form.childElementCount); 
    console.log(count)
    document.getElementById(section + "Button").disabled = false;
    const element = document.createElement("div")
    element.id = section + "added" + count
    if (document.getElementById(section + "Address") != null) {    //change addEntryAlt to addEntry if selected
    element.innerHTML = `   
        <div style="display: flex; justify-content: center; margin-top: 16px;">
            <h5>${count}</h5>
        </div>
    <div id="${section}Name">
            <label class="form-label">Nome</label>
                <input type="text" class="form-control" id="${section}Name${count}" required
                    placeholder="Nome">
        </div>
        <div id="${section}Address">
            <label class="form-label">Morada*</label>
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
                <input type="text" class="form-control" id="${section}Address${count}" required
                    placeholder="Morada">
            </div>
        </div>
        <div id="${section}Contact">
            <label class="form-label">Contacto telefónico*</label>
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
                <input type="number" class="form-control" id="${section}Contact${count}" required
                    placeholder="Contacto">
            </div>
        </div>
        <div id="${section}Email">
            <label class="form-label">Endereço eletrónico*</label>
            <div style="display: flex; align-items: center; margin-bottom: 16px;" >
                <input type="email" class="form-control" id="${section}Email${count}" required
                    placeholder="E-mail">
            </div>
        </div>`
        
    }else{
    element.innerHTML = `              
            <h5>${count}</h5>
    <div id="${section}Name">
            <label class="form-label">Nome*</label>
                <input type="text" class="form-control" id="${section}Name${count}" required
                    placeholder="Nome">
        </div>
        <div id="${section}Contact">
            <label class="form-label">Contacto telefónico*</label>
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
                <input type="number" class="form-control" id="${section}Contact${count}" required
                    placeholder="Contacto">
            </div>
        </div>
        <div id="${section}Email">
            <label class="form-label">Endereço eletrónico*</label>
            <div style="display: flex; align-items: center; margin-bottom: 16px;" >
                <input type="email" class="form-control" id="${section}Email${count}" required
                    placeholder="E-mail">
            </div>
        </div>`
    }

    form.appendChild(element)
}


function removeEntryAlt(section) {
    const count = (document.getElementById(section + "Form").childElementCount) -1;
    console.log(count)
    if (count == 1) {
        return;
    } else {
        if (count == 2) {
            document.getElementById(section + "Button").disabled = true;
        }
        document.getElementById(section + "added" + count).remove()
    }

}



function registerUser() {
    let data = {}
    if (role == "institution") {
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

    data = {
        email: document.getElementById("CreateEmail").value,
        password: document.getElementById("CreatePassword").value,
        name: document.getElementById("InstitutionName").value,
        city: document.getElementById("Location2").value,
        district: userDistrict,
        schools: schoolsArray,
        teachers: teachersArray,
        interlocutors: interlocutorsArray
    }
    }else{
        data = {   
            email: document.getElementById("CreateEmail").value,
            password: document.getElementById("CreatePassword").value,
            code: document.getElementById("Code").value,
        }
    }
    axios.post(`https://ajudaris-api.onrender.com/users/${role}s`,data)
    .then((response) => {
        console.log(response.data)
        window.location.href = "index.html";
    })
    .catch((error) => {
        console.error(error);
        alert("Erro ao criar conta. Tente novamente mais tarde.")
    })

}

window.changeForm = changeForm;
window.addEntry = addEntry;
window.checkRole = checkRole;
window.checkOther = checkOther;
window.removeEntry = removeEntry;
window.removeEntryAlt = removeEntryAlt
window.addEntryAlt = addEntryAlt;
window.passwordView = passwordView
window.registerUser = registerUser