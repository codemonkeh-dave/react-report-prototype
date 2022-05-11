import React from 'react';
import { useEffect, useState } from 'react';
import { Report } from '../services/report.js';

export default function ReportViewer() {
  function dump(input) {
    return JSON.stringify(input, null, 2);
  }

  let reportData = {
    variables: {
      title: 'Report Title',
      date: new Date().toLocaleDateString(),
    },
    summaryDataSet: [
      { value: '31' },
      { value: '11.05.22' },
      { value: '11:30AM' },
    ],
    dataSet1: [
      // { name: 'Daniel Frain', age: 59 },
      // { name: 'Andrew Smith', company: 'Chichester Electrical Ltd', age: 44 },
      // { name: 'Michell Barnard', company: 'Creative Images', age: 10 },
      // { name: 'Angela Davies', company: 'Creative Images', age: 43 },
      // { name: 'Peter Jones', company: 'Howard Hunt (City) Ltd', age: 54 },
      // { name: 'Andy Atkinson', company: 'CloudPass', age: 7 },
      // { name: 'Sophie Sowerby', company: 'Creative Images', age: 28 },
      // { name: 'Michael Jones', company: 'Chichester Electrical Ltd', age: 11 },
      // { name: 'Ian Jones', company: 'Cheshire Removals & Storage', age: 35 },
      // { name: 'Kelly Wyatt', company: 'Idris & Co Solicitors', age: 8 },
      // { name: 'Tony Argyle', company: 'Cheshire Removals & Storage', age: 12 },
      // { name: 'Sarah Greenwood', company: 'Creative Images', age: 27 },
      // { name: 'Amy Wi', company: 'Creative Images', age: 55 },
      // { name: 'Geoff Hurst', company: 'Cheshire Removals & Storage', age: 23 },
      // { name: 'Emma Smith', company: 'Cheshire Removals & Storage', age: 43 },
      // { name: 'John Sturrock', company: 'Howard Hunt (City) Ltd', age: 53 },
      // { name: 'Marlon Francis', company: 'Chichester Electrical Ltd', age: 49 },
      // { name: 'Joseph Bloggs', company: 'Howard Hunt (City) Ltd', age: 27 },
      // { name: 'Darren Oliver', company: 'CloudPass', age: 39 },
      // { name: 'Joe Smith', company: 'Howard Hunt (City) Ltd', age: 35 },
    ],
  };

  let reportLayout = [
    {
      type: 'reportHeader',
      rowHeight: 1,
      title: 'Users Report',
      subTitle: 'By company and age',
      icon: 'https://cloudpass.azureedge.net/images/report-icon-delivery.png',
    },
    {
      type: 'pageHeader',
      className: 'pageHeader',
      rowHeight: 1,
      columns: [{ text: '{0}', variables: ['title'] }],
    },
    {
      type: 'summary',
      rowHeight: 0.7,
      marginTop: 0.2,
      marginBottom: 0.2,
      noDataHeight: 10,
      dataSet: 'summaryDataSet',
      rows: [
        { key: 'Total Days', className: 'a' },
        { key: 'Creation Date' },
        { key: 'Creation Time' },
        { key: 'Report Title', text: '{0}', variables: ['title'] },
      ],
    },
    {
      type: 'rows',
      rowHeight: 0.7,
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
          text: 'Page {0} of {1}',
          variables: ['pageNumber', 'pageCount'],
        },
        { text: 'Report generated {0}', variables: ['date'] },
        {
          text: '',
        },
      ],
    },
  ];

  const [pagedReport, setPagedReport] = useState([]);

  useEffect(() => {
    let report = new Report(reportLayout, reportData);
    let builtReport = report.build();
    setPagedReport(builtReport);
  }, []);

  return (
    <>
      {pagedReport.map((page, index) => (
        <page className="A4">
          {page.map((table) => (
            <>
              {table.type === 'summary' && (
                <h1 className="summaryTitle">Summary</h1>
              )}

              {table.type === 'reportHeader' && (
                <>
                  <div class="reportHeader">
                    <div class="icon">
                      <img src={table.icon} />
                    </div>
                    <div class="reportTitles">
                      <div class="title">{table.title}</div>
                      <div class="subTitle">{table.subTitle}</div>
                    </div>
                  </div>
                </>
              )}

              <table
                cellspacing="0"
                className={table.className}
                style={{
                  marginTop: table.marginTop + 'cm',
                  marginBottom: table.marginBottom + 'cm',
                }}
              >
                {table.head && (
                  <>
                    <tr style={{ height: table.rowHeight + 'cm' }}>
                      {table.head.map((cell) => (
                        <th>{cell}</th>
                      ))}
                    </tr>
                  </>
                )}

                {table.type == 'summary' && (
                  <>
                    {table.rows.map((row) => (
                      <>
                        <tr style={{ height: table.rowHeight + 'cm' }}>
                          {row.map((cell) => (
                            <>
                              <td className="summaryKey" colspan={row.colspan}>
                                {cell.text}
                              </td>
                              <td
                                className="summaryValue"
                                colspan={row.colspan}
                              >
                                {cell.value}
                              </td>
                            </>
                          ))}
                        </tr>
                      </>
                    ))}
                  </>
                )}

                {(table.type === 'rows' ||
                  table.type === 'pageFooter' ||
                  table.type === 'pageHeader') && (
                  <>
                    {table.rows.map((row) => (
                      <>
                        <tr
                          className={table.type + '_row'}
                          style={{ height: table.rowHeight + 'cm' }}
                        >
                          {row.map((cell) => (
                            <td
                              className={cell.className}
                              colspan={cell.colspan}
                            >
                              {cell.text}
                            </td>
                          ))}
                        </tr>
                      </>
                    ))}
                  </>
                )}
              </table>
            </>
          ))}
        </page>
      ))}
    </>
  );
}
