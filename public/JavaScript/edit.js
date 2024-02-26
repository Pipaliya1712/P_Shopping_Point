let open_nav = () => {
    document.getElementById("menu").style.display = "none";
    document.getElementById("close").style.display = "block";
    document.getElementById("fullnav").style.display = "block";

}
let close_nav = () =>{
    document.getElementById("menu").style.display = "block";
    document.getElementById("close").style.display = "none";
    document.getElementById("fullnav").style.display = "none";
}

const showPass = () => {
    const pass = document.querySelector(".pass");
    if(pass.type === "password") pass.type = "text";
    else pass.type = "password";
}