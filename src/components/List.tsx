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
      className={`group shrink-0 w-72 bg-gray-100/50 backdrop-blur-sm rounded-xl p-3 border border-gray-200/60 shadow-sm flex flex-col max-h-full ${isDeleting ? 'opacity-50' : ''}`}
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
              className="w-full text-sm font-semibold text-gray-800 bg-white border border-blue-500 rounded px-1.5 py-0.5 focus:outline-none"
            />
          </form>
        ) : (
          <h3 
            className="font-semibold text-gray-800 text-sm tracking-wide cursor-pointer flex-1"
            onClick={() => setIsEditing(true)}
          >
            {list.title}
          </h3>
        )}
        
        <div className="flex items-center gap-2">
          {!isEditing && (
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
              title="Delete List"
            >
              <Trash2 size={14} className="stroke-2" />
            </button>
          )}
          <span className="text-xs font-medium text-gray-500 bg-gray-200/50 px-2 py-0.5 rounded-full">{list.cards?.length || 0}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 min-h-[10px]">
        {list.cards?.map((card: any) => (
          <CardComponent key={card.id} card={card} boardId={boardId} />
        ))}
      </div>

      <div className="mt-3 pt-2 border-t border-gray-200/50">
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
              className="w-full text-sm p-2 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none min-h-[60px]"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
                title="Add Card"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-gray-500 hover:text-gray-700 text-xs px-2 py-1 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 hover:bg-white/50 w-full p-1.5 rounded-lg transition-colors text-sm font-medium"
          >
            <Plus size={16} /> Add a card
          </button>
        )}
      </div>
    </div>
  );
}
