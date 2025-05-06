import {Chart as ChartJS, registerables } from 'chart.js/auto';
import { ReactElement } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(...registerables);

const ShadedLineChart = ({datasets, type }:any): ReactElement => {

    const getChartTitle = () => {
      switch(type) {
        case 'investments':
          return 'Investment Trends with Confidence Intervals';
        case 'income':
          return 'Income Trends with Confidence Intervals';
        case 'expenses':
          return 'Expense Trends with Confidence Intervals';
        default:
          return 'Financial Trends with Confidence Intervals';
      }
    };
    const defaultOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: getChartTitle(),
            font: {
              size: 16,
              weight: 'bold'
            },
          }
        },
        fill: true,
      };

      let cleaned_data;
      const years = Object.keys(datasets);
      const values = Object.values(datasets);

      console.log(values);

      const findMedian = (nums:[]) => {
        const sortedArr = [...nums].sort((a, b) => a - b);
        const middleIndex = Math.floor(sortedArr.length / 2);
        if (sortedArr.length % 2 !== 0) {
          return sortedArr[middleIndex];
        }
        return (sortedArr[middleIndex - 1] + sortedArr[middleIndex]) / 2;
      }

      const processInvestmentDataMedian = () => {
        let investmentData:any = []
  
        values.forEach((value:any) => {
          let curr_val:any = []
          value.forEach((x:any) => {
              curr_val.push(x.investment_total);
          })
          let med = findMedian(curr_val);
          investmentData.push(med);
        })
        // console.log(investmentData)
        return investmentData;
      }

      const processIncomeDataMedian = () => {
        
        let incomeData:any = []
  
        values.forEach((value:any) => {
          let curr_val:any = []
          value.forEach((x:any) => {
              curr_val.push(x.income_total);
          })
          let med = findMedian(curr_val);
          incomeData.push(med);
        })
        // console.log(incomeData)
        return incomeData;
      }

      const processExpenseDataMedian = () => {
        let expenseData:any = []
  
        values.forEach((value:any) => {
          let curr_val:any = []
          value.forEach((x:any) => {
              curr_val.push(x.expenses_total);
          })
          let med = findMedian(curr_val);
          expenseData.push(med);
        })
        // console.log(incomeData)
        return expenseData;
      }
      
      if (type === "investments"){
        cleaned_data = processInvestmentDataMedian();
        
      }
      else if (type === "income"){
        cleaned_data = processIncomeDataMedian();
      }
      else if (type === "expenses"){
        cleaned_data = processExpenseDataMedian();
      }

      console.log(cleaned_data);
      let range1090Lower:any = []
      let range1090Upper:any = []
      let range2080Lower:any = []
      let range2080Upper:any = []
      let range3070Lower:any = []
      let range3070Upper:any = []
      let range4060Lower:any = []
      let range4060Upper:any = []

      cleaned_data.map((num:number) => {
        let range1090 = num * (0.4);
        range1090Lower.push(num - range1090);
        range1090Upper.push(num + range1090);

        let range2080 = num * (0.3);
        range2080Lower.push(num - range2080);
        range2080Upper.push(num + range2080);

        let range3070 = num * (0.2);
        range3070Lower.push(num - range3070);
        range3070Upper.push(num + range3070);

        let range4060 = num * (0.1);
        range4060Lower.push(num - range4060);
        range4060Upper.push(num + range4060);
      })

      console.log(range1090Lower)
      console.log(range1090Upper)

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

      const chartData = {
        labels: years,
        datasets: [
            {
                label: 'Median',
                data: cleaned_data,
                borderColor: 'rgb(251, 6, 6)',
                backgroundColor: 'rgb(253, 0, 0)',
                fill: false,
                borderWidth: 2,
                tension: 0.1,
                pointRadius: 0,
            },
            {
                label: '40%-60% Lower',
                data: range4060Lower,
                fill: 1,
                backgroundColor: 'rgba(1, 32, 52, 0.5)',
                borderWidth: 1,
                pointRadius: 0,
              },
              {
                label: '40%-60% Upper',
                data: range4060Upper,
                fill: 1,
                backgroundColor: 'rgba(1, 32, 52, 0.5)',
                borderWidth: 1,
                pointRadius: 0,
              },
              {
                label: '30%-70% Lower',
                data: range3070Lower,
                fill: '-2',
                backgroundColor: 'rgba(7, 69, 110, 0.4)',
                borderWidth: 1,
                pointRadius: 0,
              },
              {
                label: '30%-70% Upper',
                data: range3070Upper,
                fill: "-2",
                backgroundColor: 'rgba(7, 69, 110, 0.4)',
                borderWidth: 1,
                pointRadius: 0,
              },
              {
                label: '20%-80% Lower',
                data: range2080Lower,
                fill: '-2',
                backgroundColor: 'rgba(53, 162, 235, 0.3)',
                borderWidth: 1,
                pointRadius: 0,
              },
              {
                label: '20%-80% Upper',
                data: range2080Upper,
                fill: '-2',
                backgroundColor: 'rgba(53, 162, 235, 0.3)',
                borderWidth: 1,
                pointRadius: 0,
              },
            {
              label: '10%-90% Lower',
              data: range1090Lower,
              fill: '-2',
              backgroundColor: 'rgba(53, 162, 235, 0.2)',
              borderWidth: 1,
              pointRadius: 0,
            },
            {
              label: '10%-90% Upper',
              data: range1090Upper,
              fill: '-2',
              backgroundColor: 'rgba(53, 162, 235, 0.2)',
              borderWidth: 1,
              pointRadius: 0,
            }, 
          ],
      };
    
    return (
        <>
        <div style={{ height: '400px', width: '100%' }}>
            <Line 
                data={chartData}
                options={defaultOptions}>
            </Line>
        </div>
        </>
    )
}
export default ShadedLineChart;