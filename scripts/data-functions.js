
async function loadData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.log(`Response status: ${response.status}`);
            return;
        }

        return await response.text();
    } catch (error) {
        console.log(error);
    }
}

function replaceComponent(target, data) {
    const elements = document.querySelectorAll("." + target);
    elements.forEach(element => {
        // TODO preserve classes
        let classes = element.classList.toString().split(" ");
        element.outerHTML = data;

        loadedSubpages.addPage('loaded-' + target);
    })
}

function replaceComponentData(data) {
    // noinspection JSUnresolvedReference
    data.Replacements.forEach(element => {
        // noinspection JSUnresolvedReference
        const target = document.querySelector(element.Structure);
        if (target === null) {
            // noinspection JSUnresolvedReference
            console.error(`There was an error finding ${element.Structure}`);
        }
        // noinspection JSUnresolvedReference
        target.title = element.Title;
        // noinspection JSUnresolvedReference
        target.innerHTML = "";
        element.Content.forEach((child) => {
            target.innerHTML += child;
        })
    })

    if (data.hasOwnProperty("RemoveClass")) {
        const parent = document.querySelector('.' + data.RemoveClass);
        let classes = parent.getAttribute("class").split(" ");
        for (let i = 0; i < classes.length; i++) {
            if (classes[i] === data.RemoveClass) {
                classes.splice(i, 1);
            }
        }
        parent.setAttribute("class", classes.join(" "));
    }
}

// TODO fix to call actual blog post
function dateData() {
    const timeSinceElements = document.querySelectorAll(".time-since");
    timeSinceElements.forEach(element => {
        const url = "../pages/featured-posts.html"
        fetch(url).then(r => {
            const lastMod = new Date(r.headers.get('Last-Modified'));
            element.innerHTML = calculateTimeSince(lastMod);
            element.dataset.date = lastMod.toDateString() + " " + lastMod.toTimeString();
        })
    })
}
