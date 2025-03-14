
// do not do anything until the header is inserted into the document
onmessage = (event) => {
    if (event.data === "header") {
        addButtonListeners();
    }
}

function addButtonListeners(){
    const menu_button = document.getElementById("menu-button");
    const body = document.getElementsByTagName("body")[0];

    menu_button.addEventListener("click", () => {
        body.classList.toggle("is-menu-visible");
    })
}
