
init()

function init() {
    const fileSource = document.getElementById("data-files");

    loadSubSections(fileSource);
    loadReplacements(fileSource);
    loadPosts(fileSource);
}

function loadSubSections(fileSource) {
    let sections = [
        "menu",
        "header",
        "banner",
        "landing-links",
        "featured-posts-small",
        "featured-posts-large",
        "table-section",
        "footer"
    ]

    sections.forEach(section => {
        loadData(fileSource.dataset.sourcePages + section + ".html")
            .then((result) => {
                replaceComponent(section, result);
            })
    })
}

function loadReplacements(fileSource) {
    const url = new URL(document.URL);
    let page = "";
    url.pathname.split("/").forEach(element => {
        if (element.includes('.html')) {
            page = element.replace(".html", "");
        }
    })

    if (fileSource.dataset.hasOwnProperty("assets")) {
        const replacements = fileSource.dataset.replacements.split(" ");
        replacements.forEach(section => {
            loadData(fileSource.dataset.sourceAssets + "settings/" + page + "-" + section + ".json")
                .then((result) => {
                    replaceComponentData(JSON.parse(result));
                })
        })
    }
}

function loadPosts(fileSource) {
    if (loadedPosts.allLoaded) {
        console.log("Posts already loaded");
        return;
    }

    loadedPosts.postFiles.forEach(post => {
        const source = fileSource.dataset.sourceAssets + post + '.json';

        const request = new Request(source);
        fetch(request).then(response => {
            const lastModified = new Date(response.headers.get('Last-Modified'));
            response.json().then(data => {
                data.LastModified = lastModified.toString();
                loadedPosts.addPost(data);
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
