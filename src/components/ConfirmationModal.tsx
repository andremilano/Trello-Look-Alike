'use client';

import { AlertTriangle, AlertCircle, Info, Loader2, X } from 'lucide-react';
import { useEffect } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
  isPending?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showCancel = true,
  onConfirm,
  onCancel,
  variant = 'info',
  isPending = false,
}: ConfirmationModalProps) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return (
          <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-12 h-12 rounded-full bg-warning/10 text-warning flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
        );
      case 'info':
      default:
        return (
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Info className="w-6 h-6" />
          </div>
        );
    }
  };

  const getConfirmButtonClass = () => {
    if (isPending) {
      return 'bg-on-surface/20 text-on-surface/40 cursor-not-allowed';
    }
    switch (variant) {
      case 'danger':
        return 'bg-error text-on-error hover:bg-error/90';
      case 'warning':
        return 'bg-warning text-on-warning hover:bg-warning/90';
      case 'info':
      default:
        return 'bg-primary text-on-primary hover:bg-primary/95';
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={() => !isPending && onCancel()}
      />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-surface-container-high border border-outline-variant/30 rounded-2xl p-6 shadow-ambient z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        {!isPending && (
          <button 
            onClick={onCancel}
            className="absolute top-4 right-4 p-1 rounded-full text-on-surface-variant/60 hover:text-on-surface hover:bg-surface-container-highest transition-colors outline-none"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="flex gap-4 items-start mt-2">
          {getIcon()}
          <div className="space-y-2 flex-1">
            <h3 className="text-lg font-serif font-bold text-on-surface tracking-tight leading-snug">
              {title}
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end items-center gap-3">
          {showCancel && (
            <button
              onClick={onCancel}
              disabled={isPending}
              className="px-4 py-2 border border-outline-variant/30 hover:border-outline-variant/60 hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={`px-5 py-2 text-sm font-bold rounded-xl transition-all shadow-ghost flex items-center gap-1.5 justify-center min-w-[80px] ${getConfirmButtonClass()}`}
          >
            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
