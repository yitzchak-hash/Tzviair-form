import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import type { FormValues, Question } from '../types';
import { validateForm } from '../utils/validateForm';
import { buildPayload } from '../utils/buildPayload';
import { submitToGoogleSheets } from '../utils/submitToGoogleSheets';
import { TextInput } from './TextInput';
import { ChoiceGroup } from './ChoiceGroup';
import { SuccessState } from './SuccessState';
import { motion } from 'framer-motion';

export function FormRenderer() {
  const { lang, settings, addLog } = useApp();
  const tx = t[lang];
  const isRtl = lang === 'he';

  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const questions: Question[] = settings.questions;

  const handleChange = (id: string, val: string | string[]) => {
    setValues((prev) => ({ ...prev, [id]: val }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateForm(questions, values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstErrId = Object.keys(errs)[0];
      document.getElementById(firstErrId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    setSubmitError(false);

    const payload = buildPayload(questions, values, lang);

    try {
      await submitToGoogleSheets(settings.spreadsheetUrl, payload);
      addLog('Form Submitted', `Name: ${payload['fullName'] || payload[questions[0]?.id] || ''}`, 'success');
      setSubmitted(true);
      setValues({});
      setErrors({});
    } catch {
      addLog('Submission Failed', 'Network error', 'error');
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <SuccessState
        onReset={() => setSubmitted(false)}
        lang={lang}
      />
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      dir={isRtl ? 'rtl' : 'ltr'}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-8"
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
              errorMsg={tx.required}
              lang={lang}
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
              errorMsg={tx.required}
              lang={lang}
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
            errorMsg={tx.required}
            lang={lang}
          />
        );
      })}

      {submitError && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-[#DB6519] text-sm leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}
        >
          {tx.errorMsg}
        </motion.p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-5 rounded-2xl bg-[#1C2D55] text-white text-lg font-semibold tracking-wide
          hover:bg-[#17213A] active:scale-[0.98] transition-all duration-200
          disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#1C2D55]/20 mt-2"
      >
        {submitting ? tx.submitting : tx.submit}
      </button>
    </motion.form>
  );
}
