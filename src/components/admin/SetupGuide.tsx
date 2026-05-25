import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APPS_SCRIPT_CODE } from '../../utils/appsScript';
import { downloadCSV, downloadExcel } from '../../utils/templateDownload';

const STEPS = [
  {
    n: 1,
    title: 'Open Google Apps Script',
    body: 'Go to script.google.com and click "New project".',
  },
  {
    n: 2,
    title: 'Paste the code',
    body: 'Delete everything in the editor, then paste the code below. Click the save icon (💾).',
  },
  {
    n: 3,
    title: 'Deploy as Web App',
    body: 'Click Deploy → New deployment. Choose type "Web App". Set "Execute as" → Me. Set "Who has access" → Anyone. Click Deploy.',
  },
  {
    n: 4,
    title: 'Copy the endpoint URL',
    body: 'After deploying, Google shows a Web App URL ending in /exec. Copy it.',
  },
  {
    n: 5,
    title: 'Paste it in the admin',
    body: 'Paste the URL into the Google Sheets URL field above and click Save.',
  },
  {
    n: 6,
    title: 'Test it',
    body: 'Open the URL in a browser tab. You should see: "TzviAir Form endpoint is active ✓"',
  },
];

export function SetupGuide() {
  const { settings } = useApp();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(APPS_SCRIPT_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = APPS_SCRIPT_CODE;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Template downloads */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-gray-500 font-medium">Download spreadsheet template</span>
        <p className="text-xs text-gray-400 leading-relaxed">
          Columns are auto-generated from your current questions. Import into Google Sheets or open in Excel.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void downloadExcel(settings.questions)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1D6F42] text-white text-xs font-medium
              hover:bg-[#155734] transition-all duration-200 shadow-sm"
          >
            <span>📥</span> Download .xlsx
          </button>
          <button
            type="button"
            onClick={() => downloadCSV(settings.questions)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-medium
              hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            <span>📄</span> Download .csv
          </button>
        </div>
      </div>

      {/* Collapsible setup guide */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white border border-gray-200
          text-sm font-medium text-[#1C2D55] hover:border-[#44B3E1] hover:bg-sky-50 transition-all duration-200"
      >
        <span>📋 Apps Script setup guide</span>
        <span className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="flex flex-col gap-5 bg-white border border-gray-200 rounded-2xl p-5">
          {/* Steps */}
          <ol className="flex flex-col gap-4">
            {STEPS.map((step) => (
              <li key={step.n} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1C2D55] text-white text-xs font-bold
                  flex items-center justify-center mt-0.5">
                  {step.n}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-[#17213A]">{step.title}</span>
                  <span className="text-xs text-gray-500 leading-relaxed">{step.body}</span>
                </div>
              </li>
            ))}
          </ol>

          {/* Code block */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Apps Script code</span>
              <button
                type="button"
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  copied
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-[#1C2D55] text-white hover:bg-[#17213A]'
                }`}
              >
                {copied ? '✓ Copied!' : '📋 Copy code'}
              </button>
            </div>
            <pre className="bg-gray-950 text-green-300 text-xs leading-relaxed rounded-xl p-4 overflow-x-auto
              max-h-64 overflow-y-auto font-mono whitespace-pre select-all">
              {APPS_SCRIPT_CODE}
            </pre>
          </div>

          {/* Tip */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Tip:</strong> After deploying, paste the <code className="bg-amber-100 px-1 rounded">/exec</code> URL
              into the field above and save. Each form submission will automatically create a new row.
              New questions added in the admin will appear as new columns automatically.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
