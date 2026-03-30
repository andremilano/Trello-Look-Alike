import { db } from '@/db';
import { boards, lists, cards } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import BoardClient from '@/components/BoardClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function BoardPage({ params }: { params: { id: string } }) {
  const { id } = await params; // Next 15 awaits params.

  const boardResult = await db.select().from(boards).where(eq(boards.id, id));
  if (boardResult.length === 0) {
    notFound();
  }
  const board = boardResult[0];

  const boardLists = await db.select().from(lists).where(eq(lists.boardId, id)).orderBy(asc(lists.order));
  const listsWithCards = await Promise.all(
    boardLists.map(async (list) => {
      const listCards = await db.select().from(cards).where(eq(cards.listId, list.id)).orderBy(asc(cards.order));
      return { ...list, cards: listCards };
    })
  );

  return (
    <div className="flex flex-col h-full overflow-hidden bg-surface">
      <header className="h-20 bg-surface/80 backdrop-blur-[20px] px-8 flex items-center justify-between shrink-0 relative z-10 shadow-ghost">
        <div className="flex items-center gap-6">
          <Link href="/boards" className="text-secondary hover:text-primary transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h2 className="text-[1.75rem] leading-snug font-serif font-medium text-on-surface">{board.title}</h2>
        </div>
      </header>
      
      <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar bg-surface/50">
        <BoardClient board={board} initialLists={listsWithCards} />
      </div>
    </div>
  );
}
