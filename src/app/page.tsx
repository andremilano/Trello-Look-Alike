import { db } from '@/db';
import { boards } from '@/db/schema';
import Link from 'next/link';
import { createBoard } from './actions';
import { Plus } from 'lucide-react';
import { desc } from 'drizzle-orm';
import BoardCard from '@/components/BoardCard';

export default async function Home() {
  const allBoards = await db.select().from(boards).orderBy(desc(boards.createdAt));

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-[1.75rem] leading-snug font-serif mb-8 text-gray-800 tracking-tight">Your Boards</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allBoards.map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}

        {/* Create Board Card */}
        <form action={createBoard} className="h-32">
          <div className="h-full rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-4 hover:bg-gray-50 transition-colors flex flex-col justify-center items-center group">
            <input
              type="text"
              name="title"
              placeholder="Create new board..."
              required
              className="w-full bg-transparent text-center text-sm font-medium text-gray-600 focus:outline-none placeholder-gray-400 group-hover:placeholder-gray-500 mb-2"
            />
            <button
              type="submit"
              className="mt-2 text-gray-400 group-hover:text-blue-600 transition-colors bg-white rounded-full p-1 border border-gray-200 shadow-sm"
              title="Add Board"
            >
              <Plus size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
