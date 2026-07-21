import React from 'react';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Toast() {
  const { toast } = useStore();
  if (!toast) return null;

  const isGold = toast.type === 'gold';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className={`px-5 py-3.5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] border flex items-center space-x-3 backdrop-blur-xl ${
        isGold
          ? 'bg-[#141210]/95 border-[#D4AF37] text-[#D4AF37]'
          : isError
          ? 'bg-[#141210]/95 border-red-500/50 text-red-400'
          : 'bg-[#141210]/95 border-[#D4AF37]/30 text-[#FAF6F0]'
      }`}>
        {isGold ? (
          <Sparkles className="w-5 h-5 text-[#D4AF37] animate-spin" />
        ) : isError ? (
          <AlertCircle className="w-5 h-5 text-red-400" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
        )}
        <span className="font-mono text-xs font-semibold">{toast.message}</span>
      </div>
    </div>
  );
}
