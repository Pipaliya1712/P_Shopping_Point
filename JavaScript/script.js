let buyblazer = document.getElementsByClassName("buyblazer");
for(let i=0;i<buyblazer.length;i++){
    buyblazer[i].addEventListener('click' , e = () => {
        window.open('../buyblazer.html' , '_self');
    });
}

let product_name = [] ;
let product_img = [] ;
product_show = (index) => {
    let product = document.getElementsByClassName("product_class");
    for(let i=0;i<3;i++){
        product_name[i]=product[index].children[1].children[i].innerText;
        console.log(product_name[i]);
    }
    for(let i=0;i<2;i++){
        product_img[i]=product[index].children[0].children[0].children[i].src;
        console.log(product_img[i]);
    } 
    localStorage.setItem("gender",product_name[0]);
    localStorage.setItem("cloth",product_name[1]);
    localStorage.setItem("prize",product_name[2]);
    localStorage.setItem("link1",product_img[0]);
    localStorage.setItem("link2",product_img[1]);
}
