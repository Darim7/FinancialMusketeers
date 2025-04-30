import {Chart as ChartJS, registerables } from 'chart.js/auto';
import { ReactElement } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(...registerables);

const StackedBarGraph = ({labels, datasets, options}:any): ReactElement => {
    const defaultOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
        },
        scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
            },
          },
        ...options,
      };

      const data = {
        labels,
        datasets,
      };
    

    return (
        <>
            <Bar 
                data={data}
                options={defaultOptions}>
            </Bar>
        </>
    )
}

export default StackedBarGraph;