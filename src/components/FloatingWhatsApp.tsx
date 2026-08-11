import React, { useState } from 'react';
import { SiteSettings } from '../types';

interface Props {
  settings: SiteSettings;
}

export const FloatingWhatsApp: React.FC<Props> = ({ settings }) => {
  const [isHovered, setIsHovered] = useState(false);

  const rawWa = settings.whatsapp_number || '2349121252258';
  const cleanWaNum = rawWa.replace(/[^0-9]/g, '');
  const waNum = cleanWaNum.startsWith('0') ? '234' + cleanWaNum.slice(1) : cleanWaNum;

  const whatsappUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(
    "Hello Ella's Fashion Concept, I would like to make an inquiry about your bespoke female clothing."
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center">
      {/* Tooltip */}
      <div
        className={`mr-3 px-3.5 py-1.5 bg-[#121212] text-[#F4C430] border border-[#262626] rounded-full text-xs font-medium shadow-xl whitespace-nowrap transition-all duration-300 pointer-events-none ${
          isHovered
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-2'
        }`}
      >
        Chat with us
      </div>

      {/* Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl pulse-whatsapp hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
        aria-label="Chat on WhatsApp"
      >
        <svg
          className="w-7 h-7 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.762.459 3.48 1.332 5.001L2 22l5.148-1.348a9.92 9.92 0 0 0 4.86 1.282h.005c5.506 0 9.99-4.478 9.99-9.985 0-2.667-1.038-5.176-2.925-7.062A9.925 9.925 0 0 0 12.012 2zm5.82 14.156c-.244.688-1.42 1.313-1.956 1.38-.49.062-1.127.097-3.284-.78-2.76-1.122-4.522-3.929-4.66-4.113-.137-.184-1.115-1.482-1.115-2.827 0-1.346.702-2.008.95-2.28.245-.272.535-.34.714-.34.18 0 .358.002.513.01.163.008.384-.062.601.46.223.535.758 1.848.825 1.984.067.136.112.296.022.473-.089.176-.134.295-.268.452-.134.157-.282.352-.403.473-.134.135-.274.281-.118.549.156.268.694 1.146 1.49 1.854 1.025.912 1.89 1.196 2.158 1.33.268.134.424.112.58-.067.157-.179.67-0.781.849-1.049.179-.268.358-.223.603-.134.245.089 1.562.736 1.83 0.87.268.134.446.201.513.313.067.112.067.647-.177 1.335z"/>
        </svg>
      </a>
    </div>
  );
};
