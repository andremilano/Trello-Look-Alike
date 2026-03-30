'use client';

import { deleteCard, updateCardTitle, toggleCardCompletion, updateCardDescription } from '@/app/actions';
import { Trash2, Pencil, AlignLeft, CheckSquare, Square } from 'lucide-react';
import { useTransition, useState } from 'react';

export default function Card({ card, boardId }: { card: any, boardId: string }) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  
  const [isDescOpen, setIsDescOpen] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [description, setDescription] = useState(card.description || '');

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

  return (
    <div
      draggable={!isEditing && !isEditingDesc}
      onDragStart={handleDragStart}
      className={`group relative bg-surface-container-lowest rounded-xl p-3 shadow-ghost hover:shadow-ambient hover:-translate-y-0.5 transition-all duration-200 ease-out flex flex-col gap-2 ${(!isEditing && !isEditingDesc) ? 'cursor-grab active:cursor-grabbing' : ''} ${isPending ? 'opacity-50' : ''} ${card.isCompleted ? 'bg-surface-dim/30' : ''}`}
    >
      <div className="flex items-start gap-2 relative z-10 w-full">
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
        
        {!isEditing && (
          <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-lowest rounded-md pl-1">
            {(!card.description || card.description === '') && (
              <button
                onClick={() => { setIsDescOpen(true); setIsEditingDesc(true); }}
                className="text-on-surface-variant hover:text-secondary hover:bg-surface-container-low rounded-md p-1.5 transition-colors"
                title="Add Description"
              >
                <AlignLeft size={12} />
              </button>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="text-on-surface-variant hover:text-secondary hover:bg-surface-container-low rounded-md p-1.5 transition-colors"
              title="Edit Card"
            >
              <Pencil size={12} />
            </button>
            <button
              onClick={handleDelete}
              className="text-on-surface-variant hover:text-secondary hover:bg-surface-container-low rounded-md p-1.5 transition-colors"
              title="Delete Card"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>

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
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1 text-on-surface-variant/70">
                <AlignLeft size={10} /> <span className="font-semibold uppercase tracking-wider text-[10px]">Description</span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a more detailed description..."
                className="w-full text-xs text-on-surface bg-surface-container-lowest border border-outline-variant rounded-md p-2 focus:outline-none focus:border-secondary resize-y min-h-[60px]"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveDescription}
                  className="bg-primary text-on-primary text-[10px] font-medium px-2 py-1 rounded transition-colors hover:bg-primary-container"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditingDesc(false);
                    if (!card.description) setIsDescOpen(false);
                    setDescription(card.description || '');
                  }}
                  className="text-on-surface-variant hover:text-on-surface text-[10px] transition-colors px-2 py-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
