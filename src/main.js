import {loadData} from "./data-functions";

document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener('initialize-clear', function () {
        init();
    })
});

function init() {
    const fileSource = document.getElementById("data-files");

    loadPosts(fileSource);
    loadSubpages(fileSource);
    loadSettings(fileSource);
}

function loadSubpages(fileSource) {
    const sections = [
        "menu",
        "header",
        "banner",
        "table",
        "banner-small",
        "landing-links",
        "featured-posts-sidebar",
        "featured-posts-small",
        "featured-posts-large",
        "article-left",
        "article-right",
        "article-none",
        "footer"
    ]

    sections.forEach(section => {
        loadData(fileSource.dataset.sourcePages + section + ".html")
            .then((result) => {
                document.dispatchEvent(new CustomEvent('import-component', {
                    bubbles: true,
                    detail: {
                        target: section,
                        data: result
                    }
                }));
            })
    })
}

function loadSettings(fileSource) {
    const url = new URL(document.URL).pathname;
    let page = "";
    url.split("/").forEach(element => {
        if (element.includes('.html')) {
            page = element.replace(".html", "");
        }
    })
    page = page.length < 1 ? "index" : page;

    loadData(fileSource.dataset.sourceAssets + "settings/" + page + ".json")
        .then((result) => {
            document.dispatchEvent(new CustomEvent('import-settings', {
                bubbles: true,
                detail: {
                    page: page + "-settings",
                    data: JSON.parse(result)
                }
            }));
            document.dispatchEvent(new CustomEvent('loaded-settings'));
        });
}

const files = [
    { 'name': 'blogs/May-30-2025', 'type': 'YAML'},
    { 'name': 'blogs/Apr-9-2025', 'type': 'YAML'},
    { 'name': 'projects/brewl', 'type': 'YAML'},
    { 'name': 'notes/User-Stories-in-Game-Development', 'type': 'YAML'},
    { 'name': 'blogs/Apr-2-2025', 'type': 'YAML'},
    { 'name': 'projects/witchs-brew', 'type': 'YAML'},
    { 'name': 'blogs/Mar-26-2025', 'type': 'YAML'},
    { 'name': 'projects/personal-website', 'type': 'YAML'},
]

function loadPosts(fileSource) {
    let posts = [];
    let formats = [];

    files.forEach(file => {
        let source = fileSource.dataset.sourceAssets + file.name + '.json';
        if (file.type === 'YAML') source = fileSource.dataset.sourceAssets + file.name + '.yaml';

        const request = new Request(source);
        fetch(request).then(response => {
            //const lastModified = new Date(response.headers.get('Last-Modified'));
            response.text().then(data => {
                posts.push(data);
                formats.push(file.type);

                if (file === files[files.length - 1]) {
                    document.dispatchEvent(new CustomEvent('loaded-posts', {
                        detail: {
                            formats: formats,
                            posts: posts
                        }
                    }))
                }
            })
        })
    })
}

export function setUpObserver(threshold, element, callback) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(() => {
            callback();
        }, { threshold: threshold });
    })

    observer.observe(element);
}
