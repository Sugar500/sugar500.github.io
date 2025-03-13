
getData("assets/components/button.json", parseComponent)

async function getData(url, func) {
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

function parseComponent(json) {
    const elements = document.querySelectorAll("." + json.tag);

    let tag = "\n<" + json.tag;
    for (const key in json.attributes) {
        tag += " " + key + "=\"" + json.attributes[key] + "\"";
    }
    tag += ">";
    tag += json.value;
    tag += "</" + json.tag + ">";

    elements.forEach(element => {
        for (const key in json.style) {
            element.style.setProperty(key, json.style[key]);
        }
        element.innerHTML = tag;
    })
}
