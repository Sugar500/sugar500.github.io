import { Table } from "./subpage-manipulation.js";

export const Posts = {
    posts: [],
    loaded: false,
    add: function(post) {
        this.posts.push(post);
    },
    sortTitle: function () {
        return this.posts.sort((a, b) => {
            const titleA = a["Title"].toLowerCase(), titleB = b["Title"].toLowerCase();
            return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
        })
    },
    sortDate: function () {
        return this.posts.sort((a, b) => {
            return new Date(a.LastModified) - new Date(b.LastModified);
        })
    },
    filterTag: function (tag) {
        return this.posts.filter(post => {
            return post["Tags"].includes(tag) && !post["Tags"].includes("secret");
        })
    },
    find: function (title) {
        return this.posts.filter((post) => {
            return post["Title"].toLowerCase() === title.toLowerCase();
        })[0];
    }
}

// featured-post classes are: project-posts, blog-posts, world-building-posts
// blog-posts can also have other classes: world-building, project, notes
// TODO include ability to pin a post

export function initPosts(url) {
    Posts.sortDate();

    const pathname = url.pathname;
    if (pathname.includes("article-page.html")) {
        initArticle(url.hash.replace("#", ""));
    }
    else if (pathname.includes("project-landing.html")) {
        document.dispatchEvent(new CustomEvent('initialized-posts', {
            bubbles: true,
            detail: {
                page: 'project',
                hash: url.hash.replace("#", ""),
                data: [Table, Posts]
            }
        }));
    }
    else if (pathname.includes("table-of-contents.html")) {
        document.dispatchEvent(new CustomEvent('initialized-posts', {
            bubbles: true,
            detail: {
                page: 'directory',
                data: [Table, Posts]
            }
        }));
    }

    document.querySelectorAll("[class*='featured-posts-']").forEach(element => {
        initFeaturedPosts(element);
    })

}

function initArticle(postTitle) {
    if (postTitle === "") return;

    // find the main post
    const post = Posts.find(postTitle.replaceAll("-", " "));
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

function initFeaturedPosts(element) {
    if (element === null) return;

    const postsType = element.classList.contains("project-posts") ? "project" :
        element.classList.contains("creative-posts") ? "creative" :
            element.classList.contains("blog-posts") ? "blog" : "posts";

    const posts = postsType !== 'posts' ? Posts.filterTag(postsType) : Posts.posts;

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
        const paragraph = summary.querySelector('.time-since');

        if (index + 1 >= posts.length && !paragraph)
        {
            header.style.visibility = "hidden";
            time_since.innerHTML = "No more to show.";
            return;
        }
        else if (index + 1 >= posts.length)
        {
            header.style.visibility = "hidden";
            time_since.style.display = "none";
            paragraph.innerHTML = "No more to show.";
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
