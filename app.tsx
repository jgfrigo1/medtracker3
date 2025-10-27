  
import React, { useState, useEffect, useCallback } from 'react';
import { Medication, DailyRecord, HourlyRecord } from './types';
import { PASSWORD, TIME_SLOTS } from './constants';
import { LoginScreen } from './components/LoginScreen';
import { Calendar } from './components/Calendar';
import { MedicationManager } from './components/MedicationManager';
import { DayView } from './components/DayView';
import { PatternManager } from './components/PatternManager';

type Tab = 'registro' | 'medicamentos' | 'patron';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('registro');
  
  const [medications, setMedications] = useState<Medication[]>([]);
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [pattern, setPattern] = useState<HourlyRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const usePersistentState = <T,>(key: string, setter: React.Dispatch<React.SetStateAction<T>>, defaultValue: T) => {
    useEffect(() => {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setter(JSON.parse(item));
        } else {
          setter(defaultValue);
        }
      } catch (error) {
        console.error(`Error reading ${key} from localStorage`, error);
        setter(defaultValue);
      }
    }, [key, setter, defaultValue]);
  };
  
  usePersistentState('health_tracker_meds', setMedications, []);
  usePersistentState('health_tracker_records', setRecords, []);

  const getInitialPattern = useCallback(() => {
    return TIME_SLOTS.map(time => ({
        time,
        value: null,
        medications: [],
        comment: '',
    }));
  }, []);

  usePersistentState('health_tracker_pattern', setPattern, getInitialPattern());

  useEffect(() => {
    window.localStorage.setItem('health_tracker_meds', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    window.localStorage.setItem('health_tracker_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    window.localStorage.setItem('health_tracker_pattern', JSON.stringify(pattern));
  }, [pattern]);


  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSaveRecord = (record: DailyRecord) => {
    setRecords(prev => {
      const existingIndex = prev.findIndex(r => r.date === record.date);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = record;
        return updated;
      }
      return [...prev, record];
    });
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} correctPassword={PASSWORD} />;
  }

  const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const selectedDayRecord = records.find(r => r.date === dateStr);

  const renderContent = () => {
    switch (activeTab) {
      case 'medicamentos':
        return <MedicationManager medications={medications} setMedications={setMedications} />;
      case 'patron':
        return <PatternManager medications={medications} pattern={pattern} setPattern={setPattern} />;
      case 'registro':
      default:
        return (
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
              <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} records={records} />
            </div>
            <div className="flex-grow min-w-0">
               <DayView 
                 selectedDate={selectedDate} 
                 dailyRecord={selectedDayRecord} 
                 medications={medications}
                 pattern={pattern}
                 onSave={handleSaveRecord}
               />
            </div>
          </div>
        );
    }
  };

  const TabButton: React.FC<{ tab: Tab; label: string }> = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
        activeTab === tab ? 'bg-white text-cyan-600 shadow-md' : 'text-white hover:bg-white/20'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-gradient-to-r from-teal-500 to-cyan-600 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Health Tracker Diario</h1>
          <nav className="flex items-center gap-2 p-1 bg-black/20 rounded-lg">
            <TabButton tab="registro" label="Registro Diario" />
            <TabButton tab="medicamentos" label="Medicamentos" />
            <TabButton tab="patron" label="Patrón Estándar" />
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
  
