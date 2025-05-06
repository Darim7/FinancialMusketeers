import {Chart as ChartJS, registerables, scales } from 'chart.js/auto';
import { ReactElement } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(...registerables);

const LineGraph = ({datasets}:any) => {

    const defaultOptions = {
        type: 'line',
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
        },
        scales: {
          y: {
            max:100,
            title: {
              display: true,
              text: 'Probability (%)'
            }
          }
        },
        options: {
          elements: {
              point:{
                  radius: 0
              }
          }
        },
        fill: true,
      };
    
    console.log(datasets);
    const years = Object.keys(datasets);
    const values = Object.values(datasets);

    const percents = values.map((value:any) => {
        const percent = value * 100;
        return percent.toFixed(2);
    })

    const data = {
        labels: years, 
        datasets: [
            {
                label: 'Probability of Success',
                data: percents,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                borderWidth: 2,
                pointRadius: 0,
            }
        ]
    };
    
    return (
        <>
          <div style={{ height: '400px', width: '100%' }}>
            <Line data={data} options={defaultOptions} />
          </div>
        </>
    )
};

export default LineGraph;