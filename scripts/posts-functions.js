
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
    initPosts(new URL(document.location));
})

document.addEventListener('loaded-settings', function () {
    allPosts.loaded = true;

    if (allPosts.posts.length < 1) return;
    initPosts(new URL(document.location));
})

window.addEventListener('hashchange', (event) => {
    initPosts(new URL(event.newURL));
})


function initPosts(url) {
    sortPosts("date", false);

    const pathname = url.pathname;
    if (pathname.includes("article-page.html")) {
        initArticle(url.hash.replace("#", ""));
    }
    else if (pathname.includes("project-landing.html")) {
        initProjectPage(url.hash.replace("#", ""));
    }
    else if (pathname.includes("table-of-contents.html")) {
        initDirectory();
    }

    document.querySelectorAll("[class*='featured-posts-']").forEach(element => {
        initFeaturedPosts(element);
    })

}

function initArticle(postTitle) {
    if (postTitle === "") return;

    // find the main post
    const post = filterNames(postTitle.replaceAll("-", " "))[0];
    if (!post) return;

    // set the banner up
    document.title = post["Title"];
    document.querySelector('.banner-small h2').innerHTML = post["Title"];
    document.querySelector('.banner-small p').innerHTML = post["Short Summary"];

    // determine which article type to use
    if (!post.hasOwnProperty("Article-Type")) return;
    document.querySelectorAll('[class*=article-]').forEach((element) => {
        const classes = element.classList;
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

        featured.classList.add(post["Tags"]);
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

function initProjectPage(landingType) {
    // blog (blog-posts, blog), projects (project-posts, project),
    // creative-projects (creative-posts, writing | world-building | creative)
    // current other landings: writing-projects (writing), world-building (world-building)

    // update the banner to match the projects
    const bannerTitle = document.querySelector('.banner-small h2');
    const bannerSubtitle = document.querySelector('.banner-small p');
    switch (landingType) {
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
        case "writing-projects":
            bannerTitle.title = "";
            bannerTitle.innerHTML = "Welcome to the Writing Project archive!";
            bannerSubtitle.title = "the non-secret ones";
            bannerSubtitle.innerHTML = "A place to find creative writing projects.";
            break;
        case "world-building":
            bannerTitle.title = "";
            bannerTitle.innerHTML = "Welcome to the World-building archive!";
            bannerSubtitle.title = "Secrets! Where?";
            bannerSubtitle.innerHTML = "A place to find world-building projects!";
            break;
    }

    // show or hide the creative landings
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

    // update the featured articles
    const featuredPosts = document.querySelector('[class*="featured-posts-"]');
    const featuredPostsHeading = document.querySelector('[class*="featured-posts-"] h2');
    featuredPosts.classList.remove('blog-posts');
    featuredPosts.classList.remove('project-posts');
    featuredPosts.classList.remove('creative-posts');
    switch (landingType) {
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
    const postTag = landingType === "projects" ? "project" : landingType === "creative-projects" ? "creative"
        : landingType === "blog" ? "blog" : "posts";
    const posts = filterTags(postTag, "secret");

    // update the table
    initPostTable(posts);
}

function initFeaturedPosts(element) {
    if (element === null) return;

    const postsType = element.classList.contains("project-posts") ? "project" :
        element.classList.contains("creative-posts") ? "creative" :
            element.classList.contains("blog-posts") ? "blog" : "posts";

    const posts = postsType !== 'posts' ? filterTags(postsType, "secret") : allPosts.posts;

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

    // set up the small and sidebar featured posts
    const articles = element.querySelectorAll('article.article');
    articles.forEach( function(article, index) {
        const header = article.querySelector('h3');
        const paragraph = article.querySelector('p');

        if (index >= posts.length)
        {
            header.style.display = "none";
            paragraph.innerHTML = "No more to show.";
            return;
        }

        header.innerHTML = posts[index]["Title"];
        header.style.display = "block";
        header.cursor = "pointer";
        header.onclick = () => {
            document.location.href = "./article-page.html" + "#"
                + posts[index]["Title"].replace(/ /g, '-').toLowerCase();
        }
        paragraph.innerHTML = posts[index]["Short Summary"];
    })

    // set up the large featured posts
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

function initDirectory() {
    sortPosts("name", false);
    const posts = allPosts.posts;

    const extraRows = [
        "<td><!--suppress HtmlUnknownTarget --><a href='./index.html'>Index</a></td><td></td><td>Landing Page</td>",
        "<td><!--suppress HtmlUnknownTarget --><a href='./table-of-contents.html'>Directory</a></td><td></td><td>" +
        "This page</td>",
        "<td><!--suppress HtmlUnknownTarget --><a href=''>Resume</a></td><td></td><td>One-stop shop for employers</td>",
        "<td><!--suppress HtmlUnknownTarget --><a href='./project-landing.html#blog'>Blog Archive</a></td><td>blog" +
        "</td><td>A landing place for blog posts</td>",
        "<td><!--suppress HtmlUnknownTarget --><a href='./project-landing.html#creative-projects'>Creative Archive" +
        "</a></td><td>creative</td><td>A place landing place for creative posts</td>",
        "<td><!--suppress HtmlUnknownTarget --><a href='./project-landing.html#projects'>Project Archive</a></td><td>" +
        "project</td><td>A landing place for projects</td>",
        "<td><!--suppress HtmlUnknownTarget --><a href='./project-landing.html#world-building'>World-building Archive" +
        "</a></td><td>creative, world-building</td><td>A landing place for world-building projects</td>",
        "<td><!--suppress HtmlUnknownTarget --><a href='./project-landing.html#writing-projects'>Writing Archive</a>" +
        "</td><td>creative, writing</td><td>A landing place for writing projects.</td>",
    ]

    initPostTable(posts, extraRows);
}

function initPostTable(posts, extraRows) {
    const table = Array.from(document.getElementsByTagName('table'))[0];
    if (table === undefined) return;

    table.createTHead();
    table.tHead.innerHTML = "<tr><th>Title</th><th>Tags</th><th>Description</th></tr>";

    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = "";

    if (extraRows) extraRows.forEach((extra) => {
        const row = document.createElement('tr');
        row.innerHTML = extra;
        tableBody.appendChild(row);
    })
    posts.forEach((post) => {
        const row = document.createElement('tr');
        row.innerHTML = "<td><a href='./article-page.html#" +
            post["Title"].toLowerCase().replaceAll(' ', '-') + "'>" + post["Title"] +
            "</a></td><td>" + post["Tags"].join(", ") + "</td><td>" + post["Short Summary"] + "</td>";
        tableBody.appendChild(row);
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
        return post["Title"].toLowerCase() ===
            name.toLowerCase();
    })
}
