import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageToggle } from './components/LanguageToggle';
import { Logo } from './components/Logo';
import { FormRenderer } from './components/FormRenderer';
import { HiddenAdminButton } from './components/admin/HiddenAdminButton';
import { AdminCodeModal } from './components/admin/AdminCodeModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { t } from './i18n';
import { motion } from 'framer-motion';

function AppContent() {
  const { lang } = useApp();
  const tx = t[lang];
  const isRtl = lang === 'he';

  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="min-h-dvh bg-white relative" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top gradient accent */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(to right, #1C2D55, #44B3E1, #E1992C, #DB6519)',
        }}
      />

      {/* Hidden admin trigger */}
      <HiddenAdminButton onClick={() => setShowCodeModal(true)} />

      {/* Main content */}
      <div className="max-w-[680px] mx-auto px-5 pt-12 pb-20">

        {/* Language toggle */}
        <div className={`flex mb-10 ${isRtl ? 'justify-start' : 'justify-end'}`}>
          <LanguageToggle />
        </div>

        {/* Logo */}
        <Logo />

        {/* Title section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`mb-10 ${isRtl ? 'text-right' : 'text-left'}`}
        >
          <h1 className="text-[#1C2D55] text-3xl font-bold tracking-tight mb-3 leading-tight">
            {tx.title}
          </h1>
          <p className="text-gray-500 text-base leading-relaxed max-w-[520px]">
            {tx.subtitle}
          </p>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-[#44B3E1]/30 via-[#1C2D55]/10 to-transparent mb-10" />

        {/* Form (includes social checkboxes + submit button) */}
        <FormRenderer />

      </div>

      {/* Admin modals */}
      <AdminCodeModal
        open={showCodeModal}
        onSuccess={() => { setShowCodeModal(false); setShowAdmin(true); }}
        onClose={() => setShowCodeModal(false)}
      />
      <AdminPanel
        open={showAdmin}
        onClose={() => setShowAdmin(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
