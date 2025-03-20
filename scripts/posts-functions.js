
const allPosts = {
    posts: [],
    loaded: false,
}

// featured-post classes are: project-posts, blog-posts, world-building-posts
// blog-posts can also have other classes: world-building, project, notes
// TODO include ability to pin a post
document.addEventListener('loaded-posts', function (event) {
    allPosts.posts = event.detail.posts;

    if (!allPosts.loaded) return;
    initPosts();
})

document.addEventListener('loaded-settings', function () {
    allPosts.loaded = true;

    if (allPosts.posts.length < 1) return;
    initPosts();
})

window.addEventListener('hashchange', () => {
    initPosts();
})


function initPosts() {
    sortPosts("date", false);
    const url = new URL(document.URL);

    if (url.pathname.includes("article-page.html")) {
        initArticle(url.hash.replace("#", ""));
    }
    else {
        initProjectPage(url.hash.replace("#", ""));
    }

    document.querySelectorAll("[class*='featured-posts-']").forEach(element => {
        initFeaturedPosts(element);
    })

}

function initArticle(postTitle) {
    if (postTitle === "") return;

    const post = filterNames(postTitle.replaceAll("-", " "))[0];
    if (!post) return;

    document.title = post["Title"];
    document.querySelector('.banner-small h2').innerHTML = post["Title"];
    document.querySelector('.banner-small p').innerHTML = post["Short Summary"];

    if (!post.hasOwnProperty("Article-Type")) return;
    document.querySelectorAll('[class*=article-]').forEach((element) => {
        const classes = element.classList;
        classes.forEach((c) => {
            if (c.endsWith(post["Article-Type"])) element.classList.add("selected");
        })
    })

    const sidebars = document.querySelectorAll('[class*=article-] div.sidebar');
    const articles = document.querySelectorAll('[class*=article-] article');

    if (!sidebars || !articles) return;

    if (post.hasOwnProperty("Tags"))
    {
        const featured = document.querySelector('[class*="featured-posts-"]');
        featured.classList.add(post["Tags"]);
        post["Tags"].forEach((t) => {
            featured.classList.add(t + "-posts");
        })
    }

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
            sidebar.innerHTML += header + "<section>" + txt + "</section>\n";
        })
    })
}

function initProjectPage(landingType) {
    // blog (blog-posts, blog), projects (project-posts, project),
    // creative-projects (creative-posts, writing | world-building | creative)
    // current other landings: writing-projects (writing), world-building (world-building)

    const bannerTitle = document.querySelector('.banner-small h2');
    const bannerSubtitle = document.querySelector('.banner-small p');

    switch (landingType) {
        case "blog":
            bannerTitle.title = "";
            bannerTitle.innerHTML = "Welcome to the Blog!";
            bannerSubtitle.title = "the non-secret ones";
            bannerSubtitle.innerHTML = "A place to find all of the blog posts.";
            break;
        case "projects":
            bannerTitle.title = "Are there any completed ones?";
            bannerTitle.innerHTML = "Welcome to the Project Homepage!";
            bannerSubtitle.title = "";
            bannerSubtitle.innerHTML = "A place to find all the past and current projects.";
            break;
        case "creative-projects":
            bannerTitle.title = "";
            bannerTitle.innerHTML = "Welcome to the creative projects homepage!";
            bannerSubtitle.title = "Most of the should direct to more homepages! Homepage \'ception.";
            bannerSubtitle.innerHTML = "A place to find the creative projects.";
            break;
        case "writing-projects":
            bannerTitle.title = "";
            bannerTitle.innerHTML = "Welcome to the Writing Projects homepage!";
            bannerSubtitle.title = "the non-secret ones";
            bannerSubtitle.innerHTML = "A place to find creative writing projects.";
            break;
        case "world-building":
            bannerTitle.title = "";
            bannerTitle.innerHTML = "Welcome to the World-building homepage!";
            bannerSubtitle.title = "Secrets! Where?";
            bannerSubtitle.innerHTML = "A place to find world-building projects!";
            break;
    }

    const creativeDashboard = document.querySelector('.creative');
    if (creativeDashboard) {
        switch (landingType) {
            case "creative-projects":
            case "world-building":
            case "writing-projects":
                creativeDashboard.classList.add('selected');
                break;
            default:
                creativeDashboard.classList.remove('selected');
                break;
        }
    }

    const sidebar = document.querySelector('.featured-posts-sidebar');
    const sidebarHeading = document.querySelector('.featured-posts-sidebar h2');
    switch (landingType) {
        case "blog":
            sidebar.classList.add('blog-posts');
            sidebarHeading.innerHTML = "Featured Blog Posts";
            break;
        case "projects":
            sidebar.classList.add('project-posts');
            sidebarHeading.innerHTML = "Featured Projects";
            break;
        case "creative-projects":
            sidebar.classList.add('creative-posts');
            sidebarHeading.innerHTML = "Featured Project Posts!";
            break;
    }

    const postTag = landingType.includes("projects") ? "project" :
        landingType.includes("creative-projects") ? "creative" : landingType.includes("blog") ? "blog"
            : "posts";
    const posts = filterTags(postTag, "secret");
    const table = Array.from(document.getElementsByTagName('table'))[0];
    table.createTHead();
    table.tHead.innerHTML = "<tr><th>Title</th><th>Tags</th><th>Description</th></tr>";
    table.tBodies[0].innerHTML = "";
    posts.forEach((post, index) => {
        if (table.tBodies.length === index) table.insertRow();
        table.tBodies[index].innerHTML += "<tr><td><a href='./article-page.html#" +
            post["Title"].toLowerCase().replaceAll(' ', '-') + "'>" + post["Title"]
            + "</a></td><td>" + post["Tags"] + "</td><td>"
            + post["Short Summary"] + "</td></tr>";
    })
    console.log(table);
}

