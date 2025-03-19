
const featuredPosts = {
    posts: [],
    loaded: false,
}

// featured-post classes are: project-posts, blog-posts, world-building-posts
// blog-posts can also have other classes: world-building, project, notes
// TODO include ability to pin a post
document.addEventListener('loaded-posts', function (event) {
    featuredPosts.posts = event.detail.posts;

    if (!featuredPosts.loaded) return;
    initPosts();
})

document.addEventListener('loaded-settings', function () {
    featuredPosts.loaded = true;

    if (featuredPosts.posts.length < 1) return;
    initPosts();
})

function initPosts() {
    sortPosts("date", false);

    initArticle();
    initFeaturedPosts(document.querySelector(".featured-posts-small"));
    initFeaturedPosts(document.querySelector(".featured-posts-large"));
}

function initFeaturedPosts(element) {
    if (element === null) return;

    const type = element.classList.contains("project-posts") ? "project" :
        element.classList.contains("world-building-posts") ? "world-building" :
        element.classList.contains("blog-posts") ? "blog" : "posts";

    const posts = type !== 'posts' ? filterPosts(type) : featuredPosts.posts;

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
        const paragraph = post_preview.querySelector('p');
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
            paragraph.innerHTML = posts[0]["Long Summary"];
            subtitle.innerHTML = posts[0]["Short Summary"];
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

window.addEventListener('hashchange', () => {
    initArticle();
    initFeaturedPosts(document.querySelector(".featured-posts-small"));
    initFeaturedPosts(document.querySelector(".featured-posts-large"));
})

function initArticle() {
    const postTitle = new URL(document.URL).hash.toString().replace('#', "");
    if (postTitle === "") return;

    const post = featuredPosts.posts.filter((post) => {
        return post["Title"].toLowerCase() === postTitle.replaceAll("-", " ");
    })[0];
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
            sidebar.innerHTML += "<h3>" + element["Header"] + "</h3>\n";
            let txt = "";
            element["Content"].forEach((p) => {
                txt += p;
            });
            sidebar.innerHTML += "<section>" + txt + "</section>\n";
        })
    })
}

function sortPosts(type, ascending) {
    if (type === "title" && ascending) {
        featuredPosts.posts.sort((a, b) => {
            const titleA = a.Title.toLowerCase(), titleB = b.Title.toLowerCase();
            return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
        })
    }
    else if (type === "date" && ascending) {
        featuredPosts.posts.sort((a, b) => {
            return new Date(a.LastModified) - new Date(b.LastModified);
        })
    }
    else if (type === "name" && !ascending) {
        featuredPosts.posts.sort((a, b) => {
            const titleA = a.Title.toLowerCase(), titleB = b.Title.toLowerCase();
            return titleA < titleB ? 1 : titleA > titleB ? -1 : 0;
        })
    }
    else if (type === "date" && !ascending) {
        featuredPosts.posts.sort((a, b) => {
            return new Date(b.LastModified) - new Date(a.LastModified);
        })
    }
    else {
        console.error("Invalid sort type");
    }
}

function filterPosts(type) {
    return featuredPosts.posts.filter(post => {
        // noinspection JSUnresolvedReference
        return post.Tags.includes(type);
    })
}
