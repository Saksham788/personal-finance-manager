import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export default function SummaryChart({ transactions }) {
  const months = [
    'Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec'
  ];

  // Initialize income and expense data arrays
  const incomeData = new Array(12).fill(0);
  const expenseData = new Array(12).fill(0);

  // Aggregate transactions by month
  transactions.forEach((t) => {
    if (!t.date) return;
    const monthIndex = new Date(t.date).getMonth();
    if (t.type === 'income') {
      incomeData[monthIndex] += Number(t.amount);
    } else if (t.type === 'expense') {
      expenseData[monthIndex] += Number(t.amount);
    }
  });

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: 'rgba(34,197,94,0.7)',
        borderColor: 'rgba(34,197,94,1)',
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: 'Expense',
        data: expenseData,
        backgroundColor: 'rgba(239,68,68,0.7)',
        borderColor: 'rgba(239,68,68,1)',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#333',
          font: { size: 13, family: 'Inter, sans-serif' },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#555' },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#555' },
        grid: { color: 'rgba(200,200,200,0.2)' },
      },
    },
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 600,
        height: 350,
        background: 'var(--card-color, #fff)',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        margin: '0 auto',
      }}
    >
      <h3 style={{ marginBottom: 15, color: '#333' }}>Monthly Summary 📊</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
