'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteBoard, updateBoard } from '@/app/actions';
import { Trash2, Pencil, Check, X } from 'lucide-react';

export default function BoardCard({ board }: { board: any }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(board.title);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this board? All lists and cards inside will be deleted.')) {
      setIsDeleting(true);
      await deleteBoard(board.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = async (e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (title.trim() && title !== board.title) {
      await updateBoard(board.id, title);
    } else {
      setTitle(board.title); // reset if empty
    }
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTitle(board.title);
    setIsEditing(false);
  };

  return (
    <div
      onClick={() => {
        if (!isEditing) {
          router.push(`/board/${board.id}`);
        }
      }}
      className={`group relative h-32 rounded-xl bg-surface-container-lowest p-5 flex flex-col justify-between shadow-ambient transition-all duration-300 ease-out ${!isEditing ? 'cursor-pointer hover:-translate-y-1 hover:bg-surface-bright' : ''} ${isDeleting ? 'opacity-50' : ''}`}
    >
      {isEditing ? (
        <form onSubmit={handleSave} className="w-full flex flex-col gap-2 relative z-10" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-surface-container-lowest text-sm font-semibold text-on-surface border-b border-outline-variant px-1 py-1 focus:outline-none focus:border-secondary transition-colors"
            autoFocus
          />
          <div className="flex items-center gap-1 mt-1">
            <button
              type="submit"
              className="text-on-primary bg-primary hover:bg-primary-container p-1 rounded-md transition-colors flex-1 flex justify-center shadow-none"
            >
              <Check size={14} />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="text-on-surface bg-surface-container-high hover:bg-surface-container-highest p-1 rounded-md transition-colors flex-1 flex justify-center shadow-none"
            >
              <X size={14} />
            </button>
          </div>
        </form>
      ) : (
        <>
          <h3 className="font-semibold text-on-surface group-hover:text-secondary transition-colors py-1 truncate pr-8">
            {board.title}
          </h3>
          <div className="text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-on-surface-variant mt-auto pt-4">
            {new Date(board.createdAt).toLocaleDateString()}
          </div>
          
          <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEdit}
              className="p-1.5 text-on-surface-variant hover:text-secondary hover:bg-surface-container-low rounded-md transition-colors"
              title="Edit Board"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-on-surface-variant hover:text-secondary hover:bg-surface-container-low rounded-md transition-colors"
              title="Delete Board"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
