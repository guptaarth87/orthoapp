import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Automatically registers necessary chart.js components

const AnalysisGraph = ({ analysisData }) => {
  // Sort and filter top 3 entities
  const sortedData = Object.entries(analysisData)
    .sort(([, a], [, b]) => b - a) // Sort in descending order by value
    .slice(0, 3); // Take the top 3

  const labels = sortedData.map(([key]) => key); // Extract keys for labels
  const values = sortedData.map(([, value]) => value); // Extract values for data

  // Prepares data for Chart.js
  const data = {
    labels, // X-axis labels (Top 3 keys)
    datasets: [
      {
        label: 'Analysis Results (%)',
        data: values, // Top 3 data points
        backgroundColor: [
          '#1f77b4', // Dark blue
          '#ff7f0e', // Dark orange
          '#2ca02c', // Dark green
        ],
        borderColor: [
          '#1f77b4',
          '#ff7f0e',
          '#2ca02c',
        ],
        borderWidth: 1, // Border width of the bars
      },
    ],
  };

  // Chart options to style the graph
  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100, // Set Y-axis max to 100%
        ticks: {
          callback: (value) => value + '%', // Adds '%' to y-axis labels
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Top 3 Analysis Results',
        font: {
          size: 18,
        },
      },
      legend: {
        display: false, // Hide the legend
      },
    },
    responsive: true, // Responsive design
    maintainAspectRatio: false, // Adjust the aspect ratio for responsiveness
  };

  return (
    <div style={{ width: '80%', margin: '0 auto', height: '400px' }}>
      <h3 className="text-center mt-4">Top 3 Analysis Graph</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default AnalysisGraph;
