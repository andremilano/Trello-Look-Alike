'use client';

import { useState, useOptimistic, useTransition } from 'react';
import ListComponent from './List';
import { createList } from '@/app/actions';
import { Plus } from 'lucide-react';
import CardDetailModal from '@/components/CardDetailModal';

export type OptimisticAction = 
  | { type: 'ADD_LIST'; payload: any }
  | { type: 'DELETE_LIST'; payload: string }
  | { type: 'UPDATE_LIST'; payload: { id: string, title: string } }
  | { type: 'ADD_CARD'; payload: { listId: string, card: any } }
  | { type: 'DELETE_CARD'; payload: string }
  | { type: 'UPDATE_CARD'; payload: any }
  | { type: 'MOVE_CARD'; payload: { cardId: string, newListId: string } };

export default function BoardClient({ board, initialLists }: { board: any, initialLists: any[] }) {
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isPending, startTransition] = useTransition();
  
  const [optimisticLists, addOptimisticAction] = useOptimistic(
    initialLists,
    (state: any[], action: OptimisticAction) => {
      switch (action.type) {
        case 'ADD_LIST':
          return [...state, { ...action.payload, cards: [] }];
        case 'DELETE_LIST':
          return state.filter(list => list.id !== action.payload);
        case 'UPDATE_LIST':
          return state.map(list => list.id === action.payload.id ? { ...list, title: action.payload.title } : list);
        case 'ADD_CARD':
          return state.map(list => 
            list.id === action.payload.listId 
              ? { ...list, cards: [...(list.cards || []), action.payload.card] }
              : list
          );
        case 'DELETE_CARD':
          return state.map(list => ({
            ...list,
            cards: list.cards?.filter((card: any) => card.id !== action.payload)
          }));
        case 'UPDATE_CARD':
          return state.map(list => ({
            ...list,
            cards: list.cards?.map((card: any) => card.id === action.payload.id ? { ...card, ...action.payload } : card)
          }));
        case 'MOVE_CARD': {
          const { cardId, newListId } = action.payload;
          let movedCard: any = null;
          
          // Find the card and remove it from its current list
          const newState = state.map(list => {
            const cardIndex = list.cards?.findIndex((c: any) => c.id === cardId);
            if (cardIndex !== undefined && cardIndex !== -1) {
              movedCard = { ...list.cards[cardIndex], listId: newListId };
              return { ...list, cards: list.cards.filter((c: any) => c.id !== cardId) };
            }
            return list;
          });

          // Add the card to the new list
          if (movedCard) {
            return newState.map(list => 
              list.id === newListId 
                ? { ...list, cards: [...(list.cards || []), movedCard] }
                : list
            );
          }
          return state;
        }
        default:
          return state;
      }
    }
  );

  const handleCardClick = (card: any) => {
    setSelectedCard(card);
  };

  const handleCreateList = async (formData: FormData) => {
    const title = formData.get('title') as string;
    if (!title) return;

    const newList = {
      id: crypto.randomUUID(),
      boardId: board.id,
      title: title.trim(),
      order: optimisticLists.length,
      createdAt: new Date(),
    };

    startTransition(async () => {
      addOptimisticAction({ type: 'ADD_LIST', payload: newList });
      await createList(formData);
    });
  };

  return (
    <>
      <div className="flex h-full items-start p-4 gap-4 pb-8 min-w-max">
        {optimisticLists.map((list) => (
          <ListComponent 
            key={list.id} 
            list={list} 
            boardId={board.id} 
            onCardClick={handleCardClick}
            addOptimisticAction={addOptimisticAction}
          />
        ))}

        {/* Add New List */}
        <div className="shrink-0 w-72 bg-surface-container-low/50 hover:bg-surface-container-low transition-colors backdrop-blur-sm shadow-ghost rounded-xl p-3">
          <form action={handleCreateList}>
            <input type="hidden" name="boardId" value={board.id} />
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="title"
                placeholder="Add another list..."
                required
                className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-on-surface-variant/60 font-medium text-on-surface px-1"
              />
              <button
                type="submit"
                disabled={isPending}
                className="text-on-surface-variant hover:text-on-primary hover:bg-primary transition-colors rounded-md p-1.5 flex items-center justify-center shrink-0 disabled:opacity-50"
              >
                <Plus size={16} /> <span className="sr-only">Add</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <CardDetailModal 
        card={selectedCard} 
        boardId={board.id} 
        onClose={() => setSelectedCard(null)} 
        addOptimisticAction={addOptimisticAction}
      />
    </>
  );
}
