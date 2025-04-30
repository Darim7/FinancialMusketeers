// Overview
import React, { ReactEventHandler } from 'react';
import './Overview.css';
import NavBar from '../components/NavBar';
import {CategoryScale} from 'chart.js'; 
import { Bar, Line } from "react-chartjs-2"
import Chart from 'chart.js/auto';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import LineGraph from '../components/LineGraph';
import StackedBarGraph from '../components/StackedBarGraph';

// user: {email, scenarios}
// pass in user
// grab user scenarios
// map -> selection option
// selected charts: checkbox
// interactive charst 
Chart.register(CategoryScale);

const userEmail = localStorage.getItem('userEmail');
const userName = localStorage.getItem('userName');


const testScenarios = {
  scenario1:{ name:"test1", 
              years:["2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033"], 
              probability: [100,100,100, 95, 93, 90, 85, 93, 95],
              totalInvestmentsAvg: [3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000],
              totalIncomeAvg: [3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000],
              expensesAvg: [3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000],
              totalInvestmentsMedian: [2900, 3900, 4900, 5900, 6800, 7700, 8800, 9900, 10800],
              totalIncomeMedian: [2950, 3950, 4950, 5950, 6900, 7850, 8950, 9950, 10900],  
              expensesMedian: [2850, 3850, 4800, 5800, 6700, 7650, 8700, 9800, 10700],
            },
  scenario2:{ name:"test2",
              years:["2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033", "2034", "2035"], 
              probability: [100,100,100, 95, 93, 90, 85, 93, 95, 90, 97],
              totalInvestmentsAvg: [3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 10000, 9000],
              totalIncomeAvg: [3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 10000, 9000],
              expensesAvg:[3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 10000, 9000],
              totalInvestmentsMedian: [2900, 3950, 4850, 5900, 6900, 7900, 8800, 9800, 10750, 9850, 8900],
              totalIncomeMedian:[2950, 3980, 4920, 5930, 6950, 7950, 8900, 9850, 10850, 9900, 8950],
              expensesMedian:[2850, 3900, 4800, 5800, 6850, 7850, 8700, 9750, 10600, 9850, 8850],
            },
  scenario3:{ name:"test3",
              years:["2025", "2026", "2027", "2028", "2029"], 
              probability: [100,83,85,95, 97],
              totalInvestmentsAvg: [3000, 4000, 5000, 6000, 2000],
              totalIncomeAvg: [3000, 4000, 5000, 6000, 2000],
              expensesAvg: [3000, 4000, 5000, 6000, 2000],
              totalInvestmentsMedian:[2900, 3900, 4950, 5900, 1900],
              totalIncomeMedian:[2950, 3950, 4975, 5950, 1950],
              expensesMedian:[2850, 3850, 4900, 5850, 1850],
  },
}

