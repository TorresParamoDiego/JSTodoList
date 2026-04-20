document.addEventListener('DOMContentLoaded', function() {
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const table = document.getElementById('table');
    const alert = document.getElementById('alert');
    const btn = document.getElementById('add');
    
    function addTodo(){
        if(titleInput.value===''){
            console.error('Title and Description are required');
        }else{
            console.log("ok");
        }   
    }
    btn.onclick = addTodo;
});
