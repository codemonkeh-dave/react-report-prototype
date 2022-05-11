import React from 'react';
import { useEffect, useState } from 'react';
import { Report } from '../services/report.js';

export default function ReportViewer() {
  

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
