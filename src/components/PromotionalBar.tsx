import React from 'react';
import { Sparkles, Phone, ShieldCheck } from 'lucide-react';
import { SiteSettings } from '../types';

interface Props {
  settings: SiteSettings;
}

export const PromotionalBar: React.FC<Props> = ({ settings }) => {
  return (
    <div className="bg-[#121212] text-[#F4C430] py-2 px-4 text-xs font-medium border-b border-[#262626] transition-all">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="hidden md:flex items-center gap-4 text-[#D4CEC5]">
          <span className="flex items-center gap-1.5 hover:text-[#F4C430] transition-colors">
            <Phone className="w-3.5 h-3.5 text-[#F4C430]" />
            {settings.phone_number}
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F4C430]" />
            Guaranteed Tailored Perfection
          </span>
        </div>

        <div className="flex-1 text-center font-serif text-sm tracking-wide text-[#FAF8F5] flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#F4C430] shrink-0" />
          <span>{settings.announcement_bar_text}</span>
          <Sparkles className="w-3.5 h-3.5 text-[#F4C430] shrink-0" />
        </div>

        <div className="hidden md:flex items-center gap-4 text-xs text-[#D4CEC5]">
          <span className="font-semibold text-[#F4C430]">NGN (₦)</span>
          <span>{settings.instagram_handle}</span>
        </div>
      </div>
    </div>
  );
};
