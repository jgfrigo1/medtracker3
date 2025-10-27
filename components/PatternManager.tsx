
import React, { useState } from 'react';
import { HourlyRecord, Medication } from '../types';
import { TIME_SLOTS } from '../constants';
import { PillIcon, CommentIcon, SaveIcon } from './Icons';
import { DataInputForm } from './DataInputForm';

interface PatternManagerProps {
  medications: Medication[];
  pattern: HourlyRecord[];
  setPattern: (pattern: HourlyRecord[]) => void;
}

export const PatternManager: React.FC<PatternManagerProps> = ({ medications, pattern, setPattern }) => {
    const [localPattern, setLocalPattern] = useState<HourlyRecord[]>(pattern);

    const handleSavePattern = () => {
        setPattern(localPattern);
        alert('Patrón guardado con éxito!');
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-700">Patrón de Medicación Estándar</h2>
                <button 
                    onClick={handleSavePattern} 
                    className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2"
                >
                    <SaveIcon className="w-5 h-5" /> Guardar Patrón
                </button>
            </div>
            <p className="mb-6 text-slate-600">
                Configure aquí un patrón de medicación estándar. Podrá aplicar este patrón a cualquier día en la pestaña 'Registro Diario' para rellenar los datos rápidamente.
            </p>
            <DataInputForm 
                dailyData={localPattern}
                onDataChange={setLocalPattern}
                medications={medications}
                isPatternMode={true}
            />
        </div>
    );
};
