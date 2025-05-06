import {Chart as ChartJS, registerables } from 'chart.js/auto';
import { ReactElement } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(...registerables);

const StackedBarGraph = ({datasets, option}:any): ReactElement => {
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
      };  

    let data;
      
    if (option === "average") {
      // average
    }
    else {
      // median
    }

    return (
        <>

        </>
    )
}

export default StackedBarGraph;