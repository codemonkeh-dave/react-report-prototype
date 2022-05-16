import React from 'react';
import { useEffect, useState } from 'react';
import { Report } from '../services/report.js';

export default function ReportViewer({ layout, data, params, apiCalled, isLoading, error }) {
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
  }, [layout, data, isLoading, apiCalled, params]);

  return (
    <>
      {/* {dump(apiCalled)} */}

      {pagedReport.map((page, index) => (
        <div className="A4 page" key={index}>
          {page.map((table, index) => (
            <React.Fragment key={index}>
              {table.type === 'summary' && (
                <h1 className="summaryTitle">Summary</h1>
              )}

              {table.type === 'reportHeader' && (
                <>
                  <div className="reportHeader">
                    <div className="icon">
                      <img src={table.icon} />
                    </div>
                    <div className="reportTitles">
                      <div className="title">{table.title}</div>
                      <div className="subTitle">{table.subTitle}</div>
                    </div>
                  </div>
                </>
              )}

              <table
                cellSpacing="0"
                className={table.className}
                style={{
                  marginTop: table.marginTop + 'cm',
                  marginBottom: table.marginBottom + 'cm',
                }}
              >
                {table.head && (
                  <>
                    <thead>
                      <tr style={{ height: table.rowHeight + 'cm' }}>
                        {table.head.map((cell, index) => (
                          <th key={index}>{cell}</th>
                        ))}
                      </tr>
                    </thead>
                  </>
                )}

                <tbody>

                  {table.type == 'summary' && (
                    <>
                      {table.rows.map((row, index) => (
                        <React.Fragment key={index}>
                          <tr style={{ height: table.rowHeight + 'cm' }}>
                            {row.map((cell, index) => (
                              <React.Fragment key={index}>
                                <td className="summaryKey" colSpan={row.colspan}>
                                  {cell.text}
                                </td>
                                <td
                                  className="summaryValue"
                                  colSpan={row.colspan}
                                >
                                  {cell.value}
                                </td>
                              </React.Fragment>
                            ))}
                          </tr>
                        </React.Fragment>
                      ))}
                    </>
                  )}
                  {/* {dump(table)} */}
                  {table.type == 'imageChart' && (
                    <>
                      {table.rows.map((row, index) => (
                        <React.Fragment key={index}>
                          <tr>
                            <td>
                              <h1 className="title" style={{ marginBottom: '.5cm' }}>{table.title}</h1>
                              <div className='imageChart' style={{ height: table.staticHeight + 'cm', position: 'relative' }}>
                                {!isLoading && (
                                  <>
                                    <img src={row[0]?.chartUrl ?? ''} style={{ maxHeight: table.staticHeight + 'cm', position: 'relative', top: '50%', transform: 'translateY(-50%)' }} />
                                  </>
                                )}
                                {isLoading && apiCalled && (
                                  <p>Loading Chart...</p>
                                )}
                              </div>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </>
                  )}

                  {(table.type === 'rows' ||
                    table.type === 'pageFooter' ||
                    table.type === 'pageHeader') && (
                      <>
                        {table.rows.map((row, index) => (
                          <React.Fragment key={index}>
                            <tr
                              className={table.type + '_row'}
                              style={{ height: table.rowHeight + 'cm' }}
                            >
                              {row.map((cell, index) => (
                                <React.Fragment key={index}>
                                  {cell.empty && !isLoading && (
                                    <>
                                      <td
                                        colSpan={table.head.length}
                                        className="empty"
                                      >
                                        {table.emptyMessage ?? 'No data to display'}
                                      </td>
                                    </>
                                  )}

                                  {table.type === 'rows' && isLoading && apiCalled && (
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
                                        colSpan={cell.colspan}
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
                                </React.Fragment>
                              ))}
                            </tr>
                          </React.Fragment>
                        ))}
                      </>
                    )}

                </tbody>

              </table>
            </React.Fragment>
          ))}
        </div>
      ))}
    </>
  );
}
