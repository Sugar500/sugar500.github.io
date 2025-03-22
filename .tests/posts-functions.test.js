
// TODO test filter and sort functions
// TODO test url hash functions
// TODO split the modifying of the elements to other file
// noinspection JSUnresolvedReference

import {Posts} from "../scripts/posts-functions"
const posts = [
    {
        Title: "Secret Post",
        LastModified: "Mon Mar 17 2025 16:45:46 GMT-0700 (Pacific Daylight Time)",
        Tags: [
            "project",
            "secret"
        ]
    },
    {
        Title: "Testing Post 1",
        LastModified: "Fri Mar 21 2025 16:45:46 GMT-0700 (Pacific Daylight Time)",
        Tags: [
            "project"
        ]
    },
    {
        Title: "Testing Post 2",
        LastModified: "Fri Mar 21 2024 16:45:46 GMT-0700 (Pacific Daylight Time)",
        Tags: [
            "blog",
            "project"
        ]
    },
    {
        Title: "Testing Post 3",
        LastModified: "Fri Mar 21 2025 01:45:46 GMT-0700 (Pacific Daylight Time)",
        Tags: [
            "creative"
        ]
    },
    {
        Title: "Testing Post 4",
        LastModified: "Sat Mar 15 2025 16:45:46 GMT-0700 (Pacific Daylight Time)",
        Tags: [
            "blog"
        ]
    }
];

beforeAll(() => {
    Posts.add(posts[1]);
    Posts.add(posts[2]);
    Posts.add(posts[0]);
    Posts.add(posts[4]);
    Posts.add(posts[3]);
})

describe('Sort Posts Tests', () => {
    test('sort posts by title', () => {
        const title = [
            posts[0],
            posts[1],
            posts[2],
            posts[3],
            posts[4],
        ];

        const current = Posts.sortTitle();
        expect(current).toEqual(title);
    })
    test('sort posts by date', () => {
        const day = [
            posts[2],
            posts[4],
            posts[0],
            posts[3],
            posts[1],
        ];

        const current = Posts.sortDate();
        expect(current).toEqual(day);
    })
})

describe('Filter Posts Tests', () => {
    test('filter posts by project tag', () => {
        Posts.sortTitle();
        const tag = [
            posts[1],
            posts[2],
        ]

        const current = Posts.filterTag("project");
        expect(current).toEqual(tag);
    })
    test('filter posts by blog tag', () => {
        const tag = [
            posts[2],
            posts[4],
        ]

        const current = Posts.filterTag('blog');
        expect(current).toEqual(tag);
    })
    test('filter posts by creative tag', () => {
        const tag = [
            posts[3],
        ]

        const current = Posts.filterTag('creative');
        expect(current).toEqual(tag);
    })
    test('get post by title', () => {
        const post = posts[1];

        const current = Posts.find('Testing Post 1');
        expect(current).toEqual(post);
    })
})
