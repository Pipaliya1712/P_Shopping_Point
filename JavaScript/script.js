let buyblazer = document.getElementsByClassName("buyblazer")
for (let i = 0 ; i< buyblazer.length;i++){
    buyblazer[i].onclick = () => {
        window.open('buyblazer.html' , '_self');
    }
}

const first = document.querySelector('.first');
console.log(first)

select = (ulEl , aEl) => {
    Array.from(ulEl , aEl).forEach(
        (v) => {
            v.firstChild.classList.remove('fb');
        }
    );
    if(aEl) aEl.classList.add('fb');
}

first.addEventListener('click', e => {
    const selected = e.target;
    select(first, selected);
});




