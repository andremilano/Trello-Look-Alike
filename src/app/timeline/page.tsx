import { db } from '@/db';
import { boards, lists, cards } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserRole, getCachedUsersList } from '@/app/actions';
import TimelineClient from '@/components/TimelineClient';


export default async function TimelinePage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const role = await getUserRole();
  const isManager = role === 'manager';

  // Fetch Clerk users to resolve owner names if manager
  let usersList: any[] = [];
  if (isManager) {
    try {
      usersList = await getCachedUsersList();
    } catch (e) {
      console.error('Error fetching users from Clerk:', e);
    }
  }

  const userMap = new Map<string, string>();
  for (const u of usersList) {
    const name = [u.firstName, u.lastName].filter(Boolean).join(' ') || u.username || u.emailAddresses?.[0]?.emailAddress || u.id;
    userMap.set(u.id, name);
  }

  // Fetch cards (only those with a due date or we can fetch all and filter in client)
  const rawCards = isManager
    ? await db.select({
        id: cards.id,
        title: cards.title,
        description: cards.description,
        isCompleted: cards.isCompleted,
        dueDate: cards.dueDate,
        category: cards.category,
        categoryColor: cards.categoryColor,
        assigned: cards.assigned,
        createdAt: cards.createdAt,
        boardId: boards.id,
        boardTitle: boards.title,
        userId: boards.userId,
      })
        .from(cards)
        .innerJoin(lists, eq(cards.listId, lists.id))
        .innerJoin(boards, eq(lists.boardId, boards.id))
    : await db.select({
        id: cards.id,
        title: cards.title,
        description: cards.description,
        isCompleted: cards.isCompleted,
        dueDate: cards.dueDate,
        category: cards.category,
        categoryColor: cards.categoryColor,
        assigned: cards.assigned,
        createdAt: cards.createdAt,
        boardId: boards.id,
        boardTitle: boards.title,
        userId: boards.userId,
      })
        .from(cards)
        .innerJoin(lists, eq(cards.listId, lists.id))
        .innerJoin(boards, eq(lists.boardId, boards.id))
        .where(eq(boards.userId, userId));

  // Map user names and format
  const mappedCards = rawCards.map(c => ({
    ...c,
    ownerName: userMap.get(c.userId) || `User (${c.userId.slice(0, 8)})`,
  }));

  return (
    <div className="p-8 md:p-12 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-4xl md:text-5xl font-serif font-extrabold tracking-tight text-on-surface mb-2">
          Workspace Timeline
        </h1>
        <p className="text-on-surface-variant font-medium">
          {isManager 
            ? 'Manager access. Viewing deadlines and calendar schedules across all active boards.'
            : 'Track and plan your tasks, upcoming deadlines, and calendar schedule.'}
        </p>
      </div>

      <TimelineClient initialCards={mappedCards} isManager={isManager} />
    </div>
  );
}
