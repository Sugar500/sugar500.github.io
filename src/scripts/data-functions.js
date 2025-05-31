
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
