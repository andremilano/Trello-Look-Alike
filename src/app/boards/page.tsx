import { db } from '@/db';
import { boards } from '@/db/schema';
import { createBoard, getUserRole, getCachedUsersList } from '../actions';
import { Plus, X } from 'lucide-react';
import { desc, eq } from 'drizzle-orm';
import BoardCard from '@/components/BoardCard';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface BoardsPageProps {
  searchParams: Promise<{ userId?: string }>;
}

export default async function BoardsPage(props: BoardsPageProps) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const role = await getUserRole();
  const isManager = role === 'manager';

  const params = await props.searchParams;
  const filterUserId = params?.userId;

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

  const rawBoards = isManager
    ? (filterUserId
        ? await db.select().from(boards).where(eq(boards.userId, filterUserId)).orderBy(desc(boards.createdAt))
        : await db.select().from(boards).orderBy(desc(boards.createdAt)))
    : await db.select().from(boards).where(eq(boards.userId, userId)).orderBy(desc(boards.createdAt));

  const allBoards = rawBoards.map(b => ({
    ...b,
    ownerName: isManager ? (userMap.get(b.userId) || `User (${b.userId.slice(0, 8)})`) : undefined
  }));

  const filteredUserName = filterUserId ? (userMap.get(filterUserId) || `User (${filterUserId.slice(0, 8)})`) : '';

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Header and Filter Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-[1.75rem] leading-snug font-serif text-on-surface tracking-tight">
            {isManager 
              ? (filterUserId ? `Boards for ${filteredUserName}` : 'All Workspace Boards')
              : 'Your Boards'
            }
          </h2>
          {filterUserId && (
            <p className="text-sm text-on-surface-variant font-medium mt-1">
              Showing boards owned by {filteredUserName} ({filterUserId}).
            </p>
          )}
        </div>
        {filterUserId && (
          <Link 
            href="/boards"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface font-semibold text-xs rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filter</span>
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {allBoards.map((board) => (
          <BoardCard key={board.id} board={board} ownerName={board.ownerName} />
        ))}

        {/* Create Board Card (Only visible/meaningful if not filtering, or will create for current user) */}
        {(!filterUserId || filterUserId === userId) && (
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
        )}
      </div>
    </div>
  );
}
