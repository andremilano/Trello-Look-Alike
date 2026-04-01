'use client';

import { useState, useTransition } from 'react';
import CardComponent from './Card';
import { createCard, deleteList, updateList, updateCardList } from '@/app/actions';
import { Plus, Trash2 } from 'lucide-react';
import { OptimisticAction } from './BoardClient';

export default function List({ 
  list, 
  boardId, 
  onCardClick, 
  addOptimisticAction 
}: { 
  list: any, 
  boardId: string, 
  onCardClick?: (card: any) => void,
  addOptimisticAction: (action: OptimisticAction) => void
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [isTransitioning, startTransition] = useTransition();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('cardId');
    if (!cardId) return;
    
    startTransition(async () => {
      addOptimisticAction({ type: 'MOVE_CARD', payload: { cardId, newListId: list.id } });
      await updateCardList(cardId, list.id, boardId);
    });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this list? All cards inside will be deleted.')) {
      startTransition(async () => {
        addOptimisticAction({ type: 'DELETE_LIST', payload: list.id });
        await deleteList(list.id, boardId);
      });
    }
  };

  const handleSaveTitle = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (title.trim() && title !== list.title) {
      startTransition(async () => {
        addOptimisticAction({ type: 'UPDATE_LIST', payload: { id: list.id, title: title.trim() } });
        await updateList(list.id, title, boardId);
      });
    } else {
      setTitle(list.title);
    }
    setIsEditing(false);
  };

  const handleCreateCard = async (formData: FormData) => {
    const cardTitle = formData.get('title') as string;
    if (!cardTitle) return;

    const newCard = {
      id: crypto.randomUUID(),
      listId: list.id,
      title: cardTitle.trim(),
      order: (list.cards?.length || 0),
      createdAt: new Date(),
      isCompleted: false,
    };

    startTransition(async () => {
      addOptimisticAction({ type: 'ADD_CARD', payload: { listId: list.id, card: newCard } });
      setIsAdding(false);
      await createCard(formData);
    });
  };

  return (
    <div 
      className={`group shrink-0 w-72 bg-surface-container-low shadow-ghost rounded-xl p-3 flex flex-col max-h-full transition-opacity ${isTransitioning ? 'opacity-70' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-3 px-1 min-h-[28px]">
        {isEditing ? (
          <form onSubmit={handleSaveTitle} className="flex-1 flex gap-1 mr-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              onBlur={() => handleSaveTitle()}
              className="w-full text-sm font-semibold text-on-surface bg-transparent border-b border-outline-variant px-1.5 py-0.5 focus:outline-none focus:border-secondary transition-colors"
            />
          </form>
        ) : (
          <h3 
            className="font-semibold text-on-surface text-sm tracking-wide cursor-pointer flex-1"
            onClick={() => setIsEditing(true)}
          >
            {list.title}
          </h3>
        )}
        
        <div className="flex items-center gap-2">
          {!isEditing && (
            <button
              onClick={handleDelete}
              className="text-on-surface-variant hover:text-secondary opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-surface-container-high rounded-md"
              title="Delete List"
            >
              <Trash2 size={14} className="stroke-2" />
            </button>
          )}
          <span className="text-xs font-medium text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full">{list.cards?.length || 0}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 min-h-[10px] py-1">
        {list.cards?.map((card: any) => (
          <CardComponent 
            key={card.id} 
            card={card} 
            boardId={boardId} 
            onClick={onCardClick}
            addOptimisticAction={addOptimisticAction}
          />
        ))}
      </div>

      <div className="mt-3 pt-2">
        {isAdding ? (
          <form 
            action={handleCreateCard} 
            className="flex flex-col gap-2"
          >
            <input type="hidden" name="listId" value={list.id} />
            <input type="hidden" name="boardId" value={boardId} />
              <textarea
              name="title"
              placeholder="Enter card title..."
              required
              autoFocus
              className="w-full text-sm p-2 rounded-xl bg-surface-container-high text-on-surface shadow-ambient focus:outline-none focus:ring-1 focus:ring-secondary resize-none min-h-[60px]"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="bg-primary hover:bg-primary-container text-on-primary text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
                title="Add Card"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-on-surface-variant hover:text-on-surface text-xs px-2 py-1 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high w-full p-1.5 rounded-md transition-colors text-sm font-medium"
          >
            <Plus size={16} /> Add a card
          </button>
        )}
      </div>
    </div>
  );
}
