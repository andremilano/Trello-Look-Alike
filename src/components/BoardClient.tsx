'use client';

import { useState, useEffect } from 'react';
import ListComponent from './List';
import { createList } from '@/app/actions';
import { Plus } from 'lucide-react';

export default function BoardClient({ board, initialLists }: { board: any, initialLists: any[] }) {
  const [lists, setLists] = useState(initialLists);
  
  useEffect(() => {
    setLists(initialLists);
  }, [initialLists]);

  return (
    <div className="flex h-full p-4 gap-4 items-start pb-8">
      {lists.map((list) => (
        <ListComponent key={list.id} list={list} boardId={board.id} />
      ))}

      {/* Add New List */}
      <div className="shrink-0 w-72 bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-gray-200/60 shadow-sm border-dashed">
        <form action={createList}>
          <input type="hidden" name="boardId" value={board.id} />
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="title"
              placeholder="Add another list..."
              required
              className="flex-1 bg-transparent text-sm focus:outline-none placeholder-gray-500 font-medium text-gray-700"
            />
            <button
              type="submit"
              className="text-gray-500 hover:text-blue-600 transition-colors bg-white rounded-md p-1.5 shadow-sm border border-gray-200"
            >
              <Plus size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
