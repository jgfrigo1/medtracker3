
import React, { useState } from 'react';
import { Medication } from '../types';
import { TrashIcon, PlusIcon, SaveIcon, EditIcon } from './Icons';

interface MedicationManagerProps {
  medications: Medication[];
  setMedications: (medications: Medication[]) => void;
}

export const MedicationManager: React.FC<MedicationManagerProps> = ({ medications, setMedications }) => {
  const [newMedName, setNewMedName] = useState('');
  const [editingMed, setEditingMed] = useState<Medication | null>(null);

  const handleAddMed = () => {
    if (newMedName.trim() && !medications.some(m => m.name.toLowerCase() === newMedName.trim().toLowerCase())) {
      setMedications([...medications, { id: Date.now().toString(), name: newMedName.trim() }]);
      setNewMedName('');
    }
  };

  const handleUpdateMed = () => {
    if (editingMed && editingMed.name.trim()) {
      setMedications(medications.map(m => (m.id === editingMed.id ? editingMed : m)));
      setEditingMed(null);
    }
  };

  const handleDeleteMed = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };
  
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-slate-700">Lista de Medicamentos</h2>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newMedName}
          onChange={(e) => setNewMedName(e.target.value)}
          placeholder="Nombre del nuevo medicamento"
          className="flex-grow px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          onKeyPress={(e) => e.key === 'Enter' && handleAddMed()}
        />
        <button onClick={handleAddMed} className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2">
          <PlusIcon className="w-5 h-5" /> Añadir
        </button>
      </div>

      <ul className="space-y-3">
        {medications.map(med => (
          <li key={med.id} className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
            {editingMed?.id === med.id ? (
              <input
                type="text"
                value={editingMed.name}
                onChange={(e) => setEditingMed({ ...editingMed, name: e.target.value })}
                className="flex-grow px-3 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                onKeyPress={(e) => e.key === 'Enter' && handleUpdateMed()}
              />
            ) : (
              <span className="text-slate-800">{med.name}</span>
            )}
            <div className="flex gap-2">
              {editingMed?.id === med.id ? (
                <button onClick={handleUpdateMed} className="p-2 text-green-600 hover:text-green-800 transition-colors">
                  <SaveIcon className="w-5 h-5"/>
                </button>
              ) : (
                <button onClick={() => setEditingMed(med)} className="p-2 text-blue-600 hover:text-blue-800 transition-colors">
                   <EditIcon className="w-5 h-5"/>
                </button>
              )}
              <button onClick={() => handleDeleteMed(med.id)} className="p-2 text-red-600 hover:text-red-800 transition-colors">
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
