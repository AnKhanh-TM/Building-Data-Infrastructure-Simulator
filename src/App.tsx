import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BUSINESS_OBJECTIVE } from './lib/constants';
import { createSubmissionId, syncSubmission } from './lib/submission';
import { EMPTY_SCORE, EMPTY_SELECTIONS, EMPTY_SUBMISSION, INITIAL_STATE, type GameState } from './types/game';
import { ProgressBar } from './components/ui/ProgressBar';
import { Screen1Welcome } from './screens/Screen1Welcome';
import { Screen2DataSources } from './screens/Screen2DataSources';
import { Screen3Pipeline } from './screens/Screen3Pipeline';
import { Screen4Warehouse } from './screens/Screen4Warehouse';
import { Screen5DataModel } from './screens/Screen5DataModel';
import { Screen6Dashboard } from './screens/Screen6Dashboard';
import { Screen7Result } from './screens/Screen7Result';

const STORAGE_KEY = 'data-game-state-v2';

function App() {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...INITIAL_STATE, ...JSON.parse(saved) } : INITIAL_STATE;
    } catch {
      return INITIAL_STATE;
    }
  });

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(state)), [state]);

  const updateState = (updates: Partial<GameState>) =>
    setState((previous) => ({ ...previous, ...updates }));

  const sync = async (action: 'start' | 'complete', snapshot: GameState) => {
    const field = action === 'start' ? 'startSync' : 'completeSync';
    setState((previous) => ({
      ...previous,
      submission: { ...previous.submission, [field]: 'pending' },
    }));
    try {
      await syncSubmission(action, snapshot);
      setState((previous) => ({
        ...previous,
        submission: { ...previous.submission, [field]: 'synced' },
      }));
    } catch {
      setState((previous) => ({
        ...previous,
        submission: { ...previous.submission, [field]: 'failed' },
      }));
    }
  };

  const register = (profile: GameState['profile']) => {
    const submission = {
      ...EMPTY_SUBMISSION,
      id: createSubmissionId(),
      startedAt: new Date().toISOString(),
      startSync: 'pending' as const,
    };
    const snapshot = { ...state, profile, submission };
    setState(snapshot);
    void sync('start', snapshot);
  };

  const nextStep = () => setState((previous) => ({ ...previous, currentStep: previous.currentStep + 1 }));

  const complete = () => {
    const snapshot = {
      ...state,
      currentStep: 7,
      submission: {
        ...state.submission,
        completedAt: state.submission.completedAt || new Date().toISOString(),
        completeSync: 'pending' as const,
      },
    };
    setState(snapshot);
    void sync('complete', snapshot);
  };

  const retrySync = () => {
    if (state.submission.startSync === 'failed') void sync('start', state);
    if (state.submission.completedAt && state.submission.completeSync === 'failed') void sync('complete', state);
  };

  const resetGame = () => {
    setState({
      ...INITIAL_STATE,
      profile: state.profile,
      score: { ...EMPTY_SCORE },
      selections: { ...EMPTY_SELECTIONS },
      submission: { ...EMPTY_SUBMISSION },
    });
  };

  const props = { state, updateState, nextStep };
  const screens = [
    <Screen1Welcome {...props} register={register} />,
    <Screen2DataSources {...props} />,
    <Screen3Pipeline {...props} />,
    <Screen4Warehouse {...props} />,
    <Screen5DataModel {...props} />,
    <Screen6Dashboard {...props} complete={complete} />,
    <Screen7Result state={state} retrySync={retrySync} resetGame={resetGame} />,
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 font-bold text-white">TM</div>
            <div><h1 className="text-xl font-bold">Data System Builder</h1><p className="text-xs text-slate-500">AI Marketing & Sales System</p></div>
          </div>
          {state.profile.name && <div className="rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-800">{state.profile.name} | {state.profile.classCode}</div>}
        </div>
      </header>
      <main className="mx-auto flex min-h-[calc(100vh-65px)] max-w-6xl flex-col px-4">
        {state.currentStep > 1 && state.currentStep < 7 && (
          <>
            <div className="mt-6 rounded-xl border border-brand-100 bg-white p-4 shadow-sm space-y-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand-600">Bối cảnh Case Study</p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  <strong>RetailCo đang tăng trưởng chậm.</strong> Dữ liệu nằm rải rác giữa Ads, GA4, CRM, Order System, Email và POS. Các team tranh luận bằng những KPI khác nhau, trong khi ngân sách marketing vẫn đang target dàn trải.
                </p>
              </div>
              <div className="pt-2.5 border-t border-slate-100">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand-600">Business Objective xuyên suốt</p>
                <p className="font-semibold text-xs text-slate-700 mt-1">{BUSINESS_OBJECTIVE}</p>
              </div>
            </div>
            <ProgressBar currentStep={state.currentStep} totalSteps={7} />
          </>
        )}
        <div className="flex flex-1 items-center justify-center py-6">
          <AnimatePresence mode="wait">
            <motion.div key={state.currentStep} className="w-full" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              {screens[state.currentStep - 1] ?? screens[0]}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;
