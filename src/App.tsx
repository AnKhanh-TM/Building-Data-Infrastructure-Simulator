import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { INITIAL_STATE, type GameState } from './types/game';
import { ProgressBar } from './components/ui/ProgressBar';

import { Screen1Welcome } from './screens/Screen1Welcome';
import { Screen2DataSources } from './screens/Screen2DataSources';
import { Screen3Pipeline } from './screens/Screen3Pipeline';
import { Screen4Warehouse } from './screens/Screen4Warehouse';
import { Screen5DataModel } from './screens/Screen5DataModel';
import { Screen6Dashboard } from './screens/Screen6Dashboard';
import { Screen7Result } from './screens/Screen7Result';

function App() {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('data-game-state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_STATE;
      }
    }
    return INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('data-game-state', JSON.stringify(state));
  }, [state]);

  const updateState = (updates: Partial<GameState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const resetGame = () => {
    setState(INITIAL_STATE);
  };

  const currentComponent = () => {
    switch (state.currentStep) {
      case 1: return <Screen1Welcome state={state} updateState={updateState} nextStep={nextStep} />;
      case 2: return <Screen2DataSources state={state} updateState={updateState} nextStep={nextStep} />;
      case 3: return <Screen3Pipeline state={state} updateState={updateState} nextStep={nextStep} />;
      case 4: return <Screen4Warehouse state={state} updateState={updateState} nextStep={nextStep} />;
      case 5: return <Screen5DataModel state={state} updateState={updateState} nextStep={nextStep} />;
      case 6: return <Screen6Dashboard state={state} updateState={updateState} nextStep={nextStep} />;
      case 7: return <Screen7Result state={state} updateState={updateState} nextStep={resetGame} />;
      default: return <Screen1Welcome state={state} updateState={updateState} nextStep={nextStep} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans overflow-x-hidden">
      <header className="bg-white border-b border-slate-200 py-3 shadow-sm z-10 relative">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold shadow-md">
              TM
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-tight">Data System Builder</h1>
              <p className="text-xs text-slate-500 font-medium">Data Infrastructure Challenge</p>
            </div>
          </div>
          {state.profile.name && (
            <div className="text-sm font-medium text-brand-800 bg-brand-50 px-4 py-1.5 rounded-full border border-brand-200 shadow-sm">
              {state.profile.name} <span className="text-slate-400 mx-1">|</span> {state.profile.classCode}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto flex flex-col pt-0 relative z-0">
        {state.currentStep > 1 && state.currentStep < 7 && (
          <ProgressBar currentStep={state.currentStep} totalSteps={7} />
        )}
        
        <div className="flex-1 w-full flex items-center justify-center p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentStep}
              className="w-full flex items-center justify-center pb-12"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {currentComponent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;
