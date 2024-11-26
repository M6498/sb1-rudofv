import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { CarrChart } from './components/CarrChart';
import { ComparisonStats } from './components/ComparisonStats';
import { ExportPDF } from './components/ExportPDF';
import { BarChart } from 'lucide-react';
import { CarrData } from './types/types';

function App() {
  const [data, setData] = useState<CarrData[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <BarChart className="w-8 h-8 text-indigo-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">CARR Data Analyzer</h1>
        </div>

        <FileUpload onDataUpdate={setData} />
        
        {data.length > 0 && (
          <>
            <CarrChart data={data} />
            <ComparisonStats data={data} />
            <div className="flex justify-center mt-8">
              <ExportPDF data={data} />
            </div>
          </>
        )}

        {data.length === 0 && (
          <div className="text-center text-gray-600 mt-8">
            Upload a CSV file to get started. The file should contain a 'CARR' column.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;