
function updateTimeSince() {
    const timeSinceElements = document.querySelectorAll(".time-since");
    timeSinceElements.forEach(element => {
        element.innerHTML = calculateTimeSince(new Date(element.dataset.date));
    })
}

function calculateTimeSince(date) {
    const eventDate = new Date(date);
    const now = new Date();

    const diffMs = now - eventDate;

    const seconds = Math.floor((diffMs / 1000) % 60);
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
    const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));

    if (years > 0) { return `${years} year${years > 1 ? 's' : ''} ago`; }
    if (months > 0) { return `${months} month${months > 1 ? 's' : ''} ago`; }
    if (days > 0) { return `${days} day${days > 1 ? 's' : ''} ago`; }
    if (hours > 0) { return `${hours} hour${hours > 1 ? 's' : ''} ago`; }
    if (minutes > 0) { return `${minutes} minute${minutes > 1 ? 's' : ''} ago`; }

    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
}
