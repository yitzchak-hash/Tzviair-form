import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { t } from '../../i18n';

const ADMIN_CODE = '2141';

interface Props {
  open: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export function AdminCodeModal({ open, onSuccess, onClose }: Props) {
  const { lang, addLog } = useApp();
  const tx = t[lang];
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === ADMIN_CODE) {
      setCode('');
      setError(false);
      addLog('Admin Opened', 'Admin panel accessed');
      onSuccess();
    } else {
      setError(true);
    }
  };

  const handleClose = () => {
    setCode('');
    setError(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[#1C2D55] text-xl font-semibold mb-6 text-center">
              {tx.adminCode}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="password"
                value={code}
                onChange={(e) => { setCode(e.target.value); setError(false); }}
                placeholder={tx.adminCodePlaceholder}
                autoFocus
                className={`w-full px-5 py-4 rounded-2xl border text-center text-lg tracking-widest text-[#17213A]
                  focus:outline-none focus:ring-2 focus:ring-[#44B3E1] focus:border-transparent transition-all
                  ${error ? 'border-[#DB6519]' : 'border-gray-200'}`}
              />
              {error && (
                <p className="text-[#DB6519] text-sm text-center font-medium">{tx.adminCodeError}</p>
              )}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#1C2D55] text-white font-semibold text-base
                  hover:bg-[#17213A] transition-all duration-200"
              >
                {tx.adminEnter}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
