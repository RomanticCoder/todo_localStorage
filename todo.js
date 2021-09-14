const $ = (selector) => document.querySelector(selector);

const store = {
    setLocalStorage(todo){
        localStorage.setItem("todo",JSON.stringify(todo))
    },
    getLocalStorage(){
        return JSON.parse(localStorage.getItem("todo"));
    }
}

function App(){
    let todos = [];

    const updateTodoCount = () => {
        $(".todo-count strong").innerText = todos.length;
    }

    const render = ()=>{
        const template = todos.map((item,index)=>{
            return `
            <li data-menu-id = ${index} class=${item.isChecked ? "completed" : ""}>
                <div class="view">
                    <input class="toggle" type="checkbox" ${item.isChecked ? 'checked = "checked"' : ""}/>
                    <label class="label">${item.title}</label>
                    <button class="destroy"></button>
                </div>
                <input class="edit" value="${item.title}" />
            </li>
            `
        }).join("");
        $('#todo-list').innerHTML = template;
        updateTodoCount();
    }

    const addTodo = () =>{
        if($("#new-todo-title").value === ''){
            alert("Enter a menu name");
            return;
        }
        const title = $("#new-todo-title").value;
        todos.push({"title":title, "isChecked":false});
        store.setLocalStorage(todos);
        $("#new-todo-title").value = '';
        render();

    }

    const updateTodo = (e)=>{
        const todoId = e.target.closest("li").dataset.menuId;
        const $newTitle =e.target.closest("li").querySelector(".label").innerText;
        console.log($newTitle)
        if(!$newTitle || $newTitle == '')
            return;
        todos[todoId].title = $newTitle;
        store.setLocalStorage(todos);
        render();
    }

    const removeMenuName = (e)=>{
        // const answer = confirm("Do you really want to delete it?");
        // if (!answer)
        //     return;
        const todoId = e.target.closest("li").dataset.menuId;
        todos.splice(todoId,1);
        store.setLocalStorage(todos);
        render();
    }

    const checkMenu = (e)=>{
        const todoId = e.target.closest("li").dataset.menuId;
        //toggle
        todos[todoId].isChecked = !todos[todoId].isChecked;
        store.setLocalStorage(todos);
        render();
    }

    const init = () =>{
        if(store.getLocalStorage()){
            todos = store.getLocalStorage();
        }
        render();
    }

    init();

    $("#todo-list").addEventListener("click",(e)=>{
        if(e.target.className == "destroy"){
            removeMenuName(e);
            return;
        }

        if(e.target.className == "toggle"){
            checkMenu(e);
            return;
        }
    })

    $("#new-todo-title").addEventListener("keypress",(e)=>{
        if(e.key !== 'Enter')
            return;
        addTodo();
    });

    $('#todo-list').addEventListener("dblclick",(e)=>{
        const target = e.target;
        if(!target.nodeName === 'LABEL'){
            return;
        }
        const li = target.parentNode.parentNode;
        li.classList.add('editing');
    });

    $('#todo-list').addEventListener("keyup",(e)=>{
        if(e.keyCode === 13){ //enter
            const editInput = e.target;
            const li = editInput.parentNode;
            const label = li.querySelector('.label');
            li.classList.remove('editing');  
            label.innerHTML = editInput.value;
            updateTodo(e);
        }
        if(e.keyCode === 27){ //esc
            const li = e.target.parentNode;
            li.classList.remove('editing');    
        }
    });

    $(".filters").addEventListener('click',handleFilterClick);

    function handleFilterClick(e){
        const target = e.target;
        if(!target.nodeName === 'A'){
            return;
        }

        const btns = $(".filters").querySelectorAll('a');
        btns.forEach((btn)=>{
            btn.classList.remove('selected');
        })
        target.classList.add('selected');

        if(target.classList.contains('all')){
            const lis = $('#todo-list').querySelectorAll('li');
            lis.forEach((li)=>{
                li.classList.remove('hidden');
            })
        } 
        if(target.classList.contains('active')){
            const lis = $('#todo-list').querySelectorAll('li');
            lis.forEach((li)=>{
                const checkbox = li.querySelector(".toggle");
                if(checkbox.checked){
                    li.classList.add('hidden');
                }else{
                    li.classList.remove('hidden');
                }
            })
        }
        
        if(target.classList.contains('completed')){
            const lis = $('#todo-list').querySelectorAll('li');
            lis.forEach((li)=>{
                const checkbox = li.querySelector(".toggle");
                if(checkbox.checked){
                    li.classList.remove('hidden');
                }else{
                    li.classList.add('hidden');
                }
            })
        }
    }
}


