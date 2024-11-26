import React from 'react';
import jsPDF from 'jspdf';
import { FileDown } from 'lucide-react';
import { CarrData } from '../types/types';
import { getHistory } from '../utils/storage';

interface ExportPDFProps {
  data: CarrData[];
}

export const ExportPDF: React.FC<ExportPDFProps> = ({ data }) => {
  const generatePDF = () => {
    const pdf = new jsPDF();
    const history = getHistory();
    const previousData = history.length > 1 ? history[history.length - 2].data : [];
    
    // Add title
    pdf.setFontSize(20);
    pdf.text('CARR Data Report', 20, 20);
    
    // Add current date
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add monthly comparison table
    pdf.setFontSize(14);
    pdf.text('Monthly CARR Comparison', 20, 45);
    
    const currentMonthlyTotals = data.reduce((acc: { [key: string]: number }, curr) => {
      acc[curr.month] = (acc[curr.month] || 0) + curr.carr;
      return acc;
    }, {});

    const previousMonthlyTotals = previousData.reduce((acc: { [key: string]: number }, curr) => {
      acc[curr.month] = (acc[curr.month] || 0) + curr.carr;
      return acc;
    }, {});

    // Table headers
    let yPos = 55;
    pdf.setFontSize(12);
    pdf.text('Month', 20, yPos);
    pdf.text('Previous', 70, yPos);
    pdf.text('Current', 120, yPos);
    pdf.text('Change', 170, yPos);

    // Table content
    Object.entries(currentMonthlyTotals).forEach(([month, currentValue]) => {
      yPos += 10;
      const previousValue = previousMonthlyTotals[month] || 0;
      const change = previousValue === 0 ? 0 : ((currentValue - previousValue) / previousValue) * 100;
      const changeText = change === 0 ? '-' : `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;

      pdf.text(month, 20, yPos);
      pdf.text(`$${previousValue.toLocaleString()}`, 70, yPos);
      pdf.text(`$${currentValue.toLocaleString()}`, 120, yPos);
      pdf.text(changeText, 170, yPos);
    });

    pdf.save('carr-data-report.pdf');
  };

  return (
    <button
      onClick={generatePDF}
      className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
    >
      <FileDown className="w-5 h-5 mr-2" />
      Export PDF Report
    </button>
  );
};