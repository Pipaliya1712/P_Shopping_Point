const time = document.querySelector(".time");
setTimeout(()=>{
    time.style.display = "none";
},5000)

const showPass = () => {
    const pass = document.querySelector(".pass");
    if(pass.type === "password") pass.type = "text";
    else pass.type = "password";
}