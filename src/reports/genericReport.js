import React from 'react';
import ReportViewer from '../components/reportViewer.js';
import { useEffect, useState } from 'react';

export default function GenericReport({ reportDefinition }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(reportDefinition.data);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    try {
      fetch(reportDefinition.apiEndpoint)
        .then((response) => {
          if (!response.ok) {
            setError(true);
            return;
          }
          return response.json();
        })
        .then((response) => {
          setData({ ...data, ...response });
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
    }

    setError(true)
  }, []);

  return (
    <>
      {/* {JSON.stringify(data)} */}
      <ReportViewer
        data={data}
        layout={reportDefinition.layout}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}
