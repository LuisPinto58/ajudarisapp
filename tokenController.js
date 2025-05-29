
export function tokenController(callback,...params) {
    axios.post("https://ajudaris-api.onrender.com/users/auth/refresh",{refreshToken: window.sessionStorage.getItem("refreshToken"), email: window.localStorage.getItem("email")})
    .then((response)=>{
                    console.log("Token refreshed successfully");
                    console.log(response.data);
                    window.sessionStorage.setItem("token", response.data.accessToken);
                    window.sessionStorage.setItem("refreshToken", response.data.refreshToken);
                    if (typeof callback === "function") {
                        callback(...params); 
                    }
                }).catch((error)=>{
                    console.error(error);
                    if (confirm("A sua sessão expirou. Deseja voltar à página inicial?")) {
                        window.location.href = "index.html";
                    }
                })
}

export function logOut(){
                    window.localStorage.clear();
                    window.sessionStorage.clear();
                    window.location.href = "index.html";
                }
