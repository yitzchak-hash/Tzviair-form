import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APPS_SCRIPT_CODE } from '../../utils/appsScript';
import { downloadCSV, downloadExcel } from '../../utils/templateDownload';
import { isFirebaseConfigured } from '../../utils/firebaseClient';

const STEPS = [
  {
    n: 1,
    title: 'Open your Google Sheet',
    body: 'Go to Google Drive and open (or create) the spreadsheet where you want submissions to land.',
  },
  {
    n: 2,
    title: 'Open the built-in script editor',
    body: 'In the sheet, click Extensions → Apps Script. This binds the script directly to your sheet — no ID needed.',
  },
  {
    n: 3,
    title: 'Paste the code',
    body: 'Delete all existing code in the editor, paste the code below, then click the save icon (💾). Name the project anything you like.',
  },
  {
    n: 4,
    title: 'Deploy as Web App',
    body: 'Click Deploy → New deployment → type "Web App". Set "Execute as" → Me. Set "Who has access" → Anyone. Click Deploy and confirm.',
  },
  {
    n: 5,
    title: 'Copy the endpoint URL',
    body: 'Google shows a Web App URL ending in /exec. Copy it.',
  },
  {
    n: 6,
    title: 'Paste it in the admin',
    body: 'Paste the URL into the Google Sheets URL field above and click Save.',
  },
  {
    n: 7,
    title: 'Test it',
    body: 'Open the /exec URL in a browser tab. You should see: "TzviAir Form endpoint is active ✓". Done.',
  },
];

export function SetupGuide() {
  const { settings } = useApp();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [firebaseOpen, setFirebaseOpen] = useState(false);
  const firebaseConfigured = isFirebaseConfigured();

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

      {/* Firebase cloud sync setup */}
      <div className={`rounded-xl border px-4 py-3 flex flex-col gap-1.5 ${firebaseConfigured ? 'bg-sky-50 border-[#44B3E1]/30' : 'bg-amber-50 border-amber-200'}`}>
        <p className={`text-xs font-semibold ${firebaseConfigured ? 'text-[#44B3E1]' : 'text-amber-700'}`}>
          {firebaseConfigured ? '☁ Cloud sync active' : '⚠ Settings are saved locally only'}
        </p>
        <p className={`text-xs leading-relaxed ${firebaseConfigured ? 'text-sky-700' : 'text-amber-600'}`}>
          {firebaseConfigured
            ? 'Your settings sync to Firebase — changes are available on every device and your Vercel deployment.'
            : 'Without cloud sync, settings saved here will not appear on your Vercel URL or other devices.'}
        </p>
        {!firebaseConfigured && (
          <>
            <button
              type="button"
              onClick={() => setFirebaseOpen((o) => !o)}
              className="mt-1 self-start text-xs font-medium text-amber-700 underline underline-offset-2 hover:text-amber-900 transition-colors"
            >
              {firebaseOpen ? 'Hide setup guide ▴' : 'How to fix this ▾'}
            </button>
            {firebaseOpen && (
              <ol className="flex flex-col gap-3 mt-2">
                {[
                  { n: 1, title: 'Create a free Firebase project', body: 'Go to console.firebase.google.com → Add project. Name it anything, disable Analytics if prompted.' },
                  { n: 2, title: 'Add a Realtime Database', body: 'In the left sidebar click Build → Realtime Database → Create database. Choose "Start in test mode" (you can tighten rules later).' },
                  { n: 3, title: 'Get your config keys', body: 'Go to Project Settings (gear icon) → General → Your apps → Add app → Web. Register the app and copy the firebaseConfig object shown.' },
                  { n: 4, title: 'Add env vars to Vercel', body: 'In your Vercel project go to Settings → Environment Variables. Add: VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_DATABASE_URL, VITE_FIREBASE_PROJECT_ID — one for each value from the config.' },
                  { n: 5, title: 'Redeploy', body: 'Trigger a new Vercel deployment (push any commit or click Redeploy in the dashboard). The env vars are baked into the build.' },
                  { n: 6, title: 'For local dev', body: 'Create a .env.local file in the project root with the same four VITE_FIREBASE_* variables. Run npm run dev — you should see "☁ Synced" in the admin header.' },
                ].map((step) => (
                  <li key={step.n} className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-700 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      {step.n}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-amber-800">{step.title}</span>
                      <span className="text-xs text-amber-700 leading-relaxed">{step.body}</span>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </>
        )}
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
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex flex-col gap-2">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Recommended:</strong> Always open the script from inside your Google Sheet
              (Extensions → Apps Script) — this binds them together automatically.
              If you go to script.google.com directly instead, you must uncomment the <code className="bg-amber-100 px-1 rounded">openById</code> line
              in the code and paste your Sheet ID.
            </p>
            <p className="text-xs text-amber-700 leading-relaxed">
              New questions added in the admin panel will automatically appear as new columns in the sheet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
