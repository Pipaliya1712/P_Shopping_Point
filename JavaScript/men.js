let product_name = [] ;
let product_img = [] ;
let product_show = (index) => {
    let product = document.getElementsByClassName("product_class");
    for(let i=0;i<3;i++){
        product_name[i]=product[0].children[index].children[1].children[i].innerText;
        console.log(product_name[i]);
    }
    for(let i=0;i<2;i++){
        product_img[i]=product[0].children[index].children[0].children[0].children[i].src;
        console.log(product_img[i]);
    } 
    localStorage.setItem("gender",product_name[0]);
    localStorage.setItem("cloth",product_name[1]);
    localStorage.setItem("prize",product_name[2]);
    localStorage.setItem("link1",product_img[0]);
    localStorage.setItem("link2",product_img[1]);
}
let product_show2 = (index) => {
    console.log("object")
    let product = document.getElementsByClassName("product_class");
    for(let i=0;i<3;i++){
        product_name[i]=product[2].children[index].children[1].children[i].innerText;
        console.log(product_name[i]);
    }
    for(let i=0;i<2;i++){
        product_img[i]=product[2].children[index].children[0].children[0].children[i].src;
        console.log(product_img[i]);
    } 
    localStorage.setItem("gender",product_name[0]);
    localStorage.setItem("cloth",product_name[1]);
    localStorage.setItem("prize",product_name[2]);
    localStorage.setItem("link1",product_img[0]);
    localStorage.setItem("link2",product_img[1]);
}

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