
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

document.addEventListener('import-component', function (event) {
    const elements = document.querySelectorAll("." + event.detail.target);
    elements.forEach(element => {
        element.outerHTML = event.detail.data;
        document.dispatchEvent(new CustomEvent('loaded-component', {
            bubbles: true,
            detail: {
                page: event.detail.target
            }
        }))
    })
})

document.addEventListener('import-settings', function (event) {
    // noinspection JSUnresolvedReference
    event.detail.data.Replacements.forEach(element => {
        // noinspection JSUnresolvedReference
        const target = document.querySelector(element.Structure);
        if (target === null) {
            // noinspection JSUnresolvedReference
            console.error(`There was an error finding ${element.Structure}`);
            return;
        }

        if (element.hasOwnProperty('Class')) {
            target.classList.add(element.Class);
        }

        if (element.hasOwnProperty('Title')) { // noinspection JSUnresolvedReference
            target.title = element.Title;
        }

        if (element.hasOwnProperty('Content')) {
            target.innerHTML = "";
            // noinspection JSUnresolvedReference
            element.Content.forEach((child) => {
                target.innerHTML += child;
            });
        }
    })
})
