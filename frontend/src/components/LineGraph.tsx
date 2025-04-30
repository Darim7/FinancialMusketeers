import {Chart as ChartJS, registerables } from 'chart.js/auto';
import { ReactElement } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(...registerables);

const LineGraph = ({labels, datasets, options}:any) => {

    const defaultOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
        },
        fill: true,
        ...options,
      };

      const data = {
        labels,
        datasets,
      };
    

    return (
        <>
            <Line 
                data={data}
                options={defaultOptions}>
            </Line>
        </>
    )
};

export default LineGraph;