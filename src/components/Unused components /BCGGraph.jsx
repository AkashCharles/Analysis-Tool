import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BCGGraph = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');

    new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Stars',
            data: [{ x: 3, y: 7 }],
            backgroundColor: 'rgba(255, 99, 132, 1)',
          },
          {
            label: 'Question Mark',
            data: [{ x: 7, y: 7 }],
            backgroundColor: 'rgba(54, 162, 235, 1)', 
          },
          {
            label: 'Cash Cows',
            data: [{ x: 3, y: 3 }],
            backgroundColor: 'rgba(255, 206, 86, 1)',
          },
          {
            label: 'Dogs',
            data: [{ x: 7, y: 3 }],
            backgroundColor: 'rgba(75, 192, 192, 1)', 
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Market Growth Rate',
            },
            min: 0,
            max: 10,
          },
          y: {
            title: {
              display: true,
              text: 'Relative Market Share',
            },
            min: 0,
            max: 10,
          },
        },
      },
    });
  }, []);

  return <canvas ref={chartRef} width="400" height="400" />;
};

export default BCGGraph;
