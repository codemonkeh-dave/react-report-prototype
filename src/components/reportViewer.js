import React from 'react';
import { useEffect, useState } from 'react';

export default function ReportViewer() {
  const staticVariables = ['pageNumber', 'pageCount'];

  function dump(input) {
    return JSON.stringify(input, null, 2);
  }

  let reportData = {
    variables: {
      title: 'Test Report',
      date: new Date().toLocaleDateString(),
    },
    dataSet1: [
      { name: 'Frank1 Smith', groupMarker: true, className: 'GroupHeader' },
      { name: 'Frank1', company: 'ABC1 Ltd', age: 31 },
      { name: 'Frank2', company: 'ABC2 Ltd', age: 32 },
      { name: 'Frank3', company: 'ABC3 Ltd', age: 33 },
      { name: 'Frank4', company: 'ABC4 Ltd', age: 34 },

      { name: 'Frank2 Smith', groupMarker: true, className: 'GroupHeader' },
      { name: 'Frank1', company: 'ABC1 Ltd', age: 31 },
      { name: 'Frank2', company: 'ABC2 Ltd', age: 32 },
      { name: 'Frank3', company: 'ABC3 Ltd', age: 33 },
      { name: 'Frank4', company: 'ABC4 Ltd', age: 34 },
    ],
  };

  let reportLayout = [
    {
      type: 'pageHeader',
      className: 'pageHeader',
      rowHeight: 1,
      columns: [{ header: 'Test', text: '{0}', variables: ['title'] }],
    },
    {
      rowHeight: 1,
      noDataHeight: 10,
      dataSet: 'dataSet1',
      columns: [
        { header: 'Name', dataSetKey: 'name', className: 'Name' },
        { header: 'Company', dataSetKey: 'company' },
        { header: 'Age', dataSetKey: 'age' },
      ],
    },
    {
      type: 'pageFooter',
      className: 'pageFooter',
      rowHeight: 1,
      columns: [
        {
          header: null,
          text: 'Page {0} of {1}',
          variables: ['pageNumber', 'pageCount'],
        },
        { header: null, text: 'Report generated {0}', variables: ['date'] },
      ],
    },
  ];

  function replaceStaticVariables(pagedReport) {
    if (!pagedReport || !pagedReport.length) return;
    let pageCount = pagedReport.length;
    let pageNumber = 0;
    for (let page of pagedReport) {
      if (!page.length) continue;
      pageNumber++;
      for (let table of page) {
        if (!table.rows) continue;
        for (let row of table.rows) {
          if (!row.length) continue;
          for (let cell of row) {
            if (cell.hasStaticVariables) {
              cell.text = replace(cell.text, '{pageCount}', pageCount);
              cell.text = replace(cell.text, '{pageNumber}', pageNumber);
            }
          }
        }
      }
    }
  }

  function pageReport(report) {
    let pagedReport = [];
    let currentPage = [];
    let currentPageHeightRemaining = 0;
    let maxPageHeight = 29;
    if (report.pageHeader) maxPageHeight -= report.pageHeader.staticHeight;
    if (report.pageFooter) maxPageHeight -= report.pageFooter.staticHeight;

    if (report.pageHeader) currentPage = [report.pageHeader];
    currentPageHeightRemaining = maxPageHeight;

    for (let section of report.sections) {
      let rowsLeft = section.rows.length;
      let rowsUsed = 0;
      let loopCount = 0;
      if (section.rows && section.rows.length) {
        while (rowsLeft) {
          let currentTable = {};

          loopCount++;
          if (loopCount > 100) break;

          currentTable = JSON.parse(JSON.stringify(section));
          if (section.title) {
            currentTable.title.text = bindDataIntoCellText(
              currentTable.title.text,
              currentTable.title.variables
            );
            currentPageHeightRemaining -= section.title.height;
          }
          if (section.head) {
            currentPageHeightRemaining -= section.rowHeight;
          }
          let rowsAvailable = Math.floor(
            currentPageHeightRemaining / section.rowHeight
          );
          currentTable.rows = section.rows.slice(
            rowsUsed,
            rowsUsed + rowsAvailable
          );
          currentPageHeightRemaining -=
            currentTable.rows.length * section.rowHeight;
          rowsLeft -= currentTable.rows.length;
          rowsUsed += currentTable.rows.length;

          currentPage.push(currentTable);
          if (rowsLeft) {
            console.log(
              'NEW PAGE',
              rowsLeft,
              rowsUsed,
              currentTable.rows.length
            );
            if (report.pageFooter) currentPage.push(report.pageFooter);
            pagedReport.push(JSON.parse(JSON.stringify(currentPage)));

            if (report.pageHeader) currentPage = [report.pageHeader];
            else currentPage = [];
            currentPageHeightRemaining = maxPageHeight;
          }
        }
      }
    }

    // push last page
    if (report.pageFooter) currentPage.push(report.pageFooter);
    pagedReport.push(currentPage);

    return pagedReport;
  }

  function bindReport() {
    let report = {
      pageHeader: null,
      pageFooter: null,
      sections: [],
    };
    for (let section of reportLayout) {
      if (section.type == 'pageHeader') {
        report.pageHeader = generateTable(section);
      } else if (section.type == 'pageFooter') {
        report.pageFooter = generateTable(section);
      } else {
        report.sections.push(generateTable(section));
      }
    }
    return report;
  }

  function generateTable(section) {
    let table = {
      title: section.title,
      noData: section.noData,
      className: section.className,
      staticHeight: 0,
      rowHeight: section.rowHeight,
      head: [],
      rows: [],
    };

    let showHeader = false;
    for (let column of section.columns) {
      if (column.header) {
        showHeader = true;
        table.head.push(column.header);
      } else {
        table.head.push('');
      }
    }

    if (section.dataSet) {
      for (let dataSetRow of reportData[section.dataSet]) {
        let row = renderRow(section.columns, dataSetRow);
        table.rows.push(row);
      }
    } else {
      let row = renderRow(section.columns, null);
      table.rows.push(row);
    }

    if (showHeader) {
      table.staticHeight = section.rowHeight;
    } else {
      table.staticHeight = 0;
      delete table.head;
    }

    if (table.rows.length) {
      table.staticHeight += section.rowHeight * table.rows.length;
    } else if (table.noData) {
      table.staticHeight += table.noData.height;
    }

    return table;
  }

  function renderRow(columns, dataSetRow) {
    let cells = [];
    for (let column of columns) {
      let cellContents = '';
      if (column.text) {
        cellContents = column.text;
      }
      if (dataSetRow && column.dataSetKey && dataSetRow[column.dataSetKey]) {
        cellContents = dataSetRow[column.dataSetKey];
      }

      cellContents = bindDataIntoCellText(cellContents, column.variables);
      let cell = { text: cellContents };

      if (column.className) cell.className = column.className + ' ';
      if (dataSetRow && dataSetRow.className) {
        cell.className += dataSetRow.className + ' ';
      }

      if (hasStaticVariables(column.variables)) {
        cell.hasStaticVariables = true;
      }

      if (dataSetRow && dataSetRow.groupMarker) {
        cell.colspan = columns.length;
        cells.push(cell);
        break;
      }
      cells.push(cell);
    }
    return cells;
  }

  function bindDataIntoCellText(text, variables) {
    if (!variables) return text;
    let values = [];
    for (let key of variables) {
      let foundValue = reportData.variables[key];
      if (staticVariables.indexOf(key) !== -1) {
        foundValue = '{' + key + '}';
      }
      values.push(foundValue ? foundValue : '');
    }
    return replaceAll(text, values);
  }

  function hasStaticVariables(variables) {
    if (!variables) return false;
    for (let variable of variables) {
      if (staticVariables.indexOf(variable) !== -1) return true;
    }
    return false;
  }

  function replaceAll(text, values) {
    for (let i = 0; i < values.length; i++) {
      let search = '{' + i + '}';
      while (text.indexOf(search) !== -1) {
        text = text.replace(search, values[i]);
      }
    }
    return text;
  }

  function replaceAll(text, values) {
    if (!values || !values.length) return text;
    for (let i = 0; i < values.length; i++) {
      let search = '{' + i + '}';
      text = replace(text, search, values[i]);
    }
    return text;
  }

  function replace(text, search, value) {
    while (text.indexOf(search) !== -1) {
      text = text.replace(search, value);
    }
    return text;
  }

  const [pagedReport, setPagedReport] = useState([]);

  useEffect(() => {
    let report = bindReport();
    const newPagedReport = pageReport(report);
    replaceStaticVariables(newPagedReport);
    setPagedReport(newPagedReport);
    // console.log(JSON.stringify(newPagedReport, null, '  '));
  }, []);

  return (
    <>
      <page className="A4 landscape">
        {pagedReport.map((page) =>
          page.map((table) => (
            <table cellspacing="0" className={table.className}>
              {table.head && (
                <>
                  <tr style={{ height: table.rowHeight + 'cm' }}>
                    {table.head.map((cell) => (
                      <th>{cell}</th>
                    ))}
                  </tr>
                </>
              )}
              <tr></tr>
              {table.rows.map((row) => (
                <tr style={{ height: table.rowHeight + 'cm' }}>
                  {row.map((cell) => (
                    <td className={cell.className} colspan={row.colspan}>
                      {cell.text}
                    </td>
                  ))}
                </tr>
              ))}
            </table>
          ))
        )}
      </page>
    </>
  );
}
