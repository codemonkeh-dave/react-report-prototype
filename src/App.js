import React from 'react';
import GenericReport from './reports/genericReport.js';
import './style.css';

export default function App() {
  const reportObj = {
    runOnLoad: true,
    parameters: {
      filter: {
        label: 'Label A',
        type: 'text',
        value: 'A text filter here'
      },
      filter2: {
        label: 'Label B',
        type: 'text',
        value: 'A text filter here'
      },
      filter3: {
        label: 'Label C',
        type: 'text',
        value: 'A text filter here'
      },
      siteId: {
        label: 'Site',
        type: 'dropdown',
        emptyOption: { text: 'Select a site'},
        endpoint: { url: 'https://eoujh3f1cjlenvn.m.pipedream.net'},
        value: '-1'
      }
    },
    layout: [
      {
        type: 'reportHeader',
        title: 'Users Report',
        subTitle: 'By Company and Age',
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
        className: 'hello',
        rowHeight: 0.7,
        marginTop: 0.5,
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
        type: 'imageChart',
        rowHeight: 1,
        staticHeight: 8,
        title: "Users by Month",
        dataSet: 'userReportData',
        chartUrl: 'https://image-charts.com/chart?chbr=20&chco=0191c8&chdlp=r&chs=650x300&cht=bvs&chtt=&chxt=x%2Cy'
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
      // summaryDataSet: [
      // { value: '31' },
      // { value: '11.05.22' },
      // { value: '11:30AM' },
      // ],
      // dataSet1: [
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
      // ],
    },
    apiEndpoint: { 
      url: 'https://eolnbeduw5sicf9.m.pipedream.net/',
      method: 'POST',
      queryStringParams: ['filter', 'siteId'],
      bodyParams: ['filter', 'siteId'],
      includeAuthHeaders: true,
      customHeaders: {
        'test-header': 'test-value'
      }
    }
  };

  return (
    <>
      <GenericReport reportDefinition={reportObj} />
    </>
  );
}
