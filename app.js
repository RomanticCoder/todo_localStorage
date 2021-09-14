const $ = (selector) => document.querySelector(selector);
const store = {
    setLocalStorage(menu){
        localStorage.setItem("menu",JSON.stringify(menu))
    },
    getLocalStorage(){
        return JSON.parse(localStorage.getItem("menu"));
    }
}

function App(){
    let menu = {
        espresso:[],
        frappuccino:[],
        blended:[],
        teavana:[],
        desert:[],
    }

    const render = ()=>{
        const template = menu.map((item,index)=>{
            return `
            <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
                <span class="w-100 pl-2 menu-name ${item.soldOut ? "sold-out" : ""}">${item.name}</span>
                <button
                type="button"
                class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button">
                품절
                </button>
                <button type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button">
                수정
                </button>
                <button type="button" class="bg-gray-50 text-gray-500 text-sm menu-remove-button">
                삭제
                </button>
            </li>
            `
        }).join("");
        $('#menu-list').innerHTML = template;
        updateMenuCount();
    }

    const updateMenuCount = ()=>{
        $(".menu-count").innerHTML = `total: ${menu[currentCategory].length}`;
    }

    const addMenuName = () =>{
        if($("#menu-name").value === ''){
            alert("Enter a menu name");
            return;
        }
        const menuName = $("#menu-name").value;
        menu[currentCategory].push({name:menuName});
        store.setLocalStorage(menu);
        $("#menu-name").value = '';
        render();

    }

    const updateMenuName = (e)=>{
        const menuId = e.target.closest("li").dataset.menuId;
        const $menuName =e.target.closest("li").querySelector(".menu-name");
        const updatedMenuName = prompt("Enter a new menu name", $menuName.innerText);
        if(!updatedMenuName || updatedMenuName == '')
            return;
        menu[currentCategory][menuId].name = updatedMenuName;
        store.setLocalStorage(menu);
        render();
    }

    const removeMenuName = (e)=>{
        const answer = confirm("Do you really want to delete it?");
        if (!answer)
            return;
        const menuId = e.target.closest("li").dataset.menuId;
        menu[currentCategory].splice(menuId,1);
        store.setLocalStorage(menu);
        render();
    }

    const soldOutMenu = (e)=>{
        const menuId = e.target.closest("li").dataset.menuId;
        //toggle
        menu[currentCategory][menuId].soldOut = !menu[currentCategory][menuId].soldOut;
        store.setLocalStorage(menu);
        render();
    }

    const init = () =>{
        if(store.getLocalStorage()){
            menu = store.getLocalStorage();
        }
        render();
    }

    init();

    const initEventListener= () => {

    }
    //prevent form tag from sending data 
    $("#menu-form").addEventListener("submit",(e)=>{
        e.preventDefault();
    })

    $("#menu-list").addEventListener("click",(e)=>{
        //update menu name
        if(e.target.classList.contains("menu-edit-button")){
            updateMenuName(e);
            return;
        }

        if(e.target.classList.contains("menu-remove-button")){
            removeMenuName(e);
            return;
        }

        if(e.target.classList.contains("menu-sold-out-button")){
            soldOutMenu(e);
            return;
        }
    })

    $("#menu-submit-button").addEventListener("click",addMenuName);

    $("#menu-name").addEventListener("keypress",(e)=>{
        if(e.key !== 'Enter')
            return;
        addMenuName();
    });

    $("nav").addEventListener("click",(e)=>{
        const isCategoryBtn = e.target.classList.contains("cafe-category-name");
        if(!isCategoryBtn)
            return;
        currentCategory = e.target.dataset.categoryName;
        $('#category-title').innerText = `${e.target.innerText} menu`;
        render();
    });

    

}

App();