import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { FormValues, Question } from '../types';
import { validateForm } from '../utils/validateForm';
import { buildPayload } from '../utils/buildPayload';
import { submitToGoogleSheets } from '../utils/submitToGoogleSheets';
import { TextInput } from './TextInput';
import { ChoiceGroup } from './ChoiceGroup';
import { SuccessState } from './SuccessState';
import { SocialCheckboxSection } from './SocialCheckboxSection';
import type { SocialKey } from './SocialCheckboxSection';
import { motion } from 'framer-motion';

const SOCIAL_KEYS: SocialKey[] = ['instagram', 'tiktok', 'facebook'];
const SOCIAL_REQUIRED = 2;

const EMPTY_SOCIAL: Record<SocialKey, boolean> = {
  instagram: false,
  tiktok: false,
  facebook: false,
};

export function FormRenderer() {
  const { lang, settings, addLog } = useApp();
  const { content, layout } = settings;
  const isRtl = lang === 'he';

  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [socialChecked, setSocialChecked] = useState<Record<SocialKey, boolean>>(EMPTY_SOCIAL);
  const [socialError, setSocialError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const questions: Question[] = settings.questions;
  const checkedCount = SOCIAL_KEYS.filter((k) => socialChecked[k]).length;
  const socialReady = checkedCount >= SOCIAL_REQUIRED;

  const requiredMsg = lang === 'he' ? content.requiredHe : content.requiredEn;
  const submitLabel = lang === 'he' ? content.submitHe : content.submitEn;
  const submittingLabel = lang === 'he' ? content.submittingHe : content.submittingEn;
  const errorMsg = lang === 'he' ? content.errorMsgHe : content.errorMsgEn;
  const hintMsg = lang === 'he' ? content.socialRequiredHintHe : content.socialRequiredHintEn;

  const handleChange = (id: string, val: string | string[]) => {
    setValues((prev) => ({ ...prev, [id]: val }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: false }));
  };

  const handleSocialChange = (key: SocialKey, val: boolean) => {
    setSocialChecked((prev) => ({ ...prev, [key]: val }));
    if (socialError) setSocialError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fieldErrors = validateForm(questions, values);
    const hasSocialError = !socialReady;

    if (Object.keys(fieldErrors).length > 0 || hasSocialError) {
      setErrors(fieldErrors);
      setSocialError(hasSocialError);
      if (Object.keys(fieldErrors).length > 0) {
        const firstErrId = Object.keys(fieldErrors)[0];
        document.getElementById(firstErrId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setSubmitting(true);
    setSubmitError(false);

    const payload = buildPayload(questions, values, lang);
    payload.socialFollowed = SOCIAL_KEYS.filter((k) => socialChecked[k]).join(', ');

    try {
      await submitToGoogleSheets(settings.spreadsheetUrl, payload);
      addLog('Form Submitted', `Name: ${payload['fullName'] || payload[questions[0]?.id] || ''}`, 'success');
      setSubmitted(true);
      setValues({});
      setErrors({});
      setSocialChecked(EMPTY_SOCIAL);
      setSocialError(false);
    } catch {
      addLog('Submission Failed', 'Network error', 'error');
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return <SuccessState onReset={() => setSubmitted(false)} />;
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      dir={isRtl ? 'rtl' : 'ltr'}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col"
      style={{ gap: `${layout.fieldGapPx}px` }}
    >
      {questions.map((q) => {
        const label = lang === 'he' ? q.labelHe : q.labelEn;

        if (q.type === 'single-choice' && q.options) {
          return (
            <ChoiceGroup
              key={q.id}
              label={label}
              options={q.options}
              value={(values[q.id] as string) || ''}
              multi={false}
              onChange={(v) => handleChange(q.id, v)}
              required={q.required}
              hasError={errors[q.id]}
              errorMsg={requiredMsg}
              lang={lang}
              labelSizePx={layout.questionSizePx}
            />
          );
        }

        if (q.type === 'multi-choice' && q.options) {
          return (
            <ChoiceGroup
              key={q.id}
              label={label}
              options={q.options}
              value={(values[q.id] as string[]) || []}
              multi={true}
              onChange={(v) => handleChange(q.id, v)}
              required={q.required}
              hasError={errors[q.id]}
              errorMsg={requiredMsg}
              lang={lang}
              labelSizePx={layout.questionSizePx}
            />
          );
        }

        return (
          <TextInput
            key={q.id}
            id={q.id}
            label={label}
            type={q.type === 'number' ? 'text' : q.type === 'tel' ? 'tel' : 'text'}
            inputMode={q.type === 'number' ? 'numeric' : q.type === 'tel' ? 'tel' : 'text'}
            value={(values[q.id] as string) || ''}
            onChange={(v) => handleChange(q.id, v)}
            required={q.required}
            hasError={errors[q.id]}
            errorMsg={requiredMsg}
            lang={lang}
            labelSizePx={layout.questionSizePx}
          />
        );
      })}

      <SocialCheckboxSection
        checked={socialChecked}
        onChange={handleSocialChange}
        showError={socialError}
      />

      {submitError && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[#DB6519] text-sm leading-relaxed text-center"
        >
          {errorMsg}
        </motion.p>
      )}

      <div className="flex flex-col items-center gap-2">
        <button
          type="submit"
          disabled={submitting || !socialReady}
          style={{ fontSize: `${layout.submitSizePx}px` }}
          className={`w-full py-5 rounded-2xl text-white font-semibold tracking-wide
            transition-all duration-300 shadow-lg mt-2
            ${socialReady
              ? 'bg-[#1C2D55] hover:bg-[#17213A] active:scale-[0.98] shadow-[#1C2D55]/20 cursor-pointer'
              : 'bg-gray-300 shadow-gray-200 cursor-not-allowed'
            }
            disabled:opacity-60
          `}
        >
          {submitting ? submittingLabel : submitLabel}
        </button>

        {!socialReady && (
          <p className="text-center text-xs text-gray-400 leading-snug">{hintMsg}</p>
        )}
      </div>
    </motion.form>
  );
}
