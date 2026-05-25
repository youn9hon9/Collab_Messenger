'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useDemoStore } from '@/store/demo-store';
import { CreateEventModal } from './CreateEventModal';
import clsx from 'clsx';

export function ScheduleView() {
  const { events, setSelectedEvent, channels } = useDemoStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [view, setView] = useState<'month' | 'day'>('month');
  const [month, setMonth] = useState(new Date(2026, 4, 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const eventsForDay = (day: number) =>
    events.filter((e) => {
      const d = new Date(e.startAt);
      return d.getDate() === day && d.getMonth() === month.getMonth();
    });

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    const dayEvents = eventsForDay(day);
    if (dayEvents.length > 0) {
      setSelectedEvent(dayEvents[0].id);
    } else {
      setSelectedEvent(null);
    }
  };

  return (
    <div className="flex h-full min-h-0">
      <div className="flex-1 flex flex-col p-5 overflow-auto">
        <div className="flex items-center justify-between mb-5 gap-3">
          <h2 className="text-xl font-bold shrink-0">Schedule</h2>
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                className={clsx('px-3 py-1.5 rounded-md text-sm', view === 'month' && 'bg-white shadow-sm')}
                onClick={() => setView('month')}
              >
                월별
              </button>
              <button
                type="button"
                className={clsx('px-3 py-1.5 rounded-md text-sm', view === 'day' && 'bg-white shadow-sm')}
                onClick={() => setView('day')}
              >
                일별
              </button>
            </div>
            <button
              type="button"
              className="flex items-center gap-1 text-sm font-medium text-[var(--primary)] px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-gray-50 shrink-0"
              onClick={() => setCreateOpen(true)}
            >
              <Plus size={16} /> 새 일정
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 mb-5">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1))}
          >
            ←
          </button>
          <span className="font-semibold text-lg min-w-[140px] text-center">
            {month.toLocaleString('ko-KR', { year: 'numeric', month: 'long' })}
          </span>
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1))}
          >
            →
          </button>
          <button
            type="button"
            className="text-sm text-[var(--accent-blue)] font-medium ml-2"
            onClick={() => setMonth(new Date(2026, 4, 26))}
          >
            Today
          </button>
        </div>
        {view === 'month' ? (
          <div className="grid grid-cols-7 gap-1.5 text-xs flex-1">
            {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
              <div key={d} className="text-center font-semibold text-[var(--text-muted)] py-2">
                {d}
              </div>
            ))}
            {cells.map((day, i) => {
              const dayEvents = day ? eventsForDay(day) : [];
              const hasEvents = dayEvents.length > 0;
              return (
                <div
                  key={i}
                  role={day && hasEvents ? 'button' : undefined}
                  tabIndex={day && hasEvents ? 0 : undefined}
                  onClick={day ? () => handleDayClick(day) : undefined}
                  onKeyDown={
                    day && hasEvents
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleDayClick(day);
                          }
                        }
                      : undefined
                  }
                  className={clsx(
                    'min-h-[88px] border border-[var(--border)] rounded-lg p-1.5 bg-white',
                    day && hasEvents && 'cursor-pointer hover:bg-gray-50',
                    day && selectedDay === day && 'ring-2 ring-[var(--accent-blue)]',
                    day === 26 && month.getMonth() === 4 && selectedDay !== 26 && 'ring-1 ring-[var(--accent-blue)]/40',
                  )}
                >
                  {day && (
                    <>
                      <div
                        className={clsx(
                          'font-semibold text-gray-700 mb-1 w-6 h-6 flex items-center justify-center rounded-full text-[11px]',
                          (selectedDay === day || (day === 26 && month.getMonth() === 4 && selectedDay === null)) &&
                            'bg-[var(--accent-blue)] text-white',
                        )}
                      >
                        {day}
                      </div>
                      {dayEvents.map((e) => (
                        <button
                          key={e.id}
                          type="button"
                          className="block w-full text-left truncate rounded px-1 py-0.5 mt-0.5 text-white text-[10px] font-medium"
                          style={{ backgroundColor: e.color }}
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setSelectedDay(day);
                            setSelectedEvent(e.id);
                          }}
                        >
                          {e.title}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {events.map((e) => (
              <button
                key={e.id}
                type="button"
                className="w-full text-left border border-[var(--border)] rounded-xl p-4 hover:bg-gray-50 flex gap-3"
                onClick={() => setSelectedEvent(e.id)}
              >
                <div className="w-1 rounded-full shrink-0" style={{ backgroundColor: e.color }} />
                <div>
                  <div className="font-medium">{e.title}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">
                    {new Date(e.startAt).toLocaleString('ko-KR')}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <CreateEventModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        channels={channels}
      />
    </div>
  );
}
