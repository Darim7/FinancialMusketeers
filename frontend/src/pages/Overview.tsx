// Overview
import React, { ReactEventHandler, useEffect } from 'react';
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
import ShadedLineChart from '../components/ShadedLineChart';
import axios from 'axios';
import SurfacePlot from '../components/SurfacePlot';
import ContourPlot from '../components/ContourPlot';

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
              median: [100000, 107000, 114490, 122504, 131080, 140256, 150074, 160578, 171810],
              range4060Upper: [103000, 110210, 117624, 125553, 134001, 143064, 152779, 163174, 174293],
              range4060Lower: [97000, 103790, 111356, 119455, 128159, 137448, 147369, 157982, 169327],
              range3070Upper: [105000, 112490, 120309, 128629, 137472, 146872, 156862, 167479, 178764],
              range3070Lower: [95000, 101510, 108671, 116379, 124688, 133640, 143286, 153677, 164857],
              range2080Upper: [108000, 115990, 124234, 132975, 142234, 152048, 162450, 173488, 185205],
              range2080Lower: [92000, 99010, 104746, 111240, 118442, 126465, 135316, 145026, 155652],
              range1090Upper: [111000, 119570, 128159, 137179, 146654, 156624, 167122, 178184, 189849],
              range1090Lower: [89000, 97030, 100821, 107829, 115506, 123888, 132994, 142868, 153552],
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
  let user;
  const [userData, setUserData] = useState<string[] | null>(null);
  const [fetchUserScenarios, setFetchUserScenarios] = useState<any[]>([]);
  const selectedScenarioData = fetchUserScenarios[parseInt(scenario)];

  const getUser = async () => {
    try {
      const response = await axios.get('/api/get_user', {
        params: {
        user_email: userEmail,
        user_name: userName
        }
      });
      
      const userData = response.data;
      const userDataArray = userData.data.scenarios;
      console.log("User Data:", userData);
      console.log("User Data Array:", userDataArray);
      setUserData(userDataArray);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    useEffect(() => {
      if (userEmail && userName) {
        getUser();
      }
    }, [userEmail, userName]);

    const getScenario = async () => {
      if (!userData || userData.length === 0) {
        console.error("No scenario IDs found in userData.");
        return;
      }
      try {
        const scenarioPromises = userData.map(async (scenario) => {
          // console.log("Making request for scenario ID:", scenario);
          const response = await axios.post('/api/get_scenario', { _id: scenario });
          return response.data.data;
      });
    
      const scenarios = await Promise.all(scenarioPromises);
      setFetchUserScenarios(scenarios);
          
    
            // Wait for all promises to resolve
          
            // const responses = await Promise.all(scenarioPromises);
            // console.log("Responses:", responses);

    
            // Extract the scenario data from each response
            // const scenarios = response.map((res) => res.data.data);
    
            // Update the state with the fetched scenarios
            // setFetchUserScenarios(scenarios);
    
            // console.log("Fetched Scenarios:", scenarios);
        } catch (err) {
            console.error("Error fetching scenarios:", err);
        }
    };
    useEffect(() => {
        console.log("what the heck is userdata.scenario", userData?.length);
        if (userData && userData.length > 0) {
            getScenario();
        }
    }, [userData]);
    
    console.log("Fetch Scenarios:", fetchUserScenarios);


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

  const [surfacePlot, setSurfacePlot] = useState({ 
    finalValueOfProbabilityOfSuccess: false,
    finalValueOfMedianTotalInvestments: false,
  })

  const [contourPlot, setContourPlot] = useState({ 
    finalValueOfProbabilityOfSuccess: false,
    finalValueOfMedianTotalInvestments: false,
  })


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
    setSurfacePlot({
      finalValueOfProbabilityOfSuccess: false,
      finalValueOfMedianTotalInvestments: false,
    })
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

  const handleSurfacePlotSelection = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name, checked} = e.target;
    setSurfacePlot(prevCharts => ({
      ...prevCharts,
      [name]: checked,
    }));

    console.log(surfacePlot);
  }

  const handleContourPlotSelection = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name, checked} = e.target;
    setContourPlot(prevCharts => ({
      ...prevCharts,
      [name]: checked,
    }));

    console.log(contourPlot);
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
          {Object.keys(testScenarios).map((scenario, index) => (
            <option key={scenario} value={scenario}>
              {scenario}
            </option>

          // {fetchUserScenarios.map((scenario, index) => (
          //   <option key={scenario._id} value={index}>
          //     {scenario.name}
          //   </option>
          // ))}
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

            <div id='surfacePlot'>
              <Form.Label class="availableChartHeaders" id="surfacePlotLabel">
                Surface Plot
              </Form.Label>
              <Form.Check
                type="checkbox"
                id="surfacePlot"
                name="finalValueOfProbabilityOfSuccess"
                label="Final Value of Probability of Success"
                checked={surfacePlot.finalValueOfProbabilityOfSuccess}
                onChange={(e) => handleSurfacePlotSelection(e)}
              />
              <Form.Check
                type="checkbox"
                id="surfacePlot"
                name="finalValueOfMedianTotalInvestments"
                label="Final Value of Median Total Investments"
                checked={surfacePlot.finalValueOfMedianTotalInvestments}
                onChange={(e) => handleSurfacePlotSelection(e)}
              />
              </div>

              <div id='contourPlot'>
              <Form.Label class="availableChartHeaders" id="contourPlotLabel">
                Contour Plot
              </Form.Label> 
              <Form.Check
                type="checkbox"
                id="contourPlot"
                name="finalValueOfProbabilityOfSuccess"
                label="Final Value of Probability of Success"
                checked={contourPlot.finalValueOfProbabilityOfSuccess}
                onChange={(e) => handleContourPlotSelection(e)}
              />
              <Form.Check
                type="checkbox"
                id="contourPlot"
                name="finalValueOfMedianTotalInvestments"
                label="Final Value of Median Total Investments"
                checked={contourPlot.finalValueOfMedianTotalInvestments}
                onChange={(e) => handleContourPlotSelection(e)}
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

          {/* Check if Shaded Line Graph is selected */}
          {shadedLineChart.totalInvestments && (
            <div id="shadedLineGraph">
              <ShadedLineChart
                labels = {testScenarios[scenario].years}
              />
            </div>
          )}

          {surfacePlot.finalValueOfProbabilityOfSuccess && (
            <div id="surfacePlot">
              <SurfacePlot/>
            </div>
          )}

          {contourPlot.finalValueOfProbabilityOfSuccess && (
            <div id="contourPlot">
              <ContourPlot/>
            </div>
          )}



        </div>
        </div>
      </div>
  );
}

export default Overview;  



