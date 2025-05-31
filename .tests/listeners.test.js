// noinspection JSUnresolvedReference,ES6UnusedImports

import {} from '../scripts/listeners';
import {Table} from "../scripts/subpage-manipulation";
import {initPosts, Posts} from "../scripts/posts-functions";
const fs = require('fs'); // Node.js file system module

jest.mock("../scripts/subpage-manipulation");
jest.mock("../scripts/posts-functions");

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
        // Load subpage-init.js into the simulated DOM
        const scriptContent = fs.readFileSync('scripts/subpage-init.js', 'utf8');
        const script = document.createElement('script');
        script.textContent = scriptContent;
        document.body.appendChild(script);
    });

    test('initMenu', () => {
        const spy = jest.spyOn(window, 'initMenu');
        spy.mockImplementation(() => {})
        document.dispatchEvent(new CustomEvent('loaded-component', {
            bubbles: true,
            detail: {
                page: "menu"
            }
        }));

        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
    test('initHeader', () => {
        const spy = jest.spyOn(window, 'initHeader');
        spy.mockImplementation(() => {})
        document.dispatchEvent(new CustomEvent('loaded-component', {
            bubbles: true,
            detail: {
                page: "header"
            }
        }));

        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
    test('initBanner', () => {
        const spy = jest.spyOn(window, 'initBanner');
        spy.mockImplementation(() => {})
        document.dispatchEvent(new CustomEvent('loaded-component', {
            bubbles: true,
            detail: {
                page: "banner"
            }
        }));

        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
    test('initFooter', () => {
        const spy = jest.spyOn(window, 'initFooter');
        spy.mockImplementation(() => {})
        document.dispatchEvent(new CustomEvent('loaded-component', {
            bubbles: true,
            detail: {
                page: "footer"
            }
        }));

        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
})

describe('initialized-posts events', () => {
    beforeEach(() => {
        // Load subpage-init.js into the simulated DOM
        const scriptContent = fs.readFileSync('scripts/subpage-init.js', 'utf8');
        const script = document.createElement('script');
        script.textContent = scriptContent;
        document.body.appendChild(script);

        window.onload();
    });

    test('initDirectory', () => {
        const spy = jest.spyOn(window, 'initDirectory');
        spy.mockImplementation(() => {})
        document.dispatchEvent(new CustomEvent('initialized-posts', {
            bubbles: true,
            detail: {
                page: "directory",
                table: Table,
                posts: Posts
            }
        }));

        expect(spy).toHaveBeenCalledWith(Table, Posts);
        spy.mockRestore();
    });
    test('initArticle', () => {
        const spy = jest.spyOn(window, 'initArticle');
        spy.mockImplementation(() => {})
        document.dispatchEvent(new CustomEvent('initialized-posts', {
            bubbles: true,
            detail: {
                page: "article",
                hash: "test",
                table: Table,
                posts: Posts
            }
        }));

        expect(spy).toHaveBeenCalledWith('test', Posts);
        spy.mockRestore();
    });
    test('initProjectPage', () => {
        const spy = jest.spyOn(window, 'initProjectPage');
        spy.mockImplementation(() => {})
        document.dispatchEvent(new CustomEvent('initialized-posts', {
            bubbles: true,
            detail: {
                page: "project",
                hash: "test",
                table: Table,
                posts: Posts
            }
        }));

        expect(spy).toHaveBeenCalledWith("test", Table, Posts);
        spy.mockRestore();
    });
    test('initFeaturedPosts', () => {
        const spy = jest.spyOn(window, 'initFeaturedPosts');
        spy.mockImplementation(() => {})
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

        expect(spy).toHaveBeenCalledWith(null, Posts);
        spy.mockRestore();
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
