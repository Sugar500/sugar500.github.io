
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

    posts.posts.forEach(function (post) {
        tables.addRow(table, [
            "<a href='./article-page.html#" + post["Title"].toLowerCase().
            replaceAll(' ', '-') + "'>" + post["Title"] + "</a>",
            post["Tags"].join(", "),
            post["Short Summary"]
        ])
    })
}

function initProjectPage(hash, tables, posts) {
    // update the banner to match the projects
    const bannerTitle = document.querySelector('.banner-small h2');
    const bannerSubtitle = document.querySelector('.banner-small p');
    switch (hash) {
        case "blog":
            bannerTitle.title = "";
            bannerTitle.innerHTML = "Welcome to the Blog Archive!";
            bannerSubtitle.title = "the non-secret ones";
            bannerSubtitle.innerHTML = "A place to find all of the blog posts.";
            break;
        case "projects":
            bannerTitle.title = "Are there any completed ones?";
            bannerTitle.innerHTML = "Welcome to the Project Archive!";
            bannerSubtitle.title = "";
            bannerSubtitle.innerHTML = "A place to find all the past and current projects.";
            break;
        case "creative-projects":
            bannerTitle.title = "";
            bannerTitle.innerHTML = "Welcome to the creative project archive!";
            bannerSubtitle.title = "Most of the should direct to more archives! Homepage \'ception.";
            bannerSubtitle.innerHTML = "A place to find the creative projects.";
            break;
        default:
            bannerTitle.title = "Ya probably shouldn't be here.";
            bannerTitle.innerHTML = "Welcome to the Archive!";
            bannerSubtitle.title = "";
            bannerSubtitle.innerHTML = "A place to find all of the posts.";
    }

    // update the featured articles
    const featuredPosts = document.querySelector('[class*="featured-posts-"]');
    const featuredPostsHeading = document.querySelector('[class*="featured-posts-"] h2');
    featuredPosts.classList.remove('blog-posts');
    featuredPosts.classList.remove('project-posts');
    featuredPosts.classList.remove('creative-posts');
    switch (hash) {
        case "blog":
            featuredPosts.classList.add('blog-posts');
            featuredPostsHeading.innerHTML = "Featured Blog Posts";
            break;
        case "projects":
            featuredPosts.classList.add('project-posts');
            featuredPostsHeading.innerHTML = "Featured Projects";
            break;
        case "creative-projects":
            featuredPosts.classList.add('creative-posts');
            featuredPostsHeading.innerHTML = "Featured Project Posts!";
            break;
        default:
            featuredPostsHeading.innerHTML = "Featured Posts";
            break;
    }

    // grab all posts matching tags
    const postTag = hash === "projects" ? "project" : hash === "creative-projects" ? "creative"
        : hash === "blog" ? "blog" : "posts";
    const filtered = posts.filterTag(postTag);

    // update the table
    const table = Array.from(document.getElementsByTagName('table'))[0];
    tables.clearHeader('table');
    tables.addHeader(table, ["Title", "Description"]);
    tables.clearBody('table');
    filtered.forEach(function (post) {
        tables.addRow(table, [
            "<a href='./article-page.html#" + post["Title"].toLowerCase().
            replaceAll(' ', '-') + "'>" + post["Title"] + "</a>",
            post["Short Summary"]
        ])
    })
}
