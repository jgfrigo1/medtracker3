
import React, { useState } from 'react';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  records: { date: string }[];
}

export const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect, records }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  const recordedDates = new Set(records.map(r => r.date));

  const changeMonth = (offset: number) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-200 transition-colors">&lt;</button>
      <h3 className="font-bold text-lg">
        {currentMonth.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}
      </h3>
      <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-200 transition-colors">&gt;</button>
    </div>
  );

  const renderDays = () => {
    const days = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
    return (
      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-sm text-slate-500">
        {days.map(day => <div key={day}>{day}</div>)}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = currentMonth;
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    // Adjust start date to be Monday (1)
    let dayOfWeek = startDate.getDay();
    if (dayOfWeek === 0) dayOfWeek = 7; // Sunday is 0, make it 7
    startDate.setDate(startDate.getDate() - (dayOfWeek - 1));

    const cells = [];
    let day = startDate;
    
    while (cells.length < 42) {
      const formattedDate = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
      const isSelected = selectedDate.toDateString() === day.toDateString();
      const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
      const hasRecord = recordedDates.has(formattedDate);
      
      const classNames = `w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 relative ${
        isCurrentMonth ? 'text-slate-800' : 'text-slate-400'
      } ${
        isSelected ? 'bg-cyan-500 text-white font-bold shadow-lg' : 'hover:bg-cyan-100'
      }`;

      cells.push(
        <div key={day.toString()} className={classNames} onClick={() => onDateSelect(new Date(day))}>
          <span>{day.getDate()}</span>
          {hasRecord && <div className={`absolute bottom-1.5 h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-teal-500'}`}></div>}
        </div>
      );
      day = new Date(day);
      day.setDate(day.getDate() + 1);
    }
    return <div className="grid grid-cols-7 gap-1 place-items-center mt-2">{cells}</div>;
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};
