class Report {

  reportLayout = [];
  reportData = {};
  staticVariables = [];

  constructor(reportLayout, reportData, staticVariables)
  {
    this.reportLayout = reportLayout;
    this.reportData = reportData;
    this.staticVariables = staticVariables ?? [];
  }

  replaceStaticVariables(pagedReport) {
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
              cell.text = this.replace(cell.text, '{pageCount}', pageCount);
              cell.text = this.replace(cell.text, '{pageNumber}', pageNumber);
            }
          }
        }
      }
    }
    return pagedReport;
  }

  pageReport(report) {
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
            currentPageHeightRemaining / section.rowHeight * 0.67
          ); //todo: BUG this is calculated wrong and we have to subtract 9
          currentTable.rows = section.rows.slice(
            rowsUsed,
            rowsUsed + rowsAvailable
          );
          currentPageHeightRemaining -= 
            currentTable.rows.length * section.rowHeight;
          rowsLeft -= currentTable.rows.length;
          rowsUsed += currentTable.rows.length;

          currentPage.push(currentTable);
          console.log('rowsUsed', rowsUsed);
          console.log('rowsLeft', rowsLeft);
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

  bindReport() {
    let report = {
      pageHeader: null,
      pageFooter: null,
      sections: [],
    };
    for (let section of this.reportLayout) {
      if (section.type == 'pageHeader') {
        report.pageHeader = this.generateTable(section);
      } else if (section.type == 'pageFooter') {
        report.pageFooter = this.generateTable(section);
      } else {
        report.sections.push(this.generateTable(section));
      }
    }
    return report;
  }

  generateTable(section) {
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
      for (let dataSetRow of this.reportData[section.dataSet]) {
        let row = this.renderRow(section.columns, dataSetRow);
        table.rows.push(row);
      }
    } else {
      let row = this.renderRow(section.columns, null);
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

  renderRow(columns, dataSetRow) {
    let cells = [];
    for (let column of columns) {
      let cellContents = '';
      if (column.text) {
        cellContents = column.text;
      }
      if (dataSetRow && column.dataSetKey && dataSetRow[column.dataSetKey]) {
        cellContents = dataSetRow[column.dataSetKey];
      }

      cellContents = this.bindDataIntoCellText(cellContents, column.variables);
      let cell = { text: cellContents };

      if (column.className) cell.className = column.className + ' ';
      if (dataSetRow && dataSetRow.className) {
        cell.className += dataSetRow.className + ' ';
      }

      if (this.hasStaticVariables(column.variables)) {
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

  bindDataIntoCellText(text, variables) {
    if (!variables) return text;
    let values = [];
    for (let key of variables) {
      let foundValue = this.reportData.variables[key];
      if (this.staticVariables.indexOf(key) !== -1) {
        foundValue = '{' + key + '}';
      }
      values.push(foundValue ? foundValue : '');
    }
    return this.replaceAll(text, values);
  }

  hasStaticVariables(variables) {
    if (!variables) return false;
    for (let variable of variables) {
      if (this.staticVariables.indexOf(variable) !== -1) return true;
    }
    return false;
  }

  replaceAll(text, values) {
    for (let i = 0; i < values.length; i++) {
      let search = '{' + i + '}';
      while (text.indexOf(search) !== -1) {
        text = text.replace(search, values[i]);
      }
    }
    return text;
  }

  replaceAll(text, values) {
    if (!values || !values.length) return text;
    for (let i = 0; i < values.length; i++) {
      let search = '{' + i + '}';
      text = this.replace(text, search, values[i]);
    }
    return text;
  }

  replace(text, search, value) {
    while (text.indexOf(search) !== -1) {
      text = text.replace(search, value);
    }
    return text;
  }
  

  build()
  {
    console.log(this.reportLayout);
    let report = this.bindReport(this.reportLayout);
    
    let pagedReport = this.pageReport(report);
    console.log(">>",pagedReport);
    pagedReport = this.replaceStaticVariables(pagedReport);
    return pagedReport;

  }

}

export { Report }