
self.addEventListener("message", (event) => {
    if (event.data === "banner") {
        const header = document.getElementById("header");
        const banner = document.getElementById("banner");

        setUpObserver(0, banner, () => {
                header.classList.toggle("not-visible");
            })}
})

function setUpObserver(threshold, element, callback) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                console.log("Intersecting");
            }

            callback();
        }, { threshold: threshold });
    })

    observer.observe(element);
}
