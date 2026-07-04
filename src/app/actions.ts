'use server';

import { db } from '@/db';
import { boards, lists, cards } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath, unstable_cache, revalidateTag } from 'next/cache';
import crypto from 'crypto';
import { auth, currentUser, clerkClient, createClerkClient } from '@clerk/nextjs/server';

async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  return userId;
}

export async function getUserRole(): Promise<string> {
  const user = await currentUser();
  return (user?.publicMetadata?.role as string) || 'user';
}

export const getCachedUsersList = unstable_cache(
  async () => {
    const client = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    const response = await client.users.getUserList({ limit: 100 });
    return Array.isArray(response) ? response : (response.data || []);
  },
  ['clerk-users-list'],
  { revalidate: 60, tags: ['clerk-users'] }
);

export async function changeUserRole(targetUserId: string, newRole: 'user' | 'manager') {
  const currentRole = await getUserRole();
  if (currentRole !== 'manager') {
    throw new Error('Forbidden: Only managers can change roles');
  }

  const client = await clerkClient();
  await client.users.updateUserMetadata(targetUserId, {
    publicMetadata: {
      role: newRole,
    },
  });

  revalidateTag('clerk-users', 'max');
  revalidatePath('/team');
  revalidatePath('/');
  revalidatePath('/boards');
}

export async function createBoard(formData: FormData) {
  const userId = await requireUserId();
  const title = formData.get('title') as string;
  if (!title || title.trim() === '') return;

  const id = crypto.randomUUID();
  await db.insert(boards).values({
    id,
    userId,
    title: title.trim(),
    createdAt: new Date(),
  });

  revalidatePath('/');
  revalidatePath('/boards');
}

export async function createList(formData: FormData) {
  const title = formData.get('title') as string;
  const boardId = formData.get('boardId') as string;
  if (!title || title.trim() === '' || !boardId) return;

  const orderResult = await db.select({ id: lists.id }).from(lists).where(eq(lists.boardId, boardId));
  const order = orderResult.length;

  await db.insert(lists).values({
    id: crypto.randomUUID(),
    boardId,
    title: title.trim(),
    order,
    createdAt: new Date(),
  });

  revalidatePath(`/board/${boardId}`);
}

export async function createCard(formData: FormData) {
  const title = formData.get('title') as string;
  const listId = formData.get('listId') as string;
  const boardId = formData.get('boardId') as string;
  
  if (!title || title.trim() === '' || !listId) return;

  const orderResult = await db.select({ id: cards.id }).from(cards).where(eq(cards.listId, listId));
  const order = orderResult.length;

  await db.insert(cards).values({
    id: crypto.randomUUID(),
    listId,
    title: title.trim(),
    order,
    createdAt: new Date(),
  });

  revalidatePath(`/board/${boardId}`);
}

export async function deleteCard(cardId: string, boardId: string) {
  await db.delete(cards).where(eq(cards.id, cardId));
  revalidatePath(`/board/${boardId}`);
}

export async function updateCardList(cardId: string, newListId: string, boardId: string) {
  await db.update(cards).set({ listId: newListId }).where(eq(cards.id, cardId));
  revalidatePath(`/board/${boardId}`);
}

export async function deleteBoard(boardId: string) {
  const userId = await requireUserId();
  const role = await getUserRole();
  
  // Only allow owner or manager to delete
  const boardLists = await db.select().from(lists).where(eq(lists.boardId, boardId));
  for (const list of boardLists) {
    await db.delete(cards).where(eq(cards.listId, list.id));
  }
  await db.delete(lists).where(eq(lists.boardId, boardId));
  
  if (role === 'manager') {
    await db.delete(boards).where(eq(boards.id, boardId));
  } else {
    await db.delete(boards).where(and(eq(boards.id, boardId), eq(boards.userId, userId)));
  }
  
  revalidatePath('/');
  revalidatePath('/boards');
}

export async function updateBoard(boardId: string, title: string) {
  const userId = await requireUserId();
  const role = await getUserRole();
  if (!title || title.trim() === '') return;
  
  if (role === 'manager') {
    await db.update(boards).set({ title: title.trim() }).where(eq(boards.id, boardId));
  } else {
    await db.update(boards).set({ title: title.trim() }).where(and(eq(boards.id, boardId), eq(boards.userId, userId)));
  }
  
  revalidatePath('/');
  revalidatePath('/boards');
}

export async function deleteList(listId: string, boardId: string) {
  await db.delete(cards).where(eq(cards.listId, listId));
  await db.delete(lists).where(eq(lists.id, listId));
  revalidatePath(`/board/${boardId}`);
}

export async function updateList(listId: string, title: string, boardId: string) {
  if (!title || title.trim() === '') return;
  await db.update(lists).set({ title: title.trim() }).where(eq(lists.id, listId));
  revalidatePath(`/board/${boardId}`);
}

export async function updateCardTitle(cardId: string, title: string, boardId: string) {
  if (!title || title.trim() === '') return;
  await db.update(cards).set({ title: title.trim() }).where(eq(cards.id, cardId));
  revalidatePath(`/board/${boardId}`);
}

export async function toggleCardCompletion(cardId: string, isCompleted: boolean, boardId: string) {
  await db.update(cards).set({ isCompleted }).where(eq(cards.id, cardId));
  revalidatePath(`/board/${boardId}`);
}

export async function updateCardDescription(cardId: string, description: string | null, boardId: string) {
  await db.update(cards).set({ description }).where(eq(cards.id, cardId));
  revalidatePath(`/board/${boardId}`);
}

export async function updateCardDueDate(cardId: string, dueDate: string | null, boardId: string) {
  await db.update(cards).set({ dueDate }).where(eq(cards.id, cardId));
  revalidatePath(`/board/${boardId}`);
}

export async function updateCardCategory(cardId: string, category: string | null, categoryColor: string | null, boardId: string) {
  await db.update(cards).set({ category, categoryColor }).where(eq(cards.id, cardId));
  revalidatePath(`/board/${boardId}`);
}

export async function updateCardAssigned(cardId: string, assigned: string | null, boardId: string) {
  await db.update(cards).set({ assigned }).where(eq(cards.id, cardId));
  revalidatePath(`/board/${boardId}`);
}
