
import {} from '../scripts/listeners';
const fs = require('fs'); // Node.js file system module

describe('window.onload event', () => {
    beforeEach(() => {
        document.body.innerHTML = "<script type=\"text/javascript\" src=\"scripts/subpage-init.js\"></script>";
    })
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
        document.head.appendChild(script);
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

        // check init menu
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

        // check init menu
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

        // check init menu
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

        // check init menu
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
})


