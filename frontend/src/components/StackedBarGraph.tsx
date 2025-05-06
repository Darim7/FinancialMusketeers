import {Chart as ChartJS, registerables } from 'chart.js/auto';
import { ReactElement } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(...registerables);

const StackedBarGraph = ({datasets, type, option}:any): ReactElement => {
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

      console.log(datasets, option,type);
      const years = Object.keys(datasets);
      const values = Object.values(datasets);

      console.log(values);
      // values.forEach((value:any) => {
      //   console.log(value);
      //   let avg_val = 0;
      //   value.forEach((v:any) => {
      //       console.log(v);
      //   }
      // )
      // })

    const processInvestmentDataAvg = () => {
      const types = new Set<string>();
      values.forEach((value:any) => {
        // console.log(value);
        value.forEach((x:any) => {
          Object.keys(x.investment_values).forEach((key:any) => {
            types.add(key);
          })
        })
      })
      const investmentTypeArray = Array.from(types);
      console.log(investmentTypeArray);
      
      const investmentData = {}
      investmentTypeArray.forEach(type => {
        investmentData[type] = [];
      });

      console.log(investmentData);

      values.forEach((value:any) => {
        let curr_val = {}
        value.forEach((x:any) => {
          Object.keys(x.investment_values).forEach((key:any) => {
            if (curr_val[key] === undefined) {
              curr_val[key] = x.investment_values[key];
            }
            else {
              curr_val[key] += x.investment_values[key];
            }
          })
        })
        Object.keys(curr_val).forEach((key:any) => {
          let avg = (curr_val[key] / value.length); 
          investmentData[key].push(avg);
        })


      })
      
      console.log(investmentData)
      return investmentData;
    }

    const findMedian = (nums:[]) => {
      console.log("MEDIANNNNNNNN", nums)
      const sortedArr = [...nums].sort((a, b) => a - b);
      const middleIndex = Math.floor(sortedArr.length / 2);
      if (sortedArr.length % 2 !== 0) {
        return sortedArr[middleIndex];
      }
      return (sortedArr[middleIndex - 1] + sortedArr[middleIndex]) / 2;
    }
  
    const processInvestmentDataMedian = () => {
      const types = new Set<string>();
      values.forEach((value:any) => {
        // console.log(value);
        value.forEach((x:any) => {
          Object.keys(x.investment_values).forEach((key:any) => {
            types.add(key);
          })
        })
      })
      const investmentTypeArray = Array.from(types);

      const investmentData = {}
      investmentTypeArray.forEach(type => {
        investmentData[type] = [];
      });

      values.forEach((value:any) => {
        let curr_val = {}
        value.forEach((x:any) => {
          Object.keys(x.investment_values).forEach((key:any) => {
            if (curr_val[key] === undefined) {
              curr_val[key] = [];
            }
            curr_val[key].push(x.investment_values[key])
          })
        })
        Object.keys(curr_val).forEach((key:any) => {
          value = findMedian(curr_val[key]); 
          investmentData[key].push(value);
        })
      })
      
      console.log(investmentData)
      return investmentData;
    }

    let cleaned_data;

    if (type === "investment") {
      if (option === "average") {
        cleaned_data = processInvestmentDataAvg();
      }
      else {
        cleaned_data = processInvestmentDataMedian();
      }
    }

    console.log(cleaned_data);

    function transformDataForChart(cleaned_data: Record<string, number[]> | undefined) {
      if (!cleaned_data) return { labels: [], datasets: [] };
      
      // Create datasets array with proper structure
      const datasets = Object.keys(cleaned_data).map((key, index) => {
        return {
          label: key,
          data: cleaned_data[key],
        };
      });
      
      return {
        labels: years,
        datasets: datasets
      };
    }

    const chartData = transformDataForChart(cleaned_data);

    console.log(chartData);

    return (
        <>
          <Bar 
            data={chartData} options={defaultOptions}
          />
        </>
    )
}

export default StackedBarGraph;