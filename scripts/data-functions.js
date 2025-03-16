
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

        const target =  document.getElementById(targetID);

        if (target) {
            target.outerHTML = await response.text();
            postMessage(targetID);
        }
        else {
            console.log(`Target element ${targetID} not found.`);
        }
    } catch (error) {
        console.log(error);
    }
}

function replaceComponentData(data) {
    data.Replacements.forEach(element => {
        const target = document.querySelector(element.Structure);
        target.title = element.Title;
        target.innerHTML = element.Content;
    })
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
