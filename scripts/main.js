
loadHTML("assets/header.html", "header");

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

        document.getElementById(targetID).innerHTML = await response.text();
        postMessage(targetID);
    } catch (error) {
        console.log(error);
    }
}
