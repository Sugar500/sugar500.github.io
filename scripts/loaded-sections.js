
// menu
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
        close_button.onclick = (event) => {
            body.classList.toggle("is-menu-visible");
            event.stopPropagation();
        }
    }
})

// header
self.addEventListener("message", (event) => {
    if (event.data === "header") {
        const menu_button = document.getElementById("menu-button");
        let body = document.getElementsByTagName("body")[0];

        menu_button.addEventListener("click", (event) => {
            body.classList.toggle("is-menu-visible");
            event.stopPropagation();
        })

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

// banner
self.addEventListener("message", (event) => {
    if (event.data === "banner") {
        const header = document.querySelector(".header");
        const banner = document.querySelector(".banner");

        setUpObserver(0, banner, () => {
                header.classList.toggle("not-visible");
            })}
})

// featured-posts
self.addEventListener("message", (event) => {
    if (event.data === "featured-posts") {
        dateData();
        setInterval(updateTimeSince, 1000);
    }
})
