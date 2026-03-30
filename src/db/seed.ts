import { db } from './index';
import { boards, lists, cards } from './schema';

async function seed() {
  console.log('Seeding data...');
  
  // Insert a board
  const boardId = 'board_1';
  db.insert(boards).values({
    id: boardId,
    title: 'Project Alpha',
    createdAt: new Date(),
  }).run();

  // Insert lists
  const todoId = 'list_1';
  const inProgressId = 'list_2';
  const doneId = 'list_3';

  db.insert(lists).values([
    { id: todoId, boardId, title: 'To Do', order: 0, createdAt: new Date() },
    { id: inProgressId, boardId, title: 'In Progress', order: 1, createdAt: new Date() },
    { id: doneId, boardId, title: 'Done', order: 2, createdAt: new Date() },
  ]).run();

  // Insert cards
  db.insert(cards).values([
    { id: 'card_1', listId: todoId, title: 'Design Landing Page', description: 'Create a minimalist aesthetic', order: 0, createdAt: new Date() },
    { id: 'card_2', listId: todoId, title: 'Setup Database', description: 'Configure SQLite and Drizzle', order: 1, createdAt: new Date() },
    { id: 'card_3', listId: inProgressId, title: 'Implement Auth', description: '', order: 0, createdAt: new Date() },
  ]).run();

  console.log('Seeding completed!');
}

seed().catch(console.error);
