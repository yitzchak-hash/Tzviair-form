import { useApp } from '../context/AppContext';
import { t } from '../i18n';

interface SocialCardProps {
  name: string;
  logoUrl: string;
  qrUrl: string;
}

function SocialCard({ name, logoUrl, qrUrl }: SocialCardProps) {
  const hasLogo = !!logoUrl;
  const hasQr = !!qrUrl;

  if (!hasLogo && !hasQr) return null;

  return (
    <div className="flex-1 min-w-[160px] bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-4">
      {hasLogo ? (
        <img
          src={logoUrl}
          alt={name}
          className="w-10 h-10 object-contain"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-100" />
      )}

      <span className="text-[#17213A] text-sm font-medium">{name}</span>

      {hasQr ? (
        <img
          src={qrUrl}
          alt={`${name} QR`}
          className="w-28 h-28 object-contain rounded-xl"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      ) : (
        <div className="w-28 h-28 rounded-xl bg-gray-50 border border-dashed border-gray-200" />
      )}
    </div>
  );
}

export function SocialFollowSection() {
  const { lang, settings } = useApp();
  const tx = t[lang];
  const isRtl = lang === 'he';
  const { social } = settings;

  const hasAny =
    social.instagramLogoUrl || social.instagramQrUrl ||
    social.tiktokLogoUrl || social.tiktokQrUrl ||
    social.facebookLogoUrl || social.facebookQrUrl;

  if (!hasAny) return null;

  return (
    <div className="mt-12 pt-10 border-t border-gray-100" dir={isRtl ? 'rtl' : 'ltr'}>
      <p className={`text-[#17213A] text-base font-medium leading-relaxed mb-8 ${isRtl ? 'text-right' : 'text-left'}`}>
        {tx.socialHeadline}
      </p>
      <div className="flex flex-row gap-4 justify-center flex-wrap">
        <SocialCard
          name={tx.instagram}
          logoUrl={social.instagramLogoUrl}
          qrUrl={social.instagramQrUrl}
        />
        <SocialCard
          name={tx.tiktok}
          logoUrl={social.tiktokLogoUrl}
          qrUrl={social.tiktokQrUrl}
        />
        <SocialCard
          name={tx.facebook}
          logoUrl={social.facebookLogoUrl}
          qrUrl={social.facebookQrUrl}
        />
      </div>
    </div>
  );
}
