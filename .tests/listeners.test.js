// noinspection JSUnresolvedReference,ES6UnusedImports

import {} from '../src/listeners';
import {Table} from "../src/subpage-manipulation";
import {initPosts, Posts} from "../src/posts-functions";
import {initArticle, initBanner, initDirectory, initFeaturedPosts, initFooter, initHeader, initMenu, initProjectPage}
    from "../src/subpage-init";

jest.mock("../src/subpage-manipulation");
jest.mock("../src/posts-functions");

jest.mock("../src/subpage-init", () => ({
    initMenu: jest.fn(),
    initHeader: jest.fn(),
    initBanner: jest.fn(),
    initFooter: jest.fn(),
    initDirectory: jest.fn(),
    initFeaturedPosts: jest.fn(),
    initArticle: jest.fn(),
    initProjectPage: jest.fn()
}));

afterEach(() => {
    jest.clearAllMocks();
})

describe('window.onload event', () => {
    test('dispatch initialize-clear', () => {
        const dispatchEventMock = jest.spyOn(document, 'dispatchEvent');
        const customEvent = new CustomEvent('initialize-clear');
        window.onload(null);

        expect(dispatchEventMock).toHaveBeenCalledWith(customEvent);
        dispatchEventMock.mockRestore();
    });
})

describe('loaded-component events', () => {
    beforeEach(() => {
        window.onload(null);
    });

    test('initMenu', () => {
        document.dispatchEvent(new CustomEvent('loaded-component', {
            bubbles: true,
            detail: {
                page: "menu"
            }
        }));
        expect(jest.mocked(initMenu)).toHaveBeenCalled();
    });
    test('initHeader', () => {
        document.dispatchEvent(new CustomEvent('loaded-component', {
            bubbles: true,
            detail: {
                page: "header"
            }
        }));
        expect(jest.mocked(initHeader)).toHaveBeenCalled();
    });
    test('initBanner', () => {
        document.dispatchEvent(new CustomEvent('loaded-component', {
            bubbles: true,
            detail: {
                page: "banner"
            }
        }));
        expect(jest.mocked(initBanner)).toHaveBeenCalled();
    });
    test('initFooter', () => {
        document.dispatchEvent(new CustomEvent('loaded-component', {
            bubbles: true,
            detail: {
                page: "footer"
            }
        }));
        expect(jest.mocked(initFooter)).toHaveBeenCalled();
    });
})

describe('initialized-posts events', () => {
    beforeEach(() => {
        window.onload(null);
    });

    test('initDirectory', () => {
        document.dispatchEvent(new CustomEvent('initialized-posts', {
            bubbles: true,
            detail: {
                page: "directory",
                table: Table,
                posts: Posts
            }
        }));
        expect(jest.mocked(initDirectory)).toHaveBeenCalledWith(Table, Posts);
    });
    test('initArticle', () => {
        document.dispatchEvent(new CustomEvent('initialized-posts', {
            bubbles: true,
            detail: {
                page: "article",
                hash: "test",
                table: Table,
                posts: Posts
            }
        }));
        expect(jest.mocked(initArticle)).toHaveBeenCalledWith("test", Posts);
    });
    test('initProjectPage', () => {
        document.dispatchEvent(new CustomEvent('initialized-posts', {
            bubbles: true,
            detail: {
                page: "project",
                hash: "test",
                table: Table,
                posts: Posts
            }
        }));
        expect(jest.mocked(initProjectPage)).toHaveBeenCalledWith("test", Table, Posts);
    });
    test('initFeaturedPosts', () => {
        document.dispatchEvent(new CustomEvent('initialized-posts', {
            bubbles: true,
            detail: {
                page: "featured-posts",
                hash: "test",
                element: null,
                table: Table,
                posts: Posts
            }
        }));
        expect(jest.mocked(initFeaturedPosts)).toHaveBeenCalledWith(null, Posts);
    });
})

describe('initPosts', () => {
    beforeEach(() => {
        window.onload(null);
    });

    test('loaded posts first', () => {
        document.dispatchEvent(new CustomEvent('loaded-posts', {
            detail: {
                posts: ["test"],
                formats: ["JSON"]
            }
        }));
        document.dispatchEvent(new CustomEvent('loaded-settings'));

        expect(jest.mocked(initPosts)).toHaveBeenCalled();
    });

    test('loaded settings first', () => {
        document.dispatchEvent(new CustomEvent('loaded-settings'));
        document.dispatchEvent(new CustomEvent('loaded-posts', {
            detail: {
                posts: []
            }
        }));

        expect(jest.mocked(initPosts)).toHaveBeenCalled();
    });
})
