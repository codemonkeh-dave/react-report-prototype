import React from 'react';
import ReportViewer from '../components/reportViewer.js';
import ReportParams from '../components/reportParams.js';

import { useEffect, useState } from 'react';

export default function GenericReport({ reportDefinition }) {
  const [data, setData] = useState(reportDefinition.data);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiCalled, setApiCalled] = useState(false);
  const [params, setParams] = useState(reportDefinition.parameters ?? {});

  function dump(input) {
    return JSON.stringify(input, null, 2);
  }

  function handleResetClicked() {
    setParams(reportDefinition.parameters);
  }

  function handleSubmitClicked(parameters) {
    setParams(parameters)
  }

  function buildFilteredParams(keys, parameters)
  {
    try
    {
      if (keys.length == 0) {
        return {};
      }

      let params = {};
      keys.forEach(key => {
        params[key] = parameters[key]?.value ?? '';
      });
      return params;
    }
    catch(err)
    {
      return {};
    }
  }

  function buildQueryString(keysToInclude, parameters) {
    try
    {
      const filteredParams = buildFilteredParams(keysToInclude, parameters);
      return new URLSearchParams(filteredParams).toString();
    }
    catch(err)
    {
      console.error(err);
    }
  }

  function buildBody(keysToInclude, parameters) {
    try
    {
      if (keysToInclude.length == 0) {
        return {};
      }
      const filteredParams = buildFilteredParams(keysToInclude, parameters);
      return filteredParams;
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
        if (reportDefinition.apiEndpoint.queryStringParams.length > 0) {
          querystring = buildQueryString(reportDefinition.apiEndpoint.queryStringParams, params);
        }
        
        let body = {};
        if (reportDefinition.apiEndpoint.bodyParams.length > 0) {
          body = buildBody(reportDefinition.apiEndpoint.bodyParams, params);
        }
        
        setApiCalled(true);
        let endpoint = reportDefinition.apiEndpoint.url;
        if (querystring) endpoint += "?" + querystring;

        let fetchOptions = {};
        let headers = {};

        if (reportDefinition.apiEndpoint.customHeaders) {
          headers = {...headers, ...reportDefinition.apiEndpoint.customHeaders};
        }

        fetchOptions.method = reportDefinition.apiEndpoint.method;

        if (reportDefinition.apiEndpoint.method == "POST") {
          headers.accept = "application/json";
          headers['content-type'] = "application/json";
        }

        if (reportDefinition.apiEndpoint.includeAuthHeaders === true) {
          const bearerToken = localStorage.getItem('bearerToken');
          if (bearerToken)
            headers.authorization = `Bearer ${bearerToken}`
          else
          headers.authorization = `Bearer _BEARER_TOKEN_NOT_FOUND_`
        }

        fetchOptions.headers = headers;

        if (body) fetchOptions.body = JSON.stringify(body);
        fetch(endpoint, fetchOptions)
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
      <pre>{dump(reportDefinition.parameters)}</pre>
      <ReportParams resetClicked={handleResetClicked} submitClicked={handleSubmitClicked} parameters={params} />
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
