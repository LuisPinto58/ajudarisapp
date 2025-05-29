import { tokenController , logOut} from './tokenController.js';

document.getElementById("logOut").addEventListener("click", () => {
    logOut()
})
document.getElementById("logOut2").addEventListener("click", () => {
    logOut()
})


function loadUsers () {
    axios.get("https://ajudaris-api.onrender.com/users/",{
        headers: {
                    Authorization: "Bearer " + window.sessionStorage.getItem("token")
                }
    })
    .then((response) => {
        document.getElementById("sidebarEmail").innerHTML = window.localStorage.getItem("email")
        
        if (response.data.length === 0) {
            document.getElementById("tableBody").innerHTML = "<tr><td colspan='4'>Nenhum utilizador encontrado.</td></tr>";
            return;
        }else {
            response.data.forEach((user,index) => {
                const tr = document.createElement("tr")
                tr.classList.add("highlightable")
                tr.innerHTML = `
                        <td  data-bs-toggle="modal" data-bs-target="#viewModal" id ="${index}email">${user.email}</td>
                        <td  data-bs-toggle="modal" data-bs-target="#viewModal" id ="${index}role">${user.role}</td>
                        <td class="desktop" id ="${index}del"><button class="btn btn-danger" type="button"  data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bi bi-trash"></i><span class="desktop">Eliminar</span></button></td>
                `
                document.getElementById("tableBody").appendChild(tr)

                tr.classList.add(user.role)
                tr.classList.add("user")

                document.getElementById(index+"email").addEventListener("click",function(){
                    feedModal(user)
                })
                document.getElementById(index+"role").addEventListener("click",function(){
                    feedModal(user)
                })
                document.getElementById(index+"del").addEventListener("click",function(){
                    if(confirm("Tem certeza que deseja eliminar este utilizador?")) {
                        axios.delete("https://ajudaris-api.onrender.com/users/" + user.email,{
                            headers: {
                    Authorization: "Bearer " + window.sessionStorage.getItem("token")
                }
                    }).then(()=>window.location.reload())
                }
                })


            })
        }
        


    })
    .catch((error) => {
        if (error.response && error.response.status === 401) {
            tokenController(loadUsers)
        }else{
        console.error(error);
        alert("Erro ao receber dados. Tente novamente mais tarde.")
        }
    })

}

function changeCategory(category) {

    const elements1 = document.getElementsByClassName("user")
    const elements2 = document.getElementsByClassName(category)
    for(let i = 0; i < elements1.length; i++){
            elements1[i].classList.add("d-none");
        }
    for(let i = 0; i < elements2.length; i++){
            elements2[i].classList.remove("d-none");
        }
}


function feedModal(user) {
    document.getElementById("UserName").innerHTML = user.name
    document.getElementById("UserEmail").innerHTML = user.email
    document.getElementById("UserType").innerHTML = user.role
    document.getElementById("UserSchools").innerHTML = ""
    document.getElementById("UserTeachers").innerHTML = ""
    document.getElementById("UserInter").innerHTML = ""


    if (user.role === "institution") {
        const element = document.getElementsByClassName("institutionLabels")
        for (let i = 0; i < element.length; i++) {
            element[i].classList.remove("d-none")
        }
        user.schools.forEach((school) => {
            const li = document.createElement("li")
            li.innerHTML = school.name + " , " + school.address + " , " + school.email + " , " + school.phone 
            document.getElementById("UserSchools").appendChild(li)
        })
        user.teachers.forEach((teacher) => {
            const li = document.createElement("li")
            li.innerHTML = teacher.name +  " , " + teacher.email + " , " + teacher.phone 
            document.getElementById("UserTeachers").appendChild(li)
        })
        user.interlocutors.forEach((interlocutor) => {
            const li = document.createElement("li")
            li.innerHTML = interlocutor.name +  " , " + interlocutor.email + " , " + interlocutor.phone 
            document.getElementById("UserInter").appendChild(li)
        })
    }else{
        const element = document.getElementsByClassName("institutionLabels")
        for (let i = 0; i < element.length; i++) {
            element[i].classList.add("d-none")
        }
    }
    document.getElementById("viewFooter").innerHTML = ""
    const b1 = document.createElement("div")
    b1.style.width = "24%"
    b1.innerHTML = `<button type="button" class="btn btn-danger" style="width: 100%; border: 0px;" data-bs-toggle="modal">Eliminar</button>`
    b1.addEventListener("click",function(){
        if(confirm("Tem certeza que deseja eliminar este utilizador?")) {
            if(user.role === "admin"){  
                alert("Não pode eliminar um administrador.")
            }else{
            axios.delete("https://ajudaris-api.onrender.com/users/" + user.email,{
                headers: {
                    Authorization: "Bearer " + window.sessionStorage.getItem("token")
                }
            }
            ).then(()=>window.location.reload())
        }}
        }
    )

    
    document.getElementById("viewFooter").appendChild(b1)

if (user.role == "institution") {
    const b2 = document.createElement("div")
    b2.style.width = "36%"
    b2.addEventListener("click",function(){
        window.localStorage.setItem("user",user._id)
    })
    b2.innerHTML = `<button type="button" class="btn btn-primary" style="width:100% ;background-color: #88AA31; border: 0px;" onclick="window.location.href = 'changeInfo.html'">Editar</button>`

    document.getElementById("viewFooter").appendChild(b2)
}
    


    if(user.role == "institution" || user.role == "illustrator"){

    document.getElementById("viewBody").removeChild(document.getElementById("viewBody").lastElementChild)
    
    const b3 = document.createElement("div")
    b3.style.width = "36%"
    b3.addEventListener("click",function(){
            window.localStorage.setItem("user",user._id)
            window.localStorage.setItem("userRole",user.role)
        
        window.location.href = "adminSubmissions.html"
    })
    b3.innerHTML= `<button type="button" class="btn btn-primary" style="width: 100%; border: 0px; margin-top: 20px;">Ver submissões</button>`
    document.getElementById("viewBody").appendChild(b3)
    }else{
        const b3 = document.createElement("div")
        document.getElementById("viewBody").removeChild(document.getElementById("viewBody").lastElementChild)
        document.getElementById("viewBody").appendChild(b3)
    }

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
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    tokenController(changePassword)
                }else{
                console.error(error);
                alert("Error changing password")}
            })
    } else {
        document.getElementById("errorMessage").classList.remove("d-none");
    }
}


window.changeCategory = changeCategory
window.loadUsers = loadUsers
window.changePassword = changePassword;