import {initPosts, Posts} from "./posts-functions.js";

let LoadedPosts = false;
let LoadedSettings = false;

window.onload =() => {
    document.addEventListener('loaded-component', function(event) {
        switch (event.detail.page) {
            case "menu":
                initMenu();
                break;
            case "header":
                initHeader();
                break;
            case "banner":
                initBanner();
                break;
            case "footer":
                initFooter();
                break;
        }
    })

    document.addEventListener('loaded-posts', function (event) {
        event.detail.posts.forEach((post) => {
            Posts.add(post);
        })

        LoadedPosts = true;
        if (!LoadedSettings) return;
        initPosts(new URL(document.location));
    })

    document.addEventListener('loaded-settings', function () {
        LoadedSettings = true;
        if (!LoadedPosts) return;
        initPosts(new URL(document.location));
    })

    window.addEventListener('hashchange', (event) => {
        initPosts(new URL(event.newURL));
    })

    document.addEventListener('import-component', function (event) {
        const elements = document.querySelectorAll("." + event.detail.target);
        elements.forEach(element => {
            if (element === null) return;
            element.outerHTML = event.detail.data;
            document.dispatchEvent(new CustomEvent('loaded-component', {
                bubbles: true,
                detail: {
                    page: event.detail.target
                }
            }))
        })
    })

    document.addEventListener('import-settings', function (event) {
        if (!event.detail.data.hasOwnProperty("Replacements")) {
            console.warn("Replacements was not found in settings");
            return;
        }

        event.detail.data["Replacements"].forEach(element => {
            // noinspection JSUnresolvedReference
            const target = document.querySelector(element.Structure);
            if (target === null) {
                // noinspection JSUnresolvedReference
                console.error(`There was an error finding ${element.Structure}`);
                return;
            }

            if (element.hasOwnProperty('Class')) {
                target.classList.add(element.Class);
            }

            if (element.hasOwnProperty('Title')) { // noinspection JSUnresolvedReference
                target.title = element.Title;
            }

            if (element.hasOwnProperty('Content')) {
                target.innerHTML = "";
                // noinspection JSUnresolvedReference
                element.Content.forEach((child) => {
                    target.innerHTML += child;
                });
            }

            if (element.hasOwnProperty('Replace-Classes')) {
                element['Replace-Classes'].forEach(replaceClass => {
                    target.classList.replace(replaceClass["Current-Class"], replaceClass["New-Class"]);
                })
            }
        })
    })

    document.addEventListener('initialized-posts', function (event) {
        switch (event.detail.page) {
            case "directory":
                initDirectory(event.detail.table, event.detail.posts);
                break;
            case "article":
                initArticle(event.detail.hash, event.detail.posts);
                break;
            case "project":
                initProjectPage(event.detail.hash, event.detail.table, event.detail.posts);
                break;
            case "featured-posts":
                initFeaturedPosts(event.detail.element, event.detail.posts);
                break;
        }
    })

    document.dispatchEvent(new CustomEvent('initialize-clear'));
};

