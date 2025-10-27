
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DailyRecord, Medication } from '../types';
import { TIME_SLOTS } from '../constants';
import { PillIcon, CommentIcon } from './Icons';

interface DataChartViewProps {
  dailyData: DailyRecord;
  medications: Medication[];
}

const CustomTooltip = ({ active, payload, label, allMeds }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const medNames = data.medications
      .map((medId: string) => allMeds.find((m: Medication) => m.id === medId)?.name)
      .filter(Boolean)
      .join(', ');

    return (
      <div className="p-3 bg-white border border-slate-300 rounded-lg shadow-lg">
        <p className="font-bold">{`Hora: ${label}`}</p>
        <p className="text-cyan-600">{`Valor: ${data.value}`}</p>
        {medNames && <p className="text-teal-600">{`Meds: ${medNames}`}</p>}
        {data.comment && <p className="text-slate-600">{`Comentario: ${data.comment}`}</p>}
      </div>
    );
  }
  return null;
};

export const DataChartView: React.FC<DataChartViewProps> = ({ dailyData, medications }) => {
  const chartData = TIME_SLOTS.map(time => {
    const record = dailyData.records.find(r => r.time === time);
    return {
      time,
      value: record?.value,
      medications: record?.medications || [],
      comment: record?.comment || '',
    };
  }).filter(d => d.value !== null && d.value !== undefined);
  
  const iconData = dailyData.records.filter(r => r.medications.length > 0 || r.comment.trim() !== '');

  return (
    <div className="h-[75vh] flex flex-col p-4">
      <h3 className="text-xl font-bold mb-4 text-center text-slate-700">Resumen del Día</h3>
      
      <div className="flex-grow">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 10]} allowDecimals={false} />
                <Tooltip content={<CustomTooltip allMeds={medications} />} />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#0891b2" strokeWidth={2} name="Valor" connectNulls />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
                No hay valores numéricos registrados para mostrar un gráfico.
            </div>
          )}
      </div>

      {iconData.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold text-slate-600 mb-2">Eventos Registrados:</h4>
          <div className="flex flex-wrap gap-4">
            {iconData.map(record => (
              <div key={record.time} className="p-3 bg-slate-100 rounded-lg flex items-start gap-3">
                <span className="font-mono font-bold text-cyan-700">{record.time}</span>
                <div className="flex flex-col gap-2">
                  {record.medications.length > 0 && (
                    <div className="group relative flex items-center gap-1.5 text-teal-700">
                      <PillIcon className="w-5 h-5" />
                      <span className="text-sm">
                        {record.medications.map(id => medications.find(m => m.id === id)?.name).filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                  {record.comment && (
                    <div className="group relative flex items-center gap-1.5 text-slate-600">
                      <CommentIcon className="w-5 h-5" />
                      <p className="text-sm italic">"{record.comment}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
