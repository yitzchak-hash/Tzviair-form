import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { t } from '../../i18n';
import type { AppSettings, Question, QuestionType } from '../../types';
import { fileToDataUrl } from '../../utils/imageUpload';

interface Props {
  open: boolean;
  onClose: () => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 flex flex-col gap-4">
      <h3 className="text-[#1C2D55] text-base font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function ImageUploader({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await fileToDataUrl(file);
    onChange(url);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-gray-600 text-sm font-medium">{label}</span>
      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt={label} className="w-16 h-16 object-contain rounded-xl border border-gray-200 bg-white" />
        ) : (
          <div className="w-16 h-16 rounded-xl border border-dashed border-gray-300 bg-white flex items-center justify-center">
            <span className="text-gray-300 text-xs">—</span>
          </div>
        )}
        <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-[#1C2D55] text-sm font-medium
          hover:border-[#44B3E1] hover:bg-sky-50 transition-all duration-200">
          {label}
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            className="hidden"
            onChange={handleFile}
          />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-gray-400 hover:text-red-400 text-sm transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

function QuestionEditor({
  question,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  lang,
}: {
  question: Question;
  index: number;
  total: number;
  onChange: (q: Question) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  lang: 'he' | 'en';
}) {
  const tx = t[lang];

  const updateOption = (i: number, field: 'en' | 'he', val: string) => {
    const opts = [...(question.options ?? [])];
    opts[i] = { ...opts[i], [field]: val };
    onChange({ ...question, options: opts });
  };

  const addOption = () => {
    const opts = [...(question.options ?? []), { en: '', he: '' }];
    onChange({ ...question, options: opts });
  };

  const removeOption = (i: number) => {
    const opts = (question.options ?? []).filter((_, idx) => idx !== i);
    onChange({ ...question, options: opts });
  };

  const isChoice = question.type === 'single-choice' || question.type === 'multi-choice';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1">
          <button
            type="button"
            disabled={index === 0}
            onClick={onMoveUp}
            className="px-2 py-1 rounded-lg text-xs text-gray-400 hover:text-[#1C2D55] disabled:opacity-30 border border-gray-200 transition-colors"
          >↑</button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={onMoveDown}
            className="px-2 py-1 rounded-lg text-xs text-gray-400 hover:text-[#1C2D55] disabled:opacity-30 border border-gray-200 transition-colors"
          >↓</button>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors"
        >
          {tx.adminDelete}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-500 font-medium">{tx.adminLabelEn}</label>
          <input
            type="text"
            value={question.labelEn}
            onChange={(e) => onChange({ ...question, labelEn: e.target.value })}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-[#17213A] focus:outline-none focus:ring-2 focus:ring-[#44B3E1] transition-all"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-500 font-medium">{tx.adminLabelHe}</label>
          <input
            type="text"
            dir="rtl"
            value={question.labelHe}
            onChange={(e) => onChange({ ...question, labelHe: e.target.value })}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-[#17213A] focus:outline-none focus:ring-2 focus:ring-[#44B3E1] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-xs text-gray-500 font-medium">{tx.adminType}</label>
          <select
            value={question.type}
            onChange={(e) => onChange({ ...question, type: e.target.value as QuestionType })}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-[#17213A] focus:outline-none focus:ring-2 focus:ring-[#44B3E1] bg-white transition-all"
          >
            <option value="text">Text</option>
            <option value="tel">Phone (tel)</option>
            <option value="number">Number</option>
            <option value="single-choice">Single Choice</option>
            <option value="multi-choice">Multi Choice</option>
          </select>
        </div>
        <div className="flex items-center gap-2 mt-5">
          <button
            type="button"
            onClick={() => onChange({ ...question, required: !question.required })}
            className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
              question.required
                ? 'bg-[#DB6519] text-white border-[#DB6519]'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            }`}
          >
            {question.required ? tx.adminRequired : tx.adminOptional}
          </button>
        </div>
      </div>

      {isChoice && (
        <div className="flex flex-col gap-3">
          <span className="text-xs text-gray-500 font-medium">{tx.adminOptions}</span>
          {(question.options ?? []).map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="English"
                value={opt.en}
                onChange={(e) => updateOption(i, 'en', e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#44B3E1]"
              />
              <input
                type="text"
                placeholder="עברית"
                dir="rtl"
                value={opt.he}
                onChange={(e) => updateOption(i, 'he', e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#44B3E1]"
              />
              <button
                type="button"
                onClick={() => removeOption(i)}
                className="text-gray-300 hover:text-red-400 transition-colors text-base w-6"
              >✕</button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="text-[#44B3E1] text-sm font-medium hover:text-[#1C2D55] transition-colors text-left"
          >
            + {tx.adminAddOption}
          </button>
        </div>
      )}
    </div>
  );
}

export function AdminPanel({ open, onClose }: Props) {
  const { lang, settings, updateSettings, log, addLog } = useApp();
  const tx = t[lang];

  const [localSettings, setLocalSettings] = useState<AppSettings>(() => JSON.parse(JSON.stringify(settings)));
  const [sheetSaved, setSheetSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'questions' | 'log'>('settings');

  const syncLocal = () => {
    setLocalSettings(JSON.parse(JSON.stringify(settings)));
  };

  const handleOpen = () => {
    syncLocal();
  };

  const handleSheetSave = () => {
    updateSettings({ ...settings, spreadsheetUrl: localSettings.spreadsheetUrl });
    addLog('Spreadsheet URL Updated', localSettings.spreadsheetUrl, 'success');
    setSheetSaved(true);
    setTimeout(() => setSheetSaved(false), 2000);
  };

  const handleLogoUpload = async (url: string) => {
    const next: AppSettings = { ...localSettings, mainLogoUrl: url };
    setLocalSettings(next);
    updateSettings(next);
    addLog('Logo Uploaded', 'Main logo updated', 'success');
  };

  const handleSocialChange = (key: keyof AppSettings['social'], url: string) => {
    const next: AppSettings = {
      ...localSettings,
      social: { ...localSettings.social, [key]: url },
    };
    setLocalSettings(next);
    updateSettings(next);
    addLog('Social Asset Uploaded', key, 'success');
  };

  const handleQuestionChange = (i: number, q: Question) => {
    const qs = [...localSettings.questions];
    qs[i] = q;
    setLocalSettings({ ...localSettings, questions: qs });
  };

  const handleDeleteQuestion = (i: number) => {
    const qs = localSettings.questions.filter((_, idx) => idx !== i);
    setLocalSettings({ ...localSettings, questions: qs });
    addLog('Question Removed', `Index ${i}`);
  };

  const handleMoveUp = (i: number) => {
    if (i === 0) return;
    const qs = [...localSettings.questions];
    [qs[i - 1], qs[i]] = [qs[i], qs[i - 1]];
    setLocalSettings({ ...localSettings, questions: qs });
  };

  const handleMoveDown = (i: number) => {
    const qs = [...localSettings.questions];
    if (i >= qs.length - 1) return;
    [qs[i], qs[i + 1]] = [qs[i + 1], qs[i]];
    setLocalSettings({ ...localSettings, questions: qs });
  };

  const handleAddQuestion = () => {
    const newQ: Question = {
      id: `q_${Date.now()}`,
      labelEn: 'New Question',
      labelHe: 'שאלה חדשה',
      type: 'text',
      required: false,
    };
    setLocalSettings({ ...localSettings, questions: [...localSettings.questions, newQ] });
    addLog('Question Added', newQ.labelEn);
  };

  const handleSaveQuestions = () => {
    updateSettings(localSettings);
    addLog('Questions Saved', `${localSettings.questions.length} questions`, 'success');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-white overflow-y-auto"
          onAnimationStart={handleOpen}
        >
          {/* Admin Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 z-10 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1C2D55] flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="text-[#1C2D55] font-semibold text-base">{tx.adminTitle}</span>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium
                hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              {tx.adminClose}
            </button>
          </div>

          {/* Tabs */}
          <div className="px-6 pt-4 flex gap-2 border-b border-gray-100">
            {(['settings', 'questions', 'log'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-t-xl text-sm font-medium transition-all border-b-2 ${
                  activeTab === tab
                    ? 'text-[#1C2D55] border-[#1C2D55]'
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
              >
                {tab === 'settings' ? 'Settings' : tab === 'questions' ? 'Questions' : 'Log'}
              </button>
            ))}
          </div>

          <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <>
                {/* Logo */}
                <Section title={tx.adminLogoSection}>
                  <ImageUploader
                    label={tx.uploadLogo}
                    value={localSettings.mainLogoUrl}
                    onChange={handleLogoUpload}
                  />
                </Section>

                {/* Social */}
                <Section title={tx.adminSocialSection}>
                  <div className="grid grid-cols-1 gap-6">
                    {/* Instagram */}
                    <div className="flex flex-col gap-3">
                      <span className="text-sm font-semibold text-gray-700">{tx.instagram}</span>
                      <div className="grid grid-cols-2 gap-3">
                        <ImageUploader
                          label={tx.uploadImage}
                          value={localSettings.social.instagramLogoUrl}
                          onChange={(url) => handleSocialChange('instagramLogoUrl', url)}
                        />
                        <ImageUploader
                          label={tx.uploadQr}
                          value={localSettings.social.instagramQrUrl}
                          onChange={(url) => handleSocialChange('instagramQrUrl', url)}
                        />
                      </div>
                    </div>
                    {/* TikTok */}
                    <div className="flex flex-col gap-3">
                      <span className="text-sm font-semibold text-gray-700">{tx.tiktok}</span>
                      <div className="grid grid-cols-2 gap-3">
                        <ImageUploader
                          label={tx.uploadImage}
                          value={localSettings.social.tiktokLogoUrl}
                          onChange={(url) => handleSocialChange('tiktokLogoUrl', url)}
                        />
                        <ImageUploader
                          label={tx.uploadQr}
                          value={localSettings.social.tiktokQrUrl}
                          onChange={(url) => handleSocialChange('tiktokQrUrl', url)}
                        />
                      </div>
                    </div>
                    {/* Facebook */}
                    <div className="flex flex-col gap-3">
                      <span className="text-sm font-semibold text-gray-700">{tx.facebook}</span>
                      <div className="grid grid-cols-2 gap-3">
                        <ImageUploader
                          label={tx.uploadImage}
                          value={localSettings.social.facebookLogoUrl}
                          onChange={(url) => handleSocialChange('facebookLogoUrl', url)}
                        />
                        <ImageUploader
                          label={tx.uploadQr}
                          value={localSettings.social.facebookQrUrl}
                          onChange={(url) => handleSocialChange('facebookQrUrl', url)}
                        />
                      </div>
                    </div>
                  </div>
                </Section>

                {/* Spreadsheet URL */}
                <Section title={tx.adminSheetSection}>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm text-gray-500 font-medium">{tx.adminSheetUrl}</label>
                    <input
                      type="url"
                      value={localSettings.spreadsheetUrl}
                      onChange={(e) => setLocalSettings({ ...localSettings, spreadsheetUrl: e.target.value })}
                      placeholder="https://script.google.com/..."
                      className="px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#17213A] font-mono
                        focus:outline-none focus:ring-2 focus:ring-[#44B3E1] transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleSheetSave}
                      className={`self-start px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        sheetSaved
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-[#1C2D55] text-white hover:bg-[#17213A]'
                      }`}
                    >
                      {sheetSaved ? `✓ ${tx.adminSheetSaved}` : tx.adminSheetSave}
                    </button>
                  </div>
                </Section>
              </>
            )}

            {/* Questions Tab */}
            {activeTab === 'questions' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[#1C2D55] text-base font-semibold">{tx.adminQuestionsSection}</h3>
                  <button
                    type="button"
                    onClick={handleSaveQuestions}
                    className="px-5 py-2.5 rounded-xl bg-[#1C2D55] text-white text-sm font-medium
                      hover:bg-[#17213A] transition-all duration-200"
                  >
                    {tx.adminSave}
                  </button>
                </div>

                {localSettings.questions.map((q, i) => (
                  <QuestionEditor
                    key={q.id}
                    question={q}
                    index={i}
                    total={localSettings.questions.length}
                    onChange={(updated) => handleQuestionChange(i, updated)}
                    onDelete={() => handleDeleteQuestion(i)}
                    onMoveUp={() => handleMoveUp(i)}
                    onMoveDown={() => handleMoveDown(i)}
                    lang={lang}
                  />
                ))}

                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="w-full py-4 rounded-2xl border-2 border-dashed border-[#44B3E1] text-[#44B3E1] text-sm font-medium
                    hover:bg-sky-50 transition-all duration-200"
                >
                  + {tx.adminAddQuestion}
                </button>

                <button
                  type="button"
                  onClick={handleSaveQuestions}
                  className="w-full py-4 rounded-2xl bg-[#1C2D55] text-white text-sm font-semibold
                    hover:bg-[#17213A] transition-all duration-200"
                >
                  {tx.adminSave}
                </button>
              </div>
            )}

            {/* Log Tab */}
            {activeTab === 'log' && (
              <Section title={tx.adminLogSection}>
                <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
                  {log.length === 0 && (
                    <p className="text-gray-400 text-sm text-center py-4">No log entries yet</p>
                  )}
                  {log.map((entry) => (
                    <div
                      key={entry.id}
                      className={`flex items-start gap-3 px-4 py-3 rounded-xl text-sm ${
                        entry.status === 'error'
                          ? 'bg-red-50 text-red-700'
                          : entry.status === 'success'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      <span className="text-xs font-mono text-gray-400 mt-0.5 shrink-0">{entry.time}</span>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-medium">{entry.action}</span>
                        <span className="text-xs opacity-70 truncate">{entry.detail}</span>
                      </div>
                      <span className="ms-auto shrink-0 text-xs">
                        {entry.status === 'error' ? '✗' : entry.status === 'success' ? '✓' : '·'}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
