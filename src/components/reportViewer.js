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
      { name: 'Frank1 Smith', groupMarker: true, className: 'GroupHeader' },
      { name: '1', company: 'ABC1 Ltd', age: 31 },
      { name: '2', company: 'ABC2 Ltd', age: 32 },
      { name: '3', company: 'ABC3 Ltd', age: 33 },
      { name: '4', company: 'ABC4 Ltd', age: 34 },
      { name: 'Frank1 Smith', groupMarker: true, className: 'GroupHeader' },
      { name: '1', company: 'ABC1 Ltd', age: 31 },
      { name: '2', company: 'ABC2 Ltd', age: 32 },
      { name: '3', company: 'ABC3 Ltd', age: 33 },
      { name: '4', company: 'ABC4 Ltd', age: 34 },
      { name: 'Frank1 Smith', groupMarker: true, className: 'GroupHeader' },
      { name: '1', company: 'ABC1 Ltd', age: 31 },
      { name: '2', company: 'ABC2 Ltd', age: 32 },
      { name: '3', company: 'ABC3 Ltd', age: 33 },
      { name: '4', company: 'ABC4 Ltd', age: 34 },
      { name: 'Frank1 Smith', groupMarker: true, className: 'GroupHeader' },
      { name: '1', company: 'ABC1 Ltd', age: 31 },
      { name: '2', company: 'ABC2 Ltd', age: 32 },
      { name: '3', company: 'ABC3 Ltd', age: 33 },
      { name: '4', company: 'ABC4 Ltd', age: 34 },
      { name: 'Frank1 Smith', groupMarker: true, className: 'GroupHeader' },
      { name: '1', company: 'ABC1 Ltd', age: 31 },
      { name: '2', company: 'ABC2 Ltd', age: 32 },
      { name: '3', company: 'ABC3 Ltd', age: 33 },
      { name: '4', company: 'ABC4 Ltd', age: 34 },
    ],
  };

  let reportLayout = [
    {
      type: 'pageHeader',
      className: 'pageHeader',
      rowHeight: 1.5,
      columns: [{ text: '{0}', variables: ['title'] }],
    },
    {
      type: 'summary',
      rowHeight: 0.7,
      marginTop: 5,
      marginBottom: 5,
      noDataHeight: 10,
      dataSet: 'summaryDataSet',
      rows: [
        { key: 'Total Days', className: 'a'},
        { key: 'Creation Date' },
        { key: 'Creation Time' },
        { key: 'Text', text: '{0}', variables: ['title'] },
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
      {pagedReport.map((page) => (
        <page className="A4 landscape">
          {page.map((table) => (
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
              {table.type == 'summary' && (
                <>
                  {table.rows.map((row) => (
                    <>
                      <tr style={{ height: table.rowHeight + 'cm' }}>
                        {row.map((cell) => (
                          <>
                            <td
                              width={200}
                              className={cell.className}
                              colspan={row.colspan}
                            >
                              {cell.text}
                            </td>
                            <td
                              className={cell.className}
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
                      <tr style={{ height: table.rowHeight + 'cm' }}>
                        {row.map((cell) => (
                          <td className={cell.className} colspan={row.colspan}>
                            {cell.text}
                          </td>
                        ))}
                      </tr>
                    </>
                  ))}
                </>
              )}
            </table>
          ))}
        </page>
      ))}
    </>
  );
}
