import { Table } from "./subpage-manipulation.js";

export const Posts = {
    posts: [],
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
            return new Date(b.LastModified) - new Date(a.LastModified);
        })
    },
    filterTag: function (includes, excludes) {
        if (typeof includes === 'string') {
            includes = [includes];
        }
        if (typeof excludes === 'string') {
            excludes = [excludes];
        }

        return this.posts.filter(post => {
            // Check includes (if provided)
            let includesCheck = includes.length === 0 || true;
            includes.forEach(include => includesCheck &= post["Tags"].includes(include))
            // Check excludes (if provided)
            let excludesCheck = excludes.length === 0 || true;
            excludes.forEach(exclude => excludesCheck &= !post["Tags"].includes(exclude));
            // Both conditions must be true for the item to pass
            return includesCheck && excludesCheck;
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
                posts: Posts
            }
        }));
    }
    else if (pathname.includes("project-landing.html")) {
        document.dispatchEvent(new CustomEvent('initialized-posts', {
            bubbles: true,
            detail: {
                page: 'project',
                hash: url.hash.replace("#", ""),
                table: Table,
                posts: Posts
            }
        }));
    }
    else if (pathname.includes("table-of-contents.html")) {
        document.dispatchEvent(new CustomEvent('initialized-posts', {
            bubbles: true,
            detail: {
                page: 'directory',
                table: Table,
                posts: Posts
            }
        }));
    }

    document.querySelectorAll("[class*='featured-posts-']").forEach(element => {
        document.dispatchEvent(new CustomEvent('initialized-posts', {
            bubbles: true,
            detail: {
                page: 'featured-posts',
                element: element,
                posts: Posts
            }
        }));
    })
}
