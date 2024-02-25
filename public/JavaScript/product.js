let item_count = document.getElementById('total_item');

let subtraction = () => {
    if(item_count.innerText == "1"){
        alert("You can't select less then 1 item");
    }
    else{
        item_count.innerText--;
    }
}

let addition = () => {
    if(item_count.innerText >= "5"){
        alert("You can't select more then 5 item");
    }
    else{
        item_count.innerText ++;
    }
}

let cart = document.getElementsByClassName("total_shopping");
let cart_update = () =>{
    cart[0].innerText = parseInt(cart[0].innerText) +  item_count.innerText*33;
    cart[1].innerText = parseInt(cart[1].innerText) +  item_count.innerText*33;
}

let change_details = document.getElementsByClassName("change");
change_details[0].children[0].children[0].src = localStorage.getItem("link1");
change_details[0].children[0].children[1].src = localStorage.getItem("link2");
change_details[0].children[1].children[0].innerText = localStorage.getItem("gender")
change_details[0].children[1].children[1].innerText = localStorage.getItem("cloth")
change_details[0].children[1].children[2].children[0].innerText = localStorage.getItem("prize")

let product_name = [] ;
let product_img = [] ;
let product_show = (index) => {
    let product = document.getElementsByClassName("related");
    for(let i=0;i<3;i++){
        product_name[i]=product[0].children[index].children[1].children[i].innerText;
    }
    for(let i=0;i<2;i++){
        product_img[i]=product[0].children[index].children[0].children[0].children[i].src;
    } 
    localStorage.setItem("gender",product_name[0]);
    localStorage.setItem("cloth",product_name[1]);
    localStorage.setItem("prize",product_name[2]);
    localStorage.setItem("link1",product_img[0]);
    localStorage.setItem("link2",product_img[1]);

    change_details[0].children[0].children[0].src = product_img[0];
    change_details[0].children[0].children[1].src = product_img[1];
    change_details[0].children[1].children[0].innerText = localStorage.getItem("gender")
    change_details[0].children[1].children[1].innerText = localStorage.getItem("cloth")
    change_details[0].children[1].children[2].children[0].innerText = localStorage.getItem("prize")
}

if(change_details[0].children[1].children[0].innerText == "WOMEN"){
    let related = document.getElementsByClassName("related");
    let relaed = document.getElementsByClassName("relaed");
    related[0].children[0].children[0].children[0].children[0].src = "Photo/1w.avif";
    related[0].children[0].children[0].children[0].children[1].src = "Photo/1w.avif";
    related[0].children[0].children[1].children[0].innerText = "WOMEN"
    related[0].children[1].children[0].children[0].children[0].src = "Photo/2w.avif";
    related[0].children[1].children[0].children[0].children[1].src = "Photo/2w.avif";
    related[0].children[1].children[1].children[0].innerText = "WOMEN"
    related[0].children[2].children[0].children[0].children[0].src = "Photo/3w.jpg";
    related[0].children[2].children[0].children[0].children[1].src = "Photo/3w.jpg";
    related[0].children[2].children[1].children[0].innerText = "WOMEN"
    related[0].children[3].children[0].children[0].children[0].src = "Photo/4w.webp";
    related[0].children[3].children[0].children[0].children[1].src = "Photo/4w.webp";
    related[0].children[3].children[1].children[0].innerText = "WOMEN"
    relaed[0].children[0].children[0].children[0].children[0].src = "Photo/3w.jpg";
    relaed[0].children[0].children[0].children[0].children[1].src = "Photo/3w.jpg";
    relaed[0].children[0].children[1].children[0].innerText = "WOMEN"
    relaed[0].children[1].children[0].children[0].children[0].src = "Photo/4w.webp";
    relaed[0].children[1].children[0].children[0].children[1].src = "Photo/4w.webp";
    relaed[0].children[1].children[1].children[0].innerText = "WOMEN"
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
