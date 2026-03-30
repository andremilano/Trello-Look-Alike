import { db } from '@/db';
import { boards, lists, cards } from '@/db/schema';
import { eq, asc, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import BoardClient from '@/components/BoardClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';

export default async function BoardPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) notFound();

  // Only the board owner can view this page
  const boardResult = await db.select().from(boards).where(and(eq(boards.id, id), eq(boards.userId, userId)));
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
      <header className="h-16 md:h-20 bg-surface/80 backdrop-blur-[20px] px-4 md:px-8 flex items-center justify-between shrink-0 relative z-10 shadow-ghost">
        <div className="flex items-center gap-3 md:gap-6 min-w-0">
          <Link href="/boards" className="text-secondary hover:text-primary transition-colors shrink-0">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-base md:text-[1.75rem] leading-snug font-serif font-medium text-on-surface truncate">{board.title}</h2>
        </div>
      </header>
      
      <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar bg-surface/50">
        <BoardClient board={board} initialLists={listsWithCards} />
      </div>
    </div>
  );
}
