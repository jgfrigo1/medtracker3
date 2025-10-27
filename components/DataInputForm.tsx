
import React, { useState, useRef, useEffect } from 'react';
import { HourlyRecord, Medication } from '../types';
import { TIME_SLOTS } from '../constants';
import { PillIcon, CommentIcon } from './Icons';

interface DataInputFormProps {
  dailyData: HourlyRecord[];
  onDataChange: (data: HourlyRecord[]) => void;
  medications: Medication[];
  isPatternMode?: boolean;
}

const MedicationSelector: React.FC<{
    selectedMeds: string[], 
    allMeds: Medication[], 
    onChange: (meds: string[]) => void 
}> = ({ selectedMeds, allMeds, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleMedToggle = (medId: string) => {
        const newMeds = selectedMeds.includes(medId)
            ? selectedMeds.filter(id => id !== medId)
            : [...selectedMeds, medId];
        onChange(newMeds);
    };
    
    const selectedMedNames = allMeds
      .filter(m => selectedMeds.includes(m.id))
      .map(m => m.name)
      .join(', ');

    return (
        <div className="relative" ref={wrapperRef}>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="w-full h-10 px-3 text-left bg-white border border-slate-300 rounded-md truncate text-slate-600 hover:border-cyan-500"
              title={selectedMedNames}
            >
              {selectedMedNames || 'Seleccionar...'}
            </button>
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {allMeds.length > 0 ? allMeds.map(med => (
                        <label key={med.id} className="flex items-center px-3 py-2 hover:bg-slate-100 cursor-pointer">
                            <input 
                                type="checkbox"
                                checked={selectedMeds.includes(med.id)}
                                onChange={() => handleMedToggle(med.id)}
                                className="mr-2 h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                            />
                            {med.name}
                        </label>
                    )) : <div className="px-3 py-2 text-slate-500">No hay medicamentos.</div>}
                </div>
            )}
        </div>
    );
};


export const DataInputForm: React.FC<DataInputFormProps> = ({ dailyData, onDataChange, medications, isPatternMode = false }) => {
  const handleChange = (time: string, field: keyof HourlyRecord, value: any) => {
    const newData = [...dailyData];
    const recordIndex = newData.findIndex(r => r.time === time);
    if (recordIndex > -1) {
      (newData[recordIndex] as any)[field] = value;
    }
    onDataChange(newData);
  };

  return (
    <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-12 gap-2 sticky top-0 bg-white py-2 font-bold text-slate-600 text-sm border-b-2 border-slate-200">
        <div className="col-span-1">Hora</div>
        {!isPatternMode && <div className="col-span-2 text-center">Valor (0-10)</div>}
        <div className={isPatternMode ? "col-span-5" : "col-span-4"}>Medicamentos</div>
        <div className="col-span-5">Comentarios</div>
      </div>
      {TIME_SLOTS.map(time => {
        const record = dailyData.find(r => r.time === time) || { time, value: null, medications: [], comment: '' };
        const hasMeds = record.medications.length > 0;
        const hasComment = record.comment.trim() !== '';

        return (
          <div key={time} className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg hover:bg-slate-50">
            <div className="col-span-1 font-mono text-slate-800">{time}</div>
            
            {!isPatternMode && (
              <div className="col-span-2">
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={record.value === null ? '' : record.value}
                  onChange={e => handleChange(time, 'value', e.target.value === '' ? null : Number(e.target.value))}
                  className="w-full h-10 text-center border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            )}
            
            <div className={isPatternMode ? "col-span-5" : "col-span-4"}>
                <MedicationSelector 
                    selectedMeds={record.medications}
                    allMeds={medications}
                    onChange={(meds) => handleChange(time, 'medications', meds)}
                />
            </div>

            <div className="col-span-5">
              <input
                type="text"
                value={record.comment}
                onChange={e => handleChange(time, 'comment', e.target.value)}
                placeholder="Añadir comentario..."
                className="w-full h-10 px-3 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

          </div>
        );
      })}
    </div>
  );
};
