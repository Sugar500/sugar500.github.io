
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
    posts.sortDate();
    const postTag = hash === "projects" ? "project" : hash === "creative-projects" ? "creative"
        : hash === "blog" ? "blog" : "posts";
    const filtered = posts.filterTag(postTag, 'secret');

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

function initArticle(hash, posts) {
    if (hash === "") return;

    // find the main post
    const post = posts.find(hash.replaceAll("-", " "));
    if (!post) return;

    // set the banner up
    document.title = post["Title"];
    document.querySelector('.banner-small h2').innerHTML = post["Title"];
    document.querySelector('.banner-small p').innerHTML = post["Short Summary"];

    // determine which article type to use
    if (!post.hasOwnProperty("Article-Type")) return;
    document.querySelectorAll('[class*=article-]').forEach((element) => {
        const classes = element.classList;
        element.classList.remove("selected");
        classes.forEach((c) => {
            if (c.endsWith(post["Article-Type"])) element.classList.add("selected");
        })
    })

    // grab the main components of the article
    const sidebars = document.querySelectorAll('[class*=article-] ul.sidebar');
    const articles = document.querySelectorAll('[class*=article-] article');
    if (!sidebars || !articles) return;

    // change the featured tag type
    if (post.hasOwnProperty("Tags"))
    {
        const featured = document.querySelector('[class*="featured-posts-"]');

        post["Tags"].forEach((t) => {
            featured.classList.add(t + "-posts");
        })
    }

    // fill out the main article
    if (!post["Sections"]) return;
    articles.forEach((article) => {
        article.querySelector('.header h2').innerHTML = post["Title"];
        article.querySelector('.header p').innerHTML = post["Short Summary"];
        article.querySelector('.header .time-since').innerHTML = calculateTimeSince(new Date(post.LastModified));
        const section = article.querySelector('.content');
        section.innerHTML = "";
        post["Sections"].forEach((element) => {
            let tags = "";
            if (element.hasOwnProperty("Tags")){
                let p = "";
                element["Tags"].forEach((t) => {
                    p += " " + t;
                })

                tags = " class=\"" + p + "\"";
            }

            let header = "";
            if (element.hasOwnProperty("Header")) {
                header += "<h3>" + element["Header"] + "</h3>\n";
            }

            let content = "";
            element["Content"].forEach((p) => {
                content += p;
            });

            section.innerHTML += "<section" + tags + ">\n" + header + content + "\n</section>";
        })
    })

    // fill out the sidebar
    sidebars.forEach((sidebar) => {
        sidebar.innerHTML = "";
    })
    if (!post["Sidebar"]) return;
    sidebars.forEach((sidebar) => {
        post["Sidebar"].forEach((element) => {
            let header = "";
            if (element.hasOwnProperty("Header")) {
                header += "<h3>" + element["Header"] + "</h3>\n";
            }

            let txt = "";
            element["Content"].forEach((p) => {
                txt += p;
            });
            sidebar.innerHTML += "<li>\n" + header + "<section>" + txt + "</section>\n</li>\n";
        })
    })
}

function initFeaturedPosts(element, allPosts) {
    if (element === null) return;

    const postsType = element.classList.contains("project-posts") ? "project" :
        element.classList.contains("creative-posts") ? "creative" :
            element.classList.contains("blog-posts") ? "blog" : "posts";

    allPosts.sortDate();
    const posts = postsType !== 'posts' ? allPosts.filterTag(postsType, 'secret') : allPosts.posts;

    // replace the icons
    const icon = element.querySelectorAll('i');
    icon.forEach(function (icon) {
        if (postsType === 'project') {
            icon.classList.add("fa-solid");
            icon.classList.add("fa-folder-tree");
        }
        if (postsType === 'creative') {
            icon.classList.add("fa-solid");
            icon.classList.add("fa-hammer");
        }
        if (postsType === 'blog') {
            icon.classList.add("fa-solid");
            icon.classList.add("fa-pen-fancy");
        }
        if (postsType === 'posts') {
            // <i class="fa-regular fa-pen-to-square"></i>
            icon.classList.add("fa-regular");
            icon.classList.add("fa-pen-to-square");
        }
    })

    // set up featured posts
    const post_preview = element.querySelector('.post-preview');
    const post_summary = element.querySelectorAll('.post-summary');
    let mod = 0;

    if (post_preview !== null) {
        const header = post_preview.querySelector('h3');
        const subtitle = post_preview.querySelector('.header p');
        const time_since = post_preview.querySelector('.time-since');
        const paragraph = post_preview.querySelector('p.body');
        const button = post_preview.querySelector('button');
        mod = 1;

        if (0 >= posts.length)
        {
            header.style.display = "none";
            subtitle.style.display = "none";
            time_since.style.display = "none";
            paragraph.innerHTML = "No more to show.";
        }
        else {
            header.style.display = "block";
            subtitle.style.display = "block";
            time_since.style.display = "block";

            header.innerHTML = posts[0]["Title"];
            header.cursor = "pointer";
            header.onclick = () => {
                document.location.href = './article-page.html' + "#"
                    + posts[0]["Title"].replace(/ /g, '-').toLowerCase();

            }
            subtitle.innerHTML = posts[0]["Short Summary"];
            paragraph.innerHTML = posts[0]["Long Summary"];
            time_since.innerHTML = calculateTimeSince(new Date(posts[0].LastModified));
            button.onclick = () => {
                document.location.href = './article-page.html' + "#"
                    + posts[0]["Title"].replace(/ /g, '-').toLowerCase();
            }
        }
    }

    post_summary.forEach(function (summary, index) {
        const header = summary.querySelector('h3');
        const time_since = summary.querySelector('.time-since');
        const paragraph = summary.querySelector('p');

        if (index + mod >= posts.length && !paragraph)
        {
            header.style.visibility = "hidden";
            time_since.innerHTML = "No more to show.";
            return;
        }
        else if (index + mod >= posts.length)
        {
            header.style.visibility = "hidden";
            if (time_since) time_since.style.display = "none";
            paragraph.innerHTML = "No more to show.";
            return;
        }

        header.innerHTML = posts[index + mod]["Title"];
        header.style.visibility = "visible";
        if (time_since) time_since.style.visibility = "visible";
        header.cursor = "pointer";
        header.onclick = () => {
            document.location.href = "./article-page.html" + "#"
                + posts[index + mod]["Title"].replace(/ /g, '-').toLowerCase();
        }
        if (paragraph) paragraph.innerHTML = posts[index + mod]["Short Summary"];
        if (time_since) time_since.innerHTML = calculateTimeSince(new Date(posts[index + mod].LastModified));
    })
}
