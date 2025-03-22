
import { JSDOM } from 'jsdom';

describe('table manipulation', function() {
    beforeEach(() => {
        document.body.innerHTML = `<table id="testTable">'
        + '<thead>'
        + '<tr><th>Name</th></tr>>'
        + '<tr><th>Age</th></tr>>'
        + '<tr><th>Gender</th></tr>>'
        + '</thead>'
        + '<tbody>'
        + '<tr><td>John</td><td>25</td><td>Male</td></tr>'
        + '</tbody>'
        + '<tfoot>'
        + '<tr><td colspan="2">Total</td><td>Male</td></tr>'
        + '</tfoot>'
        + '</table>`
    });
    test('clear table', function() {
        // TODO
        expect(document.querySelector('table').innerHTML).toBe('');
    });
    test('table clear header', function () {
        // TODO
        expect(document.querySelector('table thead').innerHTML).toBe('');
    });
    test('table clear footer', function () {
        // TODO
        expect(document.querySelector('table tfoot').innerHTML).toBe('');
    });
    test('table add header', function() {
        // TODO
        expect(0).toBe(1);
    })
    test('table add row', function() {
        // TODO
        expect(0).toBe(1);
    });
    test('table assert too many columns', function() {
        // TODO
        expect(0).toBe(1);
    });
    test('table assert few many columns', function() {
        // TODO
        expect(0).toBe(1);
    });
    test('table assert empty row', function() {
        // TODO
        expect(0).toBe(1);
    });
    test('table add column', function() {
        // TODO
        expect(0).toBe(1);
    });
    test('table add footer', function () {
        // TODO
        expect(0).toBe(1);
    });
    test('table assert too small footer', function () {
        // TODO
        expect(0).toBe(1);
    });
    test('table assert too big footer', function () {
        // TODO
        expect(0).toBe(1);
    });
    test('table assert empty footer', function () {
        // TODO
        expect(0).toBe(1);
    });
})
