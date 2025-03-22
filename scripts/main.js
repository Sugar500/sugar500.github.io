
init()

function init() {
    const fileSource = document.getElementById("data-files");

    loadSubpages(fileSource);
    loadSettings(fileSource);
    loadPosts(fileSource);
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

function loadPosts(fileSource) {
    const postFiles = [
        "projects/witchs-brew",
        "blogs/Mar-26-2025",
        "projects/personal-website"
    ];
    let posts = [];

    postFiles.forEach(post => {
        const source = fileSource.dataset.sourceAssets + post + '.json';

        const request = new Request(source);
        fetch(request).then(response => {
            const lastModified = new Date(response.headers.get('Last-Modified'));
            response.json().then(data => {
                data.LastModified = lastModified.toString();
                posts.push(data);

                if (post === postFiles[postFiles.length - 1]) {
                    document.dispatchEvent(new CustomEvent('loaded-posts', {
                        detail: {
                            posts: posts
                        }
                    }))
                }
            })
        })
    })
}

function setUpObserver(threshold, element, callback) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(() => {
            callback();
        }, { threshold: threshold });
    })

    observer.observe(element);
}
