
export const Table = {
    clearTable: function (query) {
        this.clearHeader(query);
        this.clearBody(query);
        this.clearFooter(query);
    },

    clearHeader: function (query) {
        const table = document.querySelector(query);
        if (!table.querySelector('thead')) return;
        table.querySelector('thead').innerHTML = '';
    },

    clearBody: function (query) {
        const table = document.querySelector(query);
        if (!table.querySelector('tbody')) return;
        table.querySelector('tbody').innerHTML = '';
    },

    clearFooter: function (query) {
        const table = document.querySelector(query);
        if (!table.querySelector('tfoot')) return;
        table.querySelector('tfoot').innerHTML = '';
    },

    addHeader: function (table, header) {
        if (!(table instanceof HTMLTableElement)) throw new Error('table must be a table');

        if (!(header instanceof Array)) throw new Error('header must be an Array');

        if (header.length <= 0) throw new Error('tried to insert empty header');

        const thead = table.querySelector('thead');
        if (thead && thead.innerHTML !== '') throw new Error('tried to add another header');

        table.createTHead();
        const row = table.tHead.insertRow();
        header.forEach((cell) => {
            row.insertCell().innerHTML = cell;
        })
    },

    addRow: function(table, row) {
        if (!(table instanceof HTMLTableElement)) throw new Error('table must be a table');

        if (!(row instanceof Array)) throw new Error('row must be an Array');

        if (row.length <= 0) throw new Error('tried to insert empty row');

        if (table.tHead && table.tHead.rows.item(0).cells.length !== row.length)
            throw new Error('table row the wrong number of columns');
        else if (table.rows.length > 0 && table.rows.item(0).cells.length !== row.length)
            throw new Error('table row the wrong number of columns');

        const r = table.tBodies[0].insertRow();
        row.forEach((cell) => {
            r.insertCell().innerHTML = cell;
        })
    },

    addFooter: function (table, footer) {
        if (!(table instanceof HTMLTableElement)) throw new Error('table must be a table');

        if (!(footer instanceof Array)) throw new Error('footer must be an Array');

        if (footer.length <= 0) throw new Error('tried to insert an empty footer');

        if (table.querySelector('tfoot').innerHTML !== '') throw new Error('tried to add another footer');

        if (table.tHead && table.tHead.rows.item(0).cells.length !== footer.length)
            throw new Error('table footer the wrong number of columns');
        else if (table.rows.item(0).cells.length !== footer.length)
            throw new Error('table footer the wrong number of columns');

        const foot = table.createTFoot().insertRow();
        let lastCol = 0;
        footer.forEach((cell, index) => {
            if (cell === "COLSPAN") foot.cells.item(lastCol).colSpan += 1;
            else {
                foot.insertCell().innerHTML = cell;
                lastCol = index;
            }
        })
    },

    removeRow: function (table, index) {
        if (!(table instanceof HTMLTableElement)) throw new Error('table must be a table');

        if (!(Number.isInteger(index))) throw new Error('index must be a number');

        const t = document.querySelector('table');
        t.tBodies.item(0).deleteRow(index);
    },
}
