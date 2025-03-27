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
        document.dispatchEvent(new CustomEvent('initialized-posts', {
            bubbles: true,
            detail: {
                page: 'article',
                hash: url.hash.replace("#", ""),
                data: Posts
            }
        }));
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
        document.dispatchEvent(new CustomEvent('initialized-posts', {
            bubbles: true,
            detail: {
                page: 'featured-posts',
                data: [element, Posts]
            }
        }));
    })
}
