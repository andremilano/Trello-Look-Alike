'use client';

import { useTransition, useState, useEffect, useRef } from 'react';
import { 
  updateCardTitle, 
  updateCardDescription, 
  updateCardDueDate, 
  updateCardCategory, 
  updateCardAssigned,
  toggleCardCompletion,
  deleteCard
} from '@/app/actions';
import { X, Calendar, User, Tag, Trash2, Archive, Share2, MoreHorizontal, CheckCircle2, Circle, AlignLeft, ChevronDown } from 'lucide-react';

const CATEGORY_COLORS = [
  'bg-tertiary-fixed text-on-surface',
  'bg-secondary-fixed text-on-surface',
  'bg-primary-container text-on-primary',
  'bg-surface-container-high text-on-surface-variant',
];

export default function CardDetailModal({ card, boardId, onClose }: { card: any, boardId: string, onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(card?.title || '');
  const [description, setDescription] = useState(card?.description || '');
  const [dueDate, setDueDate] = useState(card?.dueDate || '');
  const [category, setCategory] = useState(card?.category || '');
  const [assigned, setAssigned] = useState(card?.assigned || '');
  
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || '');
      setDueDate(card.dueDate || '');
      setCategory(card.category || '');
      setAssigned(card.assigned || '');
    }
  }, [card]);

  if (!card) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleToggleComplete = () => {
    startTransition(() => toggleCardCompletion(card.id, !card.isCompleted, boardId));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      startTransition(() => {
        deleteCard(card.id, boardId);
        onClose();
      });
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-surface-container-lowest w-full max-w-5xl h-fit max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300"
      >
        {/* Modal Header */}
        <div className="px-8 py-5 flex justify-between items-center border-b border-outline-variant/10 bg-surface-container-low/30">
          <div className="flex items-center gap-3">
            <CheckCircle2 className={`w-5 h-5 ${card.isCompleted ? 'text-secondary' : 'text-outline-variant'}`} />
            <nav className="flex text-[10px] font-bold uppercase tracking-widest text-outline-variant gap-2 items-center">
              <span>Workspace</span>
              <span className="opacity-40">/</span>
              <span className="text-on-surface-variant">Project Board</span>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-outline-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container-high">
              <Share2 size={18} />
            </button>
            <button className="p-2 text-outline-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container-high">
              <MoreHorizontal size={18} />
            </button>
            <button 
              onClick={onClose}
              className="ml-2 bg-surface-container-high w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-highest transition-all group shadow-sm"
            >
              <X size={16} className="text-on-surface transition-transform group-hover:rotate-90" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          
          {/* Left Column: Content */}
          <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-10 custom-scrollbar">
            <section className="space-y-4">
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => title !== card.title && startTransition(() => updateCardTitle(card.id, title, boardId))}
                className="w-full text-3xl font-serif font-extrabold text-on-surface bg-transparent border-none focus:ring-0 p-0 resize-none leading-tight tracking-tight placeholder:text-outline-variant"
                placeholder="Task title..."
                rows={2}
              />
              
              <div className="bg-surface-container-low/40 p-6 rounded-2xl border border-outline-variant/5 space-y-3">
                <div className="flex items-center gap-2 text-outline-variant">
                  <AlignLeft size={14} />
                  <h3 className="text-[10px] font-bold uppercase tracking-widest">Description</h3>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => description !== card.description && startTransition(() => updateCardDescription(card.id, description, boardId))}
                  className="w-full text-sm text-on-surface-variant bg-transparent border-none focus:ring-0 p-0 resize-none leading-relaxed placeholder:text-outline-variant/50 min-h-[120px]"
                  placeholder="Add a more detailed description..."
                />
              </div>
            </section>

            {/* Checklist Placeholder */}
            <section className="space-y-4 opacity-50 pointer-events-none">
              <div className="flex items-center gap-2">
                <AlignLeft size={16} className="text-primary" />
                <h3 className="text-sm font-bold">Production Milestones</h3>
              </div>
              <div className="space-y-2 border-l-2 border-outline-variant/20 ml-2 pl-6">
                <p className="text-xs text-on-surface-variant">Checklist features coming soon...</p>
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-outline-variant/10 bg-surface-container-low/20 p-8 space-y-8 overflow-y-auto">
            
            {/* Status */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-outline-variant">Workflow State</h4>
              <button 
                onClick={handleToggleComplete}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all shadow-sm ${card.isCompleted ? 'bg-secondary-container border-secondary/20 text-on-secondary-container' : 'bg-surface-container-lowest border-outline-variant/10 text-on-surface'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${card.isCompleted ? 'bg-secondary' : 'bg-outline-variant animate-pulse'}`}></div>
                  <span className="text-xs font-bold">{card.isCompleted ? 'Completed' : 'In Progress'}</span>
                </div>
                <ChevronDown size={14} className="opacity-40" />
              </button>
            </div>

            {/* Attributes */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-outline-variant">Attributes</h4>
              
              {/* Due Date */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <Calendar size={14} />
                  <span className="text-xs font-medium">Due Date</span>
                </div>
                <input 
                  type="date"
                  value={dueDate}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDueDate(val);
                    startTransition(() => updateCardDueDate(card.id, val, boardId));
                  }}
                  className="text-xs font-bold bg-transparent border-none focus:ring-0 p-0 text-right cursor-pointer hover:text-primary transition-colors"
                />
              </div>

              {/* Assignee */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <User size={14} />
                  <span className="text-xs font-medium">Assignee</span>
                </div>
                <input 
                  type="text"
                  value={assigned}
                  onChange={(e) => setAssigned(e.target.value)}
                  onBlur={() => assigned !== card.assigned && startTransition(() => updateCardAssigned(card.id, assigned, boardId))}
                  placeholder="No one"
                  className="text-xs font-bold bg-transparent border-none focus:ring-0 p-0 text-right w-24 placeholder:text-outline-variant/40"
                />
              </div>

              {/* Label/Category */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <Tag size={14} />
                  <span className="text-xs font-medium">Category</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <input 
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    onBlur={() => category !== card.category && startTransition(() => updateCardCategory(card.id, category, card.categoryColor || CATEGORY_COLORS[3], boardId))}
                    placeholder="Add label..."
                    className="w-full text-[10px] font-bold bg-surface-container-high/50 hover:bg-surface-container-high px-3 py-1.5 rounded-lg border-none focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-outline-variant/50"
                  />
                  <div className="flex gap-1.5 w-full justify-center">
                    {CATEGORY_COLORS.map(c => (
                      <button 
                        key={c}
                        onClick={() => startTransition(() => updateCardCategory(card.id, category, c, boardId))}
                        className={`w-5 h-5 rounded-full border border-white/50 shadow-sm transition-transform hover:scale-110 ${c} ${card.categoryColor === c ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-8 space-y-3 border-t border-outline-variant/10">
              <button 
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-outline-variant/20 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-highest transition-all shadow-sm"
              >
                <Archive size={14} /> Archive Task
              </button>
              <button 
                onClick={handleDelete}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-error text-[10px] font-bold uppercase tracking-widest hover:bg-error-container/50 transition-all"
              >
                <Trash2 size={14} /> Delete Forever
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

