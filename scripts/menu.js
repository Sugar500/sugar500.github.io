
self.addEventListener("message", (event) => {
    if (event.data === "menu") {
        let menu = document.getElementById("menu");
        const body = document.getElementsByTagName("body")[0];

        menu.onclick = (event) => {
            if (body.classList.contains("is-menu-visible")) {
                event.stopPropagation();
            }
        }

        const close_button = document.querySelector('.close-button');

        close_button.addEventListener("click", (event) => {
            body.classList.toggle("is-menu-visible");
            event.stopPropagation();
        })
    }
})
