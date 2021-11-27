let collections = document.querySelectorAll('.collection');
for(let collection of collections){
    collection.addEventListener('mouseover', function(){
        collection.classList.add('shadow');
        collection.classList.remove('shadow-sm');
    });
    collection.addEventListener('mouseleave', function(){
        collection.classList.remove('shadow');
        collection.classList.add('shadow-sm');
    });
}