function initFeaturedPosts(element) {
    if (element === null) return;

    const type = element.classList.contains("project-posts") ? "project" :
        element.classList.contains("creative-posts") ? "creative" :
            element.classList.contains("blog-posts") ? "blog" : "posts";

    const posts = type !== 'posts' ? filterTags(type) : allPosts.posts;
    const icon = element.querySelectorAll('i');
    icon.forEach(function (icon) {
        if (type === 'project') {
            icon.classList.add("fa-solid");
            icon.classList.add("fa-folder-tree");
        }
        if (type === 'creative') {
            icon.classList.add("fa-solid");
            icon.classList.add("fa-hammer");
        }
        if (type === 'blog') {
            icon.classList.add("fa-solid");
            icon.classList.add("fa-pen-fancy");
        }
        if (type === 'posts') {
            // <i class="fa-regular fa-pen-to-square"></i>
            icon.classList.add("fa-regular");
            icon.classList.add("fa-pen-to-square");
        }
    })

    // small set up
    const articles = element.querySelectorAll('article.article');
    articles.forEach( function(article, index) {
        const header = article.querySelector('h3');
        const paragraph = article.querySelector('p');

        if (index >= posts.length)
        {
            header.style.visibility = "hidden";
            paragraph.innerHTML = "No more to show.";
            return;
        }

        header.innerHTML = posts[index]["Title"];
        header.cursor = "pointer";
        header.onclick = () => {
            document.location.href = "./article-page.html" + "#"
                + posts[index]["Title"].replace(/ /g, '-').toLowerCase();
        }
        paragraph.innerHTML = posts[index]["Short Summary"];
    })

    // large set up
    const post_preview = element.querySelector('.post-preview');
    const post_summary = element.querySelectorAll('.post-summary');

    if (post_preview !== null) {
        const header = post_preview.querySelector('h3');
        const subtitle = post_preview.querySelector('.header p');
        const time_since = post_preview.querySelector('.time-since');
        const paragraph = post_preview.querySelector('p.body');
        const button = post_preview.querySelector('button');

        if (0 >= posts.length)
        {
            header.style.visibility = "hidden";
            subtitle.style.visibility = "hidden";
            time_since.style.visibility = "hidden";
            paragraph.innerHTML = "No more to show.";
        }
        else {
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

        if (index + 1 >= posts.length)
        {
            header.style.visibility = "hidden";
            time_since.innerHTML = "No more to show.";
            return;
        }

        header.innerHTML = posts[index + 1]["Title"];
        header.cursor = "pointer";
        header.onclick = () => {
            document.location.href = "./article-page.html" + "#"
                + posts[index + 1]["Title"].replace(/ /g, '-').toLowerCase();
        }
        time_since.innerHTML = calculateTimeSince(new Date(posts[index + 1].LastModified));
    })
}

function sortPosts(type, ascending) {
    if (type === "title" && ascending) {
        allPosts.posts.sort((a, b) => {
            const titleA = a["Title"].toLowerCase(), titleB = b["Title"].toLowerCase();
            return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
        })
    }
    else if (type === "date" && ascending) {
        allPosts.posts.sort((a, b) => {
            return new Date(a.LastModified) - new Date(b.LastModified);
        })
    }
    else if (type === "name" && !ascending) {
        allPosts.posts.sort((a, b) => {
            const titleA = a["Title"].toLowerCase(), titleB = b["Title"].toLowerCase();
            return titleA < titleB ? 1 : titleA > titleB ? -1 : 0;
        })
    }
    else if (type === "date" && !ascending) {
        allPosts.posts.sort((a, b) => {
            return new Date(b.LastModified) - new Date(a.LastModified);
        })
    }
    else {
        console.error("Invalid sort type");
    }
}

function filterTags(includeTag, removeTag) {
    return allPosts.posts.filter(post => {
        return post["Tags"].includes(includeTag) && !post["Tags"].includes(removeTag);
    })
}

function filterNames(name) {
    return allPosts.posts.filter((post) => {
        return post["Title"].toLowerCase() === name.toLowerCase();
    })
}
