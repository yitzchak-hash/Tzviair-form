import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function Logo() {
  const { settings } = useApp();
  const [failed, setFailed] = useState(false);

  const uploadedUrl = settings.mainLogoUrl;
  const defaultSrc = '/tzviair-logo.svg';

  if (failed) {
    return (
      <div className="flex justify-center mb-6">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[#1C2D55] font-bold tracking-tight" style={{ fontSize: '2.8rem', letterSpacing: '-0.03em' }}>
            Tzvi<span className="text-[#44B3E1]">Air</span>
          </span>
          <span className="text-[#DB6519] text-xs tracking-widest font-medium uppercase">Air Conditioning</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center mb-6">
      <img
        src={uploadedUrl || defaultSrc}
        alt="TzviAir"
        className="object-contain"
        style={{ maxWidth: '780px', maxHeight: '220px', width: '100%' }}
        onError={(e) => {
          const img = e.currentTarget;
          if (uploadedUrl && img.src !== window.location.origin + defaultSrc) {
            img.src = defaultSrc;
          } else {
            setFailed(true);
          }
        }}
      />
    </div>
  );
}
