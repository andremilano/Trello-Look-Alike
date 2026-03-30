'use client';

import { useState } from 'react';
import CardComponent from './Card';
import { createCard } from '@/app/actions';
import { Plus, Trash2 } from 'lucide-react';

export default function List({ list, boardId }: { list: any, boardId: string }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('cardId');
    if (!cardId) return;
    
    import('@/app/actions').then(({ updateCardList }) => {
      updateCardList(cardId, list.id, boardId);
    });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this list? All cards inside will be deleted.')) {
      setIsDeleting(true);
      const { deleteList } = await import('@/app/actions');
      await deleteList(list.id, boardId);
    }
  };

  const handleSaveTitle = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (title.trim() && title !== list.title) {
      const { updateList } = await import('@/app/actions');
      await updateList(list.id, title, boardId);
    } else {
      setTitle(list.title);
    }
    setIsEditing(false);
  };

  return (
    <div 
      className={`group shrink-0 w-72 bg-surface-container-low shadow-ghost rounded-xl p-3 flex flex-col max-h-full transition-opacity ${isDeleting ? 'opacity-50' : ''}`}
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
          <CardComponent key={card.id} card={card} boardId={boardId} />
        ))}
      </div>

      <div className="mt-3 pt-2">
        {isAdding ? (
          <form 
            action={(formData) => {
              createCard(formData);
              setIsAdding(false);
            }} 
            className="flex flex-col gap-2"
          >
            <input type="hidden" name="listId" value={list.id} />
            <input type="hidden" name="boardId" value={boardId} />
            <textarea
              name="title"
              placeholder="Enter card title..."
              required
              autoFocus
              className="w-full text-sm p-2 rounded-xl bg-surface-container-lowest text-on-surface shadow-ambient focus:outline-none focus:ring-1 focus:ring-secondary resize-none min-h-[60px]"
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
