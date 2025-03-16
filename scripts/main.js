
init()

function init() {
    const file_source = document.getElementById("data-files");

    let sections = [
        "menu",
        "header",
        "banner",
        "project-landings",
        "featured-projects",
        "featured-posts",
        "table-section",
        "footer"
    ]

    sections.forEach(section => {
        loadData(file_source.dataset.source + section + ".html")
            .then((result) => {
                replaceComponent(section, result);
            })
    })

    if (file_source.dataset.hasOwnProperty("json")) {
        const replacements = file_source.dataset.replacements.split(",");
        replacements.forEach(section => {
            loadData(file_source.dataset.json + section + ".json")
                .then((result) => {
                    replaceComponentData(JSON.parse(result));
                })
        })
    }

}

function setUpObserver(threshold, element, callback) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(() => {
            callback();
        }, { threshold: threshold });
    })

    observer.observe(element);
}
