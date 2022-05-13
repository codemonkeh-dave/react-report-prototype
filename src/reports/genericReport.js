import React from 'react';
import ReportViewer from '../components/reportViewer.js';
import ReportParams from '../components/reportParams.js';

import { useEffect, useState } from 'react';

export default function GenericReport({ reportDefinition }) {
  const [data, setData] = useState(reportDefinition.data);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiCalled, setApiCalled] = useState(false);

  function handleResetClicked()
  {
    console.log('reset clicked')
  }

  function handleSubmitClicked(params)
  {
    console.log('submit clicked', params)
  }
  


  useEffect(() => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        setApiCalled(true);
        fetch(reportDefinition.apiEndpoint)
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
  }, []);

  return (
    <>
      {/* {JSON.stringify(data)} */}
      <ReportParams resetClicked={handleResetClicked} submitClicked={handleSubmitClicked} parameters={reportDefinition.parameters} />
      <ReportViewer
        data={data}
        apiCalled={apiCalled}
        layout={reportDefinition.layout}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}
