'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'info', duration = 4500) => {
    const id = Date.now().toString() + Math.random();
    setToasts((prev) => [...prev.slice(-4), { id, type, message }]); // max 5 at once
    setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-5 right-5 z-[99999] flex flex-col gap-3 pointer-events-none" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-lg shadow-xl border max-w-sm font-sans text-sm"
            style={{
              animation: 'toastSlideIn 0.3s ease',
              background: t.type === 'success' ? '#F0FDF4' : t.type === 'error' ? '#FEF2F2' : t.type === 'warning' ? '#FFFBEB' : '#FAF6F0',
              borderColor: t.type === 'success' ? '#86EFAC' : t.type === 'error' ? '#FCA5A5' : t.type === 'warning' ? '#FCD34D' : '#C5A880',
              color: t.type === 'success' ? '#166534' : t.type === 'error' ? '#991B1B' : t.type === 'warning' ? '#92400E' : '#2C1810',
            }}
          >
            <span className="flex-shrink-0 mt-0.5">
              {t.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
              {t.type === 'error'   && <XCircle   className="w-5 h-5 text-red-600" />}
              {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
              {t.type === 'info'    && <Info      className="w-5 h-5 text-[#8A1C2C]" />}
            </span>
            <span className="flex-1 leading-snug font-medium">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="flex-shrink-0 opacity-40 hover:opacity-80 transition ml-1"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(28px) scale(0.96); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx.toast;
}
