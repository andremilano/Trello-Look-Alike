'use client';

import { deleteCard, updateCardTitle } from '@/app/actions';
import { Trash2, Pencil } from 'lucide-react';
import { useTransition, useState } from 'react';

export default function Card({ card, boardId }: { card: any, boardId: string }) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);

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
      const { updateCardTitle } = await import('@/app/actions');
      await updateCardTitle(card.id, title, boardId);
    } else {
      setTitle(card.title);
    }
    setIsEditing(false);
  };

  return (
    <div
      draggable={!isEditing}
      onDragStart={handleDragStart}
      className={`group relative bg-white border border-gray-200/80 rounded-lg p-3 shadow-sm hover:shadow-md hover:border-blue-300 transition-all ${!isEditing ? 'cursor-grab active:cursor-grabbing' : ''} ${isPending ? 'opacity-50' : ''}`}
    >
      {isEditing ? (
        <form onSubmit={handleSaveTitle} className="flex gap-1">
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
            className="w-full text-sm text-gray-700 bg-white border border-blue-500 rounded p-1 focus:outline-none resize-none min-h-[40px]"
          />
        </form>
      ) : (
        <>
          <p className="text-sm font-medium text-gray-700 whitespace-pre-wrap pr-12">{card.title}</p>
          
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-blue-500 bg-white rounded p-1 shadow-sm border border-gray-100"
              title="Edit Card"
            >
              <Pencil size={12} />
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500 bg-white rounded p-1 shadow-sm border border-gray-100"
              title="Delete Card"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
