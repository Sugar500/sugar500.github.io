
function initMenu(){
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

function initHeader() {
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

function initBanner() {
    const header = document.querySelector(".header");
    const banner = document.querySelector(".banner");

    setUpObserver(0, banner, () => {
        header.classList.toggle("not-visible");
    })
}

function initFooter() {
    function setUpIcon(element, fileType) {
        if (element === null) {
            console.error("Element was null");
            return;
        }

        const fileSource = document.getElementById("data-files");
        const classList = Array.from(element.classList);
        const iconClass = classList.find(className => className.startsWith('icon-'));

        if (iconClass) {
            const img = document.createElement('img');
            img.src = fileSource.dataset.sourceAssets + `images/${iconClass}.${fileType}`;
            img.alt = `${iconClass} icon`;
            img.style.cursor = "pointer";
            element.appendChild(img);
        }
    }

    setUpIcon(document.querySelector(".icons a.icon-daily-dev"), 'svg');
    setUpIcon(document.querySelector(".icons a.icon-roadmap-sh"), 'png');
}

function initDirectory(tables, posts) {
    posts.sortTitle();

    const table = Array.from(document.getElementsByTagName('table'))[0];
    tables.clearBody('table');

    tables.addHeader(table, ["Title", "Tags", "Description"]);
    tables.addRow(table, [
        "<!--suppress HtmlUnknownTarget --><a href='./index.html'>Index</a>", "", "Landing Page"
    ]);
    tables.addRow(table, ["Directory", "", "This page"]);
    tables.addRow(table, [
        "<!--suppress HtmlUnknownTarget --><a href=''>Resume</a>", "", "One-stop shop for employers"
    ]);
    tables.addRow(table, [
        "<!--suppress HtmlUnknownTarget --><a href='./project-landing.html#blog'>Blog Archive</a>", "blog",
        "A landing place for blog posts"
    ]);
    tables.addRow(table, [
        "<!--suppress HtmlUnknownTarget --><a href='./project-landing.html#creative-projects'>Creative Archive</a>",
        "creative", "A landing place for creative posts"
    ]);
    tables.addRow(table, [
        "<!--suppress HtmlUnknownTarget --><a href='./project-landing.html#projects'>Project Archive</a>",
        "creative", "A landing place for projects"
    ]);

    posts.posts.forEach(function (post, index) {
        tables.addRow(table, [
            "<a href='./article-page.html#" + post["Title"].toLowerCase().
            replaceAll(' ', '-') + "'>" + post["Title"] + "</a>",
            post["Tags"].join(", "),
            post["Short Summary"]
        ])
    })
}
