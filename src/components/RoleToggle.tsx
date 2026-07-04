'use client';

import { useTransition, useState } from 'react';
import { changeUserRole } from '@/app/actions';
import { ShieldAlert, UserCheck, ShieldAlert as ShieldIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ConfirmationModal from '@/components/ConfirmationModal';

interface RoleToggleProps {
  targetUserId: string;
  currentRole: string;
  isSelf: boolean;
}

export default function RoleToggle({ targetUserId, currentRole, isSelf }: RoleToggleProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    variant: 'danger' | 'warning' | 'info';
    confirmText?: string;
    showCancel?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    variant: 'info',
    onConfirm: () => {},
  });

  const handleToggle = () => {
    if (isSelf && currentRole === 'manager') {
      setModalConfig({
        isOpen: true,
        title: 'Action Blocked',
        description: 'You cannot demote yourself to prevent losing manager (superadmin) access!',
        variant: 'warning',
        confirmText: 'OK',
        showCancel: false,
        onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false })),
      });
      return;
    }

    const nextRole = currentRole === 'manager' ? 'user' : 'manager';
    setModalConfig({
      isOpen: true,
      title: currentRole === 'manager' ? 'Demote User' : 'Promote User',
      description: currentRole === 'manager' 
        ? 'Are you sure you want to demote this user to a Regular User? They will lose superadmin dashboard access.'
        : 'Are you sure you want to promote this user to a Manager? They will have superadmin access to view and manage all boards.',
      variant: currentRole === 'manager' ? 'danger' : 'info',
      confirmText: currentRole === 'manager' ? 'Demote' : 'Promote',
      showCancel: true,
      onConfirm: () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
        startTransition(async () => {
          try {
            await changeUserRole(targetUserId, nextRole);
            router.refresh();
          } catch (err) {
            console.error(err);
            setModalConfig({
              isOpen: true,
              title: 'Error',
              description: 'Failed to change user role. Please try again.',
              variant: 'danger',
              confirmText: 'OK',
              showCancel: false,
              onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false })),
            });
          }
        });
      }
    });
  };

  if (isSelf && currentRole === 'manager') {
    return (
      <span className="text-xs text-on-surface-variant/40 font-medium italic">
        Cannot self-demote
      </span>
    );
  }

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border outline-none
          ${
            currentRole === 'manager'
              ? 'border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
              : 'bg-primary-fixed border-primary/20 text-primary hover:bg-primary-container/40'
          }
          ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : currentRole === 'manager' ? (
          <UserCheck className="w-3.5 h-3.5" />
        ) : (
          <ShieldIcon className="w-3.5 h-3.5" />
        )}
        <span>{currentRole === 'manager' ? 'Demote to User' : 'Promote to Manager'}</span>
      </button>

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        description={modalConfig.description}
        variant={modalConfig.variant}
        confirmText={modalConfig.confirmText}
        showCancel={modalConfig.showCancel}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}
