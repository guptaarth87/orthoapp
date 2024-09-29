import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Automatically registers necessary chart.js components

const AnalysisGraph = ({ analysisData }) => {
  // Prepares data for Chart.js
  const data = {
    labels: Object.keys(analysisData), // X-axis labels (Doubtful, Healthy, etc.)
    datasets: [
      {
        label: 'Analysis Results (%)',
        data: Object.values(analysisData), // Data points (0.34, 0.21, etc.)
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
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
        ticks: {
          callback: (value) => value + '%', // Adds '%' to y-axis labels
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Analysis Graph',
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
      <h3 className="text-center mt-4">Analysis Graph</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default AnalysisGraph;
