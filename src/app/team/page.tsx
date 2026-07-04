import { auth, clerkClient } from '@clerk/nextjs/server';
import { getUserRole } from '@/app/actions';
import Link from 'next/link';
import { Shield, User, ArrowLeft, Lock, Users, ShieldAlert, FolderKanban } from 'lucide-react';
import RoleToggle from '@/components/RoleToggle';

export default async function TeamPage() {
  const { userId: activeUserId } = await auth();
  const role = await getUserRole();
  const isManager = role === 'manager';

  if (!isManager) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6 text-center max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 rounded-full bg-error-container flex items-center justify-center text-error border border-error/20 shadow-ghost animate-bounce">
          <Lock className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-serif font-extrabold tracking-tight text-on-surface">Access Denied</h1>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          The Team Space and user directory are reserved exclusively for workspace Managers (superadmins). Regular users are restricted to their own private workspaces.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary font-bold text-sm rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-ghost"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  // Fetch Clerk users
  let usersList: any[] = [];
  let fetchError = false;

  try {
    const client = await clerkClient();
    const response = await client.users.getUserList({ limit: 100 });
    usersList = Array.isArray(response) ? response : (response.data || []);
  } catch (e) {
    console.error('Error fetching users from Clerk in Team Space:', e);
    fetchError = true;
  }

  const totalUsers = usersList.length;
  const totalManagers = usersList.filter(u => u.publicMetadata?.role === 'manager').length;
  const totalRegularUsers = totalUsers - totalManagers;

  return (
    <div className="p-8 md:p-12 space-y-12 max-w-7xl mx-auto">
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant/20 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold tracking-tight text-on-surface mb-2">Team Space</h1>
          <p className="text-on-surface-variant font-medium">Manage team members, roles, and view user-specific boards across the workspace.</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface font-semibold text-xs rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low p-6 rounded-xl flex items-center gap-4 shadow-ghost border border-outline-variant/10">
          <div className="w-12 h-12 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-75">Total Users</span>
            <p className="text-3xl font-extrabold font-serif text-on-surface mt-1">{totalUsers}</p>
          </div>
        </div>

        <div className="bg-surface-container-low p-6 rounded-xl flex items-center gap-4 shadow-ghost border border-outline-variant/10">
          <div className="w-12 h-12 rounded-lg bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-75">Managers (Admins)</span>
            <p className="text-3xl font-extrabold font-serif text-on-surface mt-1">{totalManagers}</p>
          </div>
        </div>

        <div className="bg-surface-container-low p-6 rounded-xl flex items-center gap-4 shadow-ghost border border-outline-variant/10">
          <div className="w-12 h-12 rounded-lg bg-surface-container-highest text-on-surface flex items-center justify-center shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-75">Regular Users</span>
            <p className="text-3xl font-extrabold font-serif text-on-surface mt-1">{totalRegularUsers}</p>
          </div>
        </div>
      </section>

      {/* User Table Card */}
      <section className="bg-surface-container-low rounded-xl shadow-ghost overflow-hidden border border-outline-variant/20">
        <div className="px-6 py-5 border-b border-outline-variant/20 flex justify-between items-center">
          <h2 className="text-lg font-serif font-bold text-on-surface">Member Directory</h2>
          <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
            Active Directory
          </span>
        </div>

        {fetchError ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <ShieldAlert className="w-12 h-12 text-error" />
            <h3 className="text-lg font-bold text-on-surface">Failed to load directory</h3>
            <p className="text-sm text-on-surface-variant max-w-sm">
              We encountered an issue communicating with Clerk to fetch user accounts. Please check your Clerk API keys or try again later.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container/50 border-b border-outline-variant/20 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">Current Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {usersList.map((user) => {
                  const userRole = user.publicMetadata?.role || 'user';
                  const isSelf = user.id === activeUserId;
                  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || 'Anonymous User';
                  const email = user.emailAddresses?.[0]?.emailAddress || 'No email address';

                  return (
                    <tr key={user.id} className="hover:bg-surface-container-low/60 transition-colors group">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img
                          src={user.imageUrl}
                          alt={fullName}
                          className="w-10 h-10 rounded-full object-cover border border-outline-variant/30 group-hover:scale-105 transition-transform"
                        />
                        <div>
                          <p className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                            <span>{fullName}</span>
                            {isSelf && (
                              <span className="text-[10px] bg-secondary/15 text-secondary px-1.5 py-0.5 rounded font-semibold uppercase tracking-tight">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-on-surface-variant opacity-80">{email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-on-surface-variant">
                        {user.id}
                      </td>
                      <td className="px-6 py-4">
                        {userRole === 'manager' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed border border-primary/20 text-primary text-[10px] font-extrabold uppercase tracking-wide">
                            <Shield className="w-3 h-3 fill-primary/10" />
                            <span>Manager</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-highest border border-outline-variant/20 text-on-surface-variant text-[10px] font-extrabold uppercase tracking-wide">
                            <User className="w-3 h-3" />
                            <span>Regular User</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end items-center gap-3">
                          <Link
                            href={`/boards?userId=${user.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-outline-variant/30 text-on-surface-variant hover:text-secondary hover:border-secondary/40 text-xs font-semibold rounded-lg transition-all"
                            title={`View boards created by ${fullName}`}
                          >
                            <FolderKanban className="w-3.5 h-3.5" />
                            <span>View Boards</span>
                          </Link>
                          <RoleToggle
                            targetUserId={user.id}
                            currentRole={userRole}
                            isSelf={isSelf}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
