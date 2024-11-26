import React from 'react';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { CarrData } from '../types/types';
import { getHistory } from '../utils/storage';

interface ComparisonStatsProps {
  data: CarrData[];
}

export const ComparisonStats: React.FC<ComparisonStatsProps> = ({ data }) => {
  const history = getHistory();
  
  const currentMonthlyTotals = data.reduce((acc: { [key: string]: number }, curr) => {
    acc[curr.month] = (acc[curr.month] || 0) + curr.carr;
    return acc;
  }, {});

  const previousData = history.length > 1 ? history[history.length - 2].data : [];
  const previousMonthlyTotals = previousData.reduce((acc: { [key: string]: number }, curr) => {
    acc[curr.month] = (acc[curr.month] || 0) + curr.carr;
    return acc;
  }, {});

  const monthlyChanges = Object.keys(currentMonthlyTotals).map(month => {
    const currentValue = currentMonthlyTotals[month];
    const previousValue = previousMonthlyTotals[month] || 0;
    const change = previousValue === 0 ? 0 : ((currentValue - previousValue) / previousValue) * 100;
    
    return {
      month,
      currentValue,
      previousValue,
      change
    };
  });

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Monthly CARR Changes</h2>
      <div className="grid grid-cols-1 gap-4">
        {monthlyChanges.map(({ month, currentValue, previousValue, change }) => (
          <div key={month} className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-600" />
                <span className="font-semibold text-gray-800">{month}</span>
              </div>
              <div className="flex items-center space-x-4">
                {previousValue > 0 && (
                  <span className="text-gray-600">
                    Previous: ${previousValue.toLocaleString()}
                  </span>
                )}
                <span className="font-semibold">
                  Current: ${currentValue.toLocaleString()}
                </span>
                {change !== 0 && (
                  <div className="flex items-center">
                    {change > 0 ? (
                      <TrendingUp className="w-5 h-5 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-500 mr-1" />
                    )}
                    <span className={`font-medium ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {change > 0 ? '+' : ''}{change.toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};