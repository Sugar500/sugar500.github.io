
async function loadData(url, func) {
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
        element.outerHTML = data;
        postMessage(target);
    })
}

function replaceComponentData(data) {
    data.Replacements.forEach(element => {
        const target = document.querySelector(element.Structure);
        if (target === null) {
            console.error(`There was an error finding ${element.Structure}`);
        }
        target.title = element.Title;
        target.innerHTML = element.Content;
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
