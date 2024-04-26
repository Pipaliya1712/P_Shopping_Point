const topMsg = document.querySelector(".top");
setTimeout(()=>{
    topMsg.style.display = "none";
},5000)

const bottom = document.querySelector(".bottom");
setTimeout(()=>{
    bottom.style.display = "none";
},5000)

const showPass = () => {
    const pass = document.querySelector(".pass");
    if(pass.type === "password") pass.type = "text";
    else pass.type = "password";
}