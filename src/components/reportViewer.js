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
    dataSet1: [
      { name: 'Frank1 Smith', groupMarker: true, className: 'GroupHeader' },
      { name: '1', company: 'ABC1 Ltd', age: 31 },
      { name: '2', company: 'ABC2 Ltd', age: 32 },
      { name: '3', company: 'ABC3 Ltd', age: 33 },
      { name: '4', company: 'ABC4 Ltd', age: 34 },

      { name: 'Frank2 Smith', groupMarker: true, className: 'GroupHeader' },
      { name: '5', company: 'ABC1 Ltd', age: 31 },
      { name: '6', company: 'ABC2 Ltd', age: 32 },
      { name: '7', company: 'ABC3 Ltd', age: 33 },
      { name: '8', company: 'ABC4 Ltd', age: 34 },

      { name: 'Frank2 Smith', groupMarker: true, className: 'GroupHeader' },
      { name: '9', company: 'ABC1 Ltd', age: 31 },
      { name: '10', company: 'ABC2 Ltd', age: 32 },
      { name: '11', company: 'ABC3 Ltd', age: 33 },
      { name: '12', company: 'ABC4 Ltd', age: 34 },

      { name: 'Frank2 Smith', groupMarker: true, className: 'GroupHeader' },
      { name: '13', company: 'ABC1 Ltd', age: 31 },
      { name: '14', company: 'ABC2 Ltd', age: 32 },
      { name: '15', company: 'ABC3 Ltd', age: 33 },
      { name: '16', company: 'ABC4 Ltd', age: 34 },

      { name: 'Frank2 Smith', groupMarker: true, className: 'GroupHeader' },
      { name: '17', company: 'ABC1 Ltd', age: 31 },
      { name: '18', company: 'ABC2 Ltd', age: 32 },
      { name: '19', company: 'ABC3 Ltd', age: 33 },
      { name: '20', company: 'ABC4 Ltd', age: 34 },

      { name: 'Frank2 Smith', groupMarker: true, className: 'GroupHeader' },
      { name: '21', company: 'ABC1 Ltd', age: 31 },
      { name: '22', company: 'ABC2 Ltd', age: 32 },
      { name: '23', company: 'ABC3 Ltd', age: 33 },
      { name: '24', company: 'ABC4 Ltd', age: 34 },

      { name: 'Frank2 Smith', groupMarker: true, className: 'GroupHeader' },
      { name: 'Frank1', company: 'ABC1 Ltd', age: 31 },
      { name: 'Frank2', company: 'ABC2 Ltd', age: 32 },
      { name: 'Frank3', company: 'ABC3 Ltd', age: 33 },
      { name: 'Frank4', company: 'ABC4 Ltd', age: 34 },

      { name: 'Frank2 Smith', groupMarker: true, className: 'GroupHeader' },
      { name: 'Frank1', company: 'ABC1 Ltd', age: 31 },
      { name: 'Frank2', company: 'ABC2 Ltd', age: 32 },
      { name: 'Frank3', company: 'ABC3 Ltd', age: 33 },
      { name: 'Frank4', company: 'ABC4 Ltd', age: 34 },

      { name: 'Frank2 Smith', groupMarker: true, className: 'GroupHeader' },
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
      rowHeight: 1.5,
      columns: [{ text: '{0}', variables: ['title'] }],
    },
    {
      rowHeight: .7,
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
          text: ''
        }
      ],
    },
  ];

  const [pagedReport, setPagedReport] = useState([]);

  useEffect(() => {
    const staticVariables = ['pageNumber', 'pageCount'];
    let report = new Report(reportLayout, reportData, staticVariables);

    let builtReport = report.build();

    setPagedReport(builtReport);

    // setPagedReport(pagedReport);
    // console.log(JSON.stringify(newPagedReport, null, '  '));
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
          ))}
        </page>
      ))}
    </>
  );
}
