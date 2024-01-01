let buyblazer = document.querySelectorAll('.buyblazer')
for(let i=0;i<buyblazer.length;i++){
    buyblazer[i].addEventListener('click' , e = () => {
        window.open('../buyblazer.html' , '_self');
    });
}

function add_to_card_slid(){
    document.getElementById('slid').classList.toggle('active');
}