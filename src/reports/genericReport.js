import React from 'react';
import ReportViewer from '../components/reportViewer.js';
import { useEffect, useState } from 'react';

export default function GenericReport({ reportDefinition }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(reportDefinition.data);

  useEffect(() => {
    setIsLoading(true);

    fetch(reportDefinition.apiEndpoint)
      .then((response) => response.json())
      .then((response) => {
        setData({ ...data, ...response });
        setIsLoading(false);
      });

  }, []);

  return (
    <>
      {/* {JSON.stringify(data)} */}
      <ReportViewer
        data={data}
        layout={reportDefinition.layout}
        isLoading={isLoading}
      />
    </>
  );
}
