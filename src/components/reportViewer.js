import React from 'react';
import { useEffect, useState } from 'react';
import { Report } from '../services/report.js';

export default function ReportViewer({ layout, data, isLoading, error }) {
  function dump(input) {
    return JSON.stringify(input, null, 2);
  }

  const [pagedReport, setPagedReport] = useState([]);

  function LoadReport() {
    let report = new Report(layout, data);
    let builtReport = report.build();
    setPagedReport(builtReport);
  }

  useEffect(() => {
    LoadReport();
  }, [layout, data, isLoading]);

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
                {/* {dump(table)} */}
                {table.type == 'imageChart' && (
                  <>
                    {table.rows.map((row) => (
                      <>
                        <tr>
                          <td>
                            <h1 className="title" style={{ marginBottom: '.5cm' }}>{table.title}</h1>
                            <div className='imageChart' style={{ height: table.staticHeight + 'cm', position: 'relative' }}>
                              {!isLoading && (
                                <>
                                  <img src={row[0]?.chartUrl ?? ''} style={{ maxHeight: table.staticHeight + 'cm', position: 'relative', top: '50%', transform: 'translateY(-50%)' }} />
                                </>
                              )}
                              {isLoading && (
                                <p>Loading Chart...</p>
                              )}

                            </div>
                          </td>
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
                              <>
                                {cell.empty && !isLoading && (
                                  <>
                                    <td
                                      colspan={table.head.length}
                                      className="empty"
                                    >
                                      {table.emptyMessage ?? 'No data to display'}
                                    </td>
                                  </>
                                )}

                                {table.type === 'rows' && isLoading && (
                                  <>
                                    <td
                                      colSpan={table?.head?.length}
                                      className="empty"
                                    >
                                      Loading...
                                    </td>
                                  </>
                                )}

                                {cell.empty != true && (
                                  <>
                                    <td
                                      className={cell.className}
                                      colspan={cell.colspan}
                                    >
                                      {!(cell.hideWhenLoading && isLoading) && (
                                        <>
                                          {cell.type === 'checkbox' && (
                                            <>
                                              <div className="checkbox">
                                                <input type="checkbox" />
                                              </div>
                                              {/* <div className="checkbox" /> */}
                                            </>
                                          )}
                                          {cell.type == null && <>{cell.text}</>}
                                        </>
                                      )}
                                    </td>
                                  </>
                                )}
                              </>
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
