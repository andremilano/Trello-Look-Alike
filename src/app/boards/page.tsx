import { db } from '@/db';
import { boards } from '@/db/schema';
import { createBoard } from '../actions';
import { Plus } from 'lucide-react';
import { desc } from 'drizzle-orm';
import BoardCard from '@/components/BoardCard';

export default async function BoardsPage() {
  const allBoards = await db.select().from(boards).orderBy(desc(boards.createdAt));

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-[1.75rem] leading-snug font-serif mb-8 text-on-surface tracking-tight">Your Boards</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {allBoards.map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}

        {/* Create Board Card */}
        <form action={createBoard} className="h-32">
          <div className="h-full rounded-xl bg-surface-container-low p-4 flex flex-col justify-center items-center group transition-colors hover:bg-surface-container shadow-ghost">
            <input
              type="text"
              name="title"
              placeholder="Create new board..."
              required
              className="w-full bg-transparent text-center text-sm font-medium text-on-surface-variant focus:outline-none placeholder:text-on-surface-variant/50 mb-3"
            />
            <button
              type="submit"
              className="text-on-primary bg-primary rounded-md px-3 py-1.5 transition-colors hover:bg-primary-container flex items-center justify-center gap-1 text-sm font-medium"
              title="Add Board"
            >
              <Plus size={16} /> <span className="sr-only">Add</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
