
const loadedPosts = {
    posts: [],
    postFiles: [
        "blogs/test-blog",
        "blogs/test-blog-1"
    ],
    allLoaded: false,
    listeners: [],
    addPost: function (post) {
        this.posts.push(post);
        this.allLoaded = this.posts.length === this.postFiles.length;

        this.listeners.forEach(listener => {
            listener(post);
        })
    },
    addListener: function (listener) {
        this.listeners.push(listener);
    }
}

// TODO replace featured-posts with actual posts
// TODO include ability to pin a post
// TODO ability to filter posts by type to add pinned project feature
loadedPosts.addListener(function() {
    if (!loadedPosts.allLoaded) return;

    sortPosts();
})

function sortPosts() {
    loadedPosts.posts.sort((a, b) => {
        return new Date(b.LastModified) - new Date(a.LastModified);
    })
}
