
// noinspection JSUnresolvedReference
import { Table } from '../src/scripts/subpage-manipulation.js'

describe('table manipulation', function() {
    beforeEach(() => {
        document.body.innerHTML = `<table id="testTable">'
        + '<thead>'
        + '<tr><th>Name</th>'
        + '<th>Age</th>'
        + '<th>Gender</th></tr>'
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
        Table.clearTable('#testTable');
        expect(document.querySelector('table thead').innerHTML).toBe('');
        expect(document.querySelector('table tbody').innerHTML).toBe('');
        expect(document.querySelector('table tfoot').innerHTML).toBe('');
    });
    test('table clear header, no header', function () {
        document.body.innerHTML = `<table id="testTable">'
        + '<tbody>'
        + '<tr><td>John</td><td>25</td><td>Male</td></tr>'
        + '</tbody>'
        + '<tfoot>'
        + '<tr><td colspan="2">Total</td><td>Male</td></tr>'
        + '</tfoot>'
        + '</table>`
        Table.clearHeader('#testTable');
        expect(document.querySelector('table thead')).toBe(null);
    });
    test('table clear header', function () {
        Table.clearHeader('#testTable');
        expect(document.querySelector('table thead').innerHTML).toBe('');
    });
    test('table clear body, no body', function () {
        document.body.innerHTML = `<table id="testTable">'
        + '<thead>'
        + '<tr><th>Name</th>'
        + '<th>Age</th>'
        + '<th>Gender</th></tr>'
        + '</thead>'
        + '<tfoot>'
        + '<tr><td colspan="2">Total</td><td>Male</td></tr>'
        + '</tfoot>'
        + '</table>`
        Table.clearBody('#testTable');
        expect(document.querySelector('table tbody')).toBe(null);
    });
    test('table clear body', function () {
        Table.clearBody('#testTable');
        expect(document.querySelector('table tbody').innerHTML).toBe('');
    });
    test('table clear footer, no footer', function () {
        document.body.innerHTML = `<table id="testTable">'
        + '<thead>'
        + '<tr><th>Name</th>'
        + '<th>Age</th>'
        + '<th>Gender</th></tr>'
        + '</thead>'
        + '<tbody>'
        + '<tr><td>John</td><td>25</td><td>Male</td></tr>'
        + '</tbody>'
        + '</table>`
        Table.clearFooter('#testTable');
        expect(document.querySelector('table tfoot')).toBe(null);
    });
    test('table clear footer', function () {
        Table.clearFooter('#testTable');
        expect(document.querySelector('table tfoot').innerHTML).toBe('');
    });
    test('table add header assert is table', function () {
        const table = document.querySelector('thead');
        expect(() => Table.addHeader(table, ['Name', 'Age', 'Sex']))
            .toThrow('table must be a table');
    })
    test('table add header assert is array', function () {
        const table = document.querySelector('#testTable');
        expect(() => Table.addHeader(table, "<td>Name</td><td>Age</td><td>Sex</td>"))
            .toThrow('header must be an Array');
    })
    test('table add header', function() {
        Table.clearHeader('#testTable');
        const table = document.querySelector('#testTable');
        Table.addHeader(table, ['Name', 'Age', 'Sex']);
        expect(document.querySelector('thead').rows.length).toBe(1);
        expect(document.querySelector('thead').rows.item(0).innerHTML)
            .toBe("<td>Name</td><td>Age</td><td>Sex</td>");
    });
    test('table assert too many headers', function() {
        const table = document.querySelector('#testTable');
        expect(() => Table.addHeader(table, ['Name', 'Age', 'Sex']))
            .toThrow('tried to add another header');
    });
    test('table assert empty header', function() {
        const table = document.querySelector('#testTable');
        expect(() => Table.addHeader(table, []))
            .toThrow('tried to insert empty header');
    });
    test('table add row assert is table', function () {
        const table = document.querySelector('thead');
        expect(() => Table.addRow(table, ['Name', 'Age', 'Sex']))
            .toThrow('table must be a table');
    })
    test('table add row assert is array', function () {
        const table = document.querySelector('#testTable');
        expect(() => Table.addRow(table, "<td>Name</td><td>Age</td><td>Sex</td>"))
            .toThrow('row must be an Array');
    })
    test('table add row', function() {
        const table = document.querySelector('#testTable');
        Table.addRow(table, ["Mary", "32", "Female"]);
        expect(document.querySelector('tbody').rows.length).toBe(2);
        expect(document.querySelector('tbody').rows.item(1).innerHTML)
            .toBe('<td>Mary</td><td>32</td><td>Female</td>');
    });
    test('table add row assert too many columns', function() {
        const table = document.querySelector('#testTable');
        expect(() => Table.addRow(table, ["Mary", "32", "Female", "Old"]))
            .toThrow('table row the wrong number of columns');
    });
    test('table add row assert two few columns', function() {
        const table = document.querySelector('#testTable');
        expect(() => Table.addRow(table, ["Mary", "32"]))
            .toThrow('table row the wrong number of columns');
    });
    test('table add row assert two few columns, no header', function() {
        Table.clearHeader('#testTable');
        const table = document.querySelector('#testTable');
        expect(() => Table.addRow(table, ["Mary", "32"]))
            .toThrow('table row the wrong number of columns');
    });
    test('table add row assert empty row', function() {
        const table = document.querySelector('#testTable');
        expect(() => Table.addRow(table, []))
            .toThrow('tried to insert empty row');
    });
    test('table add footer assert is table', function () {
        const table = document.querySelector('thead');
        expect(() => Table.addFooter(table, ['Name', 'Age', 'Sex']))
            .toThrow('table must be a table');
    })
    test('table add footer assert is array', function () {
        const table = document.querySelector('#testTable');
        expect(() => Table.addFooter(table, "<td>Name</td><td>Age</td><td>Sex</td>"))
            .toThrow('footer must be an Array');
    })
    test('table add footer, col span', function () {
        const table = document.querySelector('#testTable');
        Table.clearFooter('#testTable');
        Table.addFooter(table, ["Name", "COLSPAN", "Female"])
        expect(document.querySelector('tfoot').rows.length).toBe(1);
        expect(document.querySelector('tfoot').rows.item(0).innerHTML)
            .toBe("<td colspan=\"2\">Name</td><td>Female</td>");
    });
    test('table add footer', function () {
        const table = document.querySelector('#testTable');
        Table.clearFooter('#testTable');
        Table.addFooter(table, ["Name", "Gender", "Female"])
        expect(document.querySelector('tfoot').rows.length).toBe(1);
        expect(document.querySelector('tfoot').rows.item(0).innerHTML)
            .toBe("<td>Name</td><td>Gender</td><td>Female</td>");
    });
    test('table add footer assert too small footer', function () {
        const table = document.querySelector('#testTable');
        Table.clearFooter('#testTable');
        expect(() => Table.addFooter(table, ["Name", "Female"]))
            .toThrow('table footer the wrong number of columns');
    });
    test('table add footer assert too small footer, no header', function () {
        Table.clearHeader('#testTable');
        Table.clearFooter('#testTable');
        const table = document.querySelector('#testTable');
        expect(() => Table.addFooter(table, ["Name", "Female"]))
            .toThrow('table footer the wrong number of columns');
    });
    test('table add footer assert too big footer', function () {
        const table = document.querySelector('#testTable');
        Table.clearFooter('#testTable');
        expect(() => Table.addFooter(table, ["Name", "Mary", "23", "Old"]))
            .toThrow('table footer the wrong number of columns');
    });
    test('table add footer assert empty footer', function () {
        const table = document.querySelector('#testTable');
        expect(() => Table.addFooter(table, [])).toThrow('tried to insert an empty footer');
    });
    test('table assert too many footer', function() {
        const table = document.querySelector('#testTable');
        expect(() => Table.addFooter(table, ['Name', 'Age', 'Sex']))
            .toThrow('tried to add another footer');
    });
    test('table remove row assert is table', function () {
        const table = document.querySelector('thead');
        expect(() => Table.removeRow(table, 0))
            .toThrow('table must be a table');
    });
    test('table add row assert is number', function () {
        const table = document.querySelector('#testTable');
        expect(() => Table.removeRow(table, "<td>Name</td><td>Age</td><td>Sex</td>"))
            .toThrow('index must be a number');
    });
    test('table remove row', function() {
        const table = document.querySelector('#testTable');
        Table.removeRow(table, 0);
        expect(document.querySelector('tbody').rows.length).toBe(0);
        expect(document.querySelector('tbody').innerHTML).toBe('');
    })
})
