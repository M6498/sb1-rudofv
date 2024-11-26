import React from 'react';
import Papa from 'papaparse';
import { Upload } from 'lucide-react';
import { CarrData } from '../types/types';
import { saveData, getData } from '../utils/storage';

interface FileUploadProps {
  onDataUpdate: (data: CarrData[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataUpdate }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        if (!results.data || !Array.isArray(results.data) || results.data.length < 2) {
          alert('Invalid CSV file format');
          return;
        }

        const headers = results.data[0] as string[];
        const carrIndex = headers.findIndex(h => h?.toLowerCase() === 'carr');
        
        if (carrIndex === -1) {
          alert('No CARR column found in the CSV file');
          return;
        }

        const monthIndex = headers.findIndex(h => h?.toLowerCase() === 'month');
        const parsedData = results.data.slice(1)
          .map((row: any) => {
            if (!Array.isArray(row) || row.length <= carrIndex) {
              return null;
            }
            
            const carr = parseFloat(row[carrIndex]);
            if (isNaN(carr)) {
              return null;
            }

            return {
              month: monthIndex !== -1 && row[monthIndex] 
                ? row[monthIndex] 
                : new Date().toLocaleString('default', { month: 'long' }),
              carr
            };
          })
          .filter((item): item is CarrData => 
            item !== null && 
            typeof item.month === 'string' && 
            !isNaN(item.carr)
          );

        if (parsedData.length === 0) {
          alert('No valid CARR data found in the CSV file');
          return;
        }

        saveData(parsedData);
        onDataUpdate(getData());
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        alert('Error parsing CSV file');
      },
      header: false
    });

    // Reset the file input
    event.target.value = '';
  };

  return (
    <div className="mb-8">
      <label className="flex items-center justify-center w-full px-4 py-3 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors">
        <Upload className="w-5 h-5 mr-2" />
        Upload CSV with CARR Data
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>
      <p className="text-sm text-gray-600 text-center mt-2">
        CSV file must contain a 'CARR' column. 'Month' column is optional.
      </p>
    </div>
  );
};