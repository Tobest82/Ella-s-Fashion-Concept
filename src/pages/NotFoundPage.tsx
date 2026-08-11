import React from 'react';
import { Crown, ArrowLeft } from 'lucide-react';

interface Props {
  setCurrentPage: (page: string) => void;
}

export const NotFoundPage: React.FC<Props> = ({ setCurrentPage }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-20 h-20 bg-[#121212] text-[#F4C430] rounded-full flex items-center justify-center mx-auto shadow-2xl border border-[#F4C430]/40">
        <Crown className="w-10 h-10 text-[#F4C430]" />
      </div>
      <h1 className="font-serif text-5xl font-bold text-[#121212]">404 — Page Not Found</h1>
      <p className="text-sm text-[#8C8275] leading-relaxed max-w-md mx-auto">
        The bespoke page or gown collection you are looking for has been moved or does not exist.
      </p>
      <button
        onClick={() => setCurrentPage('home')}
        className="px-8 py-3.5 bg-[#121212] text-[#F4C430] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-black transition-all inline-flex items-center gap-2 shadow-xl"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Home Page
      </button>
    </div>
  );
};
