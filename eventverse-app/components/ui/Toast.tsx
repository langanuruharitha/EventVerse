'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export function Toast({ toasts, removeToast }: ToastProps) {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 px-5 py-4 rounded shadow-lg border max-w-sm font-sans text-sm
            ${t.type === 'success' ? 'bg-[#F0FAF4] border-green-300 text-green-800' : ''}
            ${t.type === 'error'   ? 'bg-[#FDF2F2] border-red-300 text-red-800' : ''}
            ${t.type === 'info'    ? 'bg-[#FAF6F0] border-[#C5A880] text-[#2C1810]' : ''}
          `}
          style={{ animation: 'slideIn 0.25s ease' }}
        >
          {t.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-600 mt-0.5" />}
          {t.type === 'error'   && <XCircle   className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />}
          {t.type === 'info'    && <Info      className="w-5 h-5 flex-shrink-0 text-[#8A1C2C] mt-0.5" />}
          <span className="flex-1 leading-snug font-medium">{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="opacity-50 hover:opacity-100 transition flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(24px); } to { opacity:1; transform:translateX(0); } }`}</style>
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastType = 'info', duration = 4000) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}