App();
// {

    // function controlTitleStatus(target){
    //     const li = target.parentNode.parentNode;
    //     target.classList.toggle("completed");
    //     li.classList.toggle("completed");

    // }

    // function deleteTitle(target){
    //     const li = target.parentNode.parentNode;
    //     const ul = li.parentNode;
    //     ul.removeChild(li);
    //     updateTodoCount();
    // }

    // function handleListClick(e){
    //     const target = e.target;
    //     switch(target.nodeName){
    //         case 'INPUT':
    //             controlTitleStatus(target);
    //             break;
    //         case 'BUTTON':
    //             deleteTitle(target);
    //             break;
    //         default:
    //             break;
    //     }
    // }

    // function handleTitleKeyup(e){
    //     if(e.keyCode === 13){
    //         const editInput = e.target;
    //         const li = editInput.parentNode;
    //         const label = li.querySelector('.label');
    //         li.classList.remove('editing');  
    //         label.innerHTML = editInput.value;

    //     }else if(e.keyCode === 27){
    //         const li = e.target.parentNode;
    //         li.classList.remove('editing');    
    //         console.log(li);
    //     }
    // }


    // function submitTodo(e){
    //     if(e.keyCode === 13){ //enter key
    //         e.preventDefault();
    //         addNewTodo(newTodoTitle.value);
    //         newTodoTitle.value = '';
    //     }
    // }


    // function handleFilterClick(e){
    //     const target = e.target;    // function handleFilterClick(e){
    //     const target = e.target;
    //     if(!target.nodeName === 'A'){
    //         return;
    //     }

    //     const btns = filters.querySelectorAll('a');
    //     btns.forEach((btn)=>{
    //         btn.classList.remove('selected');
    //     })
    //     target.classList.add('selected');

    //     if(target.classList.contains('all')){
    //         const titles = todoList.querySelectorAll('li');
    //         titles.forEach((title)=>{
    //             title.classList.remove('hidden');
    //         })
    //     }else if(target.classList.contains('active')){
    //         const titles = todoList.querySelectorAll('li');
    //         titles.forEach((title)=>{
    //             if(title.classList.contains('completed')){
    //                 title.classList.add('hidden');
    //             }else{
    //                 title.classList.remove('hidden');
    //             }
    //         })
    //     }else if(target.classList.contains('completed')){
    //         const titles = todoList.querySelectorAll('li');
    //         titles.forEach((title)=>{
    //             if(title.classList.contains('completed')){
    //                 title.classList.remove('hidden');
    //             }else{
    //                 console.log('really?');
    //                 title.classList.add('hidden');
    //             }
    //         })
    //     }
    // }
    //     if(!target.nodeName === 'A'){
    //         return;
    //     }

    //     const btns = filters.querySelectorAll('a');
    //     btns.forEach((btn)=>{
    //         btn.classList.remove('selected');
    //     })
    //     target.classList.add('selected');

    //     if(target.classList.contains('all')){
    //         const titles = todoList.querySelectorAll('li');
    //         titles.forEach((title)=>{
    //             title.classList.remove('hidden');
    //         })
    //     }else if(target.classList.contains('active')){
    //         const titles = todoList.querySelectorAll('li');
    //         titles.forEach((title)=>{
    //             if(title.classList.contains('completed')){
    //                 title.classList.add('hidden');
    //             }else{
    //                 title.classList.remove('hidden');
    //             }
    //         })
    //     }else if(target.classList.contains('completed')){
    //         const titles = todoList.querySelectorAll('li');
    //         titles.forEach((title)=>{
    //             if(title.classList.contains('completed')){
    //                 title.classList.remove('hidden');
    //             }else{
    //                 console.log('really?');
    //                 title.classList.add('hidden');
    //             }
    //         })
    //     }
    // }

    // function loadTitles(){
    //     const loadedTitles = localStorage.getItem(TITLES);
    //     const parsedTitles = JSON.parse(loadedTitles);
    //     parsedTitles.forEach((title)=>{
    //         console.log(title.text);
    //         addNewTodo(title.text);
    //     });
    // }

    // function init(){
    //     if(localStorage.getItem(TITLES)){
    //         loadTitles();
    //     }
    // }

    // init();

    // todoList.addEventListener("keyup",handleTitleKeyup);
    // todoList.addEventListener("click",handleListClick);
    // newTodoTitle.addEventListener("keyup",submitTodo);
    // filters.addEventListener('click',handleFilterClick);
// }