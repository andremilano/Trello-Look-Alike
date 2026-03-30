'use server';

import { db } from '@/db';
import { boards, lists, cards } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export async function createBoard(formData: FormData) {
  const title = formData.get('title') as string;
  if (!title || title.trim() === '') return;

  const id = crypto.randomUUID();
  await db.insert(boards).values({
    id,
    title: title.trim(),
    createdAt: new Date(),
  });

  revalidatePath('/');
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
  // SQLite might not have ON DELETE CASCADE set up by default in Drizzle unless configured.
  // We'll delete lists and cards manually or assume DB handles cascade. Let's manually delete to be safe.
  const boardLists = await db.select().from(lists).where(eq(lists.boardId, boardId));
  for (const list of boardLists) {
    await db.delete(cards).where(eq(cards.listId, list.id));
  }
  await db.delete(lists).where(eq(lists.boardId, boardId));
  await db.delete(boards).where(eq(boards.id, boardId));
  revalidatePath('/');
}

export async function updateBoard(boardId: string, title: string) {
  if (!title || title.trim() === '') return;
  await db.update(boards).set({ title: title.trim() }).where(eq(boards.id, boardId));
  revalidatePath('/');
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
