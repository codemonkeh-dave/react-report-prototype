import React from 'react';
import ReportViewer from '../components/reportViewer.js';
import ReportParams from '../components/reportParams.js';

import { useEffect, useState } from 'react';

export default function GenericReport({ reportDefinition }) {
  const [data, setData] = useState(reportDefinition.data);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiCalled, setApiCalled] = useState(false);
  const [params, setParams] = useState({});

  function dump(input) {
    return JSON.stringify(input, null, 2);
  }

  function handleResetClicked() {
    console.log('reset clicked')
  }

  function handleSubmitClicked(parameters) {
    setParams(parameters)
  }

  function buildQueryString(keysToInclude, parameters) {
    console.log('buildQueryString', parameters, keysToInclude);
    try
    {
      if (keysToInclude.length == 0) {
        return "";
      }

      let queryParams = {};
      keysToInclude.forEach(key => {
        queryParams[key] = parameters[key]?.value ?? '';
      });
      return new URLSearchParams(queryParams).toString();
    }
    catch(err)
    {
      console.error(err);
    }
    
  }

  function loadReport() {
    setIsLoading(true);
    try {
      setTimeout(() => {

        let querystring= "";
        setApiCalled(true);
        if (reportDefinition.apiEndpoint.queryStringParams.length > 0) {
          querystring = buildQueryString(reportDefinition.apiEndpoint.queryStringParams, params);
        }

        let endpoint = reportDefinition.apiEndpoint.url;
        if (querystring) endpoint += "?" + querystring;

        console.log(querystring)
        console.log(endpoint)


        fetch(endpoint)
          .then((response) => {
            if (!response.ok) {
              setError(true);
              return;
            }
            return response.json();
          })
          .then((response) => {
            setTimeout(() => {
              setData({ ...data, ...response });
              setIsLoading(false);
            }, 2000);
          })
          .catch((err) => {
            console.error(err);
          });
      }, 500)
    } catch (err) {
      console.error(err);
    }
    setError(true)
  }

  useEffect(() => {
    loadReport();
  }, [params]);

  return (
    <>
      <pre>{dump(params)}</pre>
      <ReportParams resetClicked={handleResetClicked} submitClicked={handleSubmitClicked} parameters={reportDefinition.parameters} />
      <ReportViewer
        data={data}
        params={params}
        apiCalled={apiCalled}
        layout={reportDefinition.layout}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}
