
onmessage(event => {
    if (event.data === "banner") {
        setUpObserver(0, document.getElementById("banner"),
            () => {
                const header = document.getElementById("header");
                header.classList.toggle("alt");
            });
    }
})

function setUpObserver(threshold, element, callback) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                console.log("Intersecting");
                callback();
            }
        }, { threshold: threshold });
    })

    observer.observe(element);
}
