'use client';

import { useState, useEffect } from 'react';
import ListComponent from './List';
import { createList } from '@/app/actions';
import { Plus } from 'lucide-react';
import CardDetailModal from '@/components/CardDetailModal';

export default function BoardClient({ board, initialLists }: { board: any, initialLists: any[] }) {
  const [lists, setLists] = useState(initialLists);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  
  useEffect(() => {
    setLists(initialLists);
  }, [initialLists]);

  const handleCardClick = (card: any) => {
    setSelectedCard(card);
  };

  return (
    <>
      <div className="flex h-full items-start p-4 gap-4 pb-8 min-w-max">
        {lists.map((list) => (
          <ListComponent key={list.id} list={list} boardId={board.id} onCardClick={handleCardClick} />
        ))}

        {/* Add New List */}
        <div className="shrink-0 w-72 bg-surface-container-low/50 hover:bg-surface-container-low transition-colors backdrop-blur-sm shadow-ghost rounded-xl p-3">
          <form action={createList}>
            <input type="hidden" name="boardId" value={board.id} />
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="title"
                placeholder="Add another list..."
                required
                className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-on-surface-variant/60 font-medium text-on-surface px-1"
              />
              <button
                type="submit"
                className="text-on-surface-variant hover:text-on-primary hover:bg-primary transition-colors rounded-md p-1.5 flex items-center justify-center shrink-0"
              >
                <Plus size={16} /> <span className="sr-only">Add</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <CardDetailModal 
        card={selectedCard} 
        boardId={board.id} 
        onClose={() => setSelectedCard(null)} 
      />
    </>
  );
}
