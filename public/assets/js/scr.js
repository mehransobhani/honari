let productItems = document.querySelectorAll('.product-item');
for(let productItem of productItems){
    productItem.addEventListener('mouseover', () => {
        productItem.classList.add('shadow');
        productItem.classList.remove('shadow-sm');
    });

    productItem.addEventListener('mouseleave', () => {
        productItem.classList.add('shadow-sm');
        productItem.classList.remove('shadow');
    });
}

let sideFilterTogglerButtons = document.querySelectorAll('.side-filter-toggler');
for(let sideFilterTogglerButton of sideFilterTogglerButtons){
    sideFilterTogglerButton.addEventListener('click', () => {
        let detailDiv = sideFilterTogglerButton.parentElement.parentElement.querySelector('.detail');
        if(detailDiv.classList.contains('d-none')){
            detailDiv.classList.remove('d-none');
            sideFilterTogglerButton.src = '/assets/images/main_images/double_up_arrow.png';
        }else{
            detailDiv.classList.add('d-none');
            sideFilterTogglerButton.src = '/assets/images/main_images/double_down_arrow.png';
        }
    });
}