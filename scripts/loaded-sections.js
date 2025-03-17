
const loadedSubpages = {
    pages: [],
    listeners: [],
    addPage: function (page) {
        this.pages.push(page);
        this.listeners.forEach(listener => {
            listener(page);
        })
    },
    addListener: function (listener) {
        this.listeners.push(listener);
    }
}

// menu
loadedSubpages.addListener(function(page) {
    if (page !== "loaded-menu") return;

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
})

// header
loadedSubpages.addListener(function(page) {
    if (page !== "loaded-header") return;

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
})

// banner
loadedSubpages.addListener(function(page) {
    if (page !== "loaded-banner") return;

    const header = document.querySelector(".header");
    const banner = document.querySelector(".banner");

    setUpObserver(0, banner, () => {
        header.classList.toggle("not-visible");
    })
})

// featured-posts
loadedSubpages.addListener(function(page) {
    if (page !== "loaded-featured-posts") return;

    dateData();
    setInterval(updateTimeSince, 1000);
})
