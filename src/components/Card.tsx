'use client';

import { deleteCard, updateCardTitle, toggleCardCompletion, updateCardDescription, updateCardDueDate, updateCardCategory, updateCardAssigned } from '@/app/actions';
import { Trash2, Pencil, AlignLeft, CheckSquare, Square, Tag, User, Calendar } from 'lucide-react';
import { useTransition, useState } from 'react';

const CATEGORY_COLORS = [
  'bg-tertiary-fixed text-on-surface',
  'bg-secondary-fixed text-on-surface',
  'bg-primary-container text-on-primary',
  'bg-surface-container-high text-on-surface-variant',
];

export default function Card({ card, boardId }: { card: any, boardId: string }) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  
  const [isDescOpen, setIsDescOpen] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [description, setDescription] = useState(card.description || '');

  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [categoryInput, setCategoryInput] = useState(card.category || '');
  const [categoryColor, setCategoryColor] = useState(card.categoryColor || CATEGORY_COLORS[3]);

  const [isEditingAssigned, setIsEditingAssigned] = useState(false);
  const [assignedInput, setAssignedInput] = useState(card.assigned || '');

  const [isEditingDueDate, setIsEditingDueDate] = useState(false);
  const [dueDateInput, setDueDateInput] = useState(card.dueDate || '');

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('cardId', card.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      startTransition(() => {
        deleteCard(card.id, boardId);
      });
    }
  };

  const handleSaveTitle = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (title.trim() && title !== card.title) {
      startTransition(async () => {
        await updateCardTitle(card.id, title, boardId);
      });
    } else {
      setTitle(card.title);
    }
    setIsEditing(false);
  };

  const handleToggleComplete = () => {
    startTransition(async () => {
      await toggleCardCompletion(card.id, !card.isCompleted, boardId);
    });
  };

  const handleSaveDescription = async () => {
    if (description !== card.description) {
      startTransition(async () => {
        await updateCardDescription(card.id, description, boardId);
      });
    }
    setIsEditingDesc(false);
  };

  const handleSaveCategory = async () => {
    if (categoryInput !== card.category || categoryColor !== card.categoryColor) {
      startTransition(async () => {
        await updateCardCategory(card.id, categoryInput, categoryColor, boardId);
      });
    }
    setIsEditingCategory(false);
  };

  const handleSaveAssigned = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (assignedInput !== card.assigned) {
      startTransition(async () => {
        await updateCardAssigned(card.id, assignedInput, boardId);
      });
    }
    setIsEditingAssigned(false);
  };

  const handleSaveDueDate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (dueDateInput !== card.dueDate) {
      startTransition(async () => {
        await updateCardDueDate(card.id, dueDateInput, boardId);
      });
    }
    setIsEditingDueDate(false);
  };

  const isAnyFieldEditing = isEditing || isEditingDesc || isEditingCategory || isEditingAssigned || isEditingDueDate;

  return (
    <div
      draggable={!isAnyFieldEditing}
      onDragStart={handleDragStart}
      className={`group relative bg-surface-container-high rounded-md p-3 shadow-ghost hover:shadow-ambient hover:-translate-y-0.5 hover:bg-surface-container-highest transition-all duration-200 ease-out flex flex-col gap-2 ${!isAnyFieldEditing ? 'cursor-grab active:cursor-grabbing' : ''} ${isPending ? 'opacity-50' : ''} ${card.isCompleted ? 'bg-surface-dim/30' : ''}`}
    >
      {/* Category Section */}
      {(card.category || isEditingCategory) && (
        <div className="flex items-center gap-1">
          {isEditingCategory ? (
            <div className="flex flex-col gap-2 w-full mb-1">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  placeholder="Category label..."
                  className="flex-1 text-xs px-2 py-1 border border-outline-variant bg-surface rounded-md focus:outline-none focus:border-secondary"
                  autoFocus
                />
                <button onClick={handleSaveCategory} className="bg-primary text-on-primary px-2 py-1 text-xs rounded-md">Save</button>
              </div>
              <div className="flex gap-1">
                {CATEGORY_COLORS.map(c => (
                  <button 
                    key={c}
                    onClick={() => setCategoryColor(c)}
                    className={`w-4 h-4 rounded-full border border-outline-variant/50 ${c} ${categoryColor === c ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                  />
                ))}
              </div>
            </div>
          ) : (
             card.category && (
               <div 
                 onClick={() => setIsEditingCategory(true)}
                 className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded cursor-pointer ${card.categoryColor || CATEGORY_COLORS[3]}`}
               >
                 {card.category}
               </div>
             )
          )}
        </div>
      )}

      {/* Main Title Section */}
      <div className="flex items-start gap-2 relative z-10 w-full mt-0.5">
        <button 
          onClick={handleToggleComplete}
          className="mt-0.5 text-on-surface-variant hover:text-secondary transition-colors shrink-0"
        >
          {card.isCompleted ? <CheckSquare size={16} className="text-tertiary" /> : <Square size={16} />}
        </button>

        {isEditing ? (
          <form onSubmit={handleSaveTitle} className="flex-1 min-w-0">
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              onBlur={() => handleSaveTitle()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveTitle();
                }
              }}
              className="w-full text-sm text-on-surface border-b border-outline-variant rounded-none px-1 py-1 focus:outline-none focus:border-secondary resize-none bg-surface-container-lowest"
              style={{ minHeight: '40px' }}
            />
          </form>
        ) : (
          <p className={`flex-1 text-sm font-medium text-on-surface whitespace-pre-wrap pr-16 leading-relaxed ${card.isCompleted ? 'line-through text-on-surface-variant' : ''}`}>
            {card.title}
          </p>
        )}
        
        {!isAnyFieldEditing && (
          <div className="absolute top-0 right-0 flex opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-high shadow-ghost rounded flex-wrap justify-end gap-0.5 max-w-[80px]">
            {(!card.category) && (
              <button onClick={() => setIsEditingCategory(true)} className="text-on-surface-variant hover:text-secondary hover:bg-surface-container-low rounded-md p-1 transition-colors" title="Add Category">
                <Tag size={12} />
              </button>
            )}
            {(!card.description || card.description === '') && (
              <button onClick={() => { setIsDescOpen(true); setIsEditingDesc(true); }} className="text-on-surface-variant hover:text-secondary hover:bg-surface-container-low rounded-md p-1 transition-colors" title="Add Description">
                <AlignLeft size={12} />
              </button>
            )}
            {(!card.dueDate) && (
              <button onClick={() => setIsEditingDueDate(true)} className="text-on-surface-variant hover:text-secondary hover:bg-surface-container-low rounded-md p-1 transition-colors" title="Add Due Date">
                <Calendar size={12} />
              </button>
            )}
            {(!card.assigned) && (
              <button onClick={() => setIsEditingAssigned(true)} className="text-on-surface-variant hover:text-secondary hover:bg-surface-container-low rounded-md p-1 transition-colors" title="Assign">
                <User size={12} />
              </button>
            )}
            <button onClick={() => setIsEditing(true)} className="text-on-surface-variant hover:text-secondary hover:bg-surface-container-low rounded-md p-1 transition-colors" title="Edit Card">
              <Pencil size={12} />
            </button>
            <button onClick={handleDelete} className="text-on-surface-variant hover:text-secondary hover:bg-surface-container-low rounded-md p-1 transition-colors" title="Delete Card">
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Description Section */}
      {(card.description || isDescOpen) && (
        <div className="mt-1 pl-6">
          {(!isEditingDesc && card.description) ? (
            <div 
              className="text-xs text-on-surface-variant bg-surface-container-low/50 p-2 rounded-md cursor-pointer hover:bg-surface-container-low transition-colors"
              onClick={() => setIsEditingDesc(true)}
            >
              <div className="flex items-center gap-1 mb-1 text-on-surface-variant/70">
                <AlignLeft size={10} /> <span className="font-semibold uppercase tracking-wider text-[10px]">Description</span>
              </div>
              <p className="whitespace-pre-wrap wrap-break-word">{card.description}</p>
            </div>
          ) : (
            isEditingDesc && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1 text-on-surface-variant/70">
                  <AlignLeft size={10} /> <span className="font-semibold uppercase tracking-wider text-[10px]">Description</span>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a more detailed description..."
                  className="w-full text-xs text-on-surface bg-surface border border-outline-variant rounded-md p-2 focus:outline-none focus:border-secondary resize-y min-h-[60px]"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <button onClick={handleSaveDescription} className="bg-primary text-on-primary text-[10px] font-medium px-2 py-1 rounded transition-colors hover:bg-primary-container">Save</button>
                  <button onClick={() => { setIsEditingDesc(false); if (!card.description) setIsDescOpen(false); setDescription(card.description || ''); }} className="text-on-surface-variant hover:text-on-surface text-[10px] transition-colors px-2 py-1">Cancel</button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Footer Metadata (Due Date & Assigned) */}
      {(card.dueDate || card.assigned || isEditingDueDate || isEditingAssigned) && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/30 pl-6 gap-2">
          
          <div className="flex-1">
            {isEditingDueDate ? (
              <form onSubmit={handleSaveDueDate} className="flex items-center gap-1">
                <input 
                  type="date"
                  value={dueDateInput}
                  onChange={(e) => setDueDateInput(e.target.value)}
                  onBlur={() => handleSaveDueDate()}
                  className="text-[10px] bg-surface-container-low border border-outline-variant rounded px-1 py-0.5 text-on-surface focus:outline-none"
                  autoFocus
                />
              </form>
            ) : (
              card.dueDate && (
                <div onClick={() => setIsEditingDueDate(true)} className="flex items-center gap-1 text-[10px] text-on-surface-variant cursor-pointer hover:text-secondary hover:bg-surface-container-low px-1 py-0.5 rounded transition-colors w-fit">
                  <Calendar size={10} />
                  <span>{new Date(card.dueDate).toLocaleDateString()}</span>
                </div>
              )
            )}
          </div>

          <div className="flex-1 flex justify-end">
            {isEditingAssigned ? (
              <form onSubmit={handleSaveAssigned} className="flex items-center gap-1 justify-end max-w-[100px]">
                <input 
                  type="text"
                  value={assignedInput}
                  onChange={(e) => setAssignedInput(e.target.value)}
                  onBlur={() => handleSaveAssigned()}
                  placeholder="Assignee name..."
                  className="w-full text-[10px] bg-surface-container-low border border-outline-variant rounded px-1 py-0.5 text-on-surface focus:outline-none placeholder:text-outline-variant"
                  autoFocus
                />
              </form>
            ) : (
              card.assigned && (
                <div onClick={() => setIsEditingAssigned(true)} className="flex items-center gap-1 bg-surface-container-high px-1.5 py-0.5 rounded-full cursor-pointer hover:bg-surface-container-highest transition-colors w-fit">
                  <div className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <span className="text-[8px] font-bold text-on-secondary uppercase">{card.assigned.charAt(0)}</span>
                  </div>
                  <span className="text-[10px] font-medium text-on-surface-variant truncate max-w-[70px]">{card.assigned}</span>
                </div>
              )
            )}
          </div>

        </div>
      )}

    </div>
  );
}