function Overview() {
  const [scenario, setScenario] = useState("");
  const [simulationAmount, setSimulationAmount] = useState(0);
  const [simulationData, setSimulationData] = useState<any>();
  const MAX_NUMBER_OF_CHARTS = 3;

  const [lineChart, setLineChart] = useState({
    probabilityofSuccess: false,
  });

  const [shadedLineChart, setShadedLineChart] = useState({
    totalInvestments: false,
    totalIncome: false,
    totalExpenses: false,
    earlyWithdrawalTax: false,
    percentageOfTotalDiscretionaryExpenses: false,
  });

  const [stackedBarGraph, setStackedBarGraph] = useState({
    average: false,
    median: false,
  });

  const countSelectedCharts = () => {
    const lineSelected = Object.values(lineChart).filter(Boolean).length;
    const shadedLineSelected = Object.values(shadedLineChart).filter(Boolean).length;
    const stackedSelected = Object.values(stackedBarGraph).filter(Boolean).length
    return lineSelected + shadedLineSelected + stackedSelected;
  };
  
  const totalSelectedCharts = countSelectedCharts();

  const handleScenarioSelection = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setScenario(e.target.value);

    // Reset the charts and simulation data when a new scenario is selected
    setLineChart({
      probabilityofSuccess: false,
    });
    setShadedLineChart({
      totalInvestments: false,
      totalIncome: false,
      totalExpenses: false,
      earlyWithdrawalTax: false,
      percentageOfTotalDiscretionaryExpenses: false,
    });
    setStackedBarGraph({
      average: false,
      median: false,
    });
    setSimulationData(false);
    setSimulationAmount(0);

    console.log("Selected Scenario:", e.target.value);
  }


  const handleLineChartSelection = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name, checked} = e.target;
    setLineChart(prevCharts => ({
      ...prevCharts,
      [name]: checked,
    }));

    console.log(lineChart);
  }

  const handleShadedLineChartSelection = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name, checked} = e.target;
    setShadedLineChart(prevCharts => ({
      ...prevCharts,
      [name]: checked,
    }));

    console.log(shadedLineChart);
  }

  const handleStackedBarGraphSelection = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name, checked} = e.target;
    setStackedBarGraph(prevCharts => ({
      ...prevCharts,
      [name]: checked,
    }));

    console.log(stackedBarGraph);
  }

  return (
    <div id="overviewDiv">

      <div id="navBar">
        <NavBar/>
      </div>
      
      <div id="main-content">
      <div id="selectScenario">
        {/* Dropdown to select the scenarios */}
        <Form.Select 
          id="selectScenarioForm"
          name="selectScenarioForm"            
          value={scenario}
          onChange={(e)=>handleScenarioSelection(e)}
        >
          <option value="" disabled>Select a scenario</option>
          {Object.keys(testScenarios).map((scenario) => (
            <option key={scenario} value={scenario}>
              {scenario}
            </option>
          ))}
        </Form.Select>
        </div>
        {/* If user selcts a scenario, allow them to checkbox the charts they want to see*/}

        {scenario && !simulationData && (
          <div id="simulationAmount">
            
            <Form.Label htmlFor="simulationAmount">
              How many times do you want to simulate?
            </Form.Label>
              <Form.Control
              id="simulationAmountInput"
              name="simulationAmount"
              type="number"
              placeholder="Enter how many times you want to simulate"
              value={simulationAmount}
              onChange={(e) => setSimulationAmount(parseInt(e.target.value))}
            />
            
            <Button
              id="simulateButton"
              name="simulateButton"
              variant="primary"
              onClick={(e) => {
                console.log("Simulating", simulationAmount, "times")
                setSimulationData(true);}
              }
            >
              Submit
            </Button>
          </div>
        )}

        {simulationData &&(
         <div id="charts">
            <div>
              <Form.Label className="availableChartHeaders" id="chartsLabel">
                Available Charts
              </Form.Label>
            </div>
            <div id="chartSelections">

            <div id="lineChart">
              <Form.Label class="availableChartHeaders" id="lineChartLabel">
                Line Graph 
              </Form.Label>
              <Form.Check
                type="checkbox"
                id="lineChart"
                name="probabilityofSuccess"
                label="Probability of Success"
                checked={lineChart.probabilityofSuccess}
                disabled={totalSelectedCharts >= MAX_NUMBER_OF_CHARTS && !lineChart.probabilityofSuccess}
                onChange={(e) => handleLineChartSelection(e)}  
              />
            </div>

            <div id="shadedLineGraph">
              <Form.Label class="availableChartHeaders" id="shadedLineGraphLabel">
                Shaded Line Graph
              </Form.Label>
              <Form.Check
                type="checkbox"
                id="shadedLineGraph"
                name="totalInvestments"
                label="Total Investments"
                checked={shadedLineChart.totalInvestments} 
                disabled={totalSelectedCharts >= MAX_NUMBER_OF_CHARTS && !shadedLineChart.totalInvestments}
                onChange={(e) => handleShadedLineChartSelection(e)}
              /> 
              <Form.Check
                type="checkbox"
                id="shadedLineGraph"
                name="totalIncome"
                label="Total Income"
                checked={shadedLineChart.totalIncome} 
                disabled={totalSelectedCharts >= MAX_NUMBER_OF_CHARTS && !shadedLineChart.totalIncome}
                onChange={(e) => handleShadedLineChartSelection(e)}
              /> 
              <Form.Check
                type="checkbox"
                id="shadedLineGraph"
                name="totalExpenses"
                label="Total Expenses"
                checked={shadedLineChart.totalExpenses} 
                disabled={totalSelectedCharts >= MAX_NUMBER_OF_CHARTS && !shadedLineChart.totalExpenses}
                onChange={(e) => handleShadedLineChartSelection(e)}
              /> 
              <Form.Check
                type="checkbox"
                id="shadedLineGraph"
                name="earlyWithdrawalTax"
                label="Early Withrdrawl Tax"
                checked={shadedLineChart.earlyWithdrawalTax} 
                disabled={totalSelectedCharts >= MAX_NUMBER_OF_CHARTS && !shadedLineChart.earlyWithdrawalTax}
                onChange={(e) => handleShadedLineChartSelection(e)}
              /> 
              <Form.Check
                type="checkbox"
                id="shadedLineGraph"
                name="percentageOfTotalDiscretionaryExpenses"
                label="Percentage of Total Discretionary Expenses"
                disabled={totalSelectedCharts >= MAX_NUMBER_OF_CHARTS && !shadedLineChart.percentageOfTotalDiscretionaryExpenses}
                checked={shadedLineChart.percentageOfTotalDiscretionaryExpenses} 
                onChange={(e) => handleShadedLineChartSelection(e)}
              /> 
            </div>

            <div id="stackedBarGraph">
              <Form.Label class="availableChartHeaders" id="stackedBarGraphLabel">
                Stacked Bar Graph of Quantity Over Time
              </Form.Label>
              <Form.Check
                type="checkbox"
                id="stackedBarGraph"
                name="average"
                label="Average Values"
                checked={stackedBarGraph.average}
                disabled={(totalSelectedCharts >= MAX_NUMBER_OF_CHARTS || stackedBarGraph.median) && !stackedBarGraph.average}
                onChange={(e) => handleStackedBarGraphSelection(e)}
              />
              <Form.Check
                type="checkbox"
                id="stackedBarGraph"
                name="median"
                label="Median Values"
                checked={stackedBarGraph.median}
                disabled={(totalSelectedCharts >= MAX_NUMBER_OF_CHARTS || stackedBarGraph.average) && !stackedBarGraph.median}
                onChange={(e) => handleStackedBarGraphSelection(e)}
              />
            </div>
            </div>
          </div>
        )}
          
        {/* Check if the bar chart is selectd */}
        <div id="graphContainer">
          {stackedBarGraph.average && (
            <div id="barGraph">
              <StackedBarGraph
                labels={testScenarios[scenario].years}
                datasets={[
                  {
                    label: "Total Investments",
                    data: testScenarios[scenario].totalInvestmentsAvg,
                  },
                  {
                    label:"Total Income",
                    data: testScenarios[scenario].totalIncomeAvg,
                  },
                  {
                    label:"Total Expense",
                    data: testScenarios[scenario].expensesAvg,
                  },
                ]}
              />
            </div>
          )}

          {stackedBarGraph.median && (
            <div id="barGraph">
              <StackedBarGraph
                labels={testScenarios[scenario].years}
                datasets={[
                  {
                    label: "Total Investments",
                    data: testScenarios[scenario].totalInvestmentsMedian,
                  },
                  {
                    label:"Total Income",
                    data: testScenarios[scenario].totalIncomeMedian,
                  },
                  {
                    label:"Total Expense",
                    data: testScenarios[scenario].expensesMedian,
                  },
                ]}
              />
            </div>
          )}

          {/* Check if Line Graph is selected */}
          {lineChart.probabilityofSuccess && (
            <div id="lineGraph">
              <LineGraph 
                labels={testScenarios[scenario].years}
                datasets={[
                  {
                    label: "Probability of Success",
                    data: testScenarios[scenario].probability,
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    fill: true,
                  }
                ]}
              />
            </div>              

            //  {/* <div id="lineGraph">
            //   <Line data={{
            //     labels: testScenarios[scenario].years,
            //     datasets: [
            //       {
            //         label: "Probability",
            //         data: testScenarios[scenario].probability,
            //       },
            //     ]
            //     }}
            //     options={{maintainAspectRatio: false}}>
            //   </Line>
            // </div> */}
          )}
        </div>
        </div>
      </div>
  );
}

export default Overview;  



