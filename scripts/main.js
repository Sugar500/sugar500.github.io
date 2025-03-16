
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
        "footer"
    ]

    sections.forEach(section => {
        loadHTML(file_source.dataset.source + section + ".html", section);
    })

    if (file_source.dataset.hasOwnProperty("json")) {
        sections.forEach(section => {
            if (!file_source.dataset.replacements.includes(section)) {
                console.log(`Section ${section} not found in replacements.`);
                return;
            }

            loadData(file_source.dataset.json + section + ".json",
                replaceComponentData)
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
