
loadHTML("assets/components/menu.html", "menu");
loadHTML("assets/components/header.html", "header");
loadHTML("assets/components/banner.html", "banner");
loadHTML("assets/components/project_landings.html", "project-landings");
loadHTML("assets/components/featured_projects.html", "code-projects");
loadHTML("assets/components/featured_posts.html", "featured-posts");
loadHTML("assets/components/footer.html", "footer");

function setUpObserver(threshold, element, callback) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(() => {
            callback();
        }, { threshold: threshold });
    })

    observer.observe(element);
}
