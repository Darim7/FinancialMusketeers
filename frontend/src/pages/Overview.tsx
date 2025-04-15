// Overview
import React, { ReactEventHandler } from 'react';
import './Overview.css';
import NavBar from '../components/NavBar';
import {CategoryScale} from 'chart.js'; 
import { Bar, Line } from "react-chartjs-2"
import Chart from 'chart.js/auto';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';

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
  scenario1: {name:"test1"},
  scenario2: {name:"test2"},
  scenario3: {name:"test3"},
}
function Overview() {
  const [scenario, setScenario] = useState("");
  const [charts, setCharts] = useState({
    lineChart: false,
    barChart: false,
  })

  const handleChartSelection = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name, checked} = e.target;
    setCharts(prevCharts => ({
      ...prevCharts,
      [name]: checked,
    }));

    console.log(charts);
  }

  return (
    <div id="overviewDiv">
      <NavBar/>
      
      <div id="selectScenario">
        {/* Dropdown to select the scenarios */}
        <Form.Select 
          id="selectScenarioForm"
          name="selectScenarioForm"            
          value={scenario}
          onChange={(e)=>setScenario(e.target.value)}
        >
          <option>Select a scenario</option>
          {Object.values(testScenarios).map((scenario) => (
            <option key={scenario.name} value={scenario.name}>
              {scenario.name}
            </option>
          ))}
        </Form.Select>
      </div>
        {/* If user selcts a scenario, allow them to checkbox the charts they want to see*/}

        {scenario && (
          <div id="selectCharts">
            <Form 
              id="selectCharts"
              name="selectCharts"
            >
              <Form.Check 
                type="switch"
                id="lineGraph"
                name="lineChart"
                label="Line Graph"
                checked={charts.lineChart}
                onChange={handleChartSelection}
              />
              <Form.Check 
                type="switch"
                id="barGraph"
                name="barChart"
                label="Bar Graph"
                checked={charts.barChart}
                onChange={handleChartSelection}
              />
            </Form>
          </div>
        )}

        {/* Check if the bar chart is selectd */}
        {charts.barChart && (
          <div id="barGraph">
            <Bar data={{
            labels: ["A", "B", "C"],
            datasets: [
              {
                label: "Revenue",
                data: [100,200,300],
              },
              {
                label:"Loss",
                data: [90,80,70],
              },
            ]
            }}>
          </Bar>
        </div>
        )}

        {/* Check if Line Graph is selected */}
        {charts.lineChart && (
          <div id="lineGraph">
            <Line data={{
              labels: ["A", "B", "C"],
              datasets: [
                {
                  label: "Revenue",
                  data: [100,200,300],
                },
                {
                  label:"Loss",
                  data: [90,80,70],
                },
              ]
              }}>
            </Line>
          </div>
        )}
        
      </div>
  );
}

export default Overview;  



