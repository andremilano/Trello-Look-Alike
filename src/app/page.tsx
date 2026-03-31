import { db } from '@/db';
import { boards, lists, cards } from '@/db/schema';
import { eq, desc, asc, isNotNull, and } from 'drizzle-orm';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const allBoards = await db.select().from(boards).where(eq(boards.userId, userId));
  
  // To filter cards by user, we join with lists and boards
  const userCards = await db.select({
    id: cards.id,
    title: cards.title,
    isCompleted: cards.isCompleted,
    dueDate: cards.dueDate,
    createdAt: cards.createdAt,
  })
    .from(cards)
    .innerJoin(lists, eq(cards.listId, lists.id))
    .innerJoin(boards, eq(lists.boardId, boards.id))
    .where(eq(boards.userId, userId));
  
  const completedCardsCount = userCards.filter(c => c.isCompleted).length;
  const completionRate = userCards.length > 0 ? Math.round((completedCardsCount / userCards.length) * 100) : 0;

  const recentBoards = await db.select().from(boards)
    .where(eq(boards.userId, userId))
    .orderBy(desc(boards.createdAt))
    .limit(4);
    
  const recentBoardsWithProgress = await Promise.all(recentBoards.map(async b => {
    const bLists = await db.select().from(lists).where(eq(lists.boardId, b.id));
    let bTotal = 0;
    let bCompleted = 0;
    for (const l of bLists) {
      const bCards = await db.select().from(cards).where(eq(cards.listId, l.id));
      bTotal += bCards.length;
      bCompleted += bCards.filter(c => c.isCompleted).length;
    }
    return {
      ...b,
      progress: bTotal > 0 ? Math.round((bCompleted / bTotal) * 100) : 0,
    };
  }));

  const upcomingDeadlines = userCards
    .filter(c => c.dueDate !== null)
    .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))
    .slice(0, 3);

  const recentActivity = [...userCards]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3);

  const icons = ['palette', 'architecture', 'design_services', 'brush'];
  const colors = ['bg-primary-fixed text-primary', 'bg-tertiary-fixed text-tertiary', 'bg-secondary-fixed text-secondary', 'bg-surface-container-highest text-on-surface'];

  return (
    <div className="p-8 md:p-12 space-y-12 max-w-7xl mx-auto">
      {/* Overview */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold tracking-tight text-on-surface mb-2">Workspace Overview</h1>
          <p className="text-on-surface-variant font-medium">Welcome back. You have {upcomingDeadlines.length} deadlines approaching this week.</p>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-surface-container-low p-8 rounded-xl flex flex-col justify-between shadow-ghost relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-primary opacity-80 mb-4 block">Active Projects</span>
            <p className="text-5xl font-extrabold font-serif tracking-tight">{allBoards.length}</p>
            <p className="mt-4 text-sm text-on-surface-variant max-w-xs">Total production boards currently in circulation across your workspace.</p>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-[160px]">grid_view</span>
          </div>
        </div>
        <div className="bg-secondary-container p-8 rounded-xl flex flex-col justify-between shadow-ghost">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-on-secondary-container opacity-80 mb-4 block">Completion Rate</span>
            <p className="text-5xl font-extrabold font-serif tracking-tight">{completionRate}%</p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-secondary font-semibold text-sm">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            {completedCardsCount} tasks finished
          </div>
        </div>
        <div className="bg-surface-container-high p-8 rounded-xl flex flex-col justify-between shadow-ghost">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 block">Total Tasks</span>
            <p className="text-5xl font-extrabold font-serif tracking-tight">{userCards.length}</p>
          </div>
          <p className="mt-4 text-sm text-on-surface-variant">Across all lists</p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-serif font-bold text-on-surface">Active Boards</h2>
            <Link href="/boards" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentBoardsWithProgress.map((board, idx) => (
              <Link href={`/board/${board.id}`} key={board.id} className="block bg-surface-container-high p-6 rounded-xl shadow-ghost group hover:translate-y-[-4px] hover:shadow-ambient transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[idx % colors.length]}`}>
                    <span className="material-symbols-outlined">{icons[idx % icons.length]}</span>
                  </div>
                  <span className="bg-secondary-fixed text-on-surface px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                    {board.progress === 100 ? 'Completed' : 'In Progress'}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-serif mb-2">{board.title}</h3>
                <p className="text-sm text-on-surface-variant mb-6 line-clamp-2">Project board containing active lists and tasks.</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-end text-xs font-bold">
                    <span className="text-on-surface-variant">Progress</span>
                    <span>{board.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${board.progress}%` }}></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Deadlines & Activity */}
        <div className="space-y-10">
          <div className="bg-surface-container-low p-8 rounded-xl shadow-ghost">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-serif font-bold">Deadlines</h2>
              <span className="material-symbols-outlined text-primary">calendar_today</span>
            </div>
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-6">
                {upcomingDeadlines.map(card => {
                  const date = new Date(card.dueDate!);
                  return (
                    <div key={card.id} className="flex gap-4 items-center">
                      <div className="flex flex-col items-center justify-center w-12 h-14 bg-surface-container-high rounded-lg border border-outline-variant/30">
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant">{date.toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-lg font-extrabold font-serif">{date.getDate()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold leading-tight">{card.title}</p>
                        <p className="text-[11px] font-medium text-primary mt-1">Due {date.toLocaleDateString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">No upcoming deadlines.</p>
            )}
            <button className="w-full mt-8 py-3 bg-surface-container-high text-on-surface text-sm font-bold rounded-lg hover:bg-surface-container-highest transition-colors">
              Full Calendar
            </button>
          </div>

          <div>
            <h2 className="text-xl font-serif font-bold mb-6">Recent Additions</h2>
            <div className="space-y-6 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant/30">
              {recentActivity.map((card, i) => (
                <div key={card.id} className="flex gap-4 relative">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${i % 2 === 0 ? 'bg-primary-fixed text-primary' : 'bg-surface-container-highest text-on-surface'}`}>
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>{card.isCompleted ? 'check_circle' : 'add_circle'}</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface">New task <em>"{card.title}"</em> was created.</p>
                    <p className="text-[10px] text-on-surface-variant font-medium mt-1">{new Date(card.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
