
loadHTML("assets/components/menu.html", "menu");
loadHTML("assets/components/header.html", "header");
loadHTML("assets/components/banner.html", "banner");
loadHTML("assets/components/project_landings.html", "project-landings");
loadHTML("assets/components/code_projects.html", "code-projects");
loadHTML("assets/components/featured_blogs.html", "featured-blogs");

async function loadData(url, func) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.log(`Response status: ${response.status}`);
            return;
        }

        const json = await response.json();
        func(json);
    } catch (error) {
        console.log(error);
    }
}
async function loadHTML(url, targetID) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.log(`Response status: ${response.status}`);
            return;
        }

        document.getElementById(targetID).outerHTML = await response.text();
        postMessage(targetID);
    } catch (error) {
        console.log(error);
    }
}
