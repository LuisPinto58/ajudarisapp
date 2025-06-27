
export function tokenController(callback,...params) {
    axios.post("https://ajudaris-api.onrender.com/users/auth/refresh",{refreshToken: window.localStorage.getItem("refreshToken"), email: window.localStorage.getItem("email")})
    .then((response)=>{
                    console.log("Token refreshed successfully");
                    console.log(response.data);
                    window.localStorage.setItem("token", response.data.accessToken);
                    window.localStorage.setItem("refreshToken", response.data.newRefreshToken);
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
                    window.location.href = "index.html";
                }
