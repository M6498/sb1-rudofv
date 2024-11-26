import { CarrData } from '../types/types';

const STORAGE_KEY = 'carr_historical_data';

interface HistoricalData {
  data: CarrData[];
  uploadDate: string;
  minCarr: number;
}

export const saveData = (data: CarrData[]) => {
  if (!Array.isArray(data) || data.length === 0) {
    return;
  }

  const existingData = getData();
  const currentDate = new Date().toISOString();
  
  // Calculate minimum CARR value across all data
  const allCarrValues = [...existingData.map(entry => entry.carr), ...data.map(item => item.carr)]
    .filter(value => !isNaN(value) && value !== null && value !== undefined);
  
  const minCarr = allCarrValues.length > 0 ? Math.min(...allCarrValues) : 0;
  
  const historicalData: HistoricalData = {
    data,
    uploadDate: currentDate,
    minCarr
  };

  const history = getHistory();
  history.push(historicalData);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const getData = (): CarrData[] => {
  const history = getHistory();
  return history.length > 0 ? history[history.length - 1].data : [];
};

export const getHistory = (): HistoricalData[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading history:', error);
    return [];
  }
};

export const getMinCarr = (): number => {
  const history = getHistory();
  if (history.length === 0) return 0;
  return history[history.length - 1].minCarr;
};