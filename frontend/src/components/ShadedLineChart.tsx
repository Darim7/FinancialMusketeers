import {Chart as ChartJS, registerables } from 'chart.js/auto';
import { ReactElement } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(...registerables);

const ShadedLineChart = ({datasets, type }:any): ReactElement => {
    const defaultOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
        },
        fill: true,
      };

      const data = {
        labels,
        datasets,
      };

      const testOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          y: {
            title: {
              display: true,

            }
          },
          x: {
            title: {
              display: true,
              text: 'Year'
            }
          }
        },
        elements: {
          point: {
            radius: 3,
          },
          line: {
            tension: 0.3,
          },
        },
      };

      const dataSet = {
              median: [100000, 107000, 114490, 122504, 131080, 140256, 150074, 160578, 171810],
              range4060Upper: [103000, 110210, 117624, 125553, 134001, 143064, 152779, 163174, 174293],
              range4060Lower: [97000, 103790, 111356, 119455, 128159, 137448, 147369, 157982, 169327],
              range3070Upper: [105000, 112490, 120309, 128629, 137472, 146872, 156862, 167479, 178764],
              range3070Lower: [95000, 101510, 108671, 116379, 124688, 133640, 143286, 153677, 164857],
              range2080Upper: [108000, 115990, 124234, 132975, 142234, 152048, 162450, 173488, 185205],
              range2080Lower: [92000, 99010, 104746, 111240, 118442, 126465, 135316, 145026, 155652],
              range1090Upper: [111000, 119570, 128159, 137179, 146654, 156624, 167122, 178184, 189849],
              range1090Lower: [89000, 97030, 100821, 107829, 115506, 123888, 132994, 142868, 153552],
      }

      const chartData = {
        labels,
        datasets: [
            {
                label: 'Median',
                data: dataSet.median,
                borderColor: 'rgb(251, 6, 6)',
                backgroundColor: 'rgb(253, 0, 0)',
                fill: false,
                borderWidth: 2,
                tension: 0.1,
                pointRadius: 0,
            },
            {
                label: '40%-60% Lower',
                data: dataSet.range4060Lower,
                fill: 1,
                backgroundColor: 'rgba(1, 32, 52, 0.5)',
                borderWidth: 1,
                pointRadius: 0,
  
  
              },
              {
                label: '40%-60% Upper',
                data: dataSet.range4060Upper,
                fill: 1,
                backgroundColor: 'rgba(1, 32, 52, 0.5)',
                borderWidth: 1,
                pointRadius: 0,
  
  
              },
              {
                label: '30%-70% Lower',
                data: dataSet.range3070Lower,
                fill: '-2',
                backgroundColor: 'rgba(7, 69, 110, 0.4)',
                borderWidth: 1,
                pointRadius: 0,
  
  
              },
              {
                label: '30%-70% Upper',
                data: dataSet.range3070Upper,
                fill: "-2",
                backgroundColor: 'rgba(7, 69, 110, 0.4)',
                borderWidth: 1,
                pointRadius: 0,
  
  
              },
              {
                label: '20%-80% Lower',
                data: dataSet.range2080Lower,
                fill: '-2',
                backgroundColor: 'rgba(53, 162, 235, 0.3)',
                borderWidth: 1,
                pointRadius: 0,
  
  
              },
              {
                label: '20%-80% Upper',
                data: dataSet.range2080Upper,
                fill: '-2',
                backgroundColor: 'rgba(53, 162, 235, 0.3)',
                borderWidth: 1,
                pointRadius: 0,
  
  
              },
            {
              label: '10%-90% Lower',
              data: dataSet.range1090Lower,
              fill: '-2',
              backgroundColor: 'rgba(53, 162, 235, 0.2)',
              borderWidth: 1,
              pointRadius: 0,
            },
            {
              label: '10%-90% Upper',
              data: dataSet.range1090Upper,
              fill: '-2',
              backgroundColor: 'rgba(53, 162, 235, 0.2)',
              borderWidth: 1,
              pointRadius: 0,
            }, 
          ],
      };
    

    return (
        <>
            <Line 
                data={chartData}
                options={defaultOptions}>
            </Line>
        </>
    )
}
export default ShadedLineChart;