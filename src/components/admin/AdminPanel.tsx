import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import type { AppSettings, ContentSettings, LayoutSettings, Question, QuestionType } from '../../types';
import { fileToDataUrl } from '../../utils/imageUpload';
import { DEFAULT_CONTENT, DEFAULT_LAYOUT } from '../../utils/defaults';

interface Props {
  open: boolean;
  onClose: () => void;
}

type Tab = 'settings' | 'text' | 'layout' | 'questions' | 'log';

// ─── Shared sub-components ───────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 flex flex-col gap-4">
      <h3 className="text-[#1C2D55] text-sm font-semibold uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-gray-500 font-medium">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, dir, placeholder, mono }: {
  value: string; onChange: (v: string) => void;
  dir?: 'rtl' | 'ltr'; placeholder?: string; mono?: boolean;
}) {
  return (
    <input type="text" dir={dir} placeholder={placeholder} value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-[#17213A]
        focus:outline-none focus:ring-2 focus:ring-[#44B3E1] transition-all bg-white
        ${mono ? 'font-mono' : ''}`}
    />
  );
}

function Textarea({ value, onChange, dir }: { value: string; onChange: (v: string) => void; dir?: 'rtl' | 'ltr' }) {
  return (
    <textarea dir={dir} rows={2} value={value} onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-[#17213A]
        focus:outline-none focus:ring-2 focus:ring-[#44B3E1] transition-all resize-none bg-white"
    />
  );
}

function BilingualRow({ labelHe, labelEn, valueHe, valueEn, onChangeHe, onChangeEn, multiline }: {
  labelHe: string; labelEn: string;
  valueHe: string; valueEn: string;
  onChangeHe: (v: string) => void; onChangeEn: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Field label={labelHe}>
        {multiline
          ? <Textarea dir="rtl" value={valueHe} onChange={onChangeHe} />
          : <Input dir="rtl" value={valueHe} onChange={onChangeHe} />}
      </Field>
      <Field label={labelEn}>
        {multiline
          ? <Textarea value={valueEn} onChange={onChangeEn} />
          : <Input value={valueEn} onChange={onChangeEn} />}
      </Field>
    </div>
  );
}

function SaveButton({ saved, onSave, label, savedLabel }: { saved: boolean; onSave: () => void; label: string; savedLabel: string }) {
  return (
    <button type="button" onClick={onSave}
      className={`self-start px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        saved ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-[#1C2D55] text-white hover:bg-[#17213A]'
      }`}>
      {saved ? `✓ ${savedLabel}` : label}
    </button>
  );
}

function ImageUploader({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(await fileToDataUrl(file));
    e.target.value = '';
  };
  return (
    <div className="flex flex-col gap-2">
      <span className="text-gray-600 text-xs font-medium">{label}</span>
      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt={label} className="w-14 h-14 object-contain rounded-xl border border-gray-200 bg-white" />
        ) : (
          <div className="w-14 h-14 rounded-xl border border-dashed border-gray-300 bg-white flex items-center justify-center">
            <span className="text-gray-300 text-xs">—</span>
          </div>
        )}
        <label className="cursor-pointer px-4 py-2 rounded-xl bg-white border border-gray-200 text-[#1C2D55] text-xs font-medium
          hover:border-[#44B3E1] hover:bg-sky-50 transition-all">
          Choose
          <input type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={handleFile} />
        </label>
        {value && <button type="button" onClick={() => onChange('')} className="text-gray-300 hover:text-red-400 text-sm">✕</button>}
      </div>
    </div>
  );
}

// ─── Slider ──────────────────────────────────────────────────────────────────

function Slider({ label, value, min, max, unit, onChange }: {
  label: string; value: number; min: number; max: number; unit: string; onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        <span className="text-xs font-semibold text-[#1C2D55] bg-white border border-gray-200 rounded-lg px-2 py-0.5 tabular-nums">
          {value}{unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 appearance-none rounded-full cursor-pointer accent-[#44B3E1]"
        style={{ background: `linear-gradient(to right, #44B3E1 ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%)` }}
      />
      <div className="flex justify-between text-xs text-gray-300">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}

// ─── Question Editor ─────────────────────────────────────────────────────────

function QuestionEditor({ question, index, total, onChange, onDelete, onMoveUp, onMoveDown }: {
  question: Question; index: number; total: number;
  onChange: (q: Question) => void; onDelete: () => void;
  onMoveUp: () => void; onMoveDown: () => void;
}) {
  const isChoice = question.type === 'single-choice' || question.type === 'multi-choice';

  const updateOption = (i: number, field: 'en' | 'he', val: string) => {
    const opts = [...(question.options ?? [])];
    opts[i] = { ...opts[i], [field]: val };
    onChange({ ...question, options: opts });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1">
          {[['↑', index === 0, onMoveUp], ['↓', index === total - 1, onMoveDown]].map(([arrow, disabled, fn]) => (
            <button key={arrow as string} type="button" disabled={disabled as boolean} onClick={fn as () => void}
              className="px-2 py-1 rounded-lg text-xs text-gray-400 hover:text-[#1C2D55] disabled:opacity-30 border border-gray-200">
              {arrow as string}
            </button>
          ))}
        </div>
        <button type="button" onClick={onDelete} className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors">
          Delete
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Hebrew label">
          <Input dir="rtl" value={question.labelHe} onChange={(v) => onChange({ ...question, labelHe: v })} />
        </Field>
        <Field label="English label">
          <Input value={question.labelEn} onChange={(v) => onChange({ ...question, labelEn: v })} />
        </Field>
      </div>

      <div className="flex items-center gap-3">
        <Field label="Type">
          <select value={question.type} onChange={(e) => onChange({ ...question, type: e.target.value as QuestionType })}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-[#17213A] focus:outline-none focus:ring-2 focus:ring-[#44B3E1] bg-white">
            <option value="text">Text</option>
            <option value="tel">Phone</option>
            <option value="number">Number</option>
            <option value="single-choice">Single Choice</option>
            <option value="multi-choice">Multi Choice</option>
          </select>
        </Field>
        <div className="mt-5">
          <button type="button" onClick={() => onChange({ ...question, required: !question.required })}
            className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
              question.required ? 'bg-[#DB6519] text-white border-[#DB6519]' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            }`}>
            {question.required ? 'Required' : 'Optional'}
          </button>
        </div>
      </div>

      {isChoice && (
        <div className="flex flex-col gap-3">
          <span className="text-xs text-gray-500 font-medium">Options (Hebrew / English)</span>
          {(question.options ?? []).map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="text" placeholder="עברית" dir="rtl" value={opt.he}
                onChange={(e) => updateOption(i, 'he', e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#44B3E1]" />
              <input type="text" placeholder="English" value={opt.en}
                onChange={(e) => updateOption(i, 'en', e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#44B3E1]" />
              <button type="button" onClick={() => onChange({ ...question, options: (question.options ?? []).filter((_, idx) => idx !== i) })}
                className="text-gray-300 hover:text-red-400 w-5 text-base">✕</button>
            </div>
          ))}
          <button type="button"
            onClick={() => onChange({ ...question, options: [...(question.options ?? []), { en: '', he: '' }] })}
            className="text-[#44B3E1] text-sm font-medium hover:text-[#1C2D55] transition-colors text-left">
            + Add option
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main AdminPanel ──────────────────────────────────────────────────────────

export function AdminPanel({ open, onClose }: Props) {
  const { settings, updateSettings, log, addLog } = useApp();

  const [local, setLocal] = useState<AppSettings>(() => JSON.parse(JSON.stringify(settings)));
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<Tab>('settings');

  const flash = (key: string) => {
    setSaved((s) => ({ ...s, [key]: true }));
    setTimeout(() => setSaved((s) => ({ ...s, [key]: false })), 2000);
  };

  const syncLocal = () => setLocal(JSON.parse(JSON.stringify(settings)));

  const setContent = (patch: Partial<ContentSettings>) =>
    setLocal((l) => ({ ...l, content: { ...l.content, ...patch } }));

  const setLayout = (patch: Partial<LayoutSettings>) =>
    setLocal((l) => ({ ...l, layout: { ...l.layout, ...patch } }));

  const saveContent = () => {
    updateSettings({ ...settings, content: local.content });
    addLog('Form Text Updated', 'All text fields saved', 'success');
    flash('text');
  };

  const saveLayout = () => {
    updateSettings({ ...settings, layout: local.layout });
    addLog('Layout Updated', 'Size & positioning saved', 'success');
    flash('layout');
  };

  const handleLogoUpload = async (url: string) => {
    const next = { ...local, mainLogoUrl: url };
    setLocal(next); updateSettings(next);
    addLog('Logo Uploaded', 'Main logo updated', 'success');
  };

  const handleSocialChange = (key: keyof AppSettings['social'], url: string) => {
    const next = { ...local, social: { ...local.social, [key]: url } };
    setLocal(next); updateSettings(next);
    addLog('Social Asset Uploaded', key, 'success');
  };

  const saveSheet = () => {
    updateSettings({ ...settings, spreadsheetUrl: local.spreadsheetUrl });
    addLog('Spreadsheet URL Updated', local.spreadsheetUrl, 'success');
    flash('sheet');
  };

  const saveQuestions = () => {
    updateSettings({ ...settings, questions: local.questions });
    addLog('Questions Saved', `${local.questions.length} questions`, 'success');
    flash('questions');
  };

  const handleAddQuestion = () => {
    const q: Question = { id: `q_${Date.now()}`, labelEn: 'New Question', labelHe: 'שאלה חדשה', type: 'text', required: false };
    setLocal((l) => ({ ...l, questions: [...l.questions, q] }));
    addLog('Question Added', q.labelEn);
  };

  const updateQuestion = (i: number, q: Question) =>
    setLocal((l) => { const qs = [...l.questions]; qs[i] = q; return { ...l, questions: qs }; });

  const deleteQuestion = (i: number) => {
    setLocal((l) => ({ ...l, questions: l.questions.filter((_, idx) => idx !== i) }));
    addLog('Question Removed', `Index ${i}`);
  };

  const moveQuestion = (i: number, dir: -1 | 1) => {
    setLocal((l) => {
      const qs = [...l.questions];
      [qs[i], qs[i + dir]] = [qs[i + dir], qs[i]];
      return { ...l, questions: qs };
    });
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: 'settings',  label: 'Settings'  },
    { id: 'text',      label: 'Text'      },
    { id: 'layout',    label: 'Layout'    },
    { id: 'questions', label: 'Questions' },
    { id: 'log',       label: 'Log'       },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-white overflow-y-auto"
          onAnimationStart={syncLocal}>

          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 z-10 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1C2D55] flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="text-[#1C2D55] font-semibold text-base">Admin Panel</span>
            </div>
            <button onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all">
              Close
            </button>
          </div>

          {/* Tabs */}
          <div className="px-6 pt-4 flex gap-1 border-b border-gray-100 overflow-x-auto">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-t-xl text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id ? 'text-[#1C2D55] border-[#1C2D55]' : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">

            {/* ── SETTINGS TAB ── */}
            {activeTab === 'settings' && (
              <>
                <Section title="Main Logo">
                  <ImageUploader label="Upload logo (PNG/JPG)" value={local.mainLogoUrl} onChange={handleLogoUpload} />
                </Section>

                <Section title="Social Icons & QR Codes">
                  {(['instagram', 'tiktok', 'facebook'] as const).map((platform) => (
                    <div key={platform} className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-gray-700 capitalize">{platform}</span>
                      <div className="grid grid-cols-2 gap-3">
                        <ImageUploader
                          label="Icon"
                          value={local.social[`${platform}LogoUrl` as keyof typeof local.social]}
                          onChange={(url) => handleSocialChange(`${platform}LogoUrl` as keyof AppSettings['social'], url)}
                        />
                        <ImageUploader
                          label="QR Code"
                          value={local.social[`${platform}QrUrl` as keyof typeof local.social]}
                          onChange={(url) => handleSocialChange(`${platform}QrUrl` as keyof AppSettings['social'], url)}
                        />
                      </div>
                    </div>
                  ))}
                </Section>

                <Section title="Google Sheets URL">
                  <Field label="Apps Script endpoint">
                    <Input mono value={local.spreadsheetUrl} onChange={(v) => setLocal({ ...local, spreadsheetUrl: v })} />
                  </Field>
                  <SaveButton saved={!!saved.sheet} onSave={saveSheet} label="Save URL" savedLabel="Saved" />
                </Section>
              </>
            )}

            {/* ── TEXT TAB ── */}
            {activeTab === 'text' && (
              <>
                <Section title="Title & Subtitle">
                  <BilingualRow labelHe="כותרת — עברית" labelEn="Title — English"
                    valueHe={local.content.titleHe} valueEn={local.content.titleEn}
                    onChangeHe={(v) => setContent({ titleHe: v })} onChangeEn={(v) => setContent({ titleEn: v })} />
                  <BilingualRow labelHe="תת-כותרת — עברית" labelEn="Subtitle — English"
                    valueHe={local.content.subtitleHe} valueEn={local.content.subtitleEn}
                    onChangeHe={(v) => setContent({ subtitleHe: v })} onChangeEn={(v) => setContent({ subtitleEn: v })}
                    multiline />
                </Section>

                <Section title="Submit Button">
                  <BilingualRow labelHe='כפתור שליחה — עברית' labelEn='Submit button — English'
                    valueHe={local.content.submitHe} valueEn={local.content.submitEn}
                    onChangeHe={(v) => setContent({ submitHe: v })} onChangeEn={(v) => setContent({ submitEn: v })} />
                  <BilingualRow labelHe='מצב שליחה — עברית' labelEn='Sending state — English'
                    valueHe={local.content.submittingHe} valueEn={local.content.submittingEn}
                    onChangeHe={(v) => setContent({ submittingHe: v })} onChangeEn={(v) => setContent({ submittingEn: v })} />
                </Section>

                <Section title="Success Screen">
                  <BilingualRow labelHe='כותרת הצלחה — עברית' labelEn='Success title — English'
                    valueHe={local.content.successTitleHe} valueEn={local.content.successTitleEn}
                    onChangeHe={(v) => setContent({ successTitleHe: v })} onChangeEn={(v) => setContent({ successTitleEn: v })} />
                  <BilingualRow labelHe='משפט הצלחה — עברית' labelEn='Success subtitle — English'
                    valueHe={local.content.successSubtitleHe} valueEn={local.content.successSubtitleEn}
                    onChangeHe={(v) => setContent({ successSubtitleHe: v })} onChangeEn={(v) => setContent({ successSubtitleEn: v })}
                    multiline />
                  <BilingualRow labelHe='כפתור מילוי נוסף — עברית' labelEn='"Fill another" button — English'
                    valueHe={local.content.fillAnotherHe} valueEn={local.content.fillAnotherEn}
                    onChangeHe={(v) => setContent({ fillAnotherHe: v })} onChangeEn={(v) => setContent({ fillAnotherEn: v })} />
                </Section>

                <Section title="Error & Validation">
                  <BilingualRow labelHe='שגיאת שליחה — עברית' labelEn='Submit error — English'
                    valueHe={local.content.errorMsgHe} valueEn={local.content.errorMsgEn}
                    onChangeHe={(v) => setContent({ errorMsgHe: v })} onChangeEn={(v) => setContent({ errorMsgEn: v })}
                    multiline />
                  <BilingualRow labelHe='שדה חובה — עברית' labelEn='Required label — English'
                    valueHe={local.content.requiredHe} valueEn={local.content.requiredEn}
                    onChangeHe={(v) => setContent({ requiredHe: v })} onChangeEn={(v) => setContent({ requiredEn: v })} />
                </Section>

                <Section title="Social Follow Section">
                  <BilingualRow labelHe='כותרת סושיאל — עברית' labelEn='Social headline — English'
                    valueHe={local.content.socialHeadlineHe} valueEn={local.content.socialHeadlineEn}
                    onChangeHe={(v) => setContent({ socialHeadlineHe: v })} onChangeEn={(v) => setContent({ socialHeadlineEn: v })}
                    multiline />
                  <BilingualRow labelHe='תווית מעקב — עברית' labelEn='"I followed" label — English'
                    valueHe={local.content.socialFollowLabelHe} valueEn={local.content.socialFollowLabelEn}
                    onChangeHe={(v) => setContent({ socialFollowLabelHe: v })} onChangeEn={(v) => setContent({ socialFollowLabelEn: v })} />
                  <BilingualRow labelHe='רמז 2/3 — עברית' labelEn='2/3 hint — English'
                    valueHe={local.content.socialRequiredHintHe} valueEn={local.content.socialRequiredHintEn}
                    onChangeHe={(v) => setContent({ socialRequiredHintHe: v })} onChangeEn={(v) => setContent({ socialRequiredHintEn: v })} />
                  <BilingualRow labelHe='שגיאת 2/3 — עברית' labelEn='2/3 error — English'
                    valueHe={local.content.socialRequiredErrorHe} valueEn={local.content.socialRequiredErrorEn}
                    onChangeHe={(v) => setContent({ socialRequiredErrorHe: v })} onChangeEn={(v) => setContent({ socialRequiredErrorEn: v })} />
                </Section>

                <div className="flex items-center gap-3">
                  <SaveButton saved={!!saved.text} onSave={saveContent} label="Save All Text" savedLabel="Saved" />
                  <button type="button" onClick={() => setLocal((l) => ({ ...l, content: { ...DEFAULT_CONTENT } }))}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
                    Reset to defaults
                  </button>
                </div>
              </>
            )}

            {/* ── LAYOUT TAB ── */}
            {activeTab === 'layout' && (
              <>
                <Section title="Font Sizes">
                  <Slider label="Page title" value={local.layout.titleSizePx} min={20} max={60} unit="px"
                    onChange={(v) => setLayout({ titleSizePx: v })} />
                  <Slider label="Subtitle" value={local.layout.subtitleSizePx} min={12} max={24} unit="px"
                    onChange={(v) => setLayout({ subtitleSizePx: v })} />
                  <Slider label="Question labels" value={local.layout.questionSizePx} min={12} max={22} unit="px"
                    onChange={(v) => setLayout({ questionSizePx: v })} />
                  <Slider label="Submit button" value={local.layout.submitSizePx} min={14} max={26} unit="px"
                    onChange={(v) => setLayout({ submitSizePx: v })} />
                </Section>

                <Section title="Alignment">
                  {[
                    { label: 'Title alignment', key: 'titleAlign' as const },
                    { label: 'Subtitle alignment', key: 'subtitleAlign' as const },
                  ].map(({ label, key }) => (
                    <div key={key} className="flex flex-col gap-2">
                      <span className="text-xs text-gray-500 font-medium">{label}</span>
                      <div className="flex gap-2">
                        {(['start', 'center'] as const).map((align) => (
                          <button key={align} type="button"
                            onClick={() => setLayout({ [key]: align })}
                            className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                              local.layout[key] === align
                                ? 'bg-[#1C2D55] text-white border-[#1C2D55]'
                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                            }`}>
                            {align === 'start' ? '⇤  Start' : '⊕  Center'}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </Section>

                <Section title="Dimensions">
                  <Slider label="Logo max height" value={local.layout.logoMaxHeightPx} min={60} max={360} unit="px"
                    onChange={(v) => setLayout({ logoMaxHeightPx: v })} />
                  <Slider label="Form max width" value={local.layout.formMaxWidthPx} min={400} max={960} unit="px"
                    onChange={(v) => setLayout({ formMaxWidthPx: v })} />
                  <Slider label="Space between fields" value={local.layout.fieldGapPx} min={12} max={60} unit="px"
                    onChange={(v) => setLayout({ fieldGapPx: v })} />
                </Section>

                <div className="flex items-center gap-3">
                  <SaveButton saved={!!saved.layout} onSave={saveLayout} label="Save Layout" savedLabel="Saved" />
                  <button type="button" onClick={() => setLocal((l) => ({ ...l, layout: { ...DEFAULT_LAYOUT } }))}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
                    Reset to defaults
                  </button>
                </div>
              </>
            )}

            {/* ── QUESTIONS TAB ── */}
            {activeTab === 'questions' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[#1C2D55] text-base font-semibold">Question Management</h3>
                  <SaveButton saved={!!saved.questions} onSave={saveQuestions} label="Save Questions" savedLabel="Saved" />
                </div>

                {local.questions.map((q, i) => (
                  <QuestionEditor key={q.id} question={q} index={i} total={local.questions.length}
                    onChange={(updated) => updateQuestion(i, updated)}
                    onDelete={() => deleteQuestion(i)}
                    onMoveUp={() => moveQuestion(i, -1)}
                    onMoveDown={() => moveQuestion(i, 1)}
                  />
                ))}

                <button type="button" onClick={handleAddQuestion}
                  className="w-full py-4 rounded-2xl border-2 border-dashed border-[#44B3E1] text-[#44B3E1] text-sm font-medium
                    hover:bg-sky-50 transition-all">
                  + Add question
                </button>

                <SaveButton saved={!!saved.questions} onSave={saveQuestions} label="Save Questions" savedLabel="Saved" />
              </div>
            )}

            {/* ── LOG TAB ── */}
            {activeTab === 'log' && (
              <Section title="Activity Log">
                <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
                  {log.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No entries yet</p>}
                  {log.map((entry) => (
                    <div key={entry.id}
                      className={`flex items-start gap-3 px-4 py-3 rounded-xl text-sm ${
                        entry.status === 'error' ? 'bg-red-50 text-red-700'
                        : entry.status === 'success' ? 'bg-green-50 text-green-700'
                        : 'bg-gray-50 text-gray-600'
                      }`}>
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
