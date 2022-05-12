import React from 'react';
import GenericReport from './reports/genericReport.js';
import './style.css';

export default function App() {
  const reportObj = {
    layout: [
      {
        type: 'reportHeader',
        title: 'Users Report',
        subTitle: 'By company and age',
        icon: 'https://cloudpass.azureedge.net/images/report-icon-delivery.png',
      },
      {
        type: 'imageChart',
        rowHeight: 1,
        staticHeight: 10,
        url: 'https://editor.image-charts.com/?tab_editor=gallery#https:/image-charts.com/chart?chbr=20&chco=CFECF7%2C27c9c2&chd=a%3A10000%2C50000%2C60000%2C80000%2C40000%7C50000%2C60000%2C100000%2C40000%2C20000&chdl=N%7CN-1&chdlp=r&chl=10%7C50%7C60%7C80%7C40%7C50%7C60%7C100%7C40%7C20&chs=700x450&cht=bvs&chtt=Revenue%20per%20month&chxl=0%3A%7CJan%7CFev%7CMar%7CAvr%7CMay&chxs=1N%2AcUSD0sz%2A%2C000000%2C14&chxt=x%2Cy',
      },
      {
        type: 'pageHeader',
        className: 'pageHeader',
        rowHeight: 1,
        columns: [{ text: '{0}', variables: ['title'] }],
      },
      {
        type: 'summary',
        className: 'hello',
        rowHeight: 0.7,
        marginTop: 0.2,
        marginBottom: 0.5,
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
        rowHeight: 1,
        noDataHeight: 10,
        dataSet: 'dataSet1',
        columns: [
          { header: 'Name', dataSetKey: 'name', className: 'Name' },
          { header: 'Company', dataSetKey: 'company' },
          { header: 'Hours Worked', dataSetKey: 'age' },
          { header: 'Checked-In', type: 'checkbox' },
        ],
        emptyMessage: 'No users to display',
      },
      {
        type: 'pageFooter',
        className: 'pageFooter',
        rowHeight: 1,
        columns: [
          {
            text: 'Page {0} of {1}',
            variables: ['pageNumber', 'pageCount'],
            hideWhenLoading: true,
          },
          { text: 'Report generated {0}', variables: ['date'] },
          {
            text: '',
          },
        ],
      },
    ],
    data: {
      variables: {
        title: 'Users Report',
        date: new Date().toLocaleDateString(),
      },
      summaryDataSet: [
        // { value: '31' },
        // { value: '11.05.22' },
        // { value: '11:30AM' },
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
    },
    apiEndpoint: 'https://eolnbeduw5sicf9.m.pipedream.net/',
  };

  return (
    <>
      <GenericReport reportDefinition={reportObj} />
    </>
  );
}
