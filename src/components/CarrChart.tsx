import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CarrData } from '../types/types';
import { getMinCarr, getHistory } from '../utils/storage';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CarrChartProps {
  data: CarrData[];
}

export const CarrChart: React.FC<CarrChartProps> = ({ data }) => {
  const history = getHistory();
  const previousData = history.length > 1 ? history[history.length - 2].data : [];

  const monthlyData = data.reduce((acc: { [key: string]: number }, curr) => {
    acc[curr.month] = (acc[curr.month] || 0) + curr.carr;
    return acc;
  }, {});

  const previousMonthlyData = previousData.reduce((acc: { [key: string]: number }, curr) => {
    acc[curr.month] = (acc[curr.month] || 0) + curr.carr;
    return acc;
  }, {});

  const values = Object.values(monthlyData);
  const maxValue = Math.max(...values);
  const minCarr = getMinCarr();
  const padding = (maxValue - minCarr) * 0.1;

  const chartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Current CARR',
        data: values,
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      },
      {
        label: 'Previous CARR',
        data: Object.keys(monthlyData).map(month => previousMonthlyData[month] || 0),
        backgroundColor: 'rgba(156, 163, 175, 0.5)',
        borderColor: 'rgb(156, 163, 175)',
        borderWidth: 1,
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'CARR Data by Month',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            const datasetLabel = context.dataset.label;
            const month = context.label;
            
            if (datasetLabel === 'Current CARR' && previousMonthlyData[month]) {
              const prevValue = previousMonthlyData[month];
              const change = ((value - prevValue) / prevValue) * 100;
              return [
                `${datasetLabel}: $${value.toLocaleString()}`,
                `Change: ${change > 0 ? '+' : ''}${change.toFixed(2)}%`
              ];
            }
            return `${datasetLabel}: $${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        min: Math.max(0, minCarr - padding),
        max: maxValue + padding,
        title: {
          display: true,
          text: 'CARR ($)',
        },
        ticks: {
          callback: (value: number) => {
            return '$' + value.toLocaleString();
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <Bar data={chartData} options={options} />
    </div>
  );
};