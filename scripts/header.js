
self.addEventListener("message", (event) => {
    if (event.data === "header") {
        addButtonListeners();

        let body = document.getElementsByTagName("body")[0];
        body.onclick = (event) => {
            if (body.classList.contains("is-menu-visible")) {
                body.classList.remove("is-menu-visible");

                event.stopPropagation();
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        }
    }
})

function addButtonListeners(){
    const menu_button = document.getElementById("menu-button");
    const body = document.getElementsByTagName("body")[0];

    menu_button.addEventListener("click", (event) => {
        body.classList.toggle("is-menu-visible");
        event.stopPropagation();
    })
}
