'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays, 
  Clock, 
  Tag, 
  User, 
  ExternalLink,
  CheckCircle2, 
  Circle,
  AlertTriangle,
  FolderDot
} from 'lucide-react';

interface Card {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  dueDate: string | null;
  category: string | null;
  categoryColor: string | null;
  assigned: string | null;
  createdAt: Date;
  boardId: string;
  boardTitle: string;
  userId: string;
  ownerName: string;
}

interface TimelineClientProps {
  initialCards: Card[];
  isManager: boolean;
}

export default function TimelineClient({ initialCards, isManager }: TimelineClientProps) {
  const [viewMode, setViewMode] = useState<'roadmap' | 'calendar'>('roadmap');
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper to format Date into YYYY-MM-DD in local time
  const formatDateKey = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Get start of today (local time)
  const getLocalDateOnly = (dateStr: string) => {
    const parts = dateStr.split('-');
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  };

  // ----------------------------------------------------
  // ROADMAP LOGIC & CATEGORIZATION
  // ----------------------------------------------------
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const getUrgencyGroup = (card: Card) => {
    if (!card.dueDate) return 'no-date';
    
    const cardDate = getLocalDateOnly(card.dueDate);
    cardDate.setHours(0, 0, 0, 0);
    
    const diffTime = cardDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (cardDate < now && !card.isCompleted) {
      return 'overdue';
    }
    if (diffDays === 0) {
      return 'today';
    }
    if (diffDays > 0 && diffDays <= 7) {
      return 'week';
    }
    // Check if within same month
    if (cardDate.getMonth() === now.getMonth() && cardDate.getFullYear() === now.getFullYear()) {
      return 'month';
    }
    return 'later';
  };

  const overdueCards = initialCards.filter(c => getUrgencyGroup(c) === 'overdue');
  const todayCards = initialCards.filter(c => getUrgencyGroup(c) === 'today');
  const weekCards = initialCards.filter(c => getUrgencyGroup(c) === 'week');
  const monthCards = initialCards.filter(c => getUrgencyGroup(c) === 'month');
  const laterCards = initialCards.filter(c => getUrgencyGroup(c) === 'later');
  const noDateCards = initialCards.filter(c => getUrgencyGroup(c) === 'no-date');

  // ----------------------------------------------------
  // CALENDAR GENERATION LOGIC
  // ----------------------------------------------------
  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startDayIndex = firstDay.getDay(); // 0 is Sunday, 1 is Monday...
    
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevTotalDays = new Date(year, month, 0).getDate();
    
    const days: { date: Date; isCurrentMonth: boolean; key: string }[] = [];
    
    // Prev Month Overflows
    for (let i = startDayIndex - 1; i >= 0; i--) {
      const d = prevTotalDays - i;
      days.push({
        date: new Date(year, month - 1, d),
        isCurrentMonth: false,
        key: `prev-${d}`,
      });
    }
    
    // Current Month Days
    for (let d = 1; d <= totalDays; d++) {
      days.push({
        date: new Date(year, month, d),
        isCurrentMonth: true,
        key: `curr-${d}`,
      });
    }
    
    // Next Month Overflows to complete a 6-week grid
    const remainingDays = 42 - days.length;
    for (let d = 1; d <= remainingDays; d++) {
      days.push({
        date: new Date(year, month + 1, d),
        isCurrentMonth: false,
        key: `next-${d}`,
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays(currentMonthDate);

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentMonthDate(new Date());
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Group cards by due date key for fast lookup in calendar
  const cardsByDate = new Map<string, Card[]>();
  for (const c of initialCards) {
    if (c.dueDate) {
      if (!cardsByDate.has(c.dueDate)) {
        cardsByDate.set(c.dueDate, []);
      }
      cardsByDate.get(c.dueDate)!.push(c);
    }
  }

  // ----------------------------------------------------
  // CARD SUB-COMPONENT FOR ROADMAP
  // ----------------------------------------------------
  const renderRoadmapCard = (card: Card) => (
    <div 
      key={card.id} 
      className={`bg-surface-container-high border border-outline-variant/20 rounded-xl p-4 shadow-ghost hover:shadow-ambient hover:translate-y-[-2px] transition-all duration-300 group flex flex-col justify-between space-y-4 ${card.isCompleted ? 'opacity-70' : ''}`}
    >
      <div>
        <div className="flex justify-between items-start gap-2 mb-2">
          {card.category && (
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${card.categoryColor || 'bg-surface-container-highest text-on-surface-variant'}`}>
              {card.category}
            </span>
          )}
          <span className="text-[10px] bg-secondary-fixed text-on-surface px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter flex items-center gap-1">
            <FolderDot className="w-2.5 h-2.5 text-secondary" />
            <span className="truncate max-w-[80px]">{card.boardTitle}</span>
          </span>
        </div>

        <h4 className={`text-sm font-bold font-serif text-on-surface group-hover:text-primary transition-colors line-clamp-2 ${card.isCompleted ? 'line-through text-on-surface-variant/60' : ''}`}>
          {card.title}
        </h4>
        
        {card.description && (
          <p className="text-xs text-on-surface-variant/80 mt-1 line-clamp-2 leading-relaxed">
            {card.description}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-outline-variant/10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {card.assigned ? (
            <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center shrink-0" title={`Assigned: ${card.assigned}`}>
              <span className="text-[9px] font-bold text-on-secondary uppercase">{card.assigned.charAt(0)}</span>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant/40 shrink-0">
              <User className="w-3 h-3" />
            </div>
          )}
          {isManager && (
            <span className="text-[10px] text-on-surface-variant font-medium truncate max-w-[70px]" title={`Owner: ${card.ownerName}`}>
              {card.ownerName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {card.dueDate && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1
              ${card.isCompleted 
                ? 'bg-success/10 text-success' 
                : getLocalDateOnly(card.dueDate) < now 
                  ? 'bg-error/10 text-error' 
                  : 'bg-surface-container-highest text-on-surface-variant'
              }
            `}>
              <Clock className="w-2.5 h-2.5" />
              <span>{new Date(card.dueDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
            </span>
          )}
          <Link 
            href={`/board/${card.boardId}`}
            className="p-1 hover:bg-surface-container-highest text-on-surface-variant hover:text-primary rounded transition-colors"
            title="Go to board"
          >
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 flex flex-col flex-1 h-full">
      {/* Navigation and Tabs Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-low p-2.5 rounded-2xl border border-outline-variant/20">
        
        {/* View Tabs */}
        <div className="flex p-0.5 bg-surface-container-high rounded-xl border border-outline-variant/10 w-full sm:w-auto">
          <button
            onClick={() => setViewMode('roadmap')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all outline-none
              ${viewMode === 'roadmap' 
                ? 'bg-surface text-primary shadow-sm' 
                : 'text-on-surface opacity-60 hover:opacity-100'
              }
            `}
          >
            <Clock className="w-4 h-4" />
            <span>Roadmap Tracker</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all outline-none
              ${viewMode === 'calendar' 
                ? 'bg-surface text-primary shadow-sm' 
                : 'text-on-surface opacity-60 hover:opacity-100'
              }
            `}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Monthly Calendar</span>
          </button>
        </div>

        {/* Calendar Navigators (Only show if calendar mode is active) */}
        {viewMode === 'calendar' && (
          <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
            <h3 className="text-sm font-serif font-extrabold text-on-surface tracking-tight min-w-[120px] text-center sm:text-left">
              {currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex items-center gap-1.5 bg-surface-container-high p-0.5 rounded-lg border border-outline-variant/10">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-surface-container rounded-md text-on-surface-variant hover:text-on-surface transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleToday}
                className="px-2.5 py-1.5 hover:bg-surface-container rounded-md text-[10px] font-bold uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Today
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-surface-container rounded-md text-on-surface-variant hover:text-on-surface transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------
          ROADMAP TRACK CONTAINER
          ---------------------------------------------------- */}
      {viewMode === 'roadmap' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-start">
          
          {/* Overdue Lane */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-error pb-3 px-1">
              <AlertTriangle className="w-4 h-4 text-error" />
              <h3 className="text-sm font-bold tracking-tight text-on-surface">Overdue</h3>
              <span className="ml-auto text-[10px] bg-error/10 text-error font-extrabold px-2 py-0.5 rounded-full">
                {overdueCards.length}
              </span>
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-1.5 custom-scrollbar">
              {overdueCards.length > 0 ? (
                overdueCards.map(renderRoadmapCard)
              ) : (
                <p className="text-xs text-on-surface-variant italic py-2">No overdue tasks.</p>
              )}
            </div>
          </div>

          {/* Today Lane */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-warning pb-3 px-1">
              <CalendarDays className="w-4 h-4 text-warning" />
              <h3 className="text-sm font-bold tracking-tight text-on-surface">Due Today</h3>
              <span className="ml-auto text-[10px] bg-warning/10 text-warning font-extrabold px-2 py-0.5 rounded-full">
                {todayCards.length}
              </span>
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-1.5 custom-scrollbar">
              {todayCards.length > 0 ? (
                todayCards.map(renderRoadmapCard)
              ) : (
                <p className="text-xs text-on-surface-variant italic py-2">No tasks due today.</p>
              )}
            </div>
          </div>

          {/* This Week Lane */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-primary pb-3 px-1">
              <Clock className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold tracking-tight text-on-surface">This Week</h3>
              <span className="ml-auto text-[10px] bg-primary/10 text-primary font-extrabold px-2 py-0.5 rounded-full">
                {weekCards.length}
              </span>
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-1.5 custom-scrollbar">
              {weekCards.length > 0 ? (
                weekCards.map(renderRoadmapCard)
              ) : (
                <p className="text-xs text-on-surface-variant italic py-2">No tasks due this week.</p>
              )}
            </div>
          </div>

          {/* This Month Lane */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-secondary pb-3 px-1">
              <CalendarIcon className="w-4 h-4 text-secondary" />
              <h3 className="text-sm font-bold tracking-tight text-on-surface">This Month</h3>
              <span className="ml-auto text-[10px] bg-secondary/10 text-secondary font-extrabold px-2 py-0.5 rounded-full">
                {monthCards.length}
              </span>
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-1.5 custom-scrollbar">
              {monthCards.length > 0 ? (
                monthCards.map(renderRoadmapCard)
              ) : (
                <p className="text-xs text-on-surface-variant italic py-2">No tasks due this month.</p>
              )}
            </div>
          </div>

          {/* Later / Unschedules Lane */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-outline-variant pb-3 px-1">
              <Tag className="w-4 h-4 text-on-surface-variant opacity-65" />
              <h3 className="text-sm font-bold tracking-tight text-on-surface">Later / Unscheduled</h3>
              <span className="ml-auto text-[10px] bg-surface-container-highest text-on-surface-variant font-extrabold px-2 py-0.5 rounded-full">
                {laterCards.length + noDateCards.length}
              </span>
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-1.5 custom-scrollbar">
              {[...laterCards, ...noDateCards].length > 0 ? (
                [...laterCards, ...noDateCards].map(renderRoadmapCard)
              ) : (
                <p className="text-xs text-on-surface-variant italic py-2">No future tasks.</p>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* ----------------------------------------------------
            CALENDAR VIEW GRID
            ---------------------------------------------------- */
        <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl shadow-ghost overflow-hidden flex flex-col flex-1 h-full">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-outline-variant/20 bg-surface-container/30 text-center font-bold text-xs text-on-surface-variant uppercase tracking-wider py-3 shrink-0">
            {weekDays.map(d => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 grid-rows-6 flex-1 min-h-[500px]">
            {calendarDays.map(({ date, isCurrentMonth, key }) => {
              const formattedDate = formatDateKey(date);
              const dayCards = cardsByDate.get(formattedDate) || [];
              const isToday = formattedDate === todayStr;

              return (
                <div 
                  key={key} 
                  className={`border-r border-b border-outline-variant/15 p-2 flex flex-col min-h-24 hover:bg-surface-container/10 transition-colors relative overflow-hidden group
                    ${isCurrentMonth ? 'text-on-surface' : 'text-on-surface-variant/40 bg-surface-container-low/20'}
                  `}
                >
                  {/* Day Indicator */}
                  <div className="flex justify-between items-center mb-1.5 shrink-0">
                    <span 
                      className={`text-xs font-extrabold flex items-center justify-center w-6 h-6 rounded-full
                        ${isToday 
                          ? 'bg-primary text-on-primary shadow-sm scale-110' 
                          : 'text-on-surface group-hover:text-primary transition-colors'
                        }
                      `}
                    >
                      {date.getDate()}
                    </span>
                  </div>

                  {/* Tasks List inside cell */}
                  <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar max-h-[14vh] pr-0.5">
                    {dayCards.slice(0, 3).map(card => (
                      <Link
                        href={`/board/${card.boardId}`}
                        key={card.id}
                        className={`block text-[9px] px-1.5 py-0.5 rounded font-bold uppercase truncate border transition-all hover:scale-[1.02]
                          ${card.isCompleted
                            ? 'bg-success-container/30 text-success border-success/10 line-through'
                            : card.categoryColor
                              ? `${card.categoryColor} border-outline-variant/10 text-on-surface`
                              : 'bg-surface-container-highest border-outline-variant/20 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/80'
                          }
                        `}
                        title={`Task: ${card.title}\nBoard: ${card.boardTitle}\nAssigned: ${card.assigned || 'Unassigned'}${isManager ? `\nOwner: ${card.ownerName}` : ''}`}
                      >
                        {card.title}
                      </Link>
                    ))}
                    {dayCards.length > 3 && (
                      <span className="text-[8px] font-bold text-on-surface-variant opacity-70 pl-1 block">
                        + {dayCards.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